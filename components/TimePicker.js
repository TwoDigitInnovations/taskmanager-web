"use client";
import moment from "moment";
import { useEffect, useState } from "react";

export default function TimePicker({ value, onChange, date }) {
    console.log(value)
    // console.log(onChange)
    console.log(date)
    const hours = Array.from({ length: 12 }, (_, i) =>
        String(i + 1).padStart(2, "0")
    );
    const minutes = ["00", "15", "30", "45"];
    const periods = ["AM", "PM"];


    const [hour, setHour] = useState(value.split(':')[0]);
    const [minute, setMinute] = useState(value.split(':')[1]);
    const [period, setPeriod] = useState(value.split(' ')[1]);

    useEffect(() => {
        if (value) {
            console.log(value.split(':')[0], value.split(':')[1], value.split(' ')[1])
            let h = value.split(':')[0];

            if (Number(h) > 12) h = Number(h) - 12
            if (Number(h) < 10 && !(h).toString().includes('0')) h = `0${h}`
            console.log(h)
            setHour(h)
            setMinute(value.split(' ')[0].split(':')[1])
            setPeriod(value.split(' ')[1])
        }

    }, [value])

    const emitTime = (h, m, p) => {
        //         const time = `${h}:${m} ${p}`;
        // let h = text.target.value.split(':')[0]
        //                     let m = text.target.value.split(':')[1]
        if (p === 'PM') h = Number(h) + 12
        // console.log('seted=======>', h)
        let nee = new Date(date)
        let newhrs = new Date(nee.setHours(Number(h)))
        let newDate = new Date(newhrs.setMinutes(Number(m)))
        onChange?.(newDate);
    };

    return (
        <div style={{ display: "flex", gap: 8 }}>
            <select
                value={hour}
                onChange={(e) => {
                    setHour(e.target.value);
                    emitTime(e.target.value, minute, period);
                }}
            >
                {hours.map((h) => (
                    <option key={h}>{h}</option>
                ))}
            </select>

            <select
                value={minute}
                onChange={(e) => {
                    setMinute(e.target.value);
                    emitTime(hour, e.target.value, period);
                }}
            >
                {minutes.map((m) => (
                    <option key={m}>{m}</option>
                ))}
            </select>

            <select
                value={period}
                onChange={(e) => {
                    setPeriod(e.target.value);
                    emitTime(hour, minute, e.target.value);
                }}
            >
                {periods.map((p) => (
                    <option key={p}>{p}</option>
                ))}
            </select>
        </div>
    );
}
