"use client";

import { useState } from "react";
import { useUploadResume, useGetReports } from "../hooks/useResume";
import { Link } from "react-router";

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const { mutate: uploadResume, isLoading } = useUploadResume();
  const { data: reports, isLoading: loadingReports } = useGetReports();

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    uploadResume(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-900">
      <h2 className="text-2xl font-bold mb-4">📄 AI Resume Analyzer</h2>

      {/* Upload Resume */}
      <div className="flex gap-2 mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="border rounded p-2 flex-1"
        />
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Reports List */}
      <h3 className="text-xl font-semibold mb-3">Your Reports</h3>
      {loadingReports ? (
        <p>Loading reports...</p>
      ) : reports?.length ? (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li
              key={r._id}
              className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md"
            >
              <p className="font-medium">{r.originalFilename}</p>
              <p className="text-sm text-gray-600">
                {r.aiResult?.shortSummary || "No summary"}
              </p>
              <Link
                to={`/reports/${r._id}`}
                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
              >
                View Details →
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reports yet. Upload a resume above.</p>
      )}
    </div>
  );
}
