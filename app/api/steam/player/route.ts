import { NextResponse } from "next/server";

export async function GET(req:any) {
    const { searchParams } = new URL(req.url);
    const steamid = searchParams.get("steamid");
    if(!steamid) {
        return NextResponse.json(
            { error: "Missing 'steamid' query parameter" },
            { status: 400 }
        );
    }

    try {
        const apiKey = process.env.STEAM_API_KEY;
        const playerUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamid}`;
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
        const name = player.personaname;
        const id = player.steamid;
        const url = player.profileurl;

        return NextResponse.json({
            avatar,
            avatarMedium,
            avatarFull,
            id,
            name,
            url,
        });
    } catch(err) {
        console.error(err);
        return NextResponse.json({ error: "Servererror fetching SteamID"}, { status: 500 });
    }
}