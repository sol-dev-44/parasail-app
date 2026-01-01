// app/api/parasail-rag/upload/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const CHUNK_SIZE = 500; // tokens
const CHUNK_OVERLAP = 50; // tokens

interface DocumentChunk {
    title: string;
    content: string;
    category: string;
    file_type: 'pdf' | 'txt' | 'text_input';
    chunk_index: number;
    total_chunks: number;
    metadata: Record<string, any>;
}

// Simple text chunking function
function chunkText(text: string, chunkSize: number, overlap: number): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += chunkSize - overlap) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        if (chunk.trim()) {
            chunks.push(chunk);
        }
    }

    return chunks.length > 0 ? chunks : [text];
}

// Extract text from PDF buffer
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        // Use pdf-parse-fork which works in Node.js/Next.js without canvas issues
        const pdfParse = (await import('pdf-parse-fork')).default;
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error('[Upload] PDF parsing error:', error);
        throw new Error('Failed to parse PDF file');
    }
}

// Generate embedding for text
async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('[Upload] Embedding error:', error);
        throw new Error('Failed to generate embedding');
    }
}

// POST: Upload document
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const textInput = formData.get('text') as string | null;
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;

        // Validation
        if (!title || !category) {
            return Response.json(
                { error: 'Title and category are required' },
                { status: 400 }
            );
        }

        const validCategories = ['safety_rules', 'accident_insights', 'equipment', 'weather', 'emergency', 'general'];
        if (!validCategories.includes(category)) {
            return Response.json(
                { error: 'Invalid category' },
                { status: 400 }
            );
        }

        let text = '';
        let fileType: 'pdf' | 'txt' | 'text_input' = 'text_input';

        // Process file upload
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                return Response.json(
                    { error: 'File too large. Maximum size is 10MB.' },
                    { status: 400 }
                );
            }

            const buffer = Buffer.from(await file.arrayBuffer());

            if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                fileType = 'pdf';
                text = await extractTextFromPDF(buffer);
            } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                fileType = 'txt';
                text = buffer.toString('utf-8');
            } else {
                return Response.json(
                    { error: 'Unsupported file type. Only PDF and TXT files are allowed.' },
                    { status: 400 }
                );
            }
        } else if (textInput) {
            text = textInput;
            fileType = 'text_input';
        } else {
            return Response.json(
                { error: 'Either file or text input is required' },
                { status: 400 }
            );
        }

        if (!text.trim()) {
            return Response.json(
                { error: 'Document is empty' },
                { status: 400 }
            );
        }

        console.log(`[Upload] Processing document: "${title}" (${fileType}, ${text.length} chars)`);

        // Chunk the text
        const chunks = chunkText(text, CHUNK_SIZE, CHUNK_OVERLAP);
        console.log(`[Upload] Created ${chunks.length} chunks`);

        // Generate embeddings and store chunks
        const documentChunks: DocumentChunk[] = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const embedding = await generateEmbedding(chunk);

            const { error } = await supabase.from('parasail_documents').insert({
                title,
                content: chunk,
                category,
                file_type: fileType,
                chunk_index: i,
                total_chunks: chunks.length,
                embedding,
                metadata: {
                    original_length: text.length,
                    chunk_length: chunk.length,
                    uploaded_at: new Date().toISOString(),
                },
            });

            if (error) {
                console.error('[Upload] Supabase error:', error);
                throw new Error('Failed to store document chunk');
            }

            documentChunks.push({
                title,
                content: chunk,
                category,
                file_type: fileType,
                chunk_index: i,
                total_chunks: chunks.length,
                metadata: {},
            });
        }

        console.log(`[Upload] Successfully uploaded ${chunks.length} chunks`);

        return Response.json({
            success: true,
            title,
            category,
            file_type: fileType,
            chunks: chunks.length,
            total_chars: text.length,
        });
    } catch (error: any) {
        console.error('[Upload] Error:', error);
        return Response.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET: List uploaded documents
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        let query = supabase
            .from('parasail_documents')
            .select('title, category, file_type, chunk_index, total_chunks, created_at, metadata');

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        // Group by title to get document-level info
        const documentsMap = new Map();

        data?.forEach((chunk: any) => {
            if (!documentsMap.has(chunk.title)) {
                documentsMap.set(chunk.title, {
                    title: chunk.title,
                    category: chunk.category,
                    file_type: chunk.file_type,
                    total_chunks: chunk.total_chunks,
                    created_at: chunk.created_at,
                    metadata: chunk.metadata,
                });
            }
        });

        const documents = Array.from(documentsMap.values());

        return Response.json({ documents });
    } catch (error: any) {
        console.error('[Upload] GET error:', error);
        return Response.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE: Remove document
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const title = searchParams.get('title');

        if (!title) {
            return Response.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('parasail_documents')
            .delete()
            .eq('title', title);

        if (error) {
            throw error;
        }

        console.log(`[Upload] Deleted document: "${title}"`);

        return Response.json({ success: true, title });
    } catch (error: any) {
        console.error('[Upload] DELETE error:', error);
        return Response.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
