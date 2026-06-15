"use client";

import Link from "next/link";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-[var(--school-background)] p-6 md:p-12 font-sans text-gray-900">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-gray-900">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        Manage your CBT portal, create new assessments, and review student performance.
                    </p>
                </div>

                {/* Dashboard Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                    {/* Create Test Card */}
                    <Link
                        href="/admin/create-test"
                        className="group bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-200 hover:border-[var(--school-primary)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
                    >
                        <div className="bg-[var(--school-surface)] text-[var(--school-primary)] group-hover:bg-[var(--school-primary)] group-hover:text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                            </svg>
                        </div>

                        <h2 className="text-3xl font-extrabold mb-3 text-gray-900 group-hover:text-[var(--school-primary)] transition-colors">
                            Create New Test
                        </h2>

                        <p className="text-gray-500 font-medium mb-8 flex-grow">
                            Draft new multiple-choice questions, set durations, and publish new exams for your students.
                        </p>

                        <span className="text-[var(--school-primary)] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            Get Started <span>→</span>
                        </span>
                    </Link>

                    {/* Manage Tests Card */}
                    <Link
                        href="/admin/tests"
                        className="group bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-200 hover:border-[var(--school-primary)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
                    >
                        <div className="bg-[var(--school-surface)] text-[var(--school-primary)] group-hover:bg-[var(--school-primary)] group-hover:text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                            </svg>
                        </div>

                        <h2 className="text-3xl font-extrabold mb-3 text-gray-900 group-hover:text-[var(--school-primary)] transition-colors">
                            Manage Tests & Results
                        </h2>

                        <p className="text-gray-500 font-medium mb-8 flex-grow">
                            View active and past tests, monitor student submissions, and review detailed score reports.
                        </p>

                        <span className="text-[var(--school-primary)] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            View Dashboard <span>→</span>
                        </span>
                    </Link>

                </div>

            </div>
        </div>
    );
}