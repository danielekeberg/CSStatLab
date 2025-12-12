'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header({ status }: { status: boolean }) {
    const [isActive, setIsActive] = useState(status);
    useEffect(() => {
        setIsActive(status);
    }, [status])
    console.log(status)
    return(
        <div className="py-5 flex justify-between items-center">
            <div>
                <img />
                <Link href="../" className="flex italic text-2xl font-bold">
                    <p>CS</p>
                    <p className="text-blue-500">STAT</p>
                    <p>LAB</p>
                </Link>
            </div>
            {isActive && (
                <div className="hidden md:flex w-1/2 justify-center">
                    <form  className="relative w-full">
                        <input type="text" className="w-full border border-neutral-700 rounded p-2 pl-11 outline-hidden" placeholder="Search by Steam ID or nickname..." />
                        <img src="../search.svg" className="h-6 w-6 absolute top-2 left-3" />
                    </form>
                </div>
            )}
        </div>
    )
}