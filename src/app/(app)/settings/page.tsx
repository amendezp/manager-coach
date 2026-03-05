"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Document {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  chunkCount: number;
  status: string;
  errorMessage: string | null;
  createdAt: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SettingsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = async (file: File) => {
    setUploadError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await fetchDocuments();
      } else {
        const data = await res.json();
        setUploadError(data.error || "Upload failed");
      }
    } catch {
      setUploadError("Upload failed — please try again");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this document and all its chunks? This cannot be undone.")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch {
      console.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-surface-secondary">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-12 sm:pt-10">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h2
            className="text-xl sm:text-2xl font-bold text-text-primary mb-2"
            style={{ letterSpacing: "-0.02em" }}
          >
            Reference Materials
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed max-w-lg">
            Upload PDFs or PPTXs with management frameworks, best practices, or
            organizational behavior content. The AI coach will draw on these
            during your rehearsals and prep sheets.
          </p>
        </div>

        {/* Upload zone */}
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 mb-6 animate-fade-up cursor-pointer
            ${
              dragOver
                ? "border-brand-700 bg-brand-50 scale-[1.01]"
                : "border-brand-200 bg-surface hover:border-brand-300"
            }
            ${uploading ? "opacity-70 pointer-events-none" : ""}
          `}
          style={{ animationDelay: "0.1s" }}
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.pptx"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="thinking-dots flex items-center gap-0.5">
                <span />
                <span />
                <span />
              </div>
              <p className="text-sm text-text-secondary font-medium">
                Processing document...
              </p>
              <p className="text-xs text-text-tertiary">
                Extracting text, chunking, and generating embeddings
              </p>
            </div>
          ) : (
            <>
              {/* Upload icon */}
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-brand-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-text-primary mb-1">
                Drop a file here, or{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-900 transition-colors"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-text-tertiary">
                PDF or PPTX, up to 10MB
              </p>
            </>
          )}
        </div>

        {/* Upload error */}
        {uploadError && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 animate-fade-up-sm">
            {uploadError}
          </div>
        )}

        {/* Document list */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-sm-caps text-text-tertiary mb-3">
            Uploaded Documents{" "}
            {documents.length > 0 && `(${documents.length})`}
          </p>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="thinking-dots flex items-center gap-0.5">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {!loading && documents.length === 0 && (
            <div className="text-center py-10 px-4 rounded-xl border border-border bg-surface">
              <p className="text-sm text-text-tertiary">
                No documents uploaded yet.
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                Upload your first PDF or PPTX to get started.
              </p>
            </div>
          )}

          {!loading && documents.length > 0 && (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg border bg-surface transition-all
                    ${doc.status === "error" ? "border-red-200" : "border-border"}
                  `}
                >
                  {/* File type icon */}
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                      doc.fileType === "pdf"
                        ? "accent-red"
                        : "accent-blue"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-white uppercase relative z-10">
                      {doc.fileType}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {doc.filename}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-text-tertiary">
                        {formatFileSize(doc.fileSize)}
                      </span>
                      {doc.status === "ready" && (
                        <>
                          <span className="text-[11px] text-text-tertiary">
                            &middot;
                          </span>
                          <span className="text-[11px] text-text-tertiary">
                            {doc.chunkCount} chunks
                          </span>
                        </>
                      )}
                      {doc.status === "processing" && (
                        <span className="text-[11px] text-amber-600 font-medium">
                          Processing...
                        </span>
                      )}
                      {doc.status === "error" && (
                        <span className="text-[11px] text-red-500 font-medium truncate">
                          {doc.errorMessage || "Processing failed"}
                        </span>
                      )}
                      <span className="text-[11px] text-text-tertiary">
                        &middot;
                      </span>
                      <span className="text-[11px] text-text-tertiary">
                        {formatDate(doc.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-text-tertiary hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete document"
                  >
                    {deletingId === doc.id ? (
                      <div className="thinking-dots flex items-center gap-0.5">
                        <span />
                        <span />
                        <span />
                      </div>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info note */}
        <div
          className="mt-8 px-4 py-3 rounded-lg bg-brand-50 border border-brand-200 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-xs text-text-secondary leading-relaxed">
            <strong className="text-text-primary">How it works:</strong> When
            you start a coaching session, the AI automatically searches your
            uploaded documents for relevant frameworks and best practices, then
            weaves them into your rehearsal and prep sheet.
          </p>
        </div>
      </div>
    </div>
  );
}
