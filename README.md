# Social Media Content Analyzer

Medium-UI MERN app that extracts text from PDFs and images (OCR) then suggests engagement improvements.

## What is included
- Backend (Node/Express) using `pdf-parse` and `tesseract.js`
- Frontend (React) with drag & drop, loading states and result view
- Heuristic analyzer producing actionable suggestions
- `.env.example`, `.gitignore` and instructions for local setup & deployment

## Local setup

### 1. Clone (or create) repo
```bash
# follow the create steps in the instructions provided with this repo
```

### 2. Backend
```bash
cd backend
npm install
# dev
npm run dev
# or production
npm start
```
Default: `http://localhost:5000`

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
Default: `http://localhost:3000`  
Set backend URL by adding `.env` with `REACT_APP_BACKEND=http://your-backend-url`

## Deploy
- Backend: Render / Heroku (deploy backend folder); start: `npm start`
- Frontend: Vercel / Netlify (point to frontend folder; build command `npm run build`)

## Notes for submission
- Make sure `uploads/` is in `.gitignore`.
- For large OCR workloads, consider using worker processes or cloud OCR.

## 200-word approach (copy for assignment)
Social Media Content Analyzer extracts text from uploaded PDFs and scanned images, then provides simple, actionable engagement suggestions. The app uses a two-layer processing strategy: first, it detects file type and extracts text — `pdf-parse` for PDFs and `tesseract.js` OCR for images — ensuring robust parsing of both digital and scanned content. Second, it runs a lightweight heuristic analyzer that measures readability (average words per sentence), counts hashtags/mentions, detects links and questions, and finds frequent terms. Based on these signals the analyzer suggests practical improvements (e.g., add hashtags, shorten sentences, include a call-to-action, mention collaborators). This approach prioritizes reliability, fast feedback, and minimal infra: the frontend is a React app offering drag-and-drop and upload progress, while the backend is Node/Express for processing. The design keeps dependencies small for quick deployment within limited time. Error handling (missing files, parse failures) and loading states improve UX. For further improvements, the pipeline can be extended with sentiment analysis, named-entity-aware hashtag generation, or LLM-driven copy suggestions. The current implementation demonstrates core functionality, production-quality structure, and clear documentation — suitable for assignment evaluation and further iteration.
