import Link from "next/link";

export default function Footer() {
    return(
        <div className="py-5 flex justify-between">
            <div>
                <img />
                <p className="italic font-bold">CSSTATLAB</p>
            </div>
            <div className="grid grid-cols-2 gap-5 text-neutral-400 text-sm">
                <Link href="../privacy/">Privacy</Link>
                <Link href="../tos/">Terms</Link>
            </div>
        </div>
    )
}