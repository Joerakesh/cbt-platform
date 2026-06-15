"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    Users,
    Search,
    Trash2,
    GraduationCap,
    UserPlus,
    ChevronRight,
    Filter
} from "lucide-react";

export default function StudentsPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    async function loadClasses() {
        try {
            const response = await axios.get("/api/classes/all");
            setClasses(response.data.data || []);
        } catch (error) {
            console.log(error);
        }
    }

    async function loadStudents(classId: string) {
        if (!classId) return;
        try {
            setLoading(true);
            const response = await axios.get(`/api/students/class/${classId}`);
            setStudents(response.data.data || []);
        } catch (error) {
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    }

    async function deleteStudent(studentId: string) {
        if (!confirm("Are you sure you want to remove this student?")) return;

        try {
            await axios.delete(`/api/students/delete/${studentId}`);
            toast.success("Student records removed");
            loadStudents(selectedClass);
        } catch (error) {
            toast.error("Delete failed");
        }
    }

    useEffect(() => { loadClasses(); }, []);

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.emisNumber.includes(search)
    );

    return (
        <div className="min-h-screen bg-[var(--school-background)] p-6 md:p-10 font-sans text-gray-900">
            <div className="max-w-7xl mx-auto">

                {/* Top Action Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Student Registry</h1>
                        <p className="text-gray-500 font-medium">Manage student profiles, EMIS data, and classroom assignments.</p>
                    </div>

                    <Link
                        href="/admin/students/create"
                        className="bg-black text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[var(--school-primary)] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                    >
                        <UserPlus size={18} />
                        Register Student
                    </Link>
                </div>

                {/* Dashboard Stats & Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

                    {/* Filter & Search Panel */}
                    <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-5">
                        <div className="flex-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Filter by Class</label>
                            <div className="relative">
                                <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={selectedClass}
                                    onChange={(e) => {
                                        setSelectedClass(e.target.value);
                                        loadStudents(e.target.value);
                                    }}
                                    className="w-full border border-gray-100 bg-gray-50 pl-12 pr-4 py-3.5 rounded-2xl font-bold focus:ring-2 focus:ring-[var(--school-primary)]/20 outline-none appearance-none transition-all"
                                >
                                    <option value="">Select a Class</option>
                                    {classes.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.className} - {item.section} ({item.medium})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex-[1.5]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Quick Search</label>
                            <div className="relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter Name or EMIS number..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border border-gray-100 bg-gray-50 pl-12 pr-4 py-3.5 rounded-2xl font-bold focus:ring-2 focus:ring-[var(--school-primary)]/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-[var(--school-primary)] p-6 rounded-3xl text-white shadow-lg flex flex-col justify-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Filtered Count</p>
                        <h3 className="text-4xl font-black">{filteredStudents.length}</h3>
                        <p className="text-xs font-bold mt-1">Students Found</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    {!selectedClass ? (
                        <div className="py-32 text-center">
                            <div className="bg-[var(--school-surface)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--school-primary)]">
                                <ChevronRight size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900">Choose a Class</h3>
                            <p className="text-gray-400 font-medium mt-2">Select a class from the dropdown above to view student list.</p>
                        </div>
                    ) : loading ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-[var(--school-primary)] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Records...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="py-32 text-center">
                            <GraduationCap size={64} className="mx-auto text-gray-100 mb-6" />
                            <h3 className="text-xl font-black text-gray-400 italic">No Students Enrolled</h3>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="text-left p-6 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Student Profile</th>
                                        <th className="text-left p-6 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">EMIS ID</th>
                                        <th className="text-left p-6 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Birth Date</th>
                                        <th className="text-right p-6 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-black text-xs group-hover:bg-[var(--school-primary)] group-hover:text-white transition-colors">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-gray-900 text-lg">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="font-mono font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 italic">
                                                    {student.emisNumber}
                                                </span>
                                            </td>
                                            <td className="p-6 font-bold text-gray-500">
                                                {student.dob}
                                            </td>
                                            <td className="p-6 text-right">
                                                <button
                                                    onClick={() => deleteStudent(student._id)}
                                                    className="bg-white border border-gray-100 text-gray-300 p-3 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-90"
                                                    title="Remove Student"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <p className="mt-10 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
                    GHS Palayanur • Internal Registry System
                </p>
            </div>
        </div>
    );
}