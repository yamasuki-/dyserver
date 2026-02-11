import Link from 'next/link';

export const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">DyServer</h1>
                <p className="text-xs text-gray-400">Dummy Server Controller</p>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    <li>
                        <Link href="/" className="block p-2 hover:bg-gray-700 rounded transition">
                            エンドポイント一覧
                        </Link>
                    </li>
                    <li>
                        <Link href="/logs" className="block p-2 hover:bg-gray-700 rounded transition">
                            ログ一覧
                        </Link>
                    </li>
                    <li>
                        <Link href="/settings" className="block p-2 hover:bg-gray-700 rounded transition">
                            全体設定
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="mt-auto pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">&copy; 2026 DyServer</p>
            </div>
        </aside>
    );
};
