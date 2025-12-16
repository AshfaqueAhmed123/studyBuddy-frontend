import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import AiService from "../../services/aiServices";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer";
import Modal from "../common/Modal";

const AIActions = () => {
    const { id: documentId } = useParams();

    const [loadingAction, setLoadingAction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [concept, setConcept] = useState("");

    const handleGenerateSummary = async () => {
        setLoadingAction("summary");
        try {
            const summary = await AiService.generateSummary(documentId);
            setModalTitle("Generate Summary");
            setModalContent(summary.data.summary);
            setIsModalOpen(true);
        } catch (error) {
            toast.error("Failed to generate summary");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleExplainConcept = async (e) => {
        e.preventDefault();
        if (!concept.trim()) {
            toast.error("Please enter a concept to explain");
            return;
        }
        setLoadingAction("explain");
        try {
            const explanation  = await AiService.explainConcept(
                documentId,
                concept
            );
            setModalTitle(`Explanation of ${concept}`);
            setModalContent(explanation.data.explanation);
            // console.log(explanation.data.explanation)
            setIsModalOpen(true);
            setConcept("");
        } catch (error) {
            toast.error("Failed to explain concept");
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <>
            {/* Main Card */}
            <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-200/60 bg-gradient-to-br from-slate-50/50 to-white/50">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-400/40">
                        <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900">AI Assistant</h1>
                        <p className="text-sm text-slate-500">Powered by Advanced AI</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 space-y-6">

                    {/* Generate Summary */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white/80 border border-slate-200/60 rounded-xl shadow-sm p-4 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                            <div className="w-10 h-10 rounded-full bg-sky-300 flex items-center justify-center shadow-inner shadow-blue-200/40">
                                <BookOpen className="w-5 h-5 text-sky-600" strokeWidth={2} />
                            </div>
                            <div>
                                <h4 className="text-md font-semibold text-slate-900">
                                    Generate Summary
                                </h4>
                                <p className="text-sm text-slate-500">
                                    Get a concise summary of the entire document
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleGenerateSummary}
                            disabled={loadingAction === "summary"}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:from-emerald-600 hover:to-teal-600 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingAction === "summary" ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-white animate-bounce" />
                                    Loading...
                                </span>
                            ) : (
                                "Summarize"
                            )}
                        </button>
                    </div>

                    {/* Explain Concept */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white/80 border border-slate-200/60 rounded-xl shadow-sm p-4 hover:shadow-md transition-all">
                        <form onSubmit={handleExplainConcept} className="flex-1 w-full">
                            <div className="flex items-center gap-4 mb-4">
                                {/* Soft yellow, semi-transparent background for the bulb */}
                                <div className="w-10 h-10 rounded-full bg-yellow-300/50 flex items-center justify-center shadow-md shadow-yellow-200/30">
                                    <Lightbulb className="w-6 h-6 text-yellow-600 " strokeWidth={2} />
                                </div>
                                <div>
                                    <h4 className="text-md font-semibold text-slate-900">Explain a Concept</h4>
                                    <p className="text-sm text-slate-500">
                                        Enter a topic or a concept from the document to get a detailed explanation
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 flex-col md:flex-row">
                                <input
                                    type="text"
                                    value={concept}
                                    onChange={(e) => setConcept(e.target.value)}
                                    placeholder="e.g., 'React Hook?'"
                                    disabled={loadingAction === "explain"}
                                    className="flex-1 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={loadingAction === "explain" || !concept.trim()}
                                    className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:from-emerald-600 hover:to-teal-600 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingAction === "explain" ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-white animate-bounce" />
                                            Loading...
                                        </span>
                                    ) : (
                                        "Explain"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>


                </div>
            </div>

            {/* Result Modal */}
            <Modal
            isOpen={isModalOpen}
            onClose={()=>setIsModalOpen(false)}
            title={modalTitle}
            >
                <div className="max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate">
                    <MarkdownRenderer content={modalContent}/>
                </div>
            </Modal>
        </>
    );
};

export default AIActions;
