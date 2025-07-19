"use client"
import { ExplanationSection } from "./ExplanationSection";
import { UploadSection } from "./UploadSection";
import { Frame } from "../types/Frame";
import { getFrames } from "../services/framesService";

interface HomeContentProps {
    onFramesGenerated: (frames: Frame[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const MainContent: React.FC<HomeContentProps> = ({ onFramesGenerated, loading, setLoading }) => {
    const handleSubmit = async (e: React.FormEvent, file: File | null) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);

        try {
            const data = await getFrames(file);
            onFramesGenerated(data.frames);
        } catch (error) {
            console.error('Error generating frames:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-700 my-4 mx-4">
            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
                    Welcome to SnapMotion
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                    Transform static images into dynamic video frames with AI
                </p>
            </div>

            {/* Three Column Layout */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Left+Middle Column - Explanation */}
                <ExplanationSection />

                {/* Right Column - Upload */}
                <UploadSection onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
}; 