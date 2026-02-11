export const Header = () => {
    return (
        <header className="bg-white shadow h-16 flex items-center px-6">
            <h2 className="text-xl font-semibold text-gray-800">
                管理画面
            </h2>
            <div className="ml-auto flex items-center space-x-4">
                {/* Placeholder for future header items */}
                <span className="text-sm text-gray-500">Status: Running</span>
            </div>
        </header>
    );
};
