"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LoadingScreen({ isLoading }) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate random particles only on the client after hydration
        const generated = Array.from({ length: 10 }).map(() => ({
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            duration: 4 + Math.random() * 2,
        }));
        setParticles(generated);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[var(--mainLightColor)]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    {/* Background gradient animation */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-white to-indigo-100 opacity-70"
                        animate={{
                            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    {/* Floating particle circles (only render after client mount) */}
                    {particles.map((p, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-indigo-300 opacity-20 blur-xl"
                            style={{
                                width: p.width,
                                height: p.height,
                                top: p.top,
                                left: p.left,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                x: [0, 10, 0],
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Logo Animation */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: 0 }}
                        animate={{ scale: 1, opacity: 1, rotate: 360 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 10,
                            duration: 1.5,
                        }}
                        className="relative z-10 flex flex-col items-center text-center"
                    >
                        <Image
                            src="/2digit/04.png"
                            width={180}
                            height={180}
                            alt="2Digit Logo"
                            className="drop-shadow-xl"
                            priority
                        />
                    </motion.div>

                    {/* Text animation */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        className="mt-10 text-2xl font-bold text-indigo-700"
                    >
                        Welcome to <span className="text-indigo-600">2Digit Innovations</span>
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 0.6 }}
                        className="text-gray-700 text-sm mt-2"
                    >
                        Please always be sure to keep me updated.
                    </motion.p>

                    {/* Fade-out highlight line */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
                        animate={{ scaleX: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
