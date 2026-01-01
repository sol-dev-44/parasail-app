# Parasail RAG Chat Feature

A RAG (Retrieval-Augmented Generation) chat system for parasailing safety documentation, powered by OpenAI embeddings, Supabase pgvector, and Claude Sonnet 4.

## Features

### 🔒 Admin Interface (`/parasail-rag/admin`)
- **PIN Protection**: Secure access with PIN code 4242 (stored in localStorage)
- **Multiple Upload Methods**:
  - PDF file upload
  - Text file upload (.txt)
  - Direct text paste
- **Document Management**: View, categorize, and delete uploaded documents
- **Category Organization**: Safety Rules, Accident Insights, Equipment, Weather, Emergency, General

### 💬 Public Chat Interface (`/parasail-rag`)
- **Streaming Responses**: Real-time AI responses with Claude Sonnet 4
- **Source Citations**: Transparent attribution to source documents with similarity scores
- **Category-Based Questions**: Pre-written questions organized by topic
- **RAG Pipeline Visualization**: See the embedding → search → generation process
- **Dark/Light Mode**: Full theme support

## Setup Instructions

### 1. Database Setup

Run the SQL schema in your Supabase project:

```bash
# Navigate to Supabase SQL Editor and run:
cat supabase/parasail-rag-schema.sql
```

This creates:
- `parasail_documents` table with pgvector embeddings
- `match_parasail_documents` RPC function for semantic search
- `parasail_query_analytics` table (optional)

### 2. Environment Variables

Create a `.env.local` file with the following (see `ENV_SETUP.md`):

```bash
# Supabase (same as ai-portfolio)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (for embeddings)
OPENAI_API_KEY=your_openai_api_key

# Anthropic (for chat)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Install Dependencies

Dependencies are already installed:
- `pdf-parse` - PDF text extraction
- `pdfjs-dist` - PDF.js library
- `react-markdown` - Markdown rendering

### 4. Upload Documents

1. Navigate to `/parasail-rag/admin`
2. Enter PIN: `4242`
3. Upload your parasailing safety documents:
   - WSIA Parasailing Training Manual (PDF)
   - NTSB Safety Reports (PDF)
   - Custom safety guidelines (PDF/TXT/Text)
4. Assign appropriate categories

### 5. Start Using

Navigate to `/parasail-rag` and start asking questions!

## Architecture

### RAG Pipeline

1. **Embedding Generation**: User queries are converted to 1536-dimensional vectors using OpenAI's `text-embedding-3-small`
2. **Vector Search**: Supabase pgvector performs cosine similarity search to find the top 5 most relevant document chunks
3. **Response Generation**: Claude Sonnet 4 generates a response using the retrieved context, with source citations

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI Models**:
  - OpenAI `text-embedding-3-small` for embeddings
  - Anthropic Claude Sonnet 4 for chat
- **Document Processing**: pdf-parse, pdfjs-dist

## API Endpoints

### Upload API (`/api/parasail-rag/upload`)

- **POST**: Upload documents (PDF, TXT, or text input)
- **GET**: List uploaded documents
- **DELETE**: Remove documents by title

### Chat API (`/api/parasail-rag/chat`)

- **POST**: Streaming chat with RAG
  - Rate limiting: 10 requests/minute per IP
  - Max query length: 500 characters
  - Optional category filtering
- **GET**: Health check

## Question Categories

The chat interface includes pre-written questions in these categories:

- 🛡️ **Safety Rules**: Pre-flight checks, wind conditions, equipment requirements
- ⚠️ **Accident Insights**: Common causes, NTSB findings, prevention strategies
- 🪂 **Equipment Guidelines**: Canopy inspection, tow lines, maintenance
- 🌤️ **Weather Protocols**: Shutdown conditions, wind monitoring, forecasting
- 🚨 **Emergency Procedures**: Line breaks, emergency landings, rescue operations

## Cost Estimation

The system calculates approximate costs for each query:
- **Embedding**: ~$0.02 per 1M tokens
- **Claude Sonnet 4**: ~$3 per 1M input tokens, ~$15 per 1M output tokens

Typical query cost: $0.0001 - $0.001

## Security Notes

- PIN code (4242) is stored in localStorage for session persistence
- Admin interface is client-side protected (consider server-side auth for production)
- Rate limiting prevents abuse (10 requests/minute)
- All API keys should be kept secure in `.env.local`

## Future Enhancements

- [ ] Server-side authentication for admin
- [ ] Document versioning
- [ ] Advanced filtering (date, file type)
- [ ] Export chat history
- [ ] Multi-language support
- [ ] Voice input/output
