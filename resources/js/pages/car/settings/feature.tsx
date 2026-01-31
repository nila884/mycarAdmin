import { Head, router } from '@inertiajs/react'; // Import router for delete
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button'; // Import Button for delete action
import { type BreadcrumbItem } from '@/types';
import { X } from 'lucide-react'; // Assuming X icon for delete

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { timeFormat } from '@/lib/utils'; // Assuming you have this utility
import FeatureForm from '@/components/car/settings/feature/featureForm';

// Define types for FeatureItem
interface FeatureItem {
    id: number;
    feature_name: string;
    description: string;
    is_main: boolean;
    icon: string | null; // icon can be null
    created_at: string;
    updated_at: string;
}

interface FeatureProps {
    features: {
        data: FeatureItem[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car Feature settings',
        href: 'car.settings.feature',
    },
];

export default function Feature({ features }: FeatureProps) {
    function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this feature?')) return;

        router.delete(route('car.settings.feature.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                // optional: toast or reload logic
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feature settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car Feature settings" description="Add new, Update and delete car features name" />

                    <FeatureForm />

                    <Table className="min-w-full">
                        <TableCaption>A list of car Features.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">icon</TableHead>
                                <TableHead className="w-[150px]">Feature Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Last Update</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {features.data.length > 0 ? (
                                features.data.map((feature) => (
                                    <TableRow key={feature.id}>
                                        <TableCell>
                                            {feature.icon ? (
                                                <img src={feature.icon} alt={feature.feature_name} className="h-10 w-10 rounded object-cover" />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
                                                    No icon
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{feature.feature_name.toUpperCase()}</TableCell>
                                        <TableCell className="text-sm text-gray-600">{feature.description}</TableCell>
                                        <TableCell>{timeFormat(feature.created_at)}</TableCell>
                                        <TableCell>{timeFormat(feature.updated_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <FeatureForm feature={feature} />
                                                <Button className="ml-2" size="icon" variant="destructive" onClick={() => handleDelete(feature.id)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        No car features found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {features.links && features.links.length > 3 && (
                        <div className="mt-4 flex justify-center">
                            <nav className="flex rounded-md shadow" aria-label="Pagination">
                                {features.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                                            link.active
                                                ? 'z-10 border-indigo-500 bg-indigo-50 text-indigo-600'
                                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                        } ${index === 0 ? 'rounded-l-md' : ''} ${index === features.links.length - 1 ? 'rounded-r-md' : ''} `}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </CarSettingLayout>
        </AppLayout>
    );
}
