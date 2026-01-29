"use client";
import moment from "moment";
import { useEffect, useState } from "react";

export default function TimePicker({
    value,
    onChange,
    date,
    minTime,
    maxTime,
}) {
    const hours = Array.from({ length: 12 }, (_, i) =>
        String(i + 1).padStart(2, "0")
    );
    const minutes = ["00", "15", "30", "45"];
    const periods = ["AM", "PM"];

    const [hour, setHour] = useState("09");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");

    useEffect(() => {
        console.log('timepicker value changed====>', value)
        if (value) {
            let h = value.split(":")[0];
            let m = value.split(" ")[0].split(":")[1];

            if (Number(h) > 12) h = Number(h) - 12;
            if (Number(h) < 10 && !h.toString().includes("0")) h = `0${h}`;
            setHour(h);
            setMinute(m);
            setPeriod(value.split(" ")[1]);
            console.log('timepicker value====>', m, h, m, value)
        }
    }, [value]);

    const toDate = (h, m, p) => {
        let hour24 = Number(h);

        if (p === "PM" && hour24 !== 12) hour24 += 12;
        if (p === "AM" && hour24 === 12) hour24 = 0;

        const d = new Date(date);
        d.setHours(hour24, Number(m), 0);
        return d;
    };

    const isDisabled = (h, m, p) => {
        const d = toDate(h, m, p);
        if (minTime && d < minTime) return true;
        if (maxTime && d > maxTime) return true;
        return false;
    };

    const emitTime = (h, m, p) => {
        const d = toDate(h, m, p);
        onChange?.(d);
    };

    return (
        <div style={{ display: "flex", gap: 8 }}>
            {/* HOURS */}
            <select
                value={hour}
                onChange={(e) => {
                    setHour(e.target.value);
                    emitTime(e.target.value, minute, period);
                }}
            >
                {hours.map((h) => (
                    <option
                        key={h}
                        value={h}
                        disabled={isDisabled(h, minute, period)}
                    >
                        {h}
                    </option>
                ))}
            </select>

            {/* MINUTES */}
            <select
                value={minute}
                onChange={(e) => {
                    setMinute(e.target.value);
                    emitTime(hour, e.target.value, period);
                }}
            >
                {minutes.map((m) => (
                    <option
                        key={m}
                        value={m}
                        disabled={isDisabled(hour, m, period)}
                    >
                        {m}
                    </option>
                ))}
            </select>

            {/* AM / PM */}
            <select
                value={period}
                onChange={(e) => {
                    setPeriod(e.target.value);
                    emitTime(hour, minute, e.target.value);
                }}
            >
                {periods.map((p) => (
                    <option
                        key={p}
                        value={p}
                        disabled={isDisabled(hour, minute, p)}
                    >
                        {p}
                    </option>
                ))}
            </select>
        </div>
    );
}
