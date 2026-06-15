"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    School,
    Plus,
    Hash,
    Layers,
    Languages,
    CalendarDays,
    ArrowRightCircle,
    Users
} from "lucide-react";

export default function ClassesPage() {
    // Store classes
    const [classes, setClasses] = useState<any[]>([]);

    // Form states
    const [className, setClassName] = useState("");
    const [section, setSection] = useState("");
    const [medium, setMedium] = useState("English");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Load classes
    async function loadClasses() {
        try {
            const response = await axios.get("/api/classes/all");
            setClasses(response.data.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load class registry");
        } finally {
            setFetchLoading(false);
        }
    }

    // Create class
    async function createClass() {
        if (!className || !section) {
            toast.error("Please provide both Class Name and Section");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Registering new class...");

        try {
            await axios.post("/api/classes/create", {
                className,
                section,
                medium,
            });

            toast.success(`${className}-${section} Registered Successfully`, { id: loadingToast });

            // Reset form
            setClassName("");
            setSection("");
            setMedium("English");
            loadClasses();
        } catch (error) {
            console.log(error);
            toast.error("Failed to register class", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadClasses(); }, []);

    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-[var(--school-background)] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[var(--school-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const inputWrapper = "relative flex items-center";
    const iconBase = "absolute left-4 text-gray-400";
    const inputStyle = "w-full border border-gray-200 bg-gray-50 pl-12 pr-4 py-4 rounded-2xl focus:border-[var(--school-primary)] focus:ring-2 focus:ring-[var(--school-primary)]/10 outline-none transition-all font-bold text-gray-900";

    return (
        <div className="min-h-screen bg-[var(--school-background)] p-6 md:p-10 font-sans text-gray-900">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-gray-900">Class Registry</h1>
                        <p className="text-gray-500 font-medium italic mt-1">Organize classrooms and instruction mediums for GHS Palayanur.</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <Users className="text-[var(--school-primary)]" size={20} />
                        <span className="font-black text-xl">{classes.length}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Classes</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT: Registration Form */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-10">
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <Plus size={16} /> New Registration
                            </h2>

                            <div className="space-y-6">
                                {/* Class Name */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Standard / Grade</label>
                                    <div className={inputWrapper}>
                                        <Hash className={iconBase} size={18} />
                                        <input
                                            type="text"
                                            placeholder="e.g. 10 or SSLC"
                                            value={className}
                                            onChange={(e) => setClassName(e.target.value)}
                                            className={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/* Section */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Section / Group</label>
                                    <div className={inputWrapper}>
                                        <Layers className={iconBase} size={18} />
                                        <input
                                            type="text"
                                            placeholder="e.g. A, B or C"
                                            value={section}
                                            onChange={(e) => setSection(e.target.value)}
                                            className={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/* Medium */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Instruction Medium</label>
                                    <div className={inputWrapper}>
                                        <Languages className={iconBase} size={18} />
                                        <select
                                            value={medium}
                                            onChange={(e) => setMedium(e.target.value)}
                                            className={inputStyle}
                                        >
                                            <option value="English">English Medium</option>
                                            <option value="Tamil">Tamil Medium</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={createClass}
                                    disabled={loading}
                                    className="w-full bg-[var(--school-primary)] hover:bg-[var(--school-primary-hover)] text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? "Processing..." : "Register Class"}
                                    {!loading && <ArrowRightCircle size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: List of Classes */}
                    <div className="lg:col-span-8">
                        {classes.length === 0 ? (
                            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center">
                                <School size={64} className="mx-auto mb-4 text-gray-200" />
                                <h3 className="text-xl font-bold text-gray-400 italic">No classes registered yet.</h3>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {classes.map((item) => (
                                    <div
                                        key={item._id}
                                        className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:border-[var(--school-primary)] hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-[var(--school-surface)] text-[var(--school-primary)] w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black group-hover:bg-[var(--school-primary)] group-hover:text-white transition-colors">
                                                    {item.className}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Section</h3>
                                                    <p className="text-2xl font-black text-gray-900 leading-none">{item.section}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black bg-gray-900 text-white px-3 py-1.5 rounded-full uppercase tracking-tighter">
                                                {item.medium}
                                            </span>
                                        </div>

                                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <CalendarDays size={14} />
                                                <span className="text-[11px] font-bold uppercase tracking-wider">Registered</span>
                                            </div>
                                            <span className="text-xs font-black text-gray-600">
                                                {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="mt-12 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                            GHSS Palayanur — Student Management System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}