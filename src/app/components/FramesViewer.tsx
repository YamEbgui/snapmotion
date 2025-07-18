import React, { useState } from 'react';
import { Frame } from '../types/Frame';

interface FramesViewerProps {
    frames: Frame[];
    onBack: () => void;
}

export const FramesViewer: React.FC<FramesViewerProps> = ({ frames, onBack }) => {
    const [downloadingFrames, setDownloadingFrames] = useState<Set<number>>(new Set());
    const [downloadingAll, setDownloadingAll] = useState(false);

    const handleDownload = async (frame: Frame, index: number) => {
        setDownloadingFrames(prev => new Set(prev).add(index));
        try {
            const response = await fetch(frame.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `frame_${index + 1}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading frame:', error);
            alert(`Failed to download frame ${index + 1}. Please try again.`);
        } finally {
            setDownloadingFrames(prev => {
                const newSet = new Set(prev);
                newSet.delete(index);
                return newSet;
            });
        }
    };

    const handleDownloadAll = async () => {
        setDownloadingAll(true);
        try {
            for (let i = 0; i < frames.length; i++) {
                await handleDownload(frames[i], i);
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } finally {
            setDownloadingAll(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 animate-fade-in">
            {/* Enhanced Header */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl mb-8 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-semibold">Back to Upload</span>
                        </button>

                        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-700 font-medium">{frames.length} frames generated successfully</span>
                        </div>
                    </div>

                    <button
                        onClick={handleDownloadAll}
                        disabled={downloadingAll}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {downloadingAll ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Downloading All...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="font-semibold">Download All Frames</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Simple image grid - similar to your original working code */}
            <div className="grid grid-cols- md:grid-cols-3 lg:grid-cols-4 gap-4">
                {frames.map((frame, index) => (
                    <div
                        key={frame.url}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 animate-fade-in"
                    >
                        {/* Image Container */}
                        <div className="relative overflow-hidden">
                            <img
                                src={frame.url}
                                alt={`Frame ${index + 1}`}
                                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Frame number badge */}
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700 shadow-lg">
                                #{index + 1}
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 mb-1">Frame {index + 1}</h3>
                                    <p className="text-sm text-gray-500">AI Generated</p>
                                </div>

                                <button
                                    onClick={() => handleDownload(frame, index)}
                                    disabled={downloadingFrames.has(index)}
                                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {downloadingFrames.has(index) ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-sm">Downloading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-sm font-medium">Download</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state message if no frames */}
            {frames.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No frames generated</h3>
                    <p className="text-gray-500">Upload an image to generate dynamic video frames</p>
                </div>
            )}
        </div>
    );
}; 