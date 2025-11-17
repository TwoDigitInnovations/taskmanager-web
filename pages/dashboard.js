"use client";
import { Api } from "@/src/services/service";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { userContext } from "./_app";

export default function EmployeeDashboard(props) {
    const [user, setUser] = useContext(userContext);
    const router = useRouter();
    const today = new Date().toISOString().split("T")[0];

    const [employees, setEmployees] = useState([]);

    const [selectedEmp, setSelectedEmp] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    // Load saved data
    useEffect(() => {
        if (user.type === 'ADMIN') {
            getTodayStatus()
        }
    }, [user]);



    const getTodayStatus = async () => {
        props.loader(true);
        Api("get", `getEmployeeStatus`, '', router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    setEmployees(res.data)
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

    const handleStatusChange = (emp) => {
        setSelectedEmp(emp);
        setNewStatus(emp.status);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setEmployees((prev) =>
            prev.map((emp) =>
                emp.id === selectedEmp.id ? { ...emp, status: newStatus } : emp
            )
        );
        setSelectedEmp(null);
    };

    return (
        <div className=" bg-gray-50 text-gray-800 p-1">
            {/* <h1 className="text-3xl font-bold text-center mb-4">Employee Dashboard</h1>
            <p className="text-center text-gray-600 mb-8">
                Date: <span className="font-medium">{today}</span>
            </p> */}

            {/* Employee Table */}
            <div className="max-w-3xl mx-auto bg-white  shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">Employee</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Month Leave</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr
                                key={emp.id}
                                className="border-b hover:bg-gray-100 transition capitalize "
                            >
                                <td className="p-3 font-medium">{emp.username}</td>
                                <td
                                    className={`p-3 text-center font-semibold ${emp.status === "Working"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {emp.status}
                                </td>
                                <td className="p-3 font-medium text-center"><span className="text-red-600">{emp.totalLeavesThisMonth}</span><span className="text-green-600">/{emp.totalCompensateThisMonth}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {selectedEmp && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            Edit Status for {selectedEmp.name}
                        </h2>

                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="border rounded-md p-2 outline-none"
                            >
                                <option>Working</option>
                                <option>On Leave</option>
                            </select>

                            <div className="flex gap-3 justify-between">
                                <button
                                    type="button"
                                    onClick={() => setSelectedEmp(null)}
                                    className="flex-1 bg-gray-300 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
