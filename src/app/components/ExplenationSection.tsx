import React from 'react'

export const ExplenationSection = () => {
    return (
        <section className="max-w-xl text-center px-4 py-10 rounded-2xl shadow-xl bg-white backdrop-blur">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Welcome to SnapMotion</h1>
            <p className="text-lg mb-6 text-gray-700">
                <strong className="text-gray-900">SnapMotion’s pose transformation</strong> lets you generate dynamic video frames from a single image. To get started, simply upload an image that contains a main object or figure — for example:
            </p>
            <ul className="mb-6 text-left mx-auto max-w-md text-gray-800 space-y-2">
                <BulletPoint>A person (standing, sitting, dancing, etc.)</BulletPoint>
                <BulletPoint>An animal</BulletPoint>
                <BulletPoint>A toy, statue, or digital character</BulletPoint>
            </ul>
            <p className="mb-3 font-semibold text-gray-900">For best results:</p>
            <ul className="text-left mx-auto max-w-md text-gray-800 space-y-2">
                <BulletPoint>The subject should be clearly visible (not blurry)</BulletPoint>
                <BulletPoint>Only one main object should be in focus</BulletPoint>
                <BulletPoint>The background should not be too cluttered</BulletPoint>
            </ul>
        </section>
    )
}

const BulletPoint = ({ children }: { children: React.ReactNode }) => {
    return (
        <li className="flex items-start gap-3">
            <span className="mt-2 w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-fuchsia-600 flex-shrink-0"></span>
            <span className="font-semibold text-gray-900">{children}</span>
        </li>
    )
}