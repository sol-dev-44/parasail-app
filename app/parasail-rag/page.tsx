'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Loader2,
    Sparkles,
    FileText,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    Database,
    Zap,
    Brain,
    Search,
    Info,
    TrendingUp,
    Shield,
    AlertTriangle,
    Package,
    Cloud,
    AlertCircle,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    sources?: Array<{
        title: string;
        category: string;
        similarity: number;
        preview: string;
    }>;
    metadata?: {
        duration_ms?: number;
        tokens_approx?: number;
        cost_usd?: number;
    };
    steps?: {
        embedding: boolean;
        search: boolean;
        generation: boolean;
    };
}

const QUESTION_CATEGORIES = [
    {
        id: 'safety_rules',
        icon: Shield,
        title: 'Safety Rules',
        color: 'blue',
        questions: [
            'What are the pre-flight safety checks for parasailing?',
            'What wind conditions are considered unsafe for parasailing?',
            'What are the minimum safety equipment requirements?',
            'How should passengers be briefed before flight?',
            'What are the weight restrictions for parasailing?',
        ],
    },
    {
        id: 'accident_insights',
        icon: AlertTriangle,
        title: 'Accident Insights',
        color: 'red',
        questions: [
            'What are the most common causes of parasailing accidents?',
            'What lessons can be learned from NTSB accident reports?',
            'How can equipment failure be prevented?',
            'What role does weather play in parasailing accidents?',
            'What are the key findings from recent safety investigations?',
        ],
    },
    {
        id: 'equipment',
        icon: Package,
        title: 'Equipment Guidelines',
        color: 'purple',
        questions: [
            'How should parasail canopies be inspected?',
            'What are the tow line requirements and specifications?',
            'When should equipment be replaced or retired?',
            'How to properly maintain winch systems?',
            'What are the harness safety standards?',
        ],
    },
    {
        id: 'weather',
        icon: Cloud,
        title: 'Weather Protocols',
        color: 'cyan',
        questions: [
            'What weather conditions require immediate shutdown?',
            'How to monitor and respond to changing wind conditions?',
            'What are the visibility requirements for safe operations?',
            'How does temperature affect parasailing operations?',
            'What weather forecasting tools should operators use?',
        ],
    },
    {
        id: 'emergency',
        icon: AlertCircle,
        title: 'Emergency Procedures',
        color: 'orange',
        questions: [
            'What should be done if a tow line breaks?',
            'How to execute an emergency landing procedure?',
            'What are the steps for water rescue operations?',
            'How to handle medical emergencies during flight?',
            'What communication protocols exist for emergencies?',
        ],
    },
];

export default function ParasailRAGChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showHowItWorks, setShowHowItWorks] = useState(false);
    const [expandedSources, setExpandedSources] = useState<number | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [currentStep, setCurrentStep] = useState<'idle' | 'embedding' | 'search' | 'generation'>('idle');
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [documents, setDocuments] = useState<Array<{ title: string; category: string; total_chunks: number }>>([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load documents on mount
    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const response = await fetch('/api/parasail-rag/upload');
                const data = await response.json();
                setDocuments(data.documents || []);
            } catch (error) {
                console.error('Failed to load documents:', error);
            }
        };
        loadDocuments();
    }, []);

    const copyToClipboard = async (text: string, index: number) => {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleQuestionClick = (question: string) => {
        setInput(question);
        setExpandedCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        setCurrentStep('embedding');
        const startTime = Date.now();

        try {
            const response = await fetch('/api/parasail-rag/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMsg: Message = {
                role: 'assistant',
                content: '',
                steps: { embedding: true, search: false, generation: false },
            };

            setMessages((prev) => [...prev, assistantMsg]);

            if (reader) {
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));

                                if (data.type === 'sources') {
                                    setCurrentStep('search');
                                    assistantMsg.sources = data.sources;
                                    assistantMsg.steps = { embedding: true, search: true, generation: false };
                                } else if (data.type === 'text') {
                                    setCurrentStep('generation');
                                    assistantMsg.content += data.text;
                                    assistantMsg.steps = { embedding: true, search: true, generation: true };
                                    setMessages((prev) => {
                                        const newMsgs = [...prev];
                                        newMsgs[newMsgs.length - 1] = { ...assistantMsg };
                                        return newMsgs;
                                    });
                                } else if (data.type === 'done') {
                                    assistantMsg.metadata = {
                                        duration_ms: data.metadata?.duration_ms,
                                        tokens_approx: data.metadata?.tokens_approx,
                                        cost_usd: data.metadata?.cost_usd,
                                    };
                                    setMessages((prev) => {
                                        const newMsgs = [...prev];
                                        newMsgs[newMsgs.length - 1] = { ...assistantMsg };
                                        return newMsgs;
                                    });
                                }
                            } catch (e) {
                                console.error('Parse error:', e);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMsg: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
            setCurrentStep('idle');
        }
    };

    const Tooltip = ({
        id,
        children,
        content,
    }: {
        id: string;
        children: React.ReactNode;
        content: string;
    }) => (
        <div
            className="relative inline-block"
            onMouseEnter={() => setActiveTooltip(id)}
            onMouseLeave={() => setActiveTooltip(null)}
        >
            {children}
            <AnimatePresence>
                {activeTooltip === id && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50"
                    >
                        {content}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const getCategoryColor = (category: string) => {
        const cat = QUESTION_CATEGORIES.find((c) => c.id === category);
        return cat?.color || 'gray';
    };

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Navigation Bar */}
            <nav className="border-b border-border-default backdrop-blur-lg bg-bg-primary/80">
                <div className="max-w-7xl mx-auto py-4 flex items-center justify-between px-6">
                    <Link href="/" className="text-2xl font-bold gradient-miami-text hover:opacity-80 transition-opacity">
                        ← Parasail Bro
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/parasail-rag/admin" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                            Admin
                        </Link>
                        <button
                            onClick={() => setShowHowItWorks(!showHowItWorks)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                            <Info className="w-4 h-4" />
                            <span className="font-medium">How it Works</span>
                            {showHowItWorks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <div className="w-full max-w-7xl mx-auto py-8 box-border px-6">
                {/* Title Section */}
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
                        <Sparkles className="w-8 h-8 text-pink-500" />
                        Parasail Safety Assistant
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Ask questions about parasailing safety, regulations, and best practices
                    </p>
                </div>

                {/* How It Works Panel */}
                <AnimatePresence>
                    {showHowItWorks && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Brain className="w-5 h-5 text-blue-600" />
                                    RAG Pipeline Architecture
                                </h3>

                                <div className="grid md:grid-cols-3 gap-4 mb-4">
                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                                                1
                                            </div>
                                            <Database className="w-5 h-5 text-blue-600" />
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Embedding</h4>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Your question is converted to a vector using OpenAI embeddings
                                        </p>
                                    </div>

                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold">
                                                2
                                            </div>
                                            <Search className="w-5 h-5 text-purple-600" />
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Vector Search</h4>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Supabase pgvector finds the most relevant safety documents
                                        </p>
                                    </div>

                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-pink-200 dark:border-pink-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-pink-600 text-white rounded-lg flex items-center justify-center font-bold">
                                                3
                                            </div>
                                            <Zap className="w-5 h-5 text-pink-600" />
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Generation</h4>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Claude Sonnet 4 generates a response with source citations
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                                        OpenAI Embeddings
                                    </span>
                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                        Supabase pgvector
                                    </span>
                                    <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">
                                        Claude Sonnet 4
                                    </span>
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                                        Next.js 16
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>



                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Question Categories Sidebar */}
                    <div className="lg:col-span-1 space-y-3">
                        <h3 className="text-lg font-bold mb-3 text-text-primary">Quick Questions</h3>
                        {QUESTION_CATEGORIES.map((category) => {
                            const Icon = category.icon;
                            const isExpanded = expandedCategory === category.id;

                            return (
                                <div key={category.id} className="bg-bg-card rounded-xl border border-border-default overflow-hidden">
                                    <button
                                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                                        className={`w-full p-4 flex items-center justify-between hover:bg-bg-secondary transition-colors`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-purple-600" />
                                            <span className="font-semibold text-text-primary">{category.title}</span>
                                        </div>
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 pt-0 space-y-2">
                                                    {category.questions.map((question, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => handleQuestionClick(question)}
                                                            className="w-full text-left p-3 text-sm bg-bg-secondary hover:bg-bg-card rounded-lg transition-colors text-text-primary border border-border-default hover:border-border-hover"
                                                        >
                                                            {question}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}

                        {/* Training Sources - Desktop */}
                        <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-purple-200 dark:border-purple-800">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                    <FileText className="w-4 h-4 text-purple-600" />
                                    Training Sources ({documents.length})
                                </h3>
                            </div>
                            <div className="p-4 max-h-[300px] overflow-y-auto">
                                {documents.length === 0 ? (
                                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">No documents uploaded yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {documents.map((doc, i) => (
                                            <div
                                                key={i}
                                                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                            >
                                                <h4 className="font-semibold text-xs text-gray-900 dark:text-white mb-1">
                                                    {doc.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                                                        {QUESTION_CATEGORIES.find((c) => c.id === doc.category)?.title || doc.category}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{doc.total_chunks} chunks</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium block text-center">
                                        📚 More training materials coming soon
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                            {/* Messages */}
                            <div className="h-[600px] overflow-y-auto p-6 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl"
                                        >
                                            <Sparkles className="w-10 h-10 text-white" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                                            Ask about parasailing safety!
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Select a category or type your own question
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                                                    <div
                                                        className={`relative group ${msg.role === 'user'
                                                            ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white rounded-2xl rounded-tr-sm'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-sm'
                                                            } px-5 py-4 shadow-lg`}
                                                    >
                                                        {msg.role === 'assistant' && (
                                                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                                                                <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                                    <Sparkles className="w-4 h-4 text-white" />
                                                                </div>
                                                                <span className="font-semibold text-sm">Safety Assistant</span>

                                                                {msg.steps && (
                                                                    <div className="flex items-center gap-1 ml-auto">
                                                                        <Tooltip id={`step-emb-${i}`} content="Embedding generated">
                                                                            <div
                                                                                className={`w-2 h-2 rounded-full ${msg.steps.embedding ? 'bg-green-500' : 'bg-gray-400'
                                                                                    }`}
                                                                            />
                                                                        </Tooltip>
                                                                        <Tooltip id={`step-search-${i}`} content="Vector search completed">
                                                                            <div
                                                                                className={`w-2 h-2 rounded-full ${msg.steps.search ? 'bg-green-500' : 'bg-gray-400'
                                                                                    }`}
                                                                            />
                                                                        </Tooltip>
                                                                        <Tooltip id={`step-gen-${i}`} content="Response generated">
                                                                            <div
                                                                                className={`w-2 h-2 rounded-full ${msg.steps.generation ? 'bg-green-500' : 'bg-gray-400'
                                                                                    }`}
                                                                            />
                                                                        </Tooltip>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div
                                                            className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'dark:prose-invert'
                                                                }`}
                                                        >
                                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                        </div>

                                                        <button
                                                            onClick={() => copyToClipboard(msg.content, i)}
                                                            className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === 'user'
                                                                ? 'bg-white/20 hover:bg-white/30'
                                                                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                                }`}
                                                        >
                                                            {copiedIndex === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                        </button>
                                                    </div>

                                                    {/* Sources */}
                                                    {msg.sources && msg.sources.length > 0 && (
                                                        <div className="mt-3 ml-2">
                                                            <button
                                                                onClick={() => setExpandedSources(expandedSources === i ? null : i)}
                                                                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                                                            >
                                                                <FileText className="w-4 h-4" />
                                                                <span className="font-medium">{msg.sources.length} sources</span>
                                                                {expandedSources === i ? (
                                                                    <ChevronUp className="w-4 h-4" />
                                                                ) : (
                                                                    <ChevronDown className="w-4 h-4" />
                                                                )}
                                                            </button>

                                                            <AnimatePresence>
                                                                {expandedSources === i && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        className="mt-2 space-y-2 overflow-hidden"
                                                                    >
                                                                        {msg.sources.map((source, j) => (
                                                                            <div
                                                                                key={j}
                                                                                className="block p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                                                            >
                                                                                <div className="flex items-start justify-between mb-1">
                                                                                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                                                                                        {source.title}
                                                                                    </span>
                                                                                    <Tooltip id={`similarity-${i}-${j}`} content="Similarity score">
                                                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                                                                                            <TrendingUp className="w-3 h-3" />
                                                                                            {(source.similarity * 100).toFixed(1)}%
                                                                                        </div>
                                                                                    </Tooltip>
                                                                                </div>
                                                                                <span
                                                                                    className={`inline-block px-2 py-0.5 bg-${getCategoryColor(
                                                                                        source.category
                                                                                    )}-100 dark:bg-${getCategoryColor(
                                                                                        source.category
                                                                                    )}-900/30 text-${getCategoryColor(
                                                                                        source.category
                                                                                    )}-700 dark:text-${getCategoryColor(
                                                                                        source.category
                                                                                    )}-400 rounded-full text-xs mb-2`}
                                                                                >
                                                                                    {QUESTION_CATEGORIES.find((c) => c.id === source.category)?.title ||
                                                                                        source.category}
                                                                                </span>
                                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                                    {source.preview}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    )}

                                                    {/* Metadata */}
                                                    {msg.metadata && (
                                                        <div className="mt-2 ml-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                            {msg.metadata.duration_ms && (
                                                                <span className="flex items-center gap-1">
                                                                    <Zap className="w-3 h-3" />
                                                                    {(msg.metadata.duration_ms / 1000).toFixed(2)}s
                                                                </span>
                                                            )}
                                                            {msg.metadata.tokens_approx && (
                                                                <span className="flex items-center gap-1">
                                                                    <FileText className="w-3 h-3" />
                                                                    {Math.round(msg.metadata.tokens_approx)} tokens
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}

                                        {loading && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                                <div className="max-w-[85%]">
                                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-5 py-4 shadow-lg">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                                <Sparkles className="w-4 h-4 text-white" />
                                                            </div>
                                                            <span className="font-semibold text-sm">Safety Assistant</span>
                                                            <Loader2 className="w-4 h-4 animate-spin text-purple-600 ml-auto" />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div
                                                                className={`flex items-center gap-2 text-sm ${currentStep === 'embedding'
                                                                    ? 'text-blue-600 dark:text-blue-400'
                                                                    : 'text-gray-500 dark:text-gray-500'
                                                                    }`}
                                                            >
                                                                <div
                                                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${currentStep === 'embedding'
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                                        }`}
                                                                >
                                                                    {currentStep === 'embedding' ? (
                                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                                    ) : (
                                                                        <Database className="w-3 h-3" />
                                                                    )}
                                                                </div>
                                                                <span>Generating embedding...</span>
                                                            </div>
                                                            <div
                                                                className={`flex items-center gap-2 text-sm ${currentStep === 'search'
                                                                    ? 'text-purple-600 dark:text-purple-400'
                                                                    : 'text-gray-500 dark:text-gray-500'
                                                                    }`}
                                                            >
                                                                <div
                                                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${currentStep === 'search'
                                                                        ? 'bg-purple-600 text-white'
                                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                                        }`}
                                                                >
                                                                    {currentStep === 'search' ? (
                                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                                    ) : (
                                                                        <Search className="w-3 h-3" />
                                                                    )}
                                                                </div>
                                                                <span>Searching documents...</span>
                                                            </div>
                                                            <div
                                                                className={`flex items-center gap-2 text-sm ${currentStep === 'generation'
                                                                    ? 'text-pink-600 dark:text-pink-400'
                                                                    : 'text-gray-500 dark:text-gray-500'
                                                                    }`}
                                                            >
                                                                <div
                                                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${currentStep === 'generation'
                                                                        ? 'bg-pink-600 text-white'
                                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                                        }`}
                                                                >
                                                                    {currentStep === 'generation' ? (
                                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                                    ) : (
                                                                        <Zap className="w-3 h-3" />
                                                                    )}
                                                                </div>
                                                                <span>Generating response...</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Input Form */}
                            <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900/50">
                                <form onSubmit={handleSubmit} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask about parasailing safety..."
                                        className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        disabled={loading}
                                        maxLength={500}
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={!input.trim() || loading}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        <span>Send</span>
                                    </motion.button>
                                </form>
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    {input.length}/500 characters
                                </div>
                            </div>
                        </div>

                        {/* Training Sources - Mobile */}
                        <div className="lg:hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden mt-6">
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-purple-200 dark:border-purple-800">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                    <FileText className="w-4 h-4 text-purple-600" />
                                    Training Sources ({documents.length})
                                </h3>
                            </div>
                            <div className="p-4 max-h-[300px] overflow-y-auto">
                                {documents.length === 0 ? (
                                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">No documents uploaded yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {documents.map((doc, i) => (
                                            <div
                                                key={i}
                                                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                            >
                                                <h4 className="font-semibold text-xs text-gray-900 dark:text-white mb-1">
                                                    {doc.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                                                        {QUESTION_CATEGORIES.find((c) => c.id === doc.category)?.title || doc.category}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{doc.total_chunks} chunks</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium block text-center">
                                        📚 More training materials coming soon
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
