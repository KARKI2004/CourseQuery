# CourseQuery

A retrieval-based Q&A tool that lets you ask questions about your specific course materials and get grounded, cited answers using Google Gemini File Search.

## Features

- **Document Q&A**: Ask questions and get answers grounded in your uploaded materials
- **Fallback Behavior**: Generates a response utilizing Google Gemini's general
    knowledge if your course materials doesnot cover the question
- **Citation Tracking**: Every answer includes source citations for transparency
- **Message Search**: Filter through your conversation history

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI
- **Backend**: Supabase Edge Functions
- **Search & Answers**: Google Gemini 2.5 Flash with File Search
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js and npm
- Supabase account and project
- Google AI Studio account with Gemini API access and a File Search store with materials uploaded

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd coursequery
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your values:
- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — your Supabase anon/publishable key

4. Set up Supabase Edge Function secrets in your Supabase dashboard 
   under Edge Functions → Secrets:
- `GEMINI_API_KEY` — your Google Gemini API key
- `GOOGLE_FILE_SEARCH_STORE_ID` — your Google File Search store ID

5. Deploy the edge function:
```bash
supabase functions deploy chat
```

6. Start the development server:
```bash
npm run dev
```

## Currently Available Materials

This instance currently has two documents uploaded to the File Search store:

- Turabian Style Citations Guide
- Supply Chain Management

Questions will be answered based on these materials only.
Additional course materials will be added over time.