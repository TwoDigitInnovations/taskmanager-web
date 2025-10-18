"use client";
import { Api } from "@/src/services/service";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { Context, userContext } from "./_app";
import AuthGuard from "./AuthGuard";


const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
];

export default function HolidayCalendar(props) {
    const [initial, setInitial] = useContext(Context);
    const router = useRouter();
    const [user, setUser] = useContext(userContext);
    const currentYear = new Date().getFullYear();
    const [holidays, setHolidays] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [holidayName, setHolidayName] = useState("");

    // Load from localStorage and merge with auto holidays
    useEffect(() => {
        getAllHolidays();
    }, [initial]);



    const getAllHolidays = () => {
        props.loader(true);
        Api("get", `holiday/getAllHolidays?year=${currentYear}`, "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res)
                    if (res.data.length === 0) {
                        const auto = getAutoHolidays(currentYear);
                        console.log(auto)
                        setHolidays(auto);
                    } else {
                        let dates = {}
                        res.data.forEach(datess => {
                            dates[datess.date_string] = datess.title
                        });
                        console.log(dates)

                        if (initial.username !== 'ADMIN') {
                            getAllHolidaysByUser(dates)
                        } else {
                            setHolidays(dates);
                        }
                    }
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

    const getAllHolidaysByUser = (d) => {
        props.loader(true);
        Api("get", `holiday/getAllHolidaysByUser?year=${currentYear}&userid=${initial?._id || ''}`, "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res)
                    let dates = {}
                    res.data.forEach(datess => {
                        dates[datess.date_string] = datess.title
                    });
                    setHolidays({ ...d, ...dates });
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
    const CreateManyHolidays = (data) => {
        props.loader(true);
        Api("post", "holiday/createManyHolidays", data, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res)
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



    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    // Auto-generate Sundays + 2nd & 4th Saturdays
    const getAutoHolidays = (year) => {
        const auto = {};
        const newHolidays = [];
        for (let month = 0; month < 12; month++) {
            const days = getDaysInMonth(month, year);
            let saturdayCount = 0;
            for (let day = 1; day <= days; day++) {
                const date = new Date(year, month, day);
                const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                    day
                ).padStart(2, "0")}`;

                if (dayOfWeek === 0) {
                    newHolidays.push({
                        holiday: dateStr,
                        date_string: dateStr,
                        title: "Sunday",
                        year: currentYear
                    })
                    auto[dateStr] = "Sunday";

                }
                else if (dayOfWeek === 6) {
                    saturdayCount++;
                    if (saturdayCount === 2) {
                        newHolidays.push({
                            holiday: dateStr,
                            date_string: dateStr,
                            title: "Second Saturday",
                            year: currentYear
                        })
                        auto[dateStr] = "Second Saturday"

                    };
                    if (saturdayCount === 4) {
                        newHolidays.push({
                            holiday: dateStr,
                            date_string: dateStr,
                            title: "Fourth Saturday",
                            year: currentYear
                        })
                        auto[dateStr] = "Fourth Saturday"

                    };
                }
            }
        }
        console.log(newHolidays)
        CreateManyHolidays(newHolidays)

        return auto;
    };

    const handleDayClick = (dateStr) => {
        setSelectedDate(dateStr);
        setHolidayName(holidays[dateStr] || "");
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!selectedDate || !holidayName.trim()) return;
        setHolidays((prev) => ({ ...prev, [selectedDate]: holidayName.trim() }));
        const d = {
            holiday: selectedDate,
            date_string: selectedDate,
            title: holidayName.trim(),
            year: currentYear
        }
        createHolidays(d)
        setSelectedDate(null);
        setHolidayName("");
    };

    const createHolidays = (data) => {
        props.loader(true);
        Api("post", "holiday/createholiday", data, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res)
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

    const handleDelete = () => {
        if (selectedDate) {
            const updated = { ...holidays };
            delete updated[selectedDate];
            setHolidays(updated);
            Deleteolidays(selectedDate)
            setSelectedDate(null);
            setHolidayName("");
        }
    };

    const Deleteolidays = (d) => {
        props.loader(true);
        Api("delete", `holiday/${d}`, '', router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    console.log(res)
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
                <div className="flex w-full justify-between items-center">


                    <h1 className="text-3xl font-bold text-center mb-6">
                        {currentYear} Holiday Calendar
                    </h1>

                    <button
                        className="bg-red-700 w-40 h-10 rounded-sm py-1 text-white text-sm"
                        onClick={() => {
                            router.push('/holiday_request')
                        }}
                    >
                        Holiday Request
                    </button>
                </div>
                {/* Calendar Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {months.map((month, monthIndex) => {
                        const days = getDaysInMonth(monthIndex, currentYear);
                        const firstDay = new Date(currentYear, monthIndex, 1).getDay();

                        return (
                            <div
                                key={month}
                                className="border rounded-2xl p-4 shadow-sm bg-gray-50"
                            >
                                <h2 className="text-xl font-semibold text-center mb-3">
                                    {month}
                                </h2>

                                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                        <div key={i} className="font-semibold text-gray-600">
                                            {d}
                                        </div>
                                    ))}

                                    {/* Empty cells for offset */}
                                    {Array.from({ length: firstDay }).map((_, i) => (
                                        <div key={`empty-${i}`} />
                                    ))}

                                    {Array.from({ length: days }, (_, day) => {
                                        const dateStr = `${currentYear}-${String(
                                            monthIndex + 1
                                        ).padStart(2, "0")}-${String(day + 1).padStart(2, "0")}`;
                                        const isHoliday = holidays[dateStr];
                                        const isSelected = selectedDate === dateStr;

                                        return (
                                            <div
                                                key={dateStr}
                                                onClick={() => { user.type === 'ADMIN' && handleDayClick(dateStr) }}
                                                className={`p-2 rounded-lg cursor-pointer transition ${isSelected
                                                    ? "bg-blue-500 text-white"
                                                    : isHoliday === "Sunday"
                                                        ? "bg-red-100 text-red-700 font-medium"
                                                        : isHoliday === "Second Saturday" ||
                                                            isHoliday === "Fourth Saturday"
                                                            ? "bg-orange-100 text-orange-700 font-medium"
                                                            : isHoliday
                                                                ? "bg-green-100 text-green-700 font-medium"
                                                                : "hover:bg-gray-200"
                                                    }`}
                                                title={isHoliday || ""}
                                            >
                                                {day + 1}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal for Add/Edit/Delete */}
                {selectedDate && (
                    <div className="fixed inset-0 flex items-center justify-center bg-[#00000090] bg-opacity-40 z-50">
                        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4 text-center">
                                {holidays[selectedDate]
                                    ? `Edit Holiday (${selectedDate})`
                                    : `Add Holiday (${selectedDate})`}
                            </h2>

                            <form onSubmit={handleSave} className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Holiday name"
                                    value={holidayName}
                                    onChange={(e) => setHolidayName(e.target.value)}
                                    className="border rounded-md p-2 outline-none"
                                />

                                <div className="flex justify-between gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedDate(null);
                                            setHolidayName("");
                                        }}
                                        className="flex-1 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>

                                    <button
                                        type="submit"
                                        className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
