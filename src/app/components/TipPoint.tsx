interface TipPointProps {
    text: string;
}

export const TipPoint: React.FC<TipPointProps> = ({ text }) => {
    return (
        <div className="flex items-start gap-3 group">
            <div className="mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span className="text-amber-800 font-medium text-sm leading-relaxed">{text}</span>
        </div>
    )
}