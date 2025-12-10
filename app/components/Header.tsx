'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const handleOpen = () => {
        setIsOpen(prev => !prev)
    }
    const handleLogin = async (e:any) => {
        e.preventDefault();
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if(res.ok) {
            window.location.reload();
        }
    }
    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
        });

        window.location.reload();
    }
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me", { credentials: "include" });
                const data = await res.json();
                setLoggedIn(data.loggedIn);
            } catch(err) {
                console.error(err),
                setLoggedIn(false);
            }
        }
        checkAuth();
    }, [])
    return(
        <>
        <div className="flex justify-between items-center">
            <div className="py-5">
                <img />
                <Link href="../" className="font-bold">CS StatLab</Link>
            </div>
            {!loggedIn ? <button onClick={handleOpen} className="cursor-pointer">Login</button> : <button onClick={handleLogout} className="cursor-pointer">Logout</button>}
        </div>
        {isOpen && (
              <div className="absolute z-9999 -top-10 left-[23%] translate-[50%] bg-[#0a0a0a] w-[55vh] h-[50vh] border border-[#eae8e0] rounded-xl p-5">
                <h1 className="text-2xl text-center font-bold my-10">SIGN IN</h1>
                <form onSubmit={handleLogin}>
                  <div className="flex flex-col my-5">
                    <label>Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" className="border border-[#eae8e0] p-2 rounded-xl" />
                  </div>
                  <div className="flex flex-col my-5">
                    <label>Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="border border-[#eae8e0] p-2 rounded-xl" />
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            )}
        </>
    )
}