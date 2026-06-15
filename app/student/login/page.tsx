"use client";

import {
    useState,
    useEffect,
} from "react";

import axios from "axios";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useRouter,
} from "next/navigation";

import Image from "next/image";

import toast from "react-hot-toast";

import {
    setStudent,
} from "@/store/studentSlice";

import {
    User,
    Calendar,
    LogIn,
} from "lucide-react";

export default function StudentLoginPage() {

    // Redux
    const dispatch =
        useDispatch();

    // Router
    const router =
        useRouter();

    // Current student
    const student =
        useSelector(
            (state: any) =>
                state.student.student
        );

    // Form states
    const [emisNumber,
        setEmisNumber] =
        useState("");

    const [dob,
        setDob] =
        useState("");

    // Loading
    const [loading,
        setLoading] =
        useState(false);

    // Redirect if already logged in
    useEffect(() => {

        if (student) {

            router.push(
                "/student"
            );
        }

    }, [student]);

    // Login
    async function login() {

        // Validation
        if (
            !emisNumber ||
            !dob
        ) {

            toast.error(
                "Please enter EMIS and DOB"
            );

            return;
        }

        setLoading(true);

        const loadingToast =
            toast.loading(
                "Verifying credentials..."
            );

        try {

            // Login API
            const response =
                await axios.post(

                    "/api/auth/student-login",

                    {
                        emisNumber,
                        dob,
                    }
                );

            // Invalid login
            if (
                !response.data.success
            ) {

                toast.error(
                    "Invalid login credentials",
                    {
                        id: loadingToast,
                    }
                );

                return;
            }

            // Save Redux
            dispatch(
                setStudent(
                    response.data.student
                )
            );

            // Success
            toast.success(

                `Welcome ${response.data.student.name}`,

                {
                    id: loadingToast,
                }
            );

            // Redirect
            router.push(
                "/student"
            );

        } catch (error) {

            console.log(error);

            toast.error(
                "Login failed",
                {
                    id: loadingToast,
                }
            );

        } finally {

            setLoading(false);
        }
    }

    return (

        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--school-background)] p-6 font-sans">

            {/* School Header */}
            <div className="mb-8 text-center">

                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seal_of_Tamil_Nadu.svg/250px-Seal_of_Tamil_Nadu.svg.png"
                    alt="Tamil Nadu Logo"
                    width={80}
                    height={80}
                    className="mx-auto mb-4 object-contain"
                />

                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">

                    GHS Palayanur

                </h2>

                <p className="text-[var(--school-primary)] text-[10px] font-bold uppercase tracking-[0.25em] mt-1">

                    Student Examination Portal

                </p>

            </div>

            {/* Login Card */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 w-full max-w-md">

                {/* Title */}
                <div className="mb-8">

                    <h1 className="text-3xl font-black text-gray-900 mb-2">

                        Student Login

                    </h1>

                    <p className="text-gray-400 text-sm font-medium italic">

                        Login using EMIS and Date of Birth

                    </p>

                </div>

                {/* Form */}
                <div className="space-y-5">

                    {/* EMIS */}
                    <div className="relative">

                        <User
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="EMIS Number"
                            value={emisNumber}
                            onChange={(e) =>
                                setEmisNumber(
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-200 bg-gray-50 pl-12 pr-4 py-4 rounded-2xl focus:border-[var(--school-primary)] focus:ring-2 focus:ring-[var(--school-primary)]/10 outline-none transition-all font-bold text-gray-900"
                        />

                    </div>

                    {/* DOB */}
                    <div className="relative">

                        <Calendar
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="DOB (DD-MM-YYYY)"
                            value={dob}
                            onChange={(e) =>
                                setDob(
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-200 bg-gray-50 pl-12 pr-4 py-4 rounded-2xl focus:border-[var(--school-primary)] focus:ring-2 focus:ring-[var(--school-primary)]/10 outline-none transition-all font-bold text-gray-900"
                        />

                    </div>

                    {/* Login Button */}
                    <button
                        onClick={login}
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[var(--school-primary)] transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >

                        {loading ? (

                            "Authenticating..."

                        ) : (

                            <>

                                Access Portal

                                <LogIn
                                    size={18}
                                />

                            </>
                        )}

                    </button>

                </div>

                {/* Footer */}
                <div className="mt-8 text-center">

                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">

                        Official CBT Platform

                    </p>

                </div>

            </div>

            {/* Quote */}
            <div className="mt-12 text-center max-w-xs">

                <p className="text-[13px] font-bold text-gray-500 italic leading-relaxed">

                    "கேடில் விழுச்செல்வம் கல்வி ஒருவற்கு
                    <br />
                    மாடல்ல மற்றை யவை."

                </p>

            </div>

        </div>
    );
}