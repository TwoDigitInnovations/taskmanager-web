"use client";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";
import { IoChevronBack, IoChevronForward, IoRepeat } from "react-icons/io5";
import moment from "moment";
import { Api } from "@/src/services/service";
import { useConfirm } from "../confirmationModal";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { Tooltip } from "@mui/material";
import { userContext } from "@/pages/_app";

export default function CustomCalendar(props) {
    const { confirm } = useConfirm();
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [view, setView] = useState("month");
    const [dateObj, setDateObj] = useState();
    const [events, setEvents] = useState([])
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [user, setUser] = useContext(userContext)


    // Example events: { date: '2025-10-10', title: 'Meeting' }
    // const events = [
    //     { date: "2025-10-01", title: "Event A" },
    //     { date: "2025-10-06", title: "Event B" },
    //     { date: "2025-10-07", title: "Event C" },
    //     { date: "2025-10-10", title: "Event D" },
    //     { date: "2025-10-17", title: "Event E" },
    // ];

    const startOfMonth = currentDate.startOf("month").startOf("week");
    const endOfMonth = currentDate.endOf("month").endOf("week");

    const days = [];
    let day = startOfMonth;
    while (day.isBefore(endOfMonth) || day.isSame(endOfMonth)) {
        days.push(day);
        day = day.add(1, "day");
    }

    const prevMonth = () => {
        setCurrentDate(currentDate.subtract(1, "month"));
    };
    const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));
    const today = () => setCurrentDate(dayjs());

    const getEventsForDay = (date) =>
        events.filter((e) => dayjs(e.date).isSame(date, "day"));

    useEffect(() => {
        setDateObj({ startDate: new Date(startOfMonth), endDate: new Date(endOfMonth) });
        props.getAllJobs(
            moment(new Date(startOfMonth)).format(),
            moment(new Date(endOfMonth)).format()
        );
    }, [currentDate])

    useEffect(() => {
        if (!!props.data) {
            setDataTable();
        }
    }, [props.data]);

    const setDataTable = () => {
        const d = [];
        const e = [];
        props?.data.forEach((ele, index) => {
            ele?.jobs.forEach((el, i) => {
                d.push({
                    title: "",
                    id: el._id,
                    date: moment(el.startDate).format("yyyy-MM-DD"),
                    // color: checkColors(el)
                    // start: moment(el.startDate).format("yyyy-MM-DD"),   //for range values
                    // end: moment(el.endDate).format("yyyy-MM-DD"),
                    ...el,
                });
                e.push({ ...el, name: ele.name });
                if (props?.data.length === index + 1) {
                    setEvents(d);
                    // setMainData(e);
                }
            });
        });
    };

    const deleteTask = async (id, date) => {
        const result = await confirm("Delete Task", "Are you sure you want to delete this?", { id });
        if (result.confirm) {
            props.loader(true);
            Api("delete", `jobs/${id}`, "", props.router).then(
                async (res) => {
                    props.loader(false);
                    if (res.status) {
                        props.getAllJobs(
                            moment(dateObj.startDate).format(),
                            moment(dateObj.endDate).format()
                        );
                    } else {
                        props.toaster({ type: "success", message: res.message });
                    }
                },
                (err) => {
                    props.loader(false);
                    props.toaster({ type: "error", message: err.message });
                    console.log(err);
                }
            );
        }
    };



    let sat = [6, 13, 20, 27, 34];
    let sun = [0, 5, 12, 19, 26]

    return (
        <div className="md:mx-5 mx-3 bg-white mb-5">
            {/* Header */}
            <div className=" bg-[var(--mainColor)]  rounded-sm border-t-4 border-[var(--customYellow)]  relative">
                <div className="grid md:grid-cols-4 grid-cols-3 items-center bg-[var(--mainColor)] md:px-5 p-3 rounded-sm   relative">
                    <div className="col-span-1">
                        <div
                            className="md:h-10 h-7 md:w-12 w-8 rounded-md border-2 border-[var(--customYellow)] hover:bg-[var(--customYellow)] flex items-center justify-center cursor-pointer bg-[var(--white)]"
                            onClick={() => {
                                prevMonth();
                            }}
                        >
                            <IoChevronBack className="text-black md:text-xl text-xs" />
                        </div>
                    </div>
                    <div className=" md:block hidden col-span-2">
                        <p className="text-white text-center text-lg ">
                            {" "}
                            {currentDate.format("MMMM YYYY")}
                        </p>
                    </div>
                    <div className="flex items-center justify-end w-full md:col-span-1 col-span-2">
                        <div className="flex md:h-10 h-7 border-2 border-[var(--customYellow)] rounded-sm items-center justify-center md:mr-5 mr-1 bg-white">
                            <button
                                className="text-black px-3 md:h-10 h-7 bg-[var(--customYellow)] border-[var(--customYellow)] md:text-md f10"

                                onClick={() => {
                                    props?.setShowCal("month");
                                }}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => {
                                    props?.setShowCal("week");
                                }}
                                className="text-black px-3 md:h-10 h-7 hover:bg-[var(--customYellow)]]  rounded-sm f10  md:text-md"
                            >
                                Week
                            </button>
                            <button className="text-black px-3 md:h-10 h-7 hover:bg-[var(--customYellow)] md:text-md f10" onClick={() => {
                                props?.setShowCal("today");
                            }}>
                                Today
                            </button>
                        </div>
                        <div
                            className="md:h-10 h-7 md:w-12 w-8 rounded-md border-2 border-[var(--customYellow)] hover:bg-[var(--customYellow)] flex items-center justify-center cursor-pointer bg-[var(--white)]"
                            onClick={nextMonth}
                        >
                            <IoChevronForward className="text-black md:text-xl text-xs" />
                        </div>
                    </div>
                </div>
            </div>

            {/* View controls */}


            {/* Calendar Grid */}
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-t border-gray-200 text-sm relative">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div
                        key={d}
                        className="text-center font-medium text-gray-600 border-b border-gray-200 py-2 bg-gray-50"
                    >
                        {d}
                    </div>
                ))}
                {days.map((d, idx) => {
                    const isCurrentMonth = d.month() === currentDate.month();
                    const isToday = d.isSame(dayjs(), "day");
                    const dayEvents = getEventsForDay(d);

                    return (
                        <div
                            key={idx}
                            className={clsx(
                                "h-28 border border-gray-100 p-1 relative group",
                                !isCurrentMonth && "bg-gray-100 text-gray-400",
                                isToday && "bg-yellow-50"
                            )}
                        >
                            <div className="text-right pr-2 font-medium text-gray-700 text-xs">
                                {d.date()}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1 px-2 justify-end ">
                                {dayEvents.map((e, i) => (
                                    <div className="relative group" key={i}>
                                        <div

                                            className="w-5 h-3 rounded-full bg-indigo-600 cursor-pointer"
                                            onMouseEnter={(event) =>
                                                setHoveredEvent(e)
                                            }
                                        // onMouseLeave={() => setHoveredEvent(null)}
                                        ></div>
                                        {hoveredEvent && hoveredEvent?.id === e.id && < div
                                            className={`hidden group-hover:block absolute top-6 z-50 bg-[var(--mainColor)] text-white text-xs rounded-md shadow-lg p-3 w-56 ${sat.includes(idx) ? '-right-1' : sun.includes(idx) ? '-left-1' : '-left-1'}`}

                                        >
                                            <div className="relative">
                                                <div className={`h-5 w-5 bg-[var(--mainColor)] rotate-45 -top-5 absolute ${sat.includes(idx) ? '-right-2' : sun.includes(idx) ? '-left-2' : '-left-2'}`}></div>

                                                <div className="font-semibold mb-1">
                                                    Project: {e?.project.name}
                                                </div>
                                                <div>Name: {e?.posted_by?.username}</div>
                                                <div>Start Time:  {moment(new Date(e?.startTime)).format("hh:mm A")}</div>
                                                <div>End Time:  {moment(new Date(e?.endTime)).format("hh:mm A")}</div>
                                                <div>Hours: {e?.job_hrs}</div>
                                                {<div className="flex justify-start items-end mt-1">

                                                    <Tooltip title={<p>Edit</p>} arrow>
                                                        <div
                                                            className="w-6 h-6 bg-white rounded-sm flex justify-center items-center mr-1"
                                                            onClick={() => {
                                                                props.goToTop();
                                                                props.setShowForm(true);
                                                                props.setJobID(e?._id);
                                                                props.setRepeat("Update Task");
                                                            }}
                                                        >
                                                            <MdModeEditOutline className="text-black  text-lg" />
                                                        </div>
                                                    </Tooltip>
                                                    <Tooltip title={<p>Delete</p>} arrow>
                                                        <div
                                                            className="w-6 h-6 bg-white rounded-sm flex justify-center items-center mr-1 "
                                                            onClick={() => {
                                                                deleteTask(e?._id);
                                                            }}
                                                        >
                                                            <MdDeleteForever className="text-black text-lg" />
                                                        </div>
                                                    </Tooltip>

                                                </div>}
                                            </div>
                                        </div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Tooltip */}
                {/* {hoveredEvent && (
                    <div
                        className="absolute z-50 bg-gray-800 text-white text-xs rounded-md shadow-lg p-3 w-56"
                        style={{
                            top: hoveredEvent.y,
                            left: hoveredEvent.x,
                        }}
                    >
                        <div className="font-semibold mb-1">
                            Project: {hoveredEvent.project}
                        </div>
                        <div>Name: {hoveredEvent.name}</div>
                        <div>Start Time: {hoveredEvent.startTime}</div>
                        <div>End Time: {hoveredEvent.endTime}</div>
                        <div>Hours: {hoveredEvent.hours}</div>
                        <div className="flex gap-2 mt-2">
                            <button className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
                                ✎
                            </button>
                            <button className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
                                🗑
                            </button>
                        </div>
                    </div>
                )} */}
            </div>
        </div >
    );
}
