"use client";

import {
    useEffect,
    useState,
    use,
} from "react";

import axios from "axios";

import Link from "next/link";

import {
    Eye,
    GraduationCap,
    Trophy,
    CalendarClock,
} from "lucide-react";

export default function ResultsPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {

    // Session/Test ID
    const { id } =
        use(params);

    // States
    const [results, setResults] =
        useState<any[]>([]);

    const [loading,
        setLoading] =
        useState(true);

    // Load results
    async function loadResults() {

        try {

            const response =
                await axios.get(

                    `/api/tests/results/${id}`
                );


            console.log(response)
            setResults(
                response.data.data || []
            );

        } catch (error) {

            console.log(
                "Failed to load results:",
                error
            );

        } finally {

            setLoading(false);
        }
    }

    // Load on mount
    useEffect(() => {

        loadResults();

    }, []);

    // Loading UI
    if (loading) {

        return (

            <div className="min-h-screen bg-[var(--school-background)] flex items-center justify-center">

                <div className="flex flex-col items-center gap-4">

                    <div className="w-10 h-10 border-4 border-[var(--school-primary)] border-t-transparent rounded-full animate-spin"></div>

                    <p className="font-bold text-[var(--school-primary)]">

                        Loading Results...

                    </p>

                </div>

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-[var(--school-background)] p-6 md:p-10">

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-10">

                    <h1 className="text-4xl font-black mb-3 flex items-center gap-3">

                        <Trophy
                            className="text-[var(--school-primary)]"
                            size={36}
                        />

                        Exam Results

                    </h1>

                    <p className="text-gray-500 font-medium">

                        View student scores and exam submissions.

                    </p>

                </div>

                {/* Empty */}
                {results.length === 0 ? (

                    <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">

                        <GraduationCap
                            size={70}
                            className="mx-auto text-gray-200 mb-5"
                        />

                        <h2 className="text-3xl font-black text-gray-400 mb-3">

                            No Results Yet

                        </h2>

                        <p className="text-gray-500 font-medium">

                            Students have not submitted this exam yet.

                        </p>

                    </div>

                ) : (

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* Top */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">

                            <h2 className="text-xl font-black">

                                Student Attempts

                            </h2>

                            <div className="text-sm font-bold text-gray-400">

                                Total:
                                {" "}
                                {results.length}

                            </div>

                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <th className="p-5 text-left text-[11px] uppercase tracking-widest text-gray-400 font-black">

                                            Student

                                        </th>

                                        <th className="p-5 text-left text-[11px] uppercase tracking-widest text-gray-400 font-black">

                                            EMIS Number

                                        </th>

                                        <th className="p-5 text-left text-[11px] uppercase tracking-widest text-gray-400 font-black">

                                            Score

                                        </th>

                                        <th className="p-5 text-left text-[11px] uppercase tracking-widest text-gray-400 font-black">

                                            Submitted Time

                                        </th>

                                        <th className="p-5 text-center text-[11px] uppercase tracking-widest text-gray-400 font-black">

                                            Action

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {results.map((item) => (

                                        <tr
                                            key={item._id}
                                            className="border-t border-gray-100 hover:bg-gray-50 transition-all"
                                        >

                                            {/* Student */}
                                            <td className="p-5">

                                                <div>

                                                    <h3 className="font-black text-gray-900">

                                                        {item.studentId?.name || "Unknown"}

                                                    </h3>

                                                </div>

                                            </td>

                                            {/* EMIS */}
                                            <td className="p-5">

                                                <span className="font-bold text-gray-500">

                                                    {item.emisNumber}

                                                </span>

                                            </td>

                                            {/* Score */}
                                            <td className="p-5">

                                                <span className="
                                                    bg-[var(--school-surface)]
                                                    border
                                                    border-[var(--school-border)]
                                                    text-[var(--school-primary)]
                                                    px-4
                                                    py-2
                                                    rounded-xl
                                                    font-black
                                                    inline-block
                                                ">

                                                    {item.score}

                                                </span>

                                            </td>

                                            {/* Time */}
                                            <td className="p-5">

                                                <div className="flex items-center gap-2 text-gray-500 font-medium">

                                                    <CalendarClock
                                                        size={16}
                                                    />

                                                    {new Date(
                                                        item.createdAt
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

                                                </div>

                                            </td>

                                            {/* Action */}
                                            <td className="p-5 text-center">

                                                <Link
                                                    href={`/admin/results/review/${item._id}`}
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        bg-[var(--school-primary)]
                                                        text-white
                                                        px-5
                                                        py-3
                                                        rounded-xl
                                                        font-bold
                                                        hover:bg-[var(--school-primary-hover)]
                                                        transition-all
                                                        active:scale-95
                                                    "
                                                >

                                                    <Eye size={18} />

                                                    Review

                                                </Link>

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