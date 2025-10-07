import { Api } from '@/src/services/service';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import AuthGuard from '../AuthGuard';

// Next.js page / component - Tailwind CSS required in the project
// Put this file in pages/project-history.jsx or components/ProjectHistoryUI.jsx

function StatPill({ label, value }) {
    return (
        <div className="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="mt-1 text-lg font-semibold text-gray-900">{value}</span>
        </div>
    )
}

function UserRow({ user, data }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">{user.name?.charAt(0)?.toUpperCase()}</div>
                <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.total_hrs} hrs</div>
                </div>
            </div>
            <div className="w-36">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-2 rounded-full"
                        style={{ width: `${Math.min(100, (user.total_hrs / data?.total_hrs) * 100)}%`, background: 'linear-gradient(90deg,#60a5fa,#3b82f6)' }}
                    />
                </div>
            </div>
        </div>
    )
}

function RoleCard({ role, data }) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-semibold text-gray-800">{role.role}</div>
                    <div className="text-xs text-gray-500">{role.total_hrs} hrs</div>
                </div>
                <div className="text-xs text-gray-500">Users: {role.users.length}</div>
            </div>

            <div className="mt-3 space-y-2">
                {role.users.map((u, idx) => (
                    <UserRow key={idx} user={u} data={data} />
                ))}
            </div>
        </div>
    )
}

function TypeCard({ type, data }) {
    return (
        <div className="bg-gray-50 rounded-3xl p-5 shadow-inner">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-sm font-semibold text-gray-900">{type.type}</div>
                    <div className="text-xs text-gray-500">{type.total_hrs} hrs</div>
                </div>
                <div className="text-xs text-gray-500">Roles: {type.work_role.length}</div>
            </div>

            <div className="space-y-3">
                {type.work_role.map((r, i) => (
                    <RoleCard key={i} role={r} data={data} />
                ))}
            </div>
        </div>
    )
}

export default function ProjectHistoryUI(props) {
    const router = useRouter();
    const { projectid } = router.query;
    const [data, setData] = React.useState({});

    useEffect(() => {
        if (projectid) {
            getClientList();
        }
    }, [projectid]);

    const getClientList = () => {
        props.loader(true);

        Api("get", `projecthistory/${projectid}`, "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console
                    setData(res?.data);
                } else {
                    props.toaster({ type: "success", message: res?.message });
                }
            },
            (err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err.message });
                console.log(err);
            }
        );
    };

    function convertToCSV(data) {
        let rows = [];
        rows.push(["Project Name", data.project_name]);
        rows.push(["Total Hours", data.total_hrs]);
        rows.push([]);

        data.work_type.forEach(t => {
            rows.push([`Work Type: ${t.type}`, `Total Hours: ${t.total_hrs}`]);
            t.work_role.forEach(r => {
                rows.push([`  Role: ${r.role}`, `Total Hours: ${r.total_hrs}`]);
                r.users.forEach(u => {
                    rows.push([`    User: ${u.name}`, u.total_hrs]);
                });
            });
            rows.push([]);
        });
        rows.push([`Work Miletone Summery`]);
        data.milestone_summary.forEach(t => {
            rows.push([`${t.status}, ${t.amount}`]);
        });
        rows.push([]);
        rows.push([`Milestones`]);
        data.milestones.forEach((t, i) => {
            rows.push([`Milestone-${i + 1}: ${t.status}, ${t.amount}`]);

        });
        // rows.push([]);
        return rows.map(r => r.join(",")).join("\n");
    }

    function downloadCSV() {
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${data.project_name}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    return (
        <AuthGuard allowedRoles={["ADMIN"]}>
            <div className="min-h-screen bg-black text-gray-900 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">{data?.project_name}</h1>
                            <p className="text-sm text-white mt-1">Project hours overview</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <StatPill label="Total Hours" value={`${data?.total_hrs} hrs`} />
                            <button className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium shadow" onClick={downloadCSV}>Export CSV</button>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left: summary / legend */}
                        <aside className="md:col-span-1 bg-[var(--customGray)] rounded-2xl p-4 shadow-sm">
                            <div className="text-sm font-medium text-white mb-3">Summary</div>
                            <div className="flex flex-col gap-3">
                                {data?.work_type?.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <div className="text-sm font-semibold">{t?.type}</div>
                                            <div className="text-xs text-gray-500">{t?.work_role?.length} role(s)</div>
                                        </div>
                                        <div className="text-sm font-semibold">{t?.total_hrs}h</div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-sm font-medium text-white mb-3 mt-3">Milestone Summary</div>
                            <div className="flex flex-col gap-3">
                                {data?.milestone_summary?.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <div className="text-sm font-semibold">{t.status}</div>
                                            {/* <div className="text-xs text-gray-500">{t.work_role.length} role(s)</div> */}
                                        </div>
                                        <div className="text-sm font-semibold">{t.amount}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm font-medium text-white mb-3 mt-3">Milestone</div>
                            <div className="flex flex-col gap-3">
                                {data?.milestones?.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <div className="text-sm font-semibold">Milestone {i + 1}</div>
                                            <div className={`"text-xs text-gray-500"  ${t.status === 'paid' ? "text-green-600" : "text-yellow-600"}`}>{t.status}</div>
                                        </div>
                                        <div className={`"text-sm font-semibold" `}>{t.amount}</div>
                                    </div>
                                ))}
                            </div>
                            {/* 
                        <div className="mt-6">
                            <div className="text-sm font-medium text-gray-800 mb-2">Legend</div>
                            <div className="text-xs text-gray-500">Bars show relative hours vs project total.</div>
                        </div> */}
                        </aside>

                        {/* Right: details */}
                        <section className="md:col-span-2 space-y-6">
                            {data?.work_type?.map((t, i) => (
                                <div key={i} className="">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{t?.type}</h3>
                                            <div className="text-xs text-white">{t?.total_hrs} hrs • {t?.work_role.length} role(s)</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {t?.work_role.map((r, j) => (
                                            <TypeCard key={j} type={{ ...t, work_role: [r] }} data={data} />
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 text-xs text-white">Generated: {moment(new Date()).format('DD/MM/YYYY hh:mm A')}</div>
                        </section>
                    </div>

                    {/* Footer - mobile CTA */}
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden">
                        <div className="bg-white p-3 rounded-3xl shadow-lg flex items-center gap-4">
                            <div className="text-sm">Total: <span className="font-semibold">{data.total_hrs} hrs</span></div>
                            <button className="ml-2 px-3 py-2 rounded-full bg-blue-600 text-white text-sm" onClick={downloadCSV}>Export</button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}
