'use client';

import { ResponseCondition, ResponseSet } from '@/types';

interface ConditionListProps {
    conditions: ResponseCondition[];
    responseSets: ResponseSet[];
    onChange: (conditions: ResponseCondition[]) => void;
}

export default function ConditionList({ conditions, responseSets, onChange }: ConditionListProps) {
    const addCondition = () => {
        const newCondition: ResponseCondition = {
            target: 'header',
            key: '',
            value: '',
            responseSetId: responseSets[0]?.id || '',
        };
        onChange([...conditions, newCondition]);
    };

    const updateCondition = (index: number, updates: Partial<ResponseCondition>) => {
        const newConditions = [...conditions];
        newConditions[index] = { ...newConditions[index], ...updates };
        onChange(newConditions);
    };

    const removeCondition = (index: number) => {
        const newConditions = [...conditions];
        newConditions.splice(index, 1);
        onChange(newConditions);
    };

    if (responseSets.length === 0) {
        return <div className="text-sm text-gray-500">条件を設定するには、まずレスポンスセットを作成してください。</div>;
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Conditions</label>
                <button
                    type="button"
                    onClick={addCondition}
                    className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                >
                    + Add Condition
                </button>
            </div>

            {conditions.length === 0 && (
                <p className="text-sm text-gray-500 italic">No conditions defined.</p>
            )}

            {conditions.map((condition, idx) => (
                <div key={idx} className="flex gap-2 items-start border p-2 rounded bg-gray-50">
                    <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                            <select
                                value={condition.target}
                                onChange={(e) => updateCondition(idx, { target: e.target.value as any })}
                                className="block w-24 border-gray-300 rounded-md shadow-sm sm:text-xs"
                            >
                                <option value="header">Header</option>
                                <option value="body">Body</option>
                                <option value="query">Query</option>
                            </select>
                            <input
                                type="text"
                                value={condition.key}
                                onChange={(e) => updateCondition(idx, { key: e.target.value })}
                                placeholder="Key"
                                className="block flex-1 border-gray-300 rounded-md shadow-sm sm:text-xs"
                            />
                            <span className="self-center">=</span>
                            <input
                                type="text"
                                value={condition.value}
                                onChange={(e) => updateCondition(idx, { value: e.target.value })}
                                placeholder="Value"
                                className="block flex-1 border-gray-300 rounded-md shadow-sm sm:text-xs"
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <span className="text-xs text-gray-500">Response:</span>
                            <select
                                value={condition.responseSetId}
                                onChange={(e) => updateCondition(idx, { responseSetId: e.target.value })}
                                className="block flex-1 border-gray-300 rounded-md shadow-sm sm:text-xs"
                            >
                                <option value="">Select Response Set</option>
                                {responseSets.map(set => (
                                    <option key={set.id} value={set.id}>{set.name} ({set.statusCode})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeCondition(idx)}
                        className="text-red-500 text-xs mt-1"
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}
