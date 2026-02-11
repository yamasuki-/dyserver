import Link from 'next/link';
import { repository } from '@/lib/store';
import LogFilter from '@/components/LogFilter';
import { clearLogs } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function LogsPage(props: { searchParams: Promise<Record<string, string>> }) {
    const params = await props.searchParams;
    const path = params.path;
    const method = params.method;
    const status = params.status ? parseInt(params.status) : undefined;

    // Pagination
    const page = parseInt(params.page || '1');
    const limit = 20;
    const offset = (page - 1) * limit;

    const { logs, total } = await repository.getLogs({
        endpointId: path, // Mapping path filter to endpointId (which handles path search in repo)
        method,
        statusCode: status,
        limit,
        offset
    });

    const totalPages = Math.ceil(total / limit);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">ログ一覧</h1>
                <div className="space-x-2">
                    <form action={clearLogs} className="inline-block">
                        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm transition">
                            全削除
                        </button>
                    </form>
                    {/* Export buttons could go here */}
                </div>
            </div>

            <LogFilter />

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                    ログがありません。
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${log.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                                                log.method === 'POST' ? 'bg-green-100 text-green-800' :
                                                    log.method === 'DELETE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {log.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        {log.path}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${log.statusCode && log.statusCode < 400 ? 'bg-green-100 text-green-800' :
                                                log.statusCode && log.statusCode < 500 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                            {log.statusCode || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.durationMs}ms
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/logs/${log.id}`} className="text-indigo-600 hover:text-indigo-900">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="py-3 flex items-center justify-between border-t border-gray-200 mt-4">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <Link href={`/logs?page=${Math.max(1, page - 1)}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
                            Previous
                        </Link>
                        <Link href={`/logs?page=${Math.min(totalPages, page + 1)}`} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
                            Next
                        </Link>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{offset + 1}</span> to <span className="font-medium">{Math.min(offset + limit, total)}</span> of <span className="font-medium">{total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <Link
                                        key={p}
                                        href={`/logs?page=${p}&path=${path || ''}&method=${method || ''}&status=${status || ''}`}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${p === page ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {p}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
