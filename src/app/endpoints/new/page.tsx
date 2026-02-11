import { createEndpoint } from '@/app/actions';

export default function NewEndpointPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">新規エンドポイント作成</h1>
            <form action={createEndpoint} className="bg-white shadow rounded-lg p-6 space-y-4">
                <div>
                    <label htmlFor="path" className="block text-sm font-medium text-gray-700">詳細パス (Path)</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            /
                        </span>
                        <input
                            type="text"
                            name="path"
                            id="path"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="api/users/[id]"
                            required
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        先頭の / は自動で付与されます。パラメータは <code>[param]</code> の形式で指定できますが、現在は完全一致のみサポートしています。
                        (TODO: Dynamic Route matching support)
                    </p>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">説明 (Description)</label>
                    <textarea
                        name="description"
                        id="description"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        作成
                    </button>
                </div>
            </form>
        </div>
    );
}
