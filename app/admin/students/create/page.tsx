"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import * as XLSX from "xlsx";

import {
    UploadCloud,
    Users,
    FileSpreadsheet,
    Download,
    Info,
} from "lucide-react";

export default function StudentsPage() {

    // Store classes
    const [classes, setClasses] =
        useState<any[]>([]);

    // Selected class
    const [classId, setClassId] =
        useState("");

    // Excel file
    const [file, setFile] =
        useState<File | null>(null);

    // Loading
    const [loading, setLoading] =
        useState(true);

    // Load classes
    async function loadClasses() {

        try {

            const response =
                await axios.get(
                    "/api/classes/all"
                );

            setClasses(
                response.data.data
            );

        } catch (error) {

            console.log(error);

            toast.error(
                "Failed to load classes"
            );

        } finally {

            setLoading(false);
        }
    }

    // Import students
    async function importStudents() {

        // Validate class
        if (!classId) {

            toast.error(
                "Please select class"
            );

            return;
        }

        // Validate file
        if (!file) {

            toast.error(
                "Please select Excel file"
            );

            return;
        }

        // Loading toast
        const loadingToast =
            toast.loading(
                "Importing students..."
            );

        try {

            // Create form data
            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            formData.append(
                "classId",
                classId
            );

            // Upload API
            const response =
                await axios.post(
                    "/api/students/import",
                    formData
                );

            // Success
            toast.success(

                `${response.data.total} students imported successfully`,

                {
                    id: loadingToast,
                }
            );

            // Reset file
            setFile(null);

            (
                document.getElementById(
                    "excel-upload"
                ) as HTMLInputElement
            ).value = "";

        } catch (error) {

            console.log(error);

            toast.error(
                "Import failed",
                {
                    id: loadingToast,
                }
            );
        }
    }

    // Download template
    function downloadTemplate() {

        // Template data
        const templateData = [

            {
                Name: "Arun Kumar",

                EMIS: "1234567890",

                DOB: "2008-05-20",
            },

            {
                Name: "Priya",

                EMIS: "1234567891",

                DOB: "2008-07-14",
            },
        ];

        // Create worksheet
        const worksheet =
            XLSX.utils.json_to_sheet(
                templateData
            );

        // Create workbook
        const workbook =
            XLSX.utils.book_new();

        // Add worksheet
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Students"
        );

        // Download
        XLSX.writeFile(
            workbook,
            "student-template.xlsx"
        );

        toast.success(
            "Template Downloaded"
        );
    }

    // Load page
    useEffect(() => {

        loadClasses();

    }, []);

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

            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-10">

                    <h1 className="text-4xl font-black tracking-tight mb-2">

                        Student Directory

                    </h1>

                    <p className="text-gray-500 font-medium italic">

                        Bulk import student records using Excel spreadsheets.

                    </p>

                </div>

                <div className="space-y-6">

                    {/* Info */}
                    <div className="bg-[var(--school-surface)] border border-[var(--school-border)] p-4 rounded-2xl flex items-start gap-3">

                        <Info
                            className="text-[var(--school-primary)] shrink-0 mt-0.5"
                            size={18}
                        />

                        <div>

                            <p className="text-sm font-bold text-[var(--school-primary)]">

                                Excel Template Format

                            </p>

                            <p className="text-xs text-gray-600 font-medium mt-1">

                                Your Excel sheet must contain these columns:

                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">

                                <span className="bg-white border px-3 py-1 rounded-lg text-xs font-mono">

                                    Name

                                </span>

                                <span className="bg-white border px-3 py-1 rounded-lg text-xs font-mono">

                                    EMIS

                                </span>

                                <span className="bg-white border px-3 py-1 rounded-lg text-xs font-mono">

                                    DOB

                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Import Card */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">

                        {/* Select Class */}
                        <div>

                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">

                                Target Class

                            </label>

                            <div className="relative">

                                <Users
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />

                                <select
                                    value={classId}
                                    onChange={(e) =>
                                        setClassId(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-200 bg-gray-50 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--school-primary)] transition-all font-bold appearance-none"
                                >

                                    <option value="">

                                        Select Class

                                    </option>

                                    {classes.map((item) => (

                                        <option
                                            key={item._id}
                                            value={item._id}
                                        >

                                            {item.className}
                                            {" "}
                                            -
                                            {" "}
                                            {item.section}
                                            {" "}
                                            (
                                            {item.medium}
                                            )

                                        </option>
                                    ))}

                                </select>

                            </div>

                        </div>

                        {/* Upload */}
                        <div>

                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">

                                Excel File

                            </label>

                            <div className={`
                                relative border-2 border-dashed rounded-2xl p-10 text-center transition-all

                                ${file
                                    ? "border-[var(--school-primary)] bg-[var(--school-surface)]"
                                    : "border-gray-200 hover:border-gray-300"
                                }
                            `}>

                                <input
                                    id="excel-upload"
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={(e) =>
                                        setFile(
                                            e.target.files?.[0] || null
                                        )
                                    }
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />

                                <div className="flex flex-col items-center">

                                    <UploadCloud
                                        className={`
                                            mb-3

                                            ${file
                                                ? "text-[var(--school-primary)]"
                                                : "text-gray-300"
                                            }
                                        `}
                                        size={48}
                                    />

                                    <p className="text-sm font-bold text-gray-700">

                                        {file
                                            ? file.name
                                            : "Click to upload Excel file"}

                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">

                                        XLSX or XLS files only

                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="pt-4 flex flex-col md:flex-row gap-4">

                            {/* Import */}
                            <button
                                onClick={importStudents}
                                className="flex-1 bg-[var(--school-primary)] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[var(--school-primary-hover)] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                            >

                                <FileSpreadsheet size={18} />

                                Import Students

                            </button>

                            {/* Download Template */}
                            <button
                                onClick={downloadTemplate}
                                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-100 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all"
                            >

                                <Download size={18} />

                                Download Template

                            </button>

                        </div>

                    </div>

                    {/* Footer */}
                    <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">

                        GHS Palayanur — Student Management Portal

                    </p>

                </div>

            </div>

        </div>
    );
}