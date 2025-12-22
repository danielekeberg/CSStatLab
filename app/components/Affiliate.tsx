import Link from "next/link";
export default function Affiliate() {
    return(
        <Link target="_blank" href="https://csgoroll.com/r/daniru">
            <div className="my-10 p-5 bg-[#383838]/20 border border-[#383838] rounded-xl text-center">
                <h1 className="text-xl font-bold">🎲 CSGOROLL bonus</h1>
                <p className="text-[#b3c0d3]">Use code <strong>DANIRU</strong> to get free coins on CSGOROLL</p>
                <button className="p-2 border bg-[#383838]/20 border-[#383838] rounded mt-3 hover:bg-black/50 cursor-pointer transition duration-200 font-bold">Get free coins</button>
            </div>
        </Link>
    )
}