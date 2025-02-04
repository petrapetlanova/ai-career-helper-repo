"use client";

import React, { useState } from "react";
import { MatchAnalysisResult } from "../../components/libs/openai";

export default function JobMatchAnalysis() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<MatchAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      if (!response.ok) {
        throw new Error("Failed to analyze job match");
      }
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError("Failed to analyze job match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Match Analysis</h1>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label htmlFor="resume" className="block text-sm font-medium mb-2">
            Resume
          </label>
          <textarea
            id="resume"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your resume text here..."
            required
          />
        </div>

        <div>
          <label
            htmlFor="jobDescription"
            className="block text-sm font-medium mb-2"
          >
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the job description here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>
      </form>

      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Match Score</h3>
            <div className="text-4xl font-bold text-blue-500">
              {analysis.matchPercentage}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-600">
                Matching Skills
              </h3>
              <ul className="list-disc pl-4">
                {analysis.skillsAnalysis.matching.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-red-600">
                Missing Skills
              </h3>
              <ul className="list-disc pl-4">
                {analysis.skillsAnalysis.missing.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-blue-600">
                Additional Skills
              </h3>
              <ul className="list-disc pl-4">
                {analysis.skillsAnalysis.additional.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <ul className="list-disc pl-4">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="mb-2">
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
