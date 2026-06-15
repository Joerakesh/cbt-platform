"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BookOpen, Plus, Library, GraduationCap } from "lucide-react";

export default function SubjectsPage() {
    // Store subjects
    const [subjects, setSubjects] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);

    // Load subjects
    async function loadSubjects() {
        try {
            const response = await axios.get("/api/subjects/all");
            setSubjects(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch subjects");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // Create subject
    async function createSubject() {
        if (!name.trim()) {
            toast.error("Subject name cannot be empty");
            return;
        }

        const loadingToast = toast.loading("Adding subject...");

        try {
            await axios.post("/api/subjects/create", { name });

            toast.success("Subject added successfully", { id: loadingToast });
            setName("");
            loadSubjects();
        } catch (error) {
            toast.error("Failed to create subject", { id: loadingToast });
            console.log(error);
        }
    }

    // Load page
    useEffect(() => {
        loadSubjects();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--school-background)] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[var(--school-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--school-background)] p-6 md:p-10 font-sans text-gray-900">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-10 flex items-center gap-4">
                    <div className="bg-[var(--school-primary)] p-3 rounded-2xl text-white">
                        <Library size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">Curriculum</h1>
                        <p className="text-gray-500 font-medium italic">Manage the academic subjects for GHS Palayanur.</p>
                    </div>
                </div>

                {/* Create Form Card */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-12">
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                        <Plus size={16} /> Add New Subject
                    </h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="e.g., Mathematics, Science, Social..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex-1 border border-gray-200 bg-gray-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--school-primary)] transition-all font-bold text-lg"
                        />
                        <button
                            onClick={createSubject}
                            className="bg-[var(--school-primary)] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[var(--school-primary-hover)] transition-all shadow-lg active:scale-95"
                        >
                            Create
                        </button>
                    </div>
                </div>

                {/* Subjects Grid */}
                <div>
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                        <BookOpen size={22} className="text-[var(--school-primary)]" />
                        Active Subjects
                    </h2>

                    {subjects.length === 0 ? (
                        <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                            <GraduationCap size={48} className="mx-auto mb-4 text-gray-200" />
                            <p className="text-gray-400 font-bold">No subjects defined yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subjects.map((item) => (
                                <div
                                    key={item._id}
                                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[var(--school-primary)] hover:shadow-xl transition-all duration-300 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--school-surface)] flex items-center justify-center text-[var(--school-primary)] group-hover:bg-[var(--school-primary)] group-hover:text-white transition-colors">
                                            <BookOpen size={20} />
                                        </div>
                                        <h3 className="text-xl font-extrabold group-hover:text-[var(--school-primary)] transition-colors">
                                            {item.name}
                                        </h3>
                                    </div>

                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-2 h-2 rounded-full bg-[var(--school-primary)]"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Branding */}
                <p className="mt-20 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    GHSS Palayanur — Academic Management System
                </p>
            </div>
        </div>
    );
}