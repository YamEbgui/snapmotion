"use client"
import { useState } from "react";
import { Header } from "../components/Header";
import { MainContent } from "../components/MainContent";
import { FramesViewer } from "../components/FramesViewer";
import { Frame } from "../types/Frame";

export const HomePage = () => {
    const [result, setResult] = useState<Frame[] | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFramesGenerated = (frames: Frame[]) => {
        setResult(frames);
    };

    const handleBack = () => {
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative">
            <Header />

            {/* Full page loading overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
                                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-pink-400"></div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Generating Your Frames</h3>
                        <p className="text-gray-600 mb-4">AI is creating dynamic video and extracting frames from your image...</p>
                        <div className="flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {!result ? (
                <main className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full px-6">
                    <MainContent
                        onFramesGenerated={handleFramesGenerated}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </main>
            ) : (
                <main className="min-h-[calc(100vh-80px)] flex items-center justify-center py-6 animate-fade-in">
                    <FramesViewer frames={result} onBack={handleBack} />
                </main>
            )}
        </div>
    );
}; 