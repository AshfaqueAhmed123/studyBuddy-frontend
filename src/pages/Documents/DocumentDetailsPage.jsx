import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import documentService from "../../services/documentService";
import ChatInterface from "../../components/chat/ChatInterface";

const DocumentDetailsPage = () => {
  const { id } = useParams();
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocumentData(data);
      } catch (error) {
        toast.error("Failed to fetch document details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentDetails();
  }, [id]);

  // Generate full PDF URL
  const getPdfUrl = () => {
    if (!documentData?.data?.filePath) return null;

    const filePath = documentData.data.filePath;

    // Absolute URL
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  // Tab content
  const renderContent = () => {
    if (loading) return <Spinner />;

    const pdfUrl = getPdfUrl();

    if (!pdfUrl)
      return <div className="text-center p-8">PDF not available.</div>;

    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-medium text-gray-700">
            Document Viewer
          </span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>

        {/* PDF iframe */}
        <div className="bg-gray-100 p-1">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className="w-full h-[70vh] rounded border border-gray-300"
            frameBorder="0"
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface/>
  };

  const renderAiActions = () => (
    <div className="p-4">AI actions coming soon</div>
  );
  const renderFlashcardsTab = () => (
    <div className="p-4">Flashcards coming soon</div>
  );
  const renderQuizzesTab = () => (
    <div className="p-4">Quizzes coming soon</div>
  );

  const tabs = [
    { name: "Content", label: "Content", content: renderContent },
    { name: "Chat", label: "Chat", content: renderChat },
    { name: "AI Actions", label: "AI Actions", content: renderAiActions },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab },
  ];

  if (loading) return <Spinner />;
  if (!documentData)
    return <div className="text-center p-8">Document not found.</div>;

  return (
    <div className="px-4 py-6">
      {/* Back link */}
      <div className="mb-4">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>

      {/* Header */}
      <PageHeader title={documentData.data.title} />

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentDetailsPage;
