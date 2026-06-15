"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { Trash2, ExternalLink, BarChart3, Clock, BookOpen } from "lucide-react";

export default function TestsPage() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadTests() {
        try {
            const response = await axios.get("/api/tests/all");
            setTests(response.data.data);
        } catch (error) {
            toast.error("Failed to load tests");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTests();
    }, []);

    async function deleteTest(testId: string) {
        // We'll use a more stylish confirm later, but let's stick to the logic for now
        const confirmDelete = confirm("Are you sure you want to delete this test? This action cannot be undone.");
        if (!confirmDelete) return;

        const loadingToast = toast.loading("Deleting test...");

        try {
            await axios.delete(`/api/tests/delete/${testId}`);

            setTests((prev) => prev.filter((test) => test._id !== testId));

            toast.success("Test deleted successfully", { id: loadingToast });
        } catch (error) {
            toast.error("Failed to delete test", { id: loadingToast });
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--school-background)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--school-primary)] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[var(--school-primary)] font-bold animate-pulse">Syncing Exams...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--school-background)] p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                            Manage Examinations
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">
                            Create, monitor, and organize your school's CBT modules.
                        </p>
                    </div>

                    <Link
                        href="/admin/create-test"
                        className="bg-[var(--school-primary)] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[var(--school-primary-hover)] transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <PlusSquare size={20} />
                        Create New Test
                    </Link>
                </div>

                {tests.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                        <div className="bg-[var(--school-surface)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--school-primary)]">
                            <BookOpen size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tests Found</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Your exam list is currently empty. Start by creating your first assessment.</p>
                        <Link href="/admin/create-test" className="text-[var(--school-primary)] font-bold hover:underline">
                            + Add your first test
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tests.map((test) => (
                            <div
                                key={test._id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[var(--school-primary)] transition-all duration-300 flex flex-col group overflow-hidden"
                            >
                                {/* Card Header / Title Area */}
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-[var(--school-primary)] transition-colors leading-tight">
                                            {test.title}
                                        </h2>
                                        <button
                                            onClick={() => deleteTest(test._id)}
                                            className="text-gray-300 hover:text-red-600 p-1 transition-colors"
                                            title="Delete Test"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="flex flex-wrap gap-3 mt-4">
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                                            <Clock size={14} className="text-[var(--school-primary)]" />
                                            {test.duration}m
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                                            <BookOpen size={14} className="text-[var(--school-primary)]" />
                                            {test.questions?.length || 0} Qs
                                        </div>
                                        {test.subject && (
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--school-primary)] bg-[var(--school-surface)] px-2.5 py-1.5 rounded-lg border border-[var(--school-border)]">
                                                {test.subject}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Footer / Quick Actions */}
                                <div className="bg-gray-50/50 p-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                                    <Link
                                        href={`/exam/${test._id}`}
                                        className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:border-[var(--school-primary)] hover:text-[var(--school-primary)] transition-all"
                                    >
                                        <ExternalLink size={16} />
                                        Preview
                                    </Link>

                                    <Link
                                        href={`/admin/results/${test._id}`}
                                        className="flex items-center justify-center gap-2 bg-[var(--school-primary)] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--school-primary-hover)] transition-all shadow-sm"
                                    >
                                        <BarChart3 size={16} />
                                        Results
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper icons needed from lucide-react: PlusSquare
function PlusSquare({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
    )
}