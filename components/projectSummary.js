"use client";

import { useContext, useState } from "react";
import * as XLSX from 'xlsx';
import moment from "moment";
import { userContext } from "@/pages/_app";
import PaidMilestonesTable from "@/components/PaidMilestonesTable";


export default function ProjectSummary({ data, project, filters, setFilters, onApplyFilters, currentUser, totalPaidAmount }) {
    console.log('UserTasks data---->', data);
    const [activeUserId, setActiveUserId] = useState(currentUser?.userId || null);
    const [user, setUser] = useContext(userContext)
    const activeUser = { taskList: data };

    const columnOptions = [
        { key: 'Project', label: 'Project' },
        { key: 'Date', label: 'Date' },
        { key: 'Time', label: 'Time' },
        { key: 'Hours', label: 'Hours' },
        // { key: 'Role', label: 'Role' },
        { key: 'Task', label: 'Task' }
    ];

    const [selectedColumns, setSelectedColumns] = useState(['Project', 'Date', 'Time', 'Hours', 'Task']);

    const handleColumnChange = (key) => {
        setSelectedColumns(prev =>
            prev.includes(key)
                ? prev.filter(c => c !== key)
                : [...prev, key]
        );
    };

    const getTaskData = (task, user = null) => {
        const obj = {};
        selectedColumns.forEach(col => {
            switch (col) {
                case 'Project':
                    obj.Project = task?.project.name || '';
                    break;
                case 'Date':
                    obj.Date = task.date;
                    break;
                case 'Time':
                    obj.Time = task.time;
                    break;
                case 'Hours':
                    obj.Hours = task.hours;
                    break;
                // case 'Role':
                //     obj.Role = task.role;
                //     break;
                case 'Task':
                    obj.Task = task.task;
                    break;
            }
        });
        return obj;
    };

    const downloadXLSX = () => {
        const exportData = activeUser.taskList.map(task => getTaskData(task));

        if (selectedColumns.includes('Hours') && selectedColumns.includes('Task')) {
            const totalRow = {};
            selectedColumns.forEach(col => {
                if (col === 'Hours') totalRow.Hours = totalHours;
                else if (col === 'Task') totalRow.Task = 'Total Hours';
                else totalRow[col] = '';
            });
            exportData.push(totalRow);
        }

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, currentUser.name);
        XLSX.writeFile(wb, `${currentUser.name}_tasks.xlsx`);
    };

    const downloadFullXLSX = () => {
        const exportData = [];
        data.forEach(user => {
            user.taskList.forEach(task => {
                exportData.push(getTaskData(task, user));
            });
        });

        if (selectedColumns.includes('Hours') && selectedColumns.includes('Task')) {
            const grandTotal = data.reduce((sum, user) => sum + user.totalHours, 0);
            const totalRow = {};
            selectedColumns.forEach(col => {
                if (col === 'Hours') totalRow.Hours = grandTotal;
                else if (col === 'Task') totalRow.Task = 'Grand Total Hours';
                else totalRow[col] = '';
            });
            exportData.push(totalRow);
        }

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'All Tasks');
        XLSX.writeFile(wb, 'project_user_tasks.xlsx');
    };

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
