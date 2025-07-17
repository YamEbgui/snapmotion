import React, { useState, useRef } from 'react';

const SUPPORTED_IMAGE_FORMATS = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];

export const UploadForm = ({
    onSubmit,
    loading,
}: {
    onSubmit: (e: React.FormEvent, file: File | null) => void;
    loading: boolean;
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected && verifyImageType(selected)) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
            setError(null);
        } else {
            setFile(null);
            setPreviewUrl(null);
            setError('Please upload a PNG, JPEG, or WEBP image.');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(e, file);
    };

    const verifyImageType = (file: File) => {
        if (SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
            return true;
        }
        return false;
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6"
        >
            <div className="w-full flex flex-col gap-2">
                <input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                />
            </div>
            {previewUrl && (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 shadow-inner">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded"
                    />
                </div>
            )}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50"
            >
                {loading ? 'Generating...' : 'Generate New Frames'}
            </button>
        </form>
    );
};