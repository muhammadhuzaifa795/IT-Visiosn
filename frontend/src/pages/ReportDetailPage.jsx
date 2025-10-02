"use client";

import { useParams, Link } from "react-router";
import { useGetReportById } from "../hooks/useResume";

export default function ReportDetailPage() {
  const { id } = useParams();
  const { data: report, isLoading } = useGetReportById(id);

  if (isLoading) return <p className="p-6">Loading report...</p>;
  if (!report) return <p className="p-6">Report not found.</p>;

  const ai = report.aiResult || {};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to Reports
      </Link>

      <h2 className="text-2xl font-bold mt-4 mb-2">
        {report.originalFilename}
      </h2>
      <p className="text-gray-600 mb-6">{report.createdAt}</p>

      {/* AI Result */}
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold">📊 Match Percentage</h3>
          <p className="text-lg">{ai.matchPercentage || "N/A"}%</p>
        </div>

        <div>
          <h3 className="font-semibold">💪 Strengths</h3>
          <ul className="list-disc list-inside">
            {ai.strengths?.map((s, i) => <li key={i}>{s}</li>) || "N/A"}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">⚠️ Missing Skills</h3>
          <ul className="list-disc list-inside text-red-600">
            {ai.missingSkills?.map((s, i) => <li key={i}>{s}</li>) || "N/A"}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">📝 Short Summary</h3>
          <p>{ai.shortSummary || "No summary generated."}</p>
        </div>

        <div>
          <h3 className="font-semibold">🏷 Suggested Tags</h3>
          <div className="flex gap-2 flex-wrap">
            {ai.suggestedTags?.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm"
              >
                {tag}
              </span>
            )) || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}
