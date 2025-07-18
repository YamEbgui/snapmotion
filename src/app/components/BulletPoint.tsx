type BulletPointProps ={
    icon: string;
    title: string;
    description: string;
}

export const BulletPoint: React.FC<BulletPointProps> = ({ icon, title, description }) => {
    return (
        <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-gray-100 hover:bg-white/80 transition-all duration-300 group">
            <div className="text-lg group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-sm mb-0.5">{title}</h4>
                <p className="text-xs text-gray-600">{description}</p>
            </div>
        </div>
    )
}