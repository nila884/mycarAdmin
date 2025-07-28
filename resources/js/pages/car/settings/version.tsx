import { Head, router } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import Create from '@/components/car/settings/version/create'; // Ensure this path is correct
import UpdateVersion from '@/components/car/settings/version/update'; // Will create this component
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; // Assuming X icon for delete
import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { timeFormat } from '@/lib/utils'; // Assuming you have this utility

// Define types for VersionItem and ModelItem
interface VersionItem {
    id: number;
    car_model_id: number;
    car_model_name: string; 
    version_name: string;
    version_year: string;
    created_at: string;
    updated_at: string;
}

interface ModelItem {
    id: number;
    model_name: string;
}

interface VersionProps {
    versions: {
        data: VersionItem[];
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
    carModels: ModelItem[]; // Pass car models to the page for Create/Update forms
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car version settings',
        href: '/car/settings/version',
    },
];

export default function Version({ versions, carModels }: VersionProps) {
    function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this version?')) return;

        router.delete(route('carversion.destroy', id), {
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
            <Head title="Version settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car Version settings" description="Add new, Update and delete car Versions" />

                    <Create models={carModels} /> 

                    <Table className="min-w-full">
                        <TableCaption>A list of your car versions.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Version Name</TableHead>
                                <TableHead>Model Name</TableHead>
                                <TableHead>Version Year</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Last Update</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {versions.data.length > 0 ? (
                                versions.data.map((version) => (
                                    <TableRow key={version.id}>
                                        <TableCell className="font-medium">{version.version_name.toUpperCase()}</TableCell>
                                        <TableCell>{version.car_model_name.toUpperCase()}</TableCell> 
                                        <TableCell>{version.version_year}</TableCell>
                                        <TableCell>{timeFormat(version.created_at)}</TableCell>
                                        <TableCell>{timeFormat(version.updated_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <UpdateVersion version={version} models={carModels} />
                                                <Button
                                                    className='ml-2'
                                                    variant="destructive"
                                                    onClick={() => handleDelete(version.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        No car versions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {/* Add Pagination if needed */}
                    {versions.links && versions.links.length > 3 && ( // Check if pagination links exist
                        <div className="flex justify-center mt-4">
                            <nav className="flex rounded-md shadow" aria-label="Pagination">
                                {versions.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                            ${link.active
                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                            }
                                            ${index === 0 ? 'rounded-l-md' : ''}
                                            ${index === versions.links.length - 1 ? 'rounded-r-md' : ''}
                                        `}
                                        dangerouslySetInnerHTML={{ __html: link.label }} // Render HTML entities like &laquo;
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