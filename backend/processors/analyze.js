const stopwords = new Set([
  "a","an","the","and","or","but","if","in","on","to","for","with","is","are","was","were"
]);

function sentencesFromText(text){
  return text.split(/(?<=[.?!])\s+/).filter(Boolean);
}

function wordsFromText(text){
  return text.replace(/\n/g," ").split(/\s+/).filter(w=>w.trim().length>0);
}

function topWords(text, n=5){
  const words = wordsFromText(text).map(w=>w.replace(/[^a-zA-Z']/g,"").toLowerCase());
  const freq = {};
  for(const w of words){
    if(!w || stopwords.has(w)) continue;
    freq[w] = (freq[w]||0)+1;
  }
  return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,n).map(x=>x[0]);
}

function analyzeTextFromFile(text){
  const words = wordsFromText(text);
  const sentences = sentencesFromText(text);
  const wordCount = words.length;
  const sentenceCount = sentences.length || 1;
  const avgWordsPerSentence = +(wordCount/sentenceCount).toFixed(1);
  const avgWordLen = +(words.reduce((s,w)=>s+w.length,0)/Math.max(1,wordCount)).toFixed(1);
  const hashtags = (text.match(/#[\w]+/g) || []).length;
  const mentions = (text.match(/@[\w]+/g) || []).length;
  const urls = (text.match(/https?:\/\/\S+/g) || []).length;
  const questions = (text.match(/\?/g) || []).length;

  const suggestions = [];

  if (wordCount === 0) suggestions.push("No text found—check the file quality or try another file.");
  if (avgWordsPerSentence > 20) suggestions.push("Sentences are long. Break into shorter sentences (≈12–18 words) to improve readability.");
  if (hashtags < 2) suggestions.push("Add relevant hashtags (2–5) to increase discoverability.");
  if (mentions === 0) suggestions.push("Mention relevant users/partners to increase engagement.");
  if (questions === 0) suggestions.push("Add a call-to-action or a question to invite comments.");
  if (wordCount > 220) suggestions.push("Post is long — consider trimming to keep it punchy for social feeds.");
  if (urls > 0) suggestions.push("If you include links, use a shortened link and pin context in the caption.");
  if (avgWordLen > 6) suggestions.push("Consider simpler words to improve scanning speed.");

  const positiveWords = ["good","great","love","awesome","happy","excited","amazing"];
  const negativeWords = ["bad","sad","angry","disappointed","problem","issue"];
  const lc = text.toLowerCase();
  const pos = positiveWords.some(w=>lc.includes(w));
  const neg = negativeWords.some(w=>lc.includes(w));
  if (pos && !neg) suggestions.push("Tone seems positive — add celebratory emojis to amplify emotion.");
  if (neg && !pos) suggestions.push("Tone seems negative — keep empathetic and suggest solutions.");

  const suggestedHashtags = topWords(text, 5).map(w => `#${w}`);

  return {
    wordCount,
    sentenceCount,
    avgWordsPerSentence,
    avgWordLen,
    hashtags,
    mentions,
    urls,
    suggestions,
    suggestedHashtags
  };
}

module.exports = { analyzeTextFromFile };
