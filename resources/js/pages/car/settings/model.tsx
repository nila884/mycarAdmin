// model.tsx
import { Head, router } from '@inertiajs/react'; // Import router for delete

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import Create from '@/components/car/settings/model/create'; // Import Create component
import UpdateModel from '@/components/car/settings/model/update'; // Will create this component
import { Button } from '@/components/ui/button'; // Import Button for delete action

import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { timeFormat } from '@/lib/utils'; // Assuming you have this utility
import { X } from 'lucide-react';

// Define types for CarModel and Brand
interface CarModelItem {
    id: number;
    model_name: string;
    brand_id: number;
    brand_name: string; // Include brand_name for display
    created_at: string;
    updated_at: string;
}

interface BrandItem {
    id: number;
    brand_name: string;
}

interface ModelProps {
    models: {
        data: CarModelItem[];
        // Add other pagination properties if Index() returns paginated data
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
    brands: BrandItem[]; // Pass brands to the page for Create/Update forms
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car model settings',
        href: '/car/settings/model',
    },
];

// Update the component to accept props
export default function Model({ models, brands }: ModelProps) {
    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this car model?')) {
            return;
        }
        router.delete(route('carmodel.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally show a success message
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Model settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car Model settings" description="Add new, Update and delete car Models name" />

                    <Create brands={brands} /> 

                    <Table className="min-w-full">
                        <TableCaption>A list of your car model.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Model Name</TableHead>
                                <TableHead>Brand Name</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Last Update</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {models.data.length > 0 ? (
                                models.data.map((model) => (
                                    <TableRow key={model.id}>
                                        <TableCell className="font-medium">{model.model_name.toUpperCase()}</TableCell>
                                        <TableCell>{model.brand_name.toUpperCase()}</TableCell> 
                                        <TableCell>{timeFormat(model.created_at)}</TableCell>
                                        <TableCell>{timeFormat(model.updated_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <UpdateModel model={model} brands={brands} /> 
                                                <Button
                                                    className='ml-2'
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(model.id)}
                                                >
                                                   <X/>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        No car models found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {/* Add Pagination if needed */}
                    {models.links && models.links.length > 3 && ( // Check if pagination links exist
                        <div className="flex justify-center mt-4">
                            <nav className="flex rounded-md shadow" aria-label="Pagination">
                                {models.links.map((link, index) => (
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
                                            ${index === models.links.length - 1 ? 'rounded-r-md' : ''}
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