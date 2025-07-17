
export const Header = () => {
    return (
        <header className="flex justify-center items-center p-4 border-b border-gray-200 w-full">
            <img src="/logo.png" alt="SnapMotion Logo" className="h-8" />
            <span className="text-2xl font-large text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-fuchsia-600">
                SnapMotion
            </span>
        </header>
    );
}
