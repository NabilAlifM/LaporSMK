import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    answer: number;
    is_active: boolean;
}

interface KuisProps extends PageProps {
    questions: QuizQuestion[];
    hasParticipatedThisWeek: boolean;
}

export default function Kuis({ auth, questions, hasParticipatedThisWeek }: KuisProps) {
    const user = auth?.user as any;
    const pts = user?.total_poin ?? 0;
    
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const handleQuizAnswer = (selectedIndex: number) => {
        let newScore = score;
        if (selectedIndex === questions[currentQ].answer) {
            newScore += 20; // 20 pts per correct answer, or this could be dynamic if needed
            setScore(newScore);
        }
        
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            setQuizCompleted(true);
            router.post(route('student.kuis.submit'), { score: newScore }, { preserveScroll: true });
        }
    };

    const resetQuiz = () => {
        // Now they can't restart if participation is limited, so we just redirect them back or let them view score.
        window.location.reload();
    };

    return (
        <>
            <Head title="Kuis Mingguan" />

            {/* Overriding primary color to pink just for this page content per request */}
            <div className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col gap-8 min-h-screen" style={{ '--tw-colors-primary': '#DB2777' } as React.CSSProperties}>
                
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-2 border-on-background pb-4">
                    <div>
                        <div className="font-label-mono text-label-mono text-[#DB2777] mb-2 uppercase flex items-center gap-2">
                            <span className="w-8 h-1 bg-[#DB2777] inline-block"></span> Weekly Challenge
                        </div>
                        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Uji Pengetahuanmu!</h2>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Jawab kuis mingguan dengan benar dan dapatkan ekstra EXP/Poin.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-surface-container border-2 border-on-background p-2 shadow-[2px_2px_0px_0px_#111827]">
                        <div className="flex flex-col items-end">
                            <span className="font-label-mono text-label-mono text-on-surface-variant">TOTAL POIN</span>
                            <span className="font-button-text text-button-text text-on-surface">{pts} PTS</span>
                        </div>
                        <div className="w-10 h-10 bg-[#DB2777] border-2 border-on-background flex items-center justify-center text-white">
                            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
                        </div>
                    </div>
                </header>

                <div className="max-w-3xl mx-auto w-full">
                    {hasParticipatedThisWeek ? (
                        <div className="bg-surface-container-lowest border-4 border-on-background shadow-[8px_8px_0px_0px_#111827] flex flex-col text-center items-center py-16 px-8">
                            <div className="w-24 h-24 bg-surface-variant border-4 border-on-background shadow-[4px_4px_0_0_#111827] flex items-center justify-center mb-6">
                                <span className="text-5xl">⏳</span>
                            </div>
                            <h2 className="font-display-lg text-display-lg text-on-background mb-2">SUDAH BERPARTISIPASI</h2>
                            <p className="font-body-lg text-on-surface-variant max-w-md">Kamu sudah mengikuti kuis untuk minggu ini. Silakan kembali lagi di minggu depan untuk tantangan berikutnya!</p>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="bg-surface-container-lowest border-4 border-on-background shadow-[8px_8px_0px_0px_#111827] flex flex-col text-center items-center py-16 px-8">
                            <div className="w-24 h-24 bg-surface-variant border-4 border-on-background shadow-[4px_4px_0_0_#111827] flex items-center justify-center mb-6">
                                <span className="text-5xl">🚧</span>
                            </div>
                            <h2 className="font-display-lg text-display-lg text-on-background mb-2">KUIS BELUM TERSEDIA</h2>
                            <p className="font-body-lg text-on-surface-variant max-w-md">Belum ada pertanyaan kuis yang aktif saat ini. Admin sedang menyiapkan kuis baru untukmu.</p>
                        </div>
                    ) : !quizCompleted ? (
                        <div className="bg-surface-container-lowest border-4 border-on-background shadow-[8px_8px_0px_0px_#111827] flex flex-col relative">
                            {/* Quiz Header Strip */}
                            <div className="bg-[#DB2777] text-white border-b-4 border-on-background px-6 py-4 flex justify-between items-center">
                                <span className="font-label-mono text-label-mono uppercase font-bold tracking-wider">Pertanyaan {currentQ + 1} / {questions.length}</span>
                                <span className="font-label-mono text-label-mono uppercase font-bold bg-on-background text-[#DB2777] px-3 py-1">Score: {score}</span>
                            </div>

                            {/* Question Area */}
                            <div className="p-8 md:p-12 flex flex-col gap-8">
                                <h3 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-background text-center">
                                    {questions[currentQ].question}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {questions[currentQ].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleQuizAnswer(idx)}
                                            className="bg-surface border-4 border-on-background p-6 font-button-text text-button-text text-on-background shadow-[4px_4px_0_0_#111827] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#111827] hover:bg-[#DB2777] hover:text-white active:translate-y-0 active:translate-x-0 active:shadow-none transition-all text-left flex items-center gap-4 group"
                                        >
                                            <span className="w-8 h-8 flex-shrink-0 bg-on-background text-surface rounded-full flex items-center justify-center font-label-mono group-hover:bg-white group-hover:text-[#DB2777] transition-colors">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-surface-container-lowest border-4 border-on-background shadow-[8px_8px_0px_0px_#111827] flex flex-col text-center items-center py-16 px-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DB2777] rounded-bl-full border-b-4 border-l-4 border-on-background -mr-4 -mt-4 opacity-50"></div>
                            
                            <div className="w-24 h-24 bg-primary-fixed border-4 border-on-background shadow-[4px_4px_0_0_#111827] flex items-center justify-center -rotate-12 mb-6">
                                <span className="text-5xl">{score >= 80 ? '🏆' : score >= 40 ? '👍' : '😅'}</span>
                            </div>
                            
                            <h2 className="font-display-lg text-display-lg text-on-background mb-2">KUIS SELESAI!</h2>
                            <p className="font-body-lg text-on-surface-variant mb-8 max-w-md">Kamu berhasil menyelesaikan kuis minggu ini. Pengetahuanmu adalah senjata utama!</p>

                            <div className="bg-[#DB2777] text-white border-4 border-on-background px-12 py-6 shadow-[4px_4px_0_0_#111827] mb-8 -rotate-2 transform">
                                <div className="font-label-mono text-label-mono uppercase tracking-widest mb-1 opacity-80">Total Skor</div>
                                <div className="font-display-lg text-[64px] leading-none">{score}</div>
                            </div>

                            <button
                                onClick={resetQuiz}
                                className="bg-surface font-button-text text-button-text border-4 border-on-background px-8 py-4 shadow-[4px_4px_0_0_#111827] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#111827] active:translate-y-0 active:shadow-none transition-all uppercase tracking-wider text-on-background"
                            >
                                Kembali
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Kuis.layout = (page: any) => <AuthenticatedLayout activeTab="kuis">{page}</AuthenticatedLayout>;
