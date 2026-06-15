"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    PlusSquare,
    ClipboardList,
    HomeIcon,
    Users,
    BookOpen,
    School,
    CalendarClock,
} from "lucide-react";
import { Toaster } from 'react-hot-toast';
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [

        {
            name: "Home",
            href: "/",
            icon: <HomeIcon size={22} />,
        },

        {
            name: "Dashboard",
            href: "/admin",
            icon: <LayoutDashboard size={22} />,
        },

        {
            name: "Classes",
            href: "/admin/classes",
            icon: <School size={22} />,
        },

        {
            name: "Subjects",
            href: "/admin/subjects",
            icon: <BookOpen size={22} />,
        },

        {
            name: "Students",
            href: "/admin/students",
            icon: <Users size={22} />,
        },

        {
            name: "Create Test",
            href: "/admin/create-test",
            icon: <PlusSquare size={22} />,
        },

        {
            name: "Manage Tests",
            href: "/admin/tests",
            icon: <FileText size={22} />,
        },

        {
            name: "Sessions",
            href: "/admin/sessions",
            icon: <CalendarClock size={22} />,
        },

        {
            name: "Results",
            href: "/admin/results",
            icon: <ClipboardList size={22} />,
        },
    ];

    return (
        /* 1. Added 'h-screen' to lock the viewport height 
           2. Added 'overflow-hidden' to prevent the whole page from scrolling 
        */
        <div className="flex h-screen overflow-hidden bg-[var(--school-background)] font-sans">

            {/* Sidebar - Added 'h-full' and 'flex-shrink-0' to keep its width stable */}
            <aside className="w-72 h-full bg-[var(--school-primary)] text-white flex flex-col shadow-2xl z-20 flex-shrink-0">

                {/* Logo & School Branding */}
                <div className="p-8 border-b border-white/10">
                    <h1 className="text-3xl font-black tracking-tight">
                        CBT Admin
                    </h1>
                    <p className="text-white/60 mt-2 text-sm font-medium tracking-wide uppercase">
                        Control Panel
                    </p>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-5 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 font-bold ${isActive
                                    ? "bg-white text-[var(--school-primary)] shadow-md"
                                    : "text-white/80 hover:bg-[var(--school-primary-hover)] hover:text-white"
                                    }`}
                            >
                                {item.icon}
                                <span className="text-lg">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Profile Section */}
                <div className="p-6 border-t border-white/10 mt-auto bg-[var(--school-primary-hover)]/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-bold">Admin User</p>
                            <p className="text-xs text-white/50">v1.0.0</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area 
                'flex-1' takes the rest of the width.
                'h-full' and 'overflow-y-auto' makes ONLY this section scroll.
            */}
            <main className="flex-1 h-full overflow-y-auto bg-[var(--school-background)] relative">
                <div className="p-4 md:p-8">
                    {children}
                    <Toaster position="top-center" reverseOrder={false} />
                </div>
            </main>

        </div>
    );
}