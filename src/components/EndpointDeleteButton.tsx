'use client';

import { deleteEndpoint } from '@/app/actions';
import { useTransition } from 'react';

export default function EndpointDeleteButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => startTransition(() => deleteEndpoint(id))}
            disabled={isPending}
            className="text-red-600 hover:text-red-900 ml-4 text-sm"
        >
            {isPending ? 'Deleting...' : 'Delete'}
        </button>
    );
}
