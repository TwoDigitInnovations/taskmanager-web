"use client"; // if using Next.js 13+ App Router

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // For Pages Router
import Loader from "@/components/loader";
// For App Router use: import { useRouter } from "next/navigation";

export default function AuthGuard({ children, allowedRoles = [] }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("userDetail"); // e.g., "admin", "client", "developer"
        let role = '';
        if (!user) {
            router.push("/");
        } else {
            role = JSON.parse(user).type

        }

        if (!token) {
            router.push("/");
        } else if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
            router.push("/"); // redirect if role not allowed
            localStorage.removeItem("token");
            localStorage.removeItem("userDetail");
        } else {
            setAuthorized(true);
        }
    }, [router, allowedRoles]);

    if (!authorized) return <div className="bg-black"><Loader open={true} /></div>; // or a loader
    return <>{children}</>;
}
