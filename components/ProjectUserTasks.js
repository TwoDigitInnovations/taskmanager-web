"use client";

import { useContext, useState } from "react";
import * as XLSX from 'xlsx';
import moment from "moment";
import { userContext } from "@/pages/_app";

export default function ProjectUserTasks({ data, project, filters, setFilters, onApplyFilters }) {
    const [activeUserId, setActiveUserId] = useState(data[0]?.userId || null);
    const [user, setUser] = useContext(userContext)
    const activeUser = data.find(user => user.userId === activeUserId);

    const columnOptions = [
        { key: 'User', label: 'User' },
        { key: 'Date', label: 'Date' },
        { key: 'Time', label: 'Time' },
        { key: 'Hours', label: 'Hours' },
        { key: 'Role', label: 'Role' },
        { key: 'Task', label: 'Task' }
    ];

    const [selectedColumns, setSelectedColumns] = useState(['Date', 'Time', 'Hours', 'Role', 'Task']);

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
                case 'User':
                    obj.User = user ? user.username : '';
                    break;
                case 'Date':
                    obj.Date = new Date(task.startDate).toLocaleDateString();
                    break;
                case 'Time':
                    obj.Time = `${new Date(task.startTime).toLocaleTimeString()} – ${new Date(task.endTime).toLocaleTimeString()}`;
                    break;
                case 'Hours':
                    obj.Hours = task.job_hrs;
                    break;
                case 'Role':
                    obj.Role = task.work_role;
                    break;
                case 'Task':
                    obj.Task = task.description;
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
                if (col === 'Hours') totalRow.Hours = activeUser.totalHours;
                else if (col === 'Task') totalRow.Task = 'Total Hours';
                else totalRow[col] = '';
            });
            exportData.push(totalRow);
        }

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, activeUser.username);
        XLSX.writeFile(wb, `${activeUser.username}_tasks.xlsx`);
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
                    <h1 className="text-2xl font-semibold">
                        Project Task Report - {project?.name}
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
                            <option value="Regular">Regular</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>

                        <button
                            onClick={onApplyFilters}
                            className="bg-[var(--mainColor)] text-white rounded px-4 py-2 hover:bg-[var(--customYellow)]"
                        >
                            Apply Filters
                        </button>
                    </div>

                    {/* Column Selection and Tabs */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-lg font-medium mb-2">Select Columns for XLSX Export</h2>
                            <div className="flex flex-wrap gap-4">
                                {columnOptions.map(option => (
                                    <label key={option.key} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedColumns.includes(option.key)}
                                            onChange={() => handleColumnChange(option.key)}
                                            className="mr-2"
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                            {data.map((user) => (
                                <button
                                    key={user.userId}
                                    onClick={() => setActiveUserId(user.userId)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${activeUserId === user.userId
                                        ? "bg-[var(--mainColor)] text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {user.username}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active User Card */}
                {activeUser && (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                        {/* User Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div>
                                <h2 className="text-lg font-semibold capitalize">
                                    {activeUser.username}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    User ID: {activeUser.userId}
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Hours</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        {activeUser.totalHours}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={downloadXLSX}
                                        className="px-4 py-2 bg-[var(--mainColor)] text-white text-sm font-medium rounded-md hover:bg-[var(--customYellow)] transition-colors"
                                    >
                                        Download XLSX
                                    </button>
                                    {user.type === "ADMIN" && <button
                                        onClick={downloadFullXLSX}
                                        className="px-4 py-2 bg-[var(--mainColor)] text-white text-sm font-medium rounded-md hover:bg-[var(--customYellow)] transition-colors"
                                    >
                                        Download Full XLSX
                                    </button>}
                                </div>
                            </div>
                        </div>

                        {/* Task Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Date</th>
                                        <th className="px-4 py-3">Time</th>
                                        <th className="px-4 py-3">Hours</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Task</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {activeUser.taskList.map((task) => (
                                        <tr
                                            key={task.taskId}
                                            className="border-t hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3 text-center">
                                                {new Date(task.startDate).toLocaleDateString()}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                {new Date(task.startTime).toLocaleTimeString()} –{" "}
                                                {new Date(task.endTime).toLocaleTimeString()}
                                            </td>

                                            <td className="px-4 py-3 text-center font-semibold">
                                                {task.job_hrs}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                {task.work_role}
                                            </td>

                                            <td className="px-4 py-3 max-w-md">
                                                <p className="font-medium">
                                                    {task.description}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
