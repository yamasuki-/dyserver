'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LogFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [path, setPath] = useState(searchParams.get('path') || '');
    const [method, setMethod] = useState(searchParams.get('method') || '');
    const [status, setStatus] = useState(searchParams.get('status') || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (path) params.set('path', path);
        if (method) params.set('method', method);
        if (status) params.set('status', status);

        router.push(`/logs?${params.toString()}`);
    };

    const handleClear = () => {
        setPath('');
        setMethod('');
        setStatus('');
        router.push('/logs');
    };

    return (
        <form onSubmit={handleFilter} className="bg-white p-4 rounded shadow mb-6 flex space-x-4 items-end">
            <div>
                <label className="block text-sm font-medium text-gray-700">Path / Endpoint</label>
                <input
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="/api/..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Method</label>
                <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                >
                    <option value="">All</option>
                    {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <input
                    type="number"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="200"
                    className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
            </div>
            <div className="flex space-x-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                    Filter
                </button>
                <button type="button" onClick={handleClear} className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                    Clear
                </button>
            </div>
        </form>
    );
}
