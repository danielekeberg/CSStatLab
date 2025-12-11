'use client';
import Link from "next/link";

export default function Header() {
    return(
        <div className="py-5">
            <img />
            <Link href="../" className="flex italic text-2xl font-bold">
                <p>CS</p>
                <p className="text-blue-500">STAT</p>
                <p>LAB</p>
            </Link>
        </div>
    )
}