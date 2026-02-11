'use client';

import { useState } from 'react';
import { GlobalConfig } from '@/types';
import { saveGlobalConfig } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function SettingsForm({ config }: { config: GlobalConfig }) {
    const [localConfig, setLocalConfig] = useState<GlobalConfig>(config);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        await saveGlobalConfig(localConfig);
        setIsSaving(false);
        alert('設定を保存しました');
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Logging</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            ログ保存の設定を行います。
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2 space-y-4">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="logging_req"
                                    name="logging_req"
                                    type="checkbox"
                                    checked={localConfig.logging.request}
                                    onChange={(e) => setLocalConfig({ ...localConfig, logging: { ...localConfig.logging, request: e.target.checked } })}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="logging_req" className="font-medium text-gray-700">Request Logging</label>
                                <p className="text-gray-500">受信したリクエストをログに保存します。</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="logging_res"
                                    name="logging_res"
                                    type="checkbox"
                                    checked={localConfig.logging.response}
                                    onChange={(e) => setLocalConfig({ ...localConfig, logging: { ...localConfig.logging, response: e.target.checked } })}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="logging_res" className="font-medium text-gray-700">Response Logging</label>
                                <p className="text-gray-500">応答したレスポンスをログに保存します。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-8">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Data Management</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            設定のバックアップと復元。
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2 space-y-4">
                        <div>
                            <a
                                href="/api/settings/export"
                                target="_blank"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Download Config (JSON)
                            </a>
                            <p className="mt-2 text-xs text-gray-500">現在の設定（エンドポイント、グローバル設定）をダウンロードします。</p>
                        </div>
                        {/* Import not implemented yet */}
                    </div>
                </div>
            </div>
        </div>
    );
}
