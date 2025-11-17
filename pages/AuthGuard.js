"use client"; // if using Next.js 13+ App Router

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // For Pages Router
import Loader from "@/components/loader";
import { deleteAuthToken, getAuthToken, getData, removeData } from "@/src/services/lib/storage";
import { removeApiToken, setApiToken } from "@/src/services/lib/api";
// For App Router use: import { useRouter } from "next/navigation";

export default function AuthGuard({ children, allowedRoles = [] }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        checkAuth()
    }, [router, allowedRoles]);

    const checkAuth = async () => {
        let user = await getData('userdetail'); // e.g., "admin", "client", "developer"
        const token = await getAuthToken()
        let role = '';
        if (!user) {
            router.push("/");
        } else {
            setApiToken(user.token)
            role = user.type
        }
        if (!token) {
            router.push("/");
        } else if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
            router.push("/"); // redirect if role not allowed
            deleteAuthToken();
            removeApiToken();
            removeData('userDetail')
        } else {
            setApiToken(user.token)
            setAuthorized(true);
        }

    }

    if (!authorized) return <div className="bg-black"><Loader open={true} /></div>; // or a loader
    return <>{children}</>;
}
