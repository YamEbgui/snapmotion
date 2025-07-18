'use client'
import { TipPoint } from './TipPoint';
import { BulletPoint } from './BulletPoint';

export const ExplanationSection = () => {
    return (
        <div className='col-span-2 max-w-4xl justify-self-center items-center'>
            {/* Main Description */}
            <div className="mb-5">
                <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-base text-gray-700 leading-relaxed">
                        <strong className="text-gray-900 font-semibold">SnapMotion's AI-powered pose transformation</strong> generates
                        dynamic video frames from a single image. Simply upload an image containing a main subject, and watch
                        as our AI creates multiple frames showing different poses and perspectives.
                    </p>
                </div>
            </div>

            {/* Example Types */}
            <div className="mb-5">
                <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    Perfect for:
                </h3>
                <div className="space-y-2">
                    <BulletPoint icon="👤" title="People" description="Standing, sitting, dancing, or any human pose" />
                    <BulletPoint icon="🐾" title="Animals" description="Pets, wildlife, or any living creature" />
                    <BulletPoint icon="🎭" title="Characters" description="Toys, statues, or digital characters" />
                </div>
            </div>

            {/* Best Practices */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200">
                <h3 className="text-base font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    For best results:
                </h3>
                <div className="space-y-1 text-sm">
                    <TipPoint text="Ensure the subject is clearly visible and not blurry" />
                    <TipPoint text="Focus on one main object or figure" />
                    <TipPoint text="Avoid cluttered or busy backgrounds" />
                    <TipPoint text="Use good lighting and contrast" />
                </div>
            </div>
        </div>
    )
}

