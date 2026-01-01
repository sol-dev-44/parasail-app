'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    FileText,
    Trash2,
    Lock,
    Unlock,
    Loader2,
    CheckCircle,
    XCircle,
    AlertCircle,
    FolderOpen,
    FileUp,
    ClipboardPaste,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

const PIN_CODE = '4242';
const PIN_STORAGE_KEY = 'parasail_admin_pin';

interface Document {
    title: string;
    category: string;
    file_type: string;
    total_chunks: number;
    created_at: string;
}

const CATEGORIES = [
    { value: 'safety_rules', label: '🛡️ Safety Rules', color: 'blue' },
    { value: 'accident_insights', label: '⚠️ Accident Insights', color: 'red' },
    { value: 'equipment', label: '🪂 Equipment Guidelines', color: 'purple' },
    { value: 'weather', label: '🌤️ Weather Protocols', color: 'cyan' },
    { value: 'emergency', label: '🚨 Emergency Procedures', color: 'orange' },
    { value: 'general', label: '📋 General Information', color: 'gray' },
];

export default function AdminPage() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState(false);

    // Upload state
    const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [textInput, setTextInput] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('safety_rules');
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

    // Documents state
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    // Check PIN on mount
    useEffect(() => {
        const savedPin = localStorage.getItem(PIN_STORAGE_KEY);
        if (savedPin === PIN_CODE) {
            setIsUnlocked(true);
            loadDocuments();
        }
    }, []);

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pinInput === PIN_CODE) {
            localStorage.setItem(PIN_STORAGE_KEY, PIN_CODE);
            setIsUnlocked(true);
            setPinError(false);
            loadDocuments();
        } else {
            setPinError(true);
            setTimeout(() => setPinError(false), 2000);
        }
        setPinInput('');
    };

    const handleLock = () => {
        localStorage.removeItem(PIN_STORAGE_KEY);
        setIsUnlocked(false);
    };

    const loadDocuments = async () => {
        setLoadingDocs(true);
        try {
            const response = await fetch('/api/parasail-rag/upload');
            const data = await response.json();
            setDocuments(data.documents || []);
        } catch (error) {
            console.error('Failed to load documents:', error);
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!title) {
                setTitle(file.name.replace(/\.(pdf|txt)$/, ''));
            }
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title) {
            setUploadStatus({ type: 'error', message: 'Title is required' });
            return;
        }

        if (uploadMethod === 'file' && !selectedFile) {
            setUploadStatus({ type: 'error', message: 'Please select a file' });
            return;
        }

        if (uploadMethod === 'text' && !textInput.trim()) {
            setUploadStatus({ type: 'error', message: 'Please enter some text' });
            return;
        }

        setUploading(true);
        setUploadStatus({ type: null, message: '' });

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);

            if (uploadMethod === 'file' && selectedFile) {
                formData.append('file', selectedFile);
            } else {
                formData.append('text', textInput);
            }

            const response = await fetch('/api/parasail-rag/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setUploadStatus({
                    type: 'success',
                    message: `Successfully uploaded ${data.chunks} chunks!`,
                });
                // Reset form
                setSelectedFile(null);
                setTextInput('');
                setTitle('');
                // Reload documents
                loadDocuments();
            } else {
                setUploadStatus({ type: 'error', message: data.error || 'Upload failed' });
            }
        } catch (error) {
            setUploadStatus({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (docTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${docTitle}"?`)) return;

        try {
            const response = await fetch(`/api/parasail-rag/upload?title=${encodeURIComponent(docTitle)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                loadDocuments();
            } else {
                alert('Failed to delete document');
            }
        } catch (error) {
            alert('Network error. Please try again.');
        }
    };

    const getCategoryColor = (cat: string) => {
        const category = CATEGORIES.find(c => c.value === cat);
        return category?.color || 'gray';
    };

    if (!isUnlocked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900 p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full"
                >
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                        Admin Access
                    </h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                        Enter PIN to manage documents
                    </p>
                    <form onSubmit={handlePinSubmit}>
                        <input
                            type="password"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            placeholder="Enter PIN"
                            className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border ${pinError ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl tracking-widest mb-4 text-gray-900 dark:text-gray-100`}
                            maxLength={4}
                            autoFocus
                        />
                        <AnimatePresence>
                            {pinError && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-red-500 text-sm text-center mb-4"
                                >
                                    Incorrect PIN. Please try again.
                                </motion.p>
                            )}
                        </AnimatePresence>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Unlock
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Document Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Upload and manage parasailing safety documents
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                            ← Home
                        </Link>
                        <Link href="/parasail-rag" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                            Chat
                        </Link>
                        <ThemeToggle />
                        <button
                            onClick={handleLock}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Unlock className="w-4 h-4" />
                            Lock
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Upload Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                            <Upload className="w-5 h-5 text-purple-600" />
                            Upload Document
                        </h2>

                        {/* Upload Method Toggle */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setUploadMethod('file')}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${uploadMethod === 'file'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <FileUp className="w-4 h-4 inline mr-2" />
                                File Upload
                            </button>
                            <button
                                onClick={() => setUploadMethod('text')}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${uploadMethod === 'text'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <ClipboardPaste className="w-4 h-4 inline mr-2" />
                                Paste Text
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Document title"
                                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* File Upload */}
                            {uploadMethod === 'file' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">File (PDF or TXT)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".pdf,.txt"
                                            onChange={handleFileSelect}
                                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 dark:file:bg-purple-900/30 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-900/50"
                                        />
                                        {selectedFile && (
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                Selected: {selectedFile.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Text Input */}
                            {uploadMethod === 'text' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Text Content</label>
                                    <textarea
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        placeholder="Paste or type your text here..."
                                        rows={8}
                                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </div>
                            )}

                            {/* Upload Button */}
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Upload Document
                                    </>
                                )}
                            </button>

                            {/* Status Message */}
                            <AnimatePresence>
                                {uploadStatus.type && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`p-4 rounded-lg flex items-center gap-2 ${uploadStatus.type === 'success'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                            }`}
                                    >
                                        {uploadStatus.type === 'success' ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <XCircle className="w-5 h-5" />
                                        )}
                                        {uploadStatus.message}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div >

                    {/* Documents List */}
                    < div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6" >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                <FolderOpen className="w-5 h-5 text-purple-600" />
                                Uploaded Documents
                            </h2>
                            <button
                                onClick={loadDocuments}
                                disabled={loadingDocs}
                                className="text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
                            >
                                {loadingDocs ? 'Loading...' : 'Refresh'}
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {documents.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No documents uploaded yet</p>
                                </div>
                            ) : (
                                documents.map((doc, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                    {doc.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                                        {CATEGORIES.find((c) => c.value === doc.category)?.label}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{doc.total_chunks} chunks</span>
                                                    <span>•</span>
                                                    <span>{doc.file_type.toUpperCase()}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    {new Date(doc.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(doc.title)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div >
                </div >
            </div >
        </div >
    );
}
