'use client';

import { useState } from 'react';
import { EndpointConfig, HttpMethod, ResponseSet, ResponseMode } from '@/types';
import { updateEndpoint } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function EndpointEditor({ endpoint }: { endpoint: EndpointConfig }) {
    const [config, setConfig] = useState<EndpointConfig>(endpoint);
    const [activeMethod, setActiveMethod] = useState<HttpMethod>('GET');
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        await updateEndpoint(config);
        setIsSaving(false);
        alert('保存しました');
        router.refresh();
    };

    const currentMethodConfig = config.methods[activeMethod];

    const toggleMethod = () => {
        setConfig({
            ...config,
            methods: {
                ...config.methods,
                [activeMethod]: {
                    ...currentMethodConfig,
                    enabled: !currentMethodConfig.enabled,
                },
            },
        });
    };

    const addResponseSet = () => {
        const newSet: ResponseSet = {
            id: crypto.randomUUID(),
            name: 'New Response Set',
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
            isNoResponse: false,
        };

        setConfig({
            ...config,
            methods: {
                ...config.methods,
                [activeMethod]: {
                    ...currentMethodConfig,
                    responseSets: [...currentMethodConfig.responseSets, newSet],
                    // If it's the first one, set as active
                    activeResponseSetId: currentMethodConfig.responseSets.length === 0 ? newSet.id : currentMethodConfig.activeResponseSetId
                }
            }
        });
    };

    const updateResponseSet = (index: number, updates: Partial<ResponseSet>) => {
        const newSets = [...currentMethodConfig.responseSets];
        newSets[index] = { ...newSets[index], ...updates };

        setConfig({
            ...config,
            methods: {
                ...config.methods,
                [activeMethod]: {
                    ...currentMethodConfig,
                    responseSets: newSets
                }
            }
        });
    };

    const removeResponseSet = (index: number) => {
        const newSets = [...currentMethodConfig.responseSets];
        newSets.splice(index, 1);

        setConfig({
            ...config,
            methods: {
                ...config.methods,
                [activeMethod]: {
                    ...currentMethodConfig,
                    responseSets: newSets
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded shadow space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Path</label>
                    <input
                        type="text"
                        value={config.path}
                        onChange={(e) => setConfig({ ...config, path: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        value={config.description || ''}
                        onChange={(e) => setConfig({ ...config, description: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        {(['GET', 'POST', 'PUT', 'DELETE'] as HttpMethod[]).map((method) => (
                            <button
                                key={method}
                                onClick={() => setActiveMethod(method)}
                                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeMethod === method
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {method}
                                {config.methods[method].enabled && (
                                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 rounded-full">ON</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">{activeMethod} Settings</h3>
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-500">{currentMethodConfig.enabled ? 'Enabled' : 'Disabled'}</span>
                            <button
                                onClick={toggleMethod}
                                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${currentMethodConfig.enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${currentMethodConfig.enabled ? 'translate-x-5' : 'translate-x-0'}`}></span>
                            </button>
                        </div>
                    </div>

                    {currentMethodConfig.enabled && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Response Mode</label>
                                <select
                                    value={currentMethodConfig.mode}
                                    onChange={(e) => setConfig({
                                        ...config,
                                        methods: {
                                            ...config.methods,
                                            [activeMethod]: { ...currentMethodConfig, mode: e.target.value as ResponseMode }
                                        }
                                    })}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="default">Default (Fixed)</option>
                                    <option value="random">Random</option>
                                    <option value="conditional">Conditional</option>
                                </select>
                            </div>

                            {/* Response Sets */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-md font-medium text-gray-900">Response Sets</h4>
                                    <button onClick={addResponseSet} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">
                                        + Add Set
                                    </button>
                                </div>

                                {currentMethodConfig.responseSets.map((set, idx) => (
                                    <div key={set.id} className="border border-gray-200 rounded p-4 space-y-3 relative">
                                        <div className="flex justify-between">
                                            <input
                                                className="font-bold border-none focus:ring-0 p-0"
                                                value={set.name}
                                                onChange={(e) => updateResponseSet(idx, { name: e.target.value })}
                                            />
                                            <button onClick={() => removeResponseSet(idx)} className="text-red-500 text-sm">Remove</button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500">Status Code</label>
                                                <input
                                                    type="number"
                                                    value={set.statusCode}
                                                    onChange={(e) => updateResponseSet(idx, { statusCode: parseInt(e.target.value) })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center mt-6">
                                                <input
                                                    type="checkbox"
                                                    checked={set.isNoResponse}
                                                    onChange={(e) => updateResponseSet(idx, { isNoResponse: e.target.checked })}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label className="ml-2 block text-sm text-gray-900">No Response (Timeout)</label>
                                            </div>
                                        </div>

                                        {!set.isNoResponse && (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Headers (JSON)</label>
                                                    <textarea
                                                        value={JSON.stringify(set.headers, null, 2)}
                                                        onChange={(e) => {
                                                            try {
                                                                const headers = JSON.parse(e.target.value);
                                                                updateResponseSet(idx, { headers });
                                                            } catch { }
                                                        }}
                                                        rows={2}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm font-mono text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Body</label>
                                                    <textarea
                                                        value={set.body}
                                                        onChange={(e) => updateResponseSet(idx, { body: e.target.value })}
                                                        rows={4}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm font-mono text-xs"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {currentMethodConfig.mode === 'default' && (
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`defaultSet-${activeMethod}`}
                                                    checked={currentMethodConfig.activeResponseSetId === set.id}
                                                    onChange={() => setConfig({
                                                        ...config,
                                                        methods: {
                                                            ...config.methods,
                                                            [activeMethod]: { ...currentMethodConfig, activeResponseSetId: set.id }
                                                        }
                                                    })}
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                />
                                                <label className="ml-2 block text-sm text-gray-900">Set as Default Response</label>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
