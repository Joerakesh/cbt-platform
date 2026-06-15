"use client";

import { useState } from "react";
import axios from "axios";

export default function CreateTestPage() {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [duration, setDuration] = useState(30);

    const [questions, setQuestions] = useState([
        {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: "",
        }
    ]);

    function addQuestion() {
        setQuestions([
            ...questions,
            {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: "",
            }
        ]);
    }

    function removeQuestion(indexToRemove: number) {
        if (questions.length === 1) {
            alert("A test must have at least one question.");
            return;
        }
        setQuestions(questions.filter((_, index) => index !== indexToRemove));
    }

    function updateQuestion(value: string, questionIndex: number) {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].question = value;
        setQuestions(updatedQuestions);
    }

    function updateOption(value: string, questionIndex: number, optionIndex: number) {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    }

    function updateCorrectAnswer(value: string, questionIndex: number) {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].correctAnswer = value;
        setQuestions(updatedQuestions);
    }

    async function createTest() {
        try {
            const response = await axios.post("/api/tests/create", {
                title,
                subject,
                duration,
                language: "mixed",
                questions,
            });

            console.log(response.data);
            alert("Test Created Successfully");

            // Reset form
            setTitle("");
            setSubject("");
            setDuration(30);
            setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
        } catch (error) {
            console.log(error);
            alert("Failed To Create Test");
        }
    }

    // Shared Tailwind classes for consistent styling
    const inputStyle = "w-full border border-gray-300 text-gray-900 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--school-primary)] focus:border-transparent transition-all placeholder-gray-400 shadow-sm";
    const labelStyle = "block mb-1.5 text-sm font-bold text-gray-700 uppercase tracking-wider";

    return (
        <div className="min-h-screen bg-[var(--school-background)] p-6 md:p-12 text-gray-900 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-gray-900">
                        Create Test
                    </h1>
                    <p className="text-gray-500 font-medium">Fill in the details below to generate a new CBT test.</p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200 mb-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Test Title */}
                        <div className="md:col-span-2">
                            <label className={labelStyle}>Test Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Midterm Mathematics Exam"
                                className={inputStyle}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Subject */}
                        <div>
                            <label className={labelStyle}>Subject</label>
                            <input
                                type="text"
                                placeholder="e.g. Algebra"
                                className={inputStyle}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className={labelStyle}>Duration (Minutes)</label>
                            <input
                                type="number"
                                min="1"
                                className={inputStyle}
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                {/* Questions Section */}
                <div className="space-y-6 mb-8">
                    {questions.map((questionItem, questionIndex) => (
                        <div
                            key={questionIndex}
                            className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm relative transition-all"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-extrabold bg-[var(--school-primary)] text-white px-4 py-1.5 rounded-full inline-block">
                                    Q {questionIndex + 1}
                                </h2>

                                <button
                                    onClick={() => removeQuestion(questionIndex)}
                                    className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>

                            {/* Question Input */}
                            <div className="mb-6">
                                <label className={labelStyle}>Question Prompt</label>
                                <textarea
                                    placeholder="Type your question here..."
                                    className={`${inputStyle} resize-y`}
                                    rows={3}
                                    value={questionItem.question}
                                    onChange={(e) => updateQuestion(e.target.value, questionIndex)}
                                />
                            </div>

                            {/* Options */}
                            <div className="mb-6">
                                <label className={labelStyle}>Options</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {questionItem.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="relative">
                                            <span className="absolute left-4 top-3.5 text-sm font-bold text-[var(--school-primary)]">
                                                {String.fromCharCode(65 + optionIndex)}.
                                            </span>
                                            <input
                                                type="text"
                                                placeholder={`Option ${optionIndex + 1}`}
                                                className={`${inputStyle} pl-10`}
                                                value={option}
                                                onChange={(e) => updateOption(e.target.value, questionIndex, optionIndex)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Correct Answer */}
                            <div className="bg-[var(--school-surface)] p-5 rounded-xl border border-[var(--school-border)]">
                                <label className={labelStyle}>Correct Answer</label>
                                <input
                                    type="text"
                                    placeholder="Type the exact correct answer here"
                                    className={`${inputStyle} bg-white`}
                                    value={questionItem.correctAnswer}
                                    onChange={(e) => updateCorrectAnswer(e.target.value, questionIndex)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sticky bottom-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-lg">
                    <button
                        onClick={addQuestion}
                        className="flex-1 bg-white border-2 border-[var(--school-primary)] text-[var(--school-primary)] font-bold text-lg px-6 py-4 rounded-xl hover:bg-[var(--school-surface)] transition-colors"
                    >
                        + Add Another Question
                    </button>

                    <button
                        onClick={createTest}
                        className="flex-1 bg-[var(--school-primary)] border-2 border-[var(--school-primary)] text-white font-bold text-lg px-6 py-4 rounded-xl hover:bg-[var(--school-primary-hover)] shadow-md transition-all"
                    >
                        Save & Publish Test
                    </button>
                </div>

            </div>
        </div>
    );
}