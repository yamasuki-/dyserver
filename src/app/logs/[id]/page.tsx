import { repository } from '@/lib/store';
import Link from 'next/link';

export default async function LogDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    // This is inefficient as getLogs loads all, but for now ok.
    // Ideally getLog(id).
    const { logs } = await repository.getLogs();
    const log = logs.find(l => l.id === params.id);

    if (!log) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold">Log not found</h1>
                <Link href="/logs" className="text-blue-600 underline">Return to list</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Log Details</h1>
                <Link href="/logs" className="text-gray-500 hover:text-gray-700">Back to List</Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">General Information</h3>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Messages ID</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{log.id}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(log.timestamp).toLocaleString()}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Method / Path</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">{log.method} {log.path}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Status Code</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {log.statusCode} ({log.durationMs}ms)
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Request */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 bg-blue-50">
                        <h3 className="text-lg leading-6 font-medium text-blue-900">Request</h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <div className="py-4 px-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Headers</h4>
                            <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">{JSON.stringify(log.request.headers, null, 2)}</pre>
                        </div>
                        <div className="py-4 px-6 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Query Specs</h4>
                            <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">{JSON.stringify(log.request.query, null, 2)}</pre>
                        </div>
                        <div className="py-4 px-6 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Body</h4>
                            <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-60 whitespace-pre-wrap word-break-all">
                                {log.request.body || '(empty)'}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Response */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 bg-green-50">
                        <h3 className="text-lg leading-6 font-medium text-green-900">Response</h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        {log.response ? (
                            <>
                                <div className="py-4 px-6">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Response Set</h4>
                                    <p className="text-sm text-gray-900">{log.response.responseSetName || 'N/A'} (ID: {log.response.responseSetId || 'N/A'})</p>
                                </div>
                                <div className="py-4 px-6 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Headers</h4>
                                    <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">{JSON.stringify(log.response.headers, null, 2)}</pre>
                                </div>
                                <div className="py-4 px-6 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Body</h4>
                                    <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-60 whitespace-pre-wrap word-break-all">
                                        {log.response.body || '(empty)'}
                                    </pre>
                                </div>
                            </>
                        ) : (
                            <div className="py-10 text-center text-gray-500 italic">
                                No response recorded (or disabled)
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
