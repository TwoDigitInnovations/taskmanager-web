"use client";

import { useContext, useState } from "react";
import * as XLSX from 'xlsx';
import moment from "moment";
import { userContext } from "@/pages/_app";
import PaidMilestonesTable from "@/components/PaidMilestonesTable";


export default function ProjectSummary({ data, project, filters, setFilters, onApplyFilters, currentUser, totalPaidAmount }) {
    console.log('UserTasks data---->', data);

    return (
        <div className="min-h-screen bg-gray-50 p-4 text-gray-900">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold capitalize">
                        {filters?.workType} Milestones
                    </h1>
                    {/* <span className="text-sm text-gray-500">
                        Light Mode
                    </span> */}
                </div>

                {/* Filters, Column Selection and Tabs */}
                <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="date"
                            className="border p-2 rounded"
                            value={moment(filters.startDate).format('YYYY-MM-DD')}
                            onChange={(e) => {
                                console.log(e.target.value)
                                let d = moment(e.target.value, 'YYYY-MM-DD').format()
                                console.log(d)
                                setFilters({ ...filters, startDate: d })
                            }}
                        />

                        <input
                            type="date"
                            className="border p-2 rounded"
                            value={moment(filters.endDate).format('YYYY-MM-DD')}
                            onChange={(e) => {
                                console.log(e.target.value)
                                let d = moment(e.target.value, 'YYYY-MM-DD').format()
                                console.log(d)
                                setFilters({ ...filters, endDate: d })
                            }}
                        />

                        <select
                            className="border p-2 rounded"
                            value={filters.workType}
                            onChange={(e) =>
                                setFilters({ ...filters, workType: e.target.value })
                            }
                        >
                            <option value="">All Types</option>
                            <option value="paid">Paid</option>
                            <option value='unpaid'>Unpaid</option>
                        </select>

                        <button
                            onClick={onApplyFilters}
                            className="bg-[var(--mainColor)] text-white rounded px-4 py-2 hover:bg-[var(--customYellow)]"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>



                <PaidMilestonesTable
                    data={data}
                    totalPaidAmount={totalPaidAmount}
                    status={filters.workType}
                />
            </div>
        </div>
    );
}
