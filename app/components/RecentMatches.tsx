import { createSupabaseServerClient } from "@/lib/supabaseServer"

export default async function RecentMatches({ playerId }: { playerId: string}) {
    const supabase = createSupabaseServerClient();
    const { data: matches } = await supabase
        .from("player_match_stats")
        .select("*, matches(*)")
        .eq("player_id", playerId)
        .order("created_at", {ascending: false })
        .limit(10);

    return(
        <div className="mt-10">
            <h5 className="font-bold mb-3">Recent Games</h5>
            <pre className="text-sm opacity-70">
                {JSON.stringify(matches, null, 2)}
            </pre>
        </div>
    )
}