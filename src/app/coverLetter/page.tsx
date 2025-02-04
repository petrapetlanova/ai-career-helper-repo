"use client";

import React, { use, useState } from "react";

export default function CoverLetterGenerator() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCoverLetter("");
    
    try {
      const response = await fetch("/api/coverletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }
      
      const data = await response.json();
      console.log(data);
      setCoverLetter(data);
    } catch (err) {
      setError("Failed to generate cover letter");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cover Letter Generator</h1>

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
          <label htmlFor="jobDescription" className="block text-sm font-medium mb-2">
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
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {coverLetter && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Generated Cover Letter</h2>
          <pre className="whitespace-pre-wrap text-gray-800">{coverLetter}</pre>
        </div>
      )}
    </div>
  );
}