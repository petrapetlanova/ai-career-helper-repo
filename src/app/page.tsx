import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>AI Career Helper</h1>
      <div>
        <Link href="/analyze">
        <button>Analyze your Resume</button>
        </Link>
        <Link href="/coverLetter">
        <button>Create your Cover Letter</button>
        </Link>
    </div>
      
    </div>
  );
}
