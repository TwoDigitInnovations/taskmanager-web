"use client";

import React from "react";
import * as XLSX from "xlsx";

export default function PaidMilestonesTable({ data, totalPaidAmount, status }) {

    const handleDownloadExcel = () => {
        // Flatten data for Excel
        const rows = [];
        let total = 0;

        data.forEach((project) => {
            project.milestones.forEach((milestone) => {
                const amount = Number(milestone.amount || 0);
                total += amount;
                rows.push({
                    Project: project.projectName,
                    // Task: milestone.tasks,
                    Amount: amount,
                    Currency: milestone.currency,
                    Paid_Date: milestone.paid_date || "",
                    Payment_Method: milestone.payment_mathod || ""
                });
            });
        });
        rows.push({
            Project: "",
            Amount: '',
            Currency: "",
            Paid_Date: "",
            Payment_Method: ""
        });
        rows.push({
            Project: "TOTAL",
            Amount: total,
            Currency: "",
            Paid_Date: "",
            Payment_Method: ""
        });

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(rows);

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Paid Milestones");

        // Download file
        XLSX.writeFile(workbook, "paid-milestones.xlsx");
    };

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-end items-center mb-4">
                    {/* <h1 className="text-2xl font-semibold text-gray-800">
                        Paid Milestones
                    </h1> */}

                    {/* Download Button */}
                    <button
                        onClick={handleDownloadExcel}
                        className="px-4 py-2 bg-[var(--mainColor)] text-white text-sm font-medium rounded-lg hover:bg-[var(--customYellow)] transition"
                    >
                        Download XLSX
                    </button>
                </div>

                {/* Total */}
                <div className="mb-4 p-4 bg-white rounded-xl shadow-sm flex justify-between items-center">
                    <span className="text-gray-600 font-medium capitalize">Total {status} Amount</span>
                    <span className="text-lg font-semibold text-green-600">
                        {totalPaidAmount}
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
                                {/* <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Task</th> */}
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Currency</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Paid Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((project) =>
                                project.milestones.map((milestone, idx) => (
                                    <tr key={`${project.projectId}-${idx}`} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {project.projectName}
                                        </td>
                                        {/* <td className="px-4 py-3 text-sm text-gray-600">
                                            {milestone.tasks}
                                        </td> */}
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                            {milestone.amount}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {milestone.currency}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {milestone.paid_date}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {milestone.payment_mathod}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
