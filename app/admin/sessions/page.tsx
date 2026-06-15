"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
    Calendar,
    Clock,
    Users,
    FileText,
    Plus,
    Trash2,
} from "lucide-react";

export default function SessionsPage() {

    // Data states
    const [tests, setTests] =
        useState<any[]>([]);

    const [classes, setClasses] =
        useState<any[]>([]);

    const [sessions, setSessions] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    // Form states
    const [title, setTitle] =
        useState("");

    const [testId, setTestId] =
        useState("");

    const [selectedClasses,
        setSelectedClasses] =
        useState<string[]>([]);

    const [startTime,
        setStartTime] =
        useState("");

    const [endTime,
        setEndTime] =
        useState("");

    // Load data
    async function loadData() {

        try {

            const [
                testsRes,
                classesRes,
                sessionsRes,
            ] = await Promise.all([

                axios.get(
                    "/api/tests/all"
                ),

                axios.get(
                    "/api/classes/all"
                ),

                axios.get(
                    "/api/sessions/all"
                ),
            ]);

            setTests(
                testsRes.data.data || []
            );

            setClasses(
                classesRes.data.data || []
            );

            setSessions(
                sessionsRes.data.data || []
            );

        } catch (error) {

            console.log(error);

            toast.error(
                "Failed to load data"
            );

        } finally {

            setLoading(false);
        }
    }

    // Toggle class
    function toggleClass(
        classId: string
    ) {

        setSelectedClasses(
            (prev) =>

                prev.includes(classId)

                    ? prev.filter(
                        (id) =>
                            id !== classId
                    )

                    : [
                        ...prev,
                        classId,
                    ]
        );
    }
    // Delete session
    async function deleteSession(
        sessionId: string
    ) {

        // Confirm
        const confirmDelete =
            confirm(
                "Delete this session?"
            );

        if (!confirmDelete) {

            return;
        }

        const loadingToast =
            toast.loading(
                "Deleting session..."
            );

        try {

            // Delete API
            await axios.delete(

                `/api/sessions/delete/${sessionId}`
            );

            toast.success(
                "Session Deleted",
                {
                    id: loadingToast,
                }
            );

            // Reload data
            loadData();

        } catch (error) {

            console.log(error);

            toast.error(
                "Delete failed",
                {
                    id: loadingToast,
                }
            );
        }
    }

    // Create session
    async function createSession() {

        // Validation
        if (
            !title ||
            !testId ||
            selectedClasses.length === 0 ||
            !startTime ||
            !endTime
        ) {

            toast.error(
                "Please fill all fields"
            );

            return;
        }

        // End time validation
        if (
            new Date(endTime)
            <=
            new Date(startTime)
        ) {

            toast.error(
                "End time must be after start time"
            );

            return;
        }

        const loadingToast =
            toast.loading(
                "Scheduling exam..."
            );

        try {

            // Proper datetime conversion
            const formattedStart =
                new Date(
                    startTime + ":00"
                );

            const formattedEnd =
                new Date(
                    endTime + ":00"
                );

            // Create session
            await axios.post(

                "/api/sessions/create",

                {
                    title,

                    testId,

                    classIds:
                        selectedClasses,

                    startTime:
                        formattedStart.toISOString(),

                    endTime:
                        formattedEnd.toISOString(),
                }
            );

            toast.success(

                "Session Scheduled",

                {
                    id: loadingToast,
                }
            );

            // Reset form
            setTitle("");

            setTestId("");

            setSelectedClasses([]);

            setStartTime("");

            setEndTime("");

            // Reload sessions
            loadData();

        } catch (error) {

            console.log(error);

            toast.error(
                "Failed to create session",
                {
                    id: loadingToast,
                }
            );
        }
    }

    // Load page
    useEffect(() => {

        loadData();

    }, []);

    // Input style
    const inputStyle = `
        w-full
        border
        border-gray-300
        bg-white
        text-gray-900
        p-4
        rounded-xl
        focus:outline-none
        focus:ring-2
        focus:ring-[var(--school-primary)]
        transition-all
        font-medium
    `;

    // Loading UI
    if (loading) {

        return (

            <div className="min-h-screen bg-[var(--school-background)] flex items-center justify-center">

                <div className="w-10 h-10 border-4 border-[var(--school-primary)] border-t-transparent rounded-full animate-spin"></div>

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-[var(--school-background)] p-6 md:p-10 font-sans text-gray-900">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-10">

                    <h1 className="text-4xl font-black tracking-tight mb-2">

                        Exam Sessions

                    </h1>

                    <p className="text-gray-500 font-medium italic">

                        Schedule when and for whom tests are active.

                    </p>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT SIDE */}
                    <div className="lg:col-span-5">

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-10">

                            {/* Title */}
                            <h2 className="text-xl font-black mb-6 flex items-center gap-2">

                                <Plus
                                    size={20}
                                    className="text-[var(--school-primary)]"
                                />

                                New Schedule

                            </h2>

                            <div className="space-y-5">

                                {/* Session Title */}
                                <div>

                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">

                                        Session Label

                                    </label>

                                    <input
                                        type="text"
                                        placeholder="e.g. Mid Term Exam"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(
                                                e.target.value
                                            )
                                        }
                                        className={inputStyle}
                                    />

                                </div>

                                {/* Select Test */}
                                <div>

                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">

                                        Select Test

                                    </label>

                                    <select
                                        value={testId}
                                        onChange={(e) =>
                                            setTestId(
                                                e.target.value
                                            )
                                        }
                                        className={inputStyle}
                                    >

                                        <option value="">

                                            Choose Test

                                        </option>

                                        {tests.map((item) => (

                                            <option
                                                key={item._id}
                                                value={item._id}
                                            >

                                                {item.title}

                                            </option>
                                        ))}

                                    </select>

                                </div>

                                {/* Classes */}
                                <div>

                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">

                                        Target Classes

                                    </label>

                                    <div className="grid grid-cols-2 gap-2">

                                        {classes.map((item) => {

                                            const selected =
                                                selectedClasses.includes(
                                                    item._id
                                                );

                                            return (

                                                <button
                                                    key={item._id}
                                                    onClick={() =>
                                                        toggleClass(
                                                            item._id
                                                        )
                                                    }
                                                    className={`
                                                        p-3
                                                        text-xs
                                                        rounded-xl
                                                        border-2
                                                        transition-all
                                                        font-bold

                                                        ${selected

                                                            ? "bg-[var(--school-primary)] text-white border-[var(--school-primary)]"

                                                            : "bg-white border-gray-100 text-gray-400 hover:border-[var(--school-primary)]"
                                                        }
                                                    `}
                                                >

                                                    {item.className}
                                                    -
                                                    {item.section}

                                                </button>
                                            );
                                        })}

                                    </div>

                                </div>

                                {/* Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Start */}
                                    <div>

                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">

                                            Start Time

                                        </label>

                                        <input
                                            type="datetime-local"
                                            value={startTime}
                                            onChange={(e) =>
                                                setStartTime(
                                                    e.target.value
                                                )
                                            }
                                            className={inputStyle}
                                        />

                                    </div>

                                    {/* End */}
                                    <div>

                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">

                                            End Time

                                        </label>

                                        <input
                                            type="datetime-local"
                                            value={endTime}
                                            onChange={(e) =>
                                                setEndTime(
                                                    e.target.value
                                                )
                                            }
                                            className={inputStyle}
                                        />

                                    </div>

                                </div>

                                {/* Button */}
                                <button
                                    onClick={createSession}
                                    className="w-full bg-[var(--school-primary)] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[var(--school-primary-hover)] transition-all shadow-lg active:scale-95"
                                >

                                    Activate Session

                                </button>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="lg:col-span-7 space-y-6">

                        <h2 className="text-xl font-black flex items-center gap-2">

                            <Calendar
                                size={20}
                                className="text-[var(--school-primary)]"
                            />

                            Existing Schedules

                        </h2>

                        {sessions.length === 0 ? (

                            <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 text-center text-gray-400 font-bold">

                                No active schedules found.

                            </div>

                        ) : (

                            <div className="space-y-4">

                                {sessions.map((item) => (

                                    <div
                                        key={item._id}
                                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    >

                                        {/* Left */}
                                        <div className="flex-grow">

                                            <div className="flex items-center gap-2 mb-2">

                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

                                                <h3 className="text-lg font-black">

                                                    {item.title}

                                                </h3>

                                            </div>

                                            <div className="flex flex-wrap gap-4 text-[13px] font-medium text-gray-500">

                                                <div className="flex items-center gap-1.5">

                                                    <FileText
                                                        size={16}
                                                        className="text-[var(--school-primary)]"
                                                    />

                                                    {item.testId?.title || "Test Removed"}

                                                </div>

                                                <div className="flex items-center gap-1.5">

                                                    <Users
                                                        size={16}
                                                        className="text-[var(--school-primary)]"
                                                    />

                                                    {item.classIds?.length || 0}
                                                    {" "}
                                                    Classes

                                                </div>

                                            </div>

                                        </div>

                                        {/* Right */}
                                        <div className="bg-[var(--school-surface)] p-4 rounded-2xl border border-[var(--school-border)] shrink-0">

                                            <div className="flex items-center gap-2 text-[11px] font-black text-gray-500 uppercase mb-1">

                                                <Clock size={14} />

                                                Schedule Window

                                            </div>

                                            <p className="text-[13px] font-bold text-[var(--school-primary)]">

                                                {new Date(
                                                    item.startTime
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        dateStyle:
                                                            "medium",

                                                        timeStyle:
                                                            "short",

                                                        timeZone:
                                                            "Asia/Kolkata",
                                                    }
                                                )}

                                                <span className="mx-2 text-gray-300">

                                                    →

                                                </span>

                                                {new Date(
                                                    item.endTime
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        dateStyle:
                                                            "medium",

                                                        timeStyle:
                                                            "short",

                                                        timeZone:
                                                            "Asia/Kolkata",
                                                    }
                                                )}

                                            </p>

                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() =>
                                                deleteSession(
                                                    item._id
                                                )
                                            }
                                            className="
            bg-red-50
            hover:bg-red-100
            text-red-500
            p-4
            rounded-2xl
            transition-all
            border
            border-red-100
            active:scale-95
        "
                                        >

                                            <Trash2 size={18} />

                                        </button>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}