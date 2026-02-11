'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { repository } from '@/lib/store';
import { EndpointConfig, GlobalConfig } from '@/types';

export async function getEndpoints() {
    return repository.getEndpoints();
}

export async function createEndpoint(formData: FormData) {
    const path = formData.get('path') as string;
    const description = formData.get('description') as string;

    if (!path) {
        // Since we are not using useFormState/useActionState yet, we cannot easily return error to UI.
        // For now, redirect or throw. Redirecting to new with error query param is option, 
        // but simplest for this MVP fix is just to proceed or throw.
        // Let's just return, which does nothing but stop execution.
        return;
    }

    const newEndpoint: EndpointConfig = {
        id: crypto.randomUUID(),
        path,
        description,
        methods: {
            GET: { enabled: true, responseSets: [], mode: 'default', conditions: [] },
            POST: { enabled: false, responseSets: [], mode: 'default', conditions: [] },
            PUT: { enabled: false, responseSets: [], mode: 'default', conditions: [] },
            DELETE: { enabled: false, responseSets: [], mode: 'default', conditions: [] },
        }
    };

    await repository.saveEndpoint(newEndpoint);
    revalidatePath('/');
    redirect('/');
}

export async function deleteEndpoint(id: string) {
    await repository.deleteEndpoint(id);
    revalidatePath('/');
}

export async function updateEndpoint(config: EndpointConfig) {
    await repository.saveEndpoint(config);
    revalidatePath('/');
    revalidatePath(`/endpoints/${config.id}`);
}

export async function getGlobalConfig() {
    return repository.getGlobalConfig();
}

export async function saveGlobalConfig(config: GlobalConfig) {
    await repository.saveGlobalConfig(config);
    revalidatePath('/settings');
}

export async function clearLogs() {
    await repository.clearLogs();
    revalidatePath('/logs');
}
