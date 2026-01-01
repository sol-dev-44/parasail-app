-- ============================================================================
-- Parasail RAG - Supabase Schema
-- ============================================================================

-- Enable pgvector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- TABLE: parasail_documents
-- Stores document chunks with embeddings for semantic search
-- ============================================================================

CREATE TABLE IF NOT EXISTS parasail_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('safety_rules', 'accident_insights', 'equipment', 'weather', 'emergency', 'general')),
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'txt', 'text_input')),
  chunk_index INTEGER NOT NULL DEFAULT 0,
  total_chunks INTEGER NOT NULL DEFAULT 1,
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS parasail_documents_embedding_idx 
ON parasail_documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS parasail_documents_category_idx ON parasail_documents(category);
CREATE INDEX IF NOT EXISTS parasail_documents_title_idx ON parasail_documents(title);
CREATE INDEX IF NOT EXISTS parasail_documents_created_at_idx ON parasail_documents(created_at DESC);

-- ============================================================================
-- RPC FUNCTION: match_parasail_documents
-- Semantic search for relevant parasail documents
-- ============================================================================

CREATE OR REPLACE FUNCTION match_parasail_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.3,
  match_count INT DEFAULT 5,
  category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  file_type TEXT,
  chunk_index INTEGER,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    parasail_documents.id,
    parasail_documents.title,
    parasail_documents.content,
    parasail_documents.category,
    parasail_documents.file_type,
    parasail_documents.chunk_index,
    1 - (parasail_documents.embedding <=> query_embedding) AS similarity,
    parasail_documents.metadata
  FROM parasail_documents
  WHERE 
    (category_filter IS NULL OR parasail_documents.category = category_filter)
    AND 1 - (parasail_documents.embedding <=> query_embedding) > match_threshold
  ORDER BY parasail_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================================
-- TABLE: parasail_query_analytics (Optional)
-- Track usage statistics for analytics
-- ============================================================================

CREATE TABLE IF NOT EXISTS parasail_query_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  category_filter TEXT,
  retrieved_doc_ids UUID[] NOT NULL,
  response_time_ms INTEGER NOT NULL,
  cost_usd FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS parasail_query_analytics_created_at_idx 
ON parasail_query_analytics(created_at DESC);

-- ============================================================================
-- FUNCTION: get_parasail_rag_stats
-- Get statistics about the RAG knowledge base
-- ============================================================================

CREATE OR REPLACE FUNCTION get_parasail_rag_stats()
RETURNS TABLE (
  total_documents BIGINT,
  total_chunks BIGINT,
  by_category JSONB,
  by_file_type JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT title)::BIGINT AS total_documents,
    COUNT(*)::BIGINT AS total_chunks,
    (
      SELECT jsonb_object_agg(category, count)
      FROM (
        SELECT category, COUNT(*) as count
        FROM parasail_documents
        GROUP BY category
      ) cat_counts
    ) AS by_category,
    (
      SELECT jsonb_object_agg(file_type, count)
      FROM (
        SELECT file_type, COUNT(*) as count
        FROM parasail_documents
        GROUP BY file_type
      ) type_counts
    ) AS by_file_type
  FROM parasail_documents;
END;
$$;

-- ============================================================================
-- Enable Row Level Security (Optional - for production)
-- ============================================================================

-- Uncomment these lines if you want to enable RLS
-- ALTER TABLE parasail_documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE parasail_query_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
-- CREATE POLICY "Allow public read access" ON parasail_documents FOR SELECT USING (true);

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE parasail_documents IS 'Parasail safety documents with embeddings for semantic search';
COMMENT ON TABLE parasail_query_analytics IS 'Analytics for parasail RAG queries';
COMMENT ON FUNCTION match_parasail_documents IS 'Semantic search for relevant parasail documents with optional category filtering';
COMMENT ON FUNCTION get_parasail_rag_stats IS 'Get RAG knowledge base statistics';
