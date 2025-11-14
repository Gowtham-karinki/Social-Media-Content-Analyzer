import React, { useState } from "react";
import Dropzone from "./components/Dropzone";
import ResultCard from "./components/ResultCard";
import { uploadFile } from "./api";

export default function App(){
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleFile(file){
    setError(null);
    setResult(null);
    setLoading(true);
    setProgress(0);
    try{
      const r = await uploadFile(file, (e) => {
        if(e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      });
      setResult(r);
    } catch(err){
    console.error(err);
    const serverError = err.response?.data?.details || err.response?.data?.error;
    setError(serverError || err.message || "Upload failed");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Social Media Content Analyzer</h1>
        <p className="muted">Upload a PDF or scanned image to extract text & get engagement suggestions.</p>
      </header>

      <main>
        <Dropzone onFile={handleFile} />

        {loading && (
          <div className="loader">
            <div className="bar" style={{width: `${progress}%`}}></div>
            <div>{progress}% Processing...</div>
          </div>
        )}

        {error && <div className="error">Error: {error}</div>}

        {result && <ResultCard text={result.text} analysis={result.analysis} />}
      </main>

      <footer>
        <small>Built with React + Node • Medium UI</small>
      </footer>
    </div>
  );
}
