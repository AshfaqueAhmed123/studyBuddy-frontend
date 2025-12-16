import React, { useState, useEffect } from "react";
import { Plus, Trash2, FileText, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const response = await documentService.getDocuments();
      const docs = Array.isArray(response)
        ? response
        : response?.data || response?.documents || [];
      setDocuments(docs);
    } catch (error) {
      toast.error("failed to fetch documents");
      console.error(error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!uploadFile || !uploadTitle.trim()) {
      toast.error("Please provide a title and select a file");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "upload failed");
    } finally {
      setUploading(false);
      setLoading(false);
    }
    const handleDeleteRequest = (doc) => {
      setSelectedDoc(doc);
      setIsDeleteModalOpen(true);
    };

    return (
      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-500" />
              <span className="text-slate-900">{doc.title}</span>
            </div>
            <Button
              onClick={() => handleDeleteRequest(doc)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc)
    setIsDeleteModalOpen(true)
  }
  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`${selectedDoc.title} deleted`);
      setDocuments((prev) =>
        prev.filter((d) => d._id !== selectedDoc._id)
      );
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
    } catch (error) {
      toast.error(error.message || "failed to delete document");
    } finally {
      setDeleting(false);
    }
  };


  const renderContent = () => {

    if (loading) {
      return (
        <div className={`flex items-center justify-center min-h-[400px]`}>
          <Spinner />
        </div>
      )
    }
    if (documents.length === 0) {
      return (
        <div className={`flex items-center justify-center min-h-[400px]`}>
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-0">
              <FileText className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2">No Documents yet </h3>
            <p className="text-sm text-slate-500 mb-6">Get started by uploading your first PDF document to start learning</p>
            <button
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale[0.9]"
              onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              upload Document
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {documents?.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    )

  }


  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-slate-900 mb-2">
              My Documents
            </h1>
            <p className="text-slate-500 text-sm">
              Manage and organize your learning materials
            </p>
          </div>

          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Upload Documents
          </Button>
        </div>

        {renderContent()}




        {/* upload document modal */}
        {isUploadModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity'
">
          {/* Modal container */}
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Upload New Document
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Add a PDF to your library
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleUpload} className="space-y-5">
              {/* Title input */}
              <div className="flex flex-col">
                <label htmlFor="title" className="text-sm font-medium text-slate-700 mb-1">
                  Document Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  placeholder="e.g, React Interview Prep"
                  className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* File input */}
              <div className="flex flex-col">
                <label htmlFor="file-upload" className="text-sm font-medium text-slate-700 mb-1">
                  PDF File
                </label>
                <div className="relative border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 transition">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    required
                  />
                  <div className="text-emerald-500 mb-2">
                    <Upload className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm text-slate-500">
                    {uploadFile ? uploadFile.name : <>Click to upload or drag and drop</>}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF up to 10MB</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:from-emerald-600 hover:to-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></div>
                      Uploading...
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        )}


        {isDeleteModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          {/* Modal container */}
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-600">
                <Trash2 className="w-6 h-6" strokeWidth={2} />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 text-center">
                Confirm Deletion
              </h2>
            </div>

            {/* Content */}
            <p className="text-center text-sm text-slate-500 mb-6">
              Are you sure you want to delete the document:{" "}
              <span className="font-medium text-slate-900">{selectedDoc?.title}</span>?
              <br />
              This action <span className="font-semibold text-red-500">cannot be undone</span>.
            </p>

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></div>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>)}





      </div>
    </div>
  );
}




export default DocumentListPage;
