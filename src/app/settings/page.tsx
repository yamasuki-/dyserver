import { repository } from '@/lib/store';
import SettingsForm from '@/components/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const config = await repository.getGlobalConfig();

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-2xl font-bold mb-6">全体設定</h1>
            <SettingsForm config={config} />
        </div>
    );
}
