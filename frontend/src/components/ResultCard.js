import React from "react";

export default function ResultCard({ text, analysis }) {
  return (
    <div className="result-card">
      <h3>Extracted Text</h3>
      <div className="extracted">{text || <em>No text extracted</em>}</div>

      <h3>Analysis</h3>
      <ul>
        <li>Words: {analysis.wordCount}</li>
        <li>Sentences: {analysis.sentenceCount}</li>
        <li>Avg words/sentence: {analysis.avgWordsPerSentence}</li>
        <li>Avg word length: {analysis.avgWordLen}</li>
        <li>Hashtags found: {analysis.hashtags}</li>
        <li>Mentions: {analysis.mentions}</li>
      </ul>

      <h4>Suggestions</h4>
      <ol>
        {analysis.suggestions.length ? analysis.suggestions.map((s,i)=><li key={i}>{s}</li>) : <li>No suggestions</li>}
      </ol>

      <h4>Suggested Hashtags</h4>
      <div className="hashtags">
        {analysis.suggestedHashtags.map((h,i)=> <span key={i} className="tag">{h}</span>)}
      </div>
    </div>
  );
}
