"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  CalendarClock,
  Clock,
  BookOpen,
  ChevronRight,
  UserCircle,
  GraduationCap
} from "lucide-react";

export default function StudentHomePage() {
  const router = useRouter();
  const student = useSelector((state: any) => state.student.student);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  // Auth check
  useEffect(() => {

    // Redux still loading
    if (student === undefined) {

      return;
    }

    // No login
    if (student === null) {

      router.push(
        "/student/login"
      );

      return;
    }

    // Load sessions
    loadSessions();

  }, [student]);
  async function loadSessions() {
    setLoading(true);
    try {
      const response = await axios.get(`/api/sessions/student/${student._id}`);
      console.log(response)
      setSessions(
        response.data.data || []
      );
    } catch (error) {
      console.log("Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--school-background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-[var(--school-primary)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-[var(--school-primary)] tracking-widest">தயார் செய்கிறது...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--school-background)] font-sans text-gray-900 flex flex-col">

      {/* Official Header */}
      <header className="bg-white border-b border-gray-200 py-5 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="shrink-0 scale-110">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seal_of_Tamil_Nadu.svg/250px-Seal_of_Tamil_Nadu.svg.png"
                alt="TN Govt Logo"
                width={50}
                height={50}
                className="object-contain w-auto h-auto"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-none">
                GHS, Palayanur
              </h1>
              <p className="text-[var(--school-primary)] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                மாணவர் தளம் / Student Portal
              </p>
            </div>
          </div>

          <div className="hidden lg:block text-right border-l-2 border-[var(--school-secondary)] pl-6">
            <p className="text-[14px] font-bold text-gray-800 italic leading-tight">
              கேடில் விழுச்செல்வம் கல்வி யொருவற்கு
              <br />
              <span className="text-[var(--school-primary)]">மாடல்ல மற்றை யவை.</span>
            </p>
          </div>
        </div>
      </header>

      {/* Hero Welcome Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-[var(--school-surface)] p-4 rounded-3xl text-[var(--school-primary)]">
              <UserCircle size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">Welcome, {student?.name}</h2>
              <p className="text-gray-500 font-bold tracking-wider uppercase text-xs mt-1">
                EMIS: <span className="text-gray-900">{student?.emisNumber}</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-3">
            <CalendarClock size={20} className="text-[var(--school-primary)]" />
            <span className="text-sm font-black text-gray-700">Scheduled Exams</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow w-full">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-900">இந்த வாரத் தேர்வுகள் / <span className="text-gray-400 font-bold">This Week's Exams</span></h3>
          <div className="h-1.5 w-16 bg-[var(--school-primary)] rounded-full mt-2"></div>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border border-gray-100 text-center shadow-sm">
            <GraduationCap className="mx-auto mb-4 text-gray-200" size={64} />
            <h2 className="text-xl font-bold text-gray-400 italic">தேர்வுகள் எதுவும் இல்லை.</h2>
            <p className="text-sm text-gray-400 mt-2">No exams are scheduled for you right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => {
              const now = new Date();

              const start =
                new Date(
                  session.startTime
                );

              const end =
                new Date(
                  session.endTime
                );

              // Session started
              const examStarted =
                now.getTime() >=
                start.getTime();

              // Session ended
              const examEnded =
                now.getTime() >
                end.getTime();

              // Session currently live
              const examLive =
                examStarted &&
                !examEnded;
              return (
                <div
                  key={session._id}
                  className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-[var(--school-primary)] transition-all duration-500 hover:shadow-2xl flex flex-col"
                >
                  <div className="flex-grow">
                    <div className="mb-4">
                      <span
                        className={`
        text-[10px]
        font-black
        px-3
        py-1.5
        rounded-full
        uppercase
        border

        ${examLive

                            ? "bg-green-50 text-green-600 border-green-100"

                            : examEnded

                              ? "bg-red-50 text-red-500 border-red-100"

                              : "bg-gray-50 text-gray-400 border-gray-100"
                          }
    `}
                      >

                        {examLive

                          ? "● Live Now"

                          : examEnded

                            ? "Completed"

                            : "Upcoming"
                        }

                      </span>
                    </div>

                    <h4 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-[var(--school-primary)] transition-colors leading-tight">
                      {session.title}
                    </h4>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-gray-600">
                        <BookOpen size={18} className="text-[var(--school-secondary)]" />
                        <span className="text-sm font-bold">{session.testId?.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Clock size={18} className="text-[var(--school-secondary)]" />
                        <span className="text-sm font-bold">
                          {new Date(
                            session.startTime
                          ).toLocaleString(
                            "en-IN",
                            {
                              dateStyle:
                                "medium",

                              timeStyle:
                                "short",

                              timeZone:
                                "Asia/Kolkata",
                            }
                          )} </span>
                      </div>
                    </div>
                  </div>

                  {examLive ? (
                    <Link
                      href={`/student/exam/${session._id}`}
                      className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white text-sm font-black py-4 rounded-2xl hover:bg-[var(--school-primary)] transition-all shadow-lg active:scale-95"
                    >
                      START EXAM <ChevronRight size={18} />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-100 text-gray-400 text-sm font-black py-4 rounded-2xl cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {examEnded
                        ? "EXAM ENDED"
                        : "WAITING TO START"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-4">
              <h4 className="text-xl font-black tracking-tight">GHS Palayanur Student Portal</h4>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Government High School, Palayanur. Ensure you are in a quiet environment before starting any assessment.
              </p>
            </div>
            <div className="space-y-4 md:text-right">
              <h4 className="text-sm font-black uppercase tracking-widest text-[var(--school-secondary)]">Support</h4>
              <p className="text-gray-400 text-sm font-bold">Please contact your class teacher for login issues.</p>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest text-center md:text-left">
              © {new Date().getFullYear()} Govt High School, Palayanur. All Rights Reserved.
            </p>
            <div className="text-[10px] text-gray-600 font-black">DESIGNED FOR EXCELLENCE</div>
          </div>
        </div>
      </footer>
    </div>
  );
}