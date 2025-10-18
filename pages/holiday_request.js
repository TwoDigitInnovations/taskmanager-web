"use client";
import { useState, useEffect, useContext } from "react";
import { Api } from "@/src/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import AuthGuard from "./AuthGuard";

export default function HolidayRequests(props) {
    const router = useRouter();
    const [user, setUser] = useContext(userContext);
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        reason: "",
    });
    const [loading, setLoading] = useState(false);

    // Fetch employee requests (replace with real API endpoint)
    useEffect(() => {
        getRequest()
    }, []);

    const getRequest = async () => {
        props.loader(true);
        Api("get", `holiday/getHolidayRequestByUser`, '', router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res)
                    setRequests(res.data);

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

    const updateRequest = async (id, status) => {
        props.loader(true);
        Api("put", `holiday/updateHolidaysRequest/${id}`, { status }, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res)
                    getRequest()

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.loader(true);
        Api("post", `holiday/createHolidaysRequest`, formData, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res)
                    setRequests((prev) => [...prev, res.data]);
                    setFormData({ startDate: "", endDate: "", reason: "" });

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



    return (
        <AuthGuard allowedRoles={["ADMIN", "PROVIDER"]}>
            <div className="min-h-screen bg-[var(--mainLightColor)] text-gray-800 p-6">
                <div className=" mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-center">Employee Holiday Requests</h1>

                    {/* Holiday Request Form */}
                    {user.type === 'PROVIDER' && <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-2xl shadow-md space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, startDate: e.target.value })
                                    }
                                    required
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold">End Date</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, endDate: e.target.value })
                                    }
                                    required
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold">Reason</label>
                            <textarea
                                value={formData.reason}
                                onChange={(e) =>
                                    setFormData({ ...formData, reason: e.target.value })
                                }
                                required
                                placeholder="Enter reason for leave"
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </form>}

                    {/* Request List */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        {/* <h2 className="text-xl font-semibold mb-4">My Requests</h2> */}
                        {requests.length === 0 ? (
                            <p className="text-gray-500 text-center">No requests found</p>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        {user.type === 'ADMIN' && <th className="text-left py-2">Employee</th>}
                                        <th className="text-left py-2">Start Date</th>
                                        <th className="text-left py-2">End Date</th>
                                        <th className="text-left py-2">Reason</th>
                                        <th className="text-left py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((req, index) => (
                                        <tr key={index} className="border-b ">
                                            {user.type === 'ADMIN' && <td className="py-2">{req?.employeeId?.username}</td>}
                                            <td className="py-2">{new Date(req.startDate).toDateString()}</td>
                                            <td className="py-2">{new Date(req.endDate).toDateString()}</td>
                                            <td className="py-2">{req.reason}</td>
                                            <td className="my-1" >
                                                {user.type === 'PROVIDER' && <div className={`py-2 font-semibold ${req.status === "Approved"
                                                    ? "text-green-600"
                                                    : req.status === "Rejected"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                                    }`}>
                                                    {req.status}

                                                </div>}
                                                {user.type === 'ADMIN' && <div className="flex gap-2 my-1">
                                                    {req.status === 'Pending' && <button
                                                        className="bg-green-600 w-20 h-10 rounded-sm py-1 text-white text-sm"
                                                        onClick={() => {
                                                            updateRequest(req._id, 'Approved')
                                                        }}
                                                    >
                                                        Accept
                                                    </button>}
                                                    {req.status === 'Pending' && <button
                                                        className="bg-red-700 w-20 h-10 rounded-sm py-1 text-white text-sm"
                                                        onClick={() => {
                                                            updateRequest(req._id, 'Rejected')
                                                        }}
                                                    >
                                                        Reject
                                                    </button>}
                                                    {req.status !== 'Pending' && <div className={`py-2 font-semibold ${req.status === "Approved"
                                                        ? "text-green-600"
                                                        : req.status === "Rejected"
                                                            ? "text-red-600"
                                                            : "text-yellow-600"
                                                        }`}>
                                                        {req.status}

                                                    </div>}
                                                </div>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
