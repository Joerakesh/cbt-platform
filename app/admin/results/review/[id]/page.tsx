"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";

export default function ReviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Extract ID from async params
    const { id } = use(params);

    // State management
    const [review, setReview] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load review
    async function loadReview() {
        try {
            const response = await axios.get(`/api/tests/results/review/${id}`);
            setReview(response.data);
        } catch (error) {
            console.log("Failed to load review:", error);
        } finally {
            setIsLoading(false);
        }
    }

    // Load on mount
    useEffect(() => {
        loadReview();
    }, []);

    // Loading State (Matches Theme)
    if (isLoading || !review) {
        return (
            <div className="min-h-screen bg-[var(--school-background)] flex items-center justify-center font-sans">
                <div className="text-xl font-bold text-[var(--school-primary)] animate-pulse flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 text-[var(--school-secondary)] animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Review Details...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--school-background)] p-6 md:p-12 text-gray-900 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-gray-900">
                        Test Review
                    </h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Roll Number Card */}
                        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Student Roll Number
                            </p>
                            <p className="text-3xl font-black text-gray-900">
                                {review.rollNo}
                            </p>
                        </div>

                        {/* Score Card - Updated to School Primary Color */}
                        <div className="bg-[var(--school-primary)] text-white p-6 rounded-2xl shadow-sm">
                            <p className="text-sm font-bold text-[var(--school-border)] uppercase tracking-wider mb-1">
                                Final Score
                            </p>
                            <p className="text-3xl font-black">
                                {review.score}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Questions Review Section */}
                <div className="space-y-6">
                    {review.reviewData.map((item: any, index: number) => {

                        // Check if the student got this specific question correct
                        const isQuestionCorrect = item.selectedAnswer === item.correctAnswer;

                        return (
                            <div
                                key={index}
                                className={`bg-white border-2 rounded-2xl p-6 md:p-8 shadow-sm ${isQuestionCorrect ? "border-green-100" : "border-red-100"
                                    }`}
                            >
                                {/* Question Prompt */}
                                <div className="mb-6 flex gap-4 items-start">
                                    <span className={`text-xl font-extrabold text-white px-4 py-1.5 rounded-full shrink-0 ${isQuestionCorrect ? "bg-green-600" : "bg-red-600"
                                        }`}>
                                        Q {index + 1}
                                    </span>
                                    <h2 className="text-lg md:text-xl font-semibold mt-1 text-gray-900">
                                        {item.question}
                                    </h2>
                                </div>

                                {/* Options Review */}
                                <div className="grid grid-cols-1 gap-3">
                                    {item.options.map((option: string, optionIndex: number) => {

                                        const isSelected = option === item.selectedAnswer;
                                        const isCorrect = option === item.correctAnswer;

                                        // Determine styling based on correctness
                                        let optionStyle = "border-gray-200 bg-gray-50 text-gray-700";
                                        let statusBadge = null;

                                        if (isCorrect) {
                                            optionStyle = "border-green-500 bg-green-50 text-green-900 shadow-sm z-10 font-bold";
                                            statusBadge = (
                                                <span className="text-sm font-bold text-green-700 bg-green-200/50 px-3 py-1 rounded-full shrink-0">
                                                    ✓ Correct Answer
                                                </span>
                                            );
                                        } else if (isSelected && !isCorrect) {
                                            optionStyle = "border-red-500 bg-red-50 text-red-900 shadow-sm z-10 font-bold";
                                            statusBadge = (
                                                <span className="text-sm font-bold text-red-700 bg-red-200/50 px-3 py-1 rounded-full shrink-0">
                                                    ✗ Your Answer
                                                </span>
                                            );
                                        }

                                        return (
                                            <div
                                                key={optionIndex}
                                                className={`relative flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border-2 transition-all ${optionStyle}`}
                                            >
                                                <div className="flex items-center">
                                                    <span className={`font-bold mr-4 ${isCorrect || (isSelected && !isCorrect) ? "text-current" : "text-gray-400"}`}>
                                                        {String.fromCharCode(65 + optionIndex)}.
                                                    </span>
                                                    <span className="leading-tight">
                                                        {option}
                                                    </span>
                                                </div>

                                                {/* Status Badge (Correct / Incorrect) */}
                                                {statusBadge && (
                                                    <div className="ml-8 md:ml-0">
                                                        {statusBadge}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}