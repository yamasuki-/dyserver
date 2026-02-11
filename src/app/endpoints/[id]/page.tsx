import { repository } from '@/lib/store';
import EndpointEditor from '@/components/EndpointEditor';
import Link from 'next/link';

export default async function EditEndpointPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const endpoint = await repository.getEndpoint(params.id);

    if (!endpoint) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold">Endpoint not found</h1>
                <Link href="/" className="text-blue-600 underline">Return to list</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Edit Endpoint</h1>
                <Link href="/" className="text-gray-500 hover:text-gray-700">Back</Link>
            </div>
            <EndpointEditor endpoint={endpoint} />
        </div>
    );
}
