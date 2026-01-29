"use client";

import { useEffect, useState } from "react";
import ProjectUserTasks from "@/components/ProjectUserTasks";
import { Api } from "@/src/services/service";
import { useRouter } from "next/router";
import moment from "moment";
import AuthGuard from "./AuthGuard";
import UserTasks from "@/components/UserTasks";

export default function UserReportPage(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    console.log(router)
    const { userID, work_type } = router.query

    const [filters, setFilters] = useState({
        // projectId: projectId,
        workType: work_type,
        startDate: moment().subtract(30, 'days').toDate(),
        endDate: moment().toDate(),
    });

    const fetchData = async () => {
        setLoading(true);

        // const params = new URLSearchParams(filters).toString();
        // const res = await fetch(`/job/getTaskByAdmin`);
        // const json = await res.json();

        // setData(json);
        // setLoading(false);
        props.loader(true);

        Api("post", `job/getWorksByUserId/${userID}`, filters, router).then(
            async (res) => {
                setData(res);
                props.loader(false);
                setLoading(false);
                if (res?.status) {

                    setData(res);
                } else {
                    props.toaster({ type: "success", message: res?.message });
                }
            },
            (err) => {
                console.log(err);
                props.loader(false);
                setLoading(false);
                props.toaster({ type: "error", message: err?.message });
                console.log(err);
            }
        );
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AuthGuard allowedRoles={["ADMIN", "PROVIDER"]}>
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Data */}
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : (
                        <UserTasks currentUser={data.user} data={data.data} filters={filters} setFilters={setFilters} onApplyFilters={fetchData} totalHours={data.totalHours} />
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
