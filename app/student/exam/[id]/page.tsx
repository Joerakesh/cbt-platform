"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
    Clock,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    Flag,
    Monitor,
    GraduationCap,
    LayoutGrid
} from "lucide-react";

// Shuffle array logic remains the same
function shuffleArray(array: any[]) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const student = useSelector((state: any) => state.student.student);

    const [exam, setExam] = useState<any>(null);
    const [answers, setAnswers] = useState<any[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    async function loadExam() {
        try {
            const response = await axios.get(`/api/tests/get/${id}`);
            const examData = response.data.data;
            const shuffledQuestions = shuffleArray(examData.questions).map((q: any) => ({
                ...q,
                options: shuffleArray(q.options),
            }));
            setExam({ ...examData, questions: shuffledQuestions });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (student === undefined) return;
        if (!student) { router.push("/student/login"); return; }
        loadExam();
    }, [student, router]);

    useEffect(() => {
        if (!started || submitted) return;
        if (timeLeft <= 0) { submitExam(); return; }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, started, submitted]);

    function startExam() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch((err) => console.log(err));
        }
        setTimeLeft(exam.duration * 60);
        setStarted(true);
    }

    function selectAnswer(questionIndex: number, selectedAnswer: string) {
        const updatedAnswers = [...answers];
        const questionId = exam.questions[questionIndex]._id;
        const existing = updatedAnswers.find((item) => item.questionId === questionId);
        if (existing) { existing.selectedAnswer = selectedAnswer; }
        else { updatedAnswers.push({ questionId, selectedAnswer }); }
        setAnswers(updatedAnswers);
    }

    async function submitExam() {
        try {
            const response =
                await axios.post(

                    "/api/tests/submit",

                    {
                        sessionId: id,

                        studentId:
                            student._id,

                        emisNumber:
                            student.emisNumber,

                        answers,
                    }
                );

            console.log("score", response)
            setFinalScore(response.data.score);
            setSubmitted(true);
            if (document.fullscreenElement) { document.exitFullscreen(); }
        } catch (error) {
            alert("Submission Failed");
        }
    }

    if (loading || !exam) {
        return (
            <div className="h-screen bg-[var(--school-background)] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[var(--school-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="h-screen bg-[var(--school-background)] flex items-center justify-center p-6 font-sans">
                <div className="bg-white rounded-[3.5rem] shadow-2xl p-10 md:p-14 max-w-2xl w-full text-center border border-gray-100 animate-in fade-in zoom-in duration-500">

                    {/* Success Icon with Pulse */}
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                        <div className="relative w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                            <CheckCircle size={40} strokeWidth={3} />
                        </div>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">தேர்வு முடிந்தது</h1>
                        <p className="text-[var(--school-primary)] text-sm font-black uppercase tracking-[0.3em]">Assessment Complete</p>
                    </div>

                    {/* Enhanced Score Display */}
                    <div className="bg-gray-900 rounded-[2.5rem] p-10 mb-8 relative overflow-hidden shadow-2xl shadow-gray-300">
                        {/* Decorative Background Icon */}
                        <div className="absolute -right-4 -bottom-4 text-white opacity-5 rotate-12">
                            <GraduationCap size={160} />
                        </div>

                        <div className="relative z-10">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Official Score</p>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-8xl font-black text-white">{finalScore}</span>
                                <div className="text-left">
                                    <p className="text-2xl font-bold text-gray-500 leading-none">/ {exam.questions.length}</p>
                                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mt-1">Total Marks</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Student Info Confirmation */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Name</p>
                            <p className="text-lg font-black text-gray-900 leading-none mt-1">{student?.name}</p>
                        </div>
                        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                        <div className="text-center md:text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">EMIS Number</p>
                            <p className="text-lg font-black text-gray-900 leading-none mt-1">{student?.emisNumber}</p>
                        </div>
                    </div>

                    <Link
                        href="/student"
                        className="inline-flex items-center gap-3 bg-[var(--school-primary)] text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 group"
                    >
                        Back to Student Portal
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }
    if (!started) {
        return (
            <div className="h-screen bg-[var(--school-background)] flex items-center justify-center p-6 font-sans">
                <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl max-w-xl w-full border border-gray-100 text-center animate-in fade-in zoom-in duration-500">

                    {/* Official Seal */}
                    <div className="mb-8">
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seal_of_Tamil_Nadu.svg/250px-Seal_of_Tamil_Nadu.svg.png"
                            alt="TN Logo"
                            width={70}
                            height={70}
                            className="mx-auto drop-shadow-sm"
                        />
                        <p className="text-[10px] font-black text-[var(--school-primary)] uppercase tracking-[0.4em] mt-4 italic">
                            தமிழ்நாடு அரசு கல்வித்துறை
                        </p>
                    </div>

                    {/* Exam Title */}
                    <h1 className="text-3xl md:text-4xl font-black text-black mb-4 leading-tight">
                        {exam.title}
                    </h1>

                    <div className="flex justify-center gap-3 mb-10">
                        <span className="bg-gray-100 text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-gray-200">
                            ⏱ {exam.duration} Minutes
                        </span>
                        <span className="bg-gray-100 text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-gray-200">
                            📝 {exam.questions.length} Questions
                        </span>
                    </div>

                    {/* Candidate Information Card */}
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 mb-10 text-left relative overflow-hidden shadow-xl">
                        {/* Subtle background decoration */}
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
                            <Monitor size={80} />
                        </div>

                        <div className="relative z-10">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Candidate Details</p>
                            <h3 className="text-2xl font-black text-white leading-none">
                                {student?.name}
                            </h3>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="bg-white/10 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter border border-white/10">
                                    EMIS: {student?.emisNumber}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Instructions / Warning */}
                    <div className="flex items-start gap-3 text-left mb-10 px-2">
                        <AlertTriangle className="text-amber-500 shrink-0" size={18} />
                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                            By clicking below, you agree to enter <span className="text-black">Fullscreen Mode</span>. Do not refresh or switch tabs during the examination.
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={startExam}
                        className="group w-full bg-black text-white py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[var(--school-primary)] transition-all active:scale-[0.97] flex items-center justify-center gap-3"
                    >
                        Begin Examination
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-8">
                        GHSS Palayanur Computer Based Test Portal
                    </p>
                </div>
            </div>
        );
    }

    const question = exam.questions[currentQuestion];
    const currentAnswer = answers.find(a => a.questionId === question._id);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    const isTimeLow = timeLeft < 300;

    return (
        <div className="h-screen bg-[var(--school-background)] font-sans flex flex-col overflow-hidden">
            {/* Header - Fixed Height */}
            <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0 shadow-sm z-50">
                <div className="flex items-center gap-4">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seal_of_Tamil_Nadu.svg/250px-Seal_of_Tamil_Nadu.svg.png" alt="TN Logo" width={35} height={35} />
                    <div className="hidden sm:block">
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight leading-none">{exam.title}</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">GHS Palayanur • {student?.name} • {student?.emisNumber} </p>
                    </div>
                </div>
                <div className={`px-6 py-2 rounded-xl text-xl font-black flex items-center gap-3 ${isTimeLow ? "bg-red-600 text-white animate-pulse" : "bg-gray-900 text-white"}`}>
                    <Clock size={20} /> {minutes}:{seconds}
                </div>
            </header>

            {/* Main Area - Dynamic Spacing */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
                <div className="w-full max-w-4xl h-full flex flex-col gap-6">

                    {/* Progress & Alert Area */}
                    <div className="shrink-0">
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-900 transition-all duration-500" style={{ width: `${((currentQuestion + 1) / exam.questions.length) * 100}%` }}></div>
                        </div>
                        {isTimeLow && (
                            <div className="mt-4 bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest">
                                <AlertTriangle size={14} /> Time is running out!
                            </div>
                        )}
                    </div>

                    {/* Question Card - Flexible Height */}
                    <div className="flex-1 min-h-0 bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">

                        {/* FIXED WATERMARK: Added pointer-events-none to prevent blocking clicks */}
                        <div className="absolute top-0 right-0 p-6 text-6xl font-black text-gray-200 opacity-70 select-none pointer-events-none z-0">
                            Q{currentQuestion + 1}
                        </div>

                        {/* FIXED CONTENT: Added relative and z-10 to stay above the watermark */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-8 leading-snug">
                                {question.question}
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                {question.options.map((option: string, i: number) => {
                                    const isSelected = currentAnswer?.selectedAnswer === option;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => selectAnswer(currentQuestion, option)}
                                            className={`group flex items-center w-full text-left p-4 rounded-xl border-2 transition-all font-bold text-base ${isSelected ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-100 hover:border-gray-300 text-gray-700"}`}
                                        >
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black mr-4 ${isSelected ? "bg-white/20" : "bg-gray-100 text-gray-400"}`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Navigator - Compact */}
                    <div className="shrink-0 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {exam.questions.map((_: any, i: number) => {
                                const isCurrent = currentQuestion === i;
                                const isAnswered = answers.some(a => a.questionId === exam.questions[i]._id);
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentQuestion(i)}
                                        className={`w-9 h-9 rounded-lg font-black text-[10px] flex items-center justify-center border-2 transition-all ${isCurrent ? "bg-gray-900 text-white border-gray-900" : isAnswered ? "bg-green-100 border-green-600 text-gray-900" : "bg-yellow-100 border-yellow-600 text-gray-900 hover:border-gray-200"}`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer - Fixed Height */}
            <footer className="h-24 bg-white border-t border-gray-200 px-8 flex items-center justify-center shrink-0 z-50">
                <div className="w-full max-w-4xl flex items-center justify-between gap-4">
                    <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(p => p - 1)} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all disabled:opacity-10">
                        <ChevronLeft size={18} /> Previous
                    </button>
                    {currentQuestion === exam.questions.length - 1 ? (
                        <button onClick={submitExam} className="bg-red-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-700 active:scale-95 flex items-center gap-2">
                            <Flag size={16} /> Final Submit
                        </button>
                    ) : (
                        <button onClick={() => setCurrentQuestion(p => p + 1)} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black active:scale-95 flex items-center gap-2">
                            Next <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}