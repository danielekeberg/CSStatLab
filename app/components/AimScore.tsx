type Bench = { low: number; mid: number; high: number };

const DEFAULT_BENCH = {
    accuracy: { low: 0.10, mid: 0.22, high: 0.35 },
    accuracy_enemy_spotted: { low: 0.20, mid: 0.36, high: 0.55 },
    accuracy_head: { low: 0.06, mid: 0.16, high: 0.28 },

    reaction_time_ms: { low: 350, mid: 750, high: 1100 },
    preaim: { low: 6.5, mid: 10.0, high: 14.0 },

    spray_accuracy: { low: 0.20, mid: 0.40, high: 0.55 },
    counter_strafing_shots_good_ratio: { low: 0.65, mid: 0.82, high: 0.95 },
};

const WEIGHTS = {
    preaim: 30,
    reaction_time_ms: 25,
    spray_accuracy: 15,
    accuracy_enemy_spotted: 12,
    counter_strafing_shots_good_ratio: 10,
    accuracy: 5,
    accuracy_head: 3,
} as const;

function clamp(x: number, a: number, b: number) {
    return Math.max(a, Math.min(b, x));
}

function scoreHighBetter(x: number | null, { low, mid, high }: Bench) {
    if (x == null || Number.isNaN(x)) return 50;
    if (x <= low) return 15;
    if (x >= high) return 100;
    if (x < mid) return (50 * (x - low)) / (mid - low);
    return 50 + (50 * (x - mid)) / (high - mid);
}

function scoreLowBetter(x: number | null, { low, mid, high }: Bench) {
    if (x == null || Number.isNaN(x)) return 50;
    if (x <= low) return 100;
    if (x >= high) return 15;
    if (x < mid) return 100 - (50 * (x - low)) / (mid - low);
    return 50 - (50 * (x - mid)) / (high - mid);
}

function calibrateAimBoost(calibrated: number) {
    if (calibrated <= 70) return calibrated;
    const extraSlope = 1.25;
    return calibrated + (calibrated - 70) * (extraSlope - 1);
}


export type AimScoreProps = {
    accuracy: number | null;
    accuracyEnemySpotted: number | null;
    accuracyHead: number | null;
    reactionTimeMs: number | null;
    preaim: number | null;
    sprayAccuracy: number | null;
    shotsFired: number | null;
    counterStrafeRatio: number | null;
};

type AimScoreOptions = {
    applyReliability?: boolean;
    reliabilityShots?: number;
    applyCalibration?: boolean;
    calSlope?: number;
    calOffset?: number;
};

function computeAimScore(
    props: AimScoreProps,
    opts: AimScoreOptions = {}
    ) {
    const {
        applyReliability = false,
        reliabilityShots = 100,
        applyCalibration = true,
        calSlope = 1.38,
        calOffset = -18.25,
    } = opts;

    const parts: Record<string, number> = {
        accuracy: scoreHighBetter(props.accuracy, DEFAULT_BENCH.accuracy),
        accuracy_enemy_spotted: scoreHighBetter(
        props.accuracyEnemySpotted,
        DEFAULT_BENCH.accuracy_enemy_spotted
        ),
        accuracy_head: scoreHighBetter(props.accuracyHead, DEFAULT_BENCH.accuracy_head),

        reaction_time_ms: scoreLowBetter(props.reactionTimeMs, DEFAULT_BENCH.reaction_time_ms),
        preaim: scoreLowBetter(props.preaim, DEFAULT_BENCH.preaim),

        spray_accuracy: scoreHighBetter(props.sprayAccuracy, DEFAULT_BENCH.spray_accuracy),
        counter_strafing_shots_good_ratio: scoreHighBetter(
        props.counterStrafeRatio,
        DEFAULT_BENCH.counter_strafing_shots_good_ratio
        ),
    };

    const totalW = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
    const raw =
        Object.entries(WEIGHTS).reduce(
        (sum, [k, w]) => sum + (parts[k] ?? 50) * (w as number),
        0
        ) / totalW;

    let score = raw;

    if (applyReliability) {
        const shots = props.shotsFired ?? 0;
        const reliability = clamp(shots / reliabilityShots, 0, 1);
        score = 50 + reliability * (score - 50);
    }

    if (applyCalibration) {
        score = calSlope * score + calOffset;
        score = calibrateAimBoost(score);
    }

    score = clamp(score, 0, 100);

    return {
        score: Math.round(score),
        raw,
        parts,
    };
}

export default function AimScore(props: AimScoreProps) {
    const { score } = computeAimScore(props, {
        applyReliability: false,
        applyCalibration: true,
    });

    return <p>{score}</p>;
}

export function calcAimScore(props: AimScoreProps): number | null {
    return computeAimScore(props, {
        applyReliability: false,
        applyCalibration: true,
    }).score;
}

export function calcAimScoreTrend(props: AimScoreProps): number | null {
    return computeAimScore(props, {
        applyReliability: true,
        reliabilityShots: 100,
        applyCalibration: true,
    }).score;
}

export type AimMatchRow = {
    finished_at: string | null;

    accuracy: number | null;
    accuracy_enemy_spotted: number | null;
    accuracy_head: number | null;
    reaction_time_ms: number | null;
    preaim: number | null;
    spray_accuracy: number | null;
    shots_fired: number | null;
    counter_strafing_shots_good_ratio: number | null;
};

export function calcAvgAimLast30( rows: AimMatchRow[], maxMatches = 30, trim = 2 ): number | null {
    if (!rows || rows.length === 0) return null;

    const recent = rows
        .filter((r) => r.finished_at)
        .slice()
        .sort(
        (a, b) =>
            new Date(b.finished_at as string).getTime() -
            new Date(a.finished_at as string).getTime()
        )
        .slice(0, maxMatches);

    const aims = recent
        .map((r) =>
        calcAimScore({
            accuracy: r.accuracy,
            accuracyEnemySpotted: r.accuracy_enemy_spotted,
            accuracyHead: r.accuracy_head,
            reactionTimeMs: r.reaction_time_ms,
            preaim: r.preaim,
            sprayAccuracy: r.spray_accuracy,
            shotsFired: r.shots_fired,
            counterStrafeRatio: r.counter_strafing_shots_good_ratio,
        })
        )
        .filter((v): v is number => typeof v === "number" && Number.isFinite(v));

    if (aims.length < 5) return null;

    const sorted = [...aims].sort((a, b) => a - b);
    const trimmed =
        sorted.length > trim * 2 ? sorted.slice(trim, sorted.length - trim) : sorted;

    if (trimmed.length === 0) return null;

    const avg = trimmed.reduce((sum, v) => sum + v, 0) / trimmed.length;
    return Math.round(avg);
}
