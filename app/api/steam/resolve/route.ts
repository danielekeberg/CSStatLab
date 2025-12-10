import { NextResponse } from "next/server";

export async function GET(req:any) {
    const { searchParams } = new URL(req.url);
    const vanityurl = searchParams.get("vanityurl");
    if(!vanityurl) {
        return NextResponse.json(
            { error: "Missing 'vanityurl' query parameter" },
            { status: 400 }
        );
    }

    try {
        const apiKey = process.env.STEAM_API_KEY;
        const resolveUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${encodeURIComponent(vanityurl)}`;
        const resolveRes = await fetch(resolveUrl);
        const resolveData = await resolveRes.json();
        if(resolveData.response.success !== 1) {
            return NextResponse.json(
                { error: "Couldnt resolve vanitu URL", raw: resolveData.response, },
                { status: 404 }
            );
        }

        const steam64id = resolveData.response.steamid;
        const playerUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steam64id}`;
        const playerRes = await fetch(playerUrl);
        const playerData = await playerRes.json();
        const player = playerData.response.players?.[0];
        if(!player) {
            return NextResponse.json(
                { error: "Couldnt find playerdata for this SteamID" },
                { status: 404 }
            );
        }

        const avatar = player.avatar;
        const avatarMedium = player.avatarmedium;
        const avatarFull = player.avatarfull;

        return NextResponse.json({
            steam64id,
            avatar,
            avatarMedium,
            avatarFull,
        });
    } catch(err) {
        console.error(err);
        return NextResponse.json({ error: "Servererror fetching SteamID"}, { status: 500 });
    }
}