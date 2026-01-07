import { Head, router } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { timeFormat } from '@/lib/utils'; // Import the timeFormat function
import { X } from 'lucide-react';
import CategoryForm from '@/components/car/settings/category/categoryForm';

// Define the type for a single category item
export interface CategoryItem {
    id: number;
    category_name: string;
    created_at: string;
    updated_at: string;
}

// Define the props for the Category component
interface CategoryProps {
    categories: CategoryItem[]; // Array of category items passed from backend
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car category settings',
        href: '/car/settings/category',
    },
];

// Update the component to accept props
export default function category({ categories }: CategoryProps) {
    // Destructure categories from props

    function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        router.delete(`/car/settings/category/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // optional: toast or reload logic
            },
        });
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Car Category settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car category settings" description="Add new ,Update and delete car categories name" />

                    <CategoryForm />

                    <Table className="min-w-2xl">
                        <TableCaption>A list of car category.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Category name</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead>Last update</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Map over the categories data to render table rows */}
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.category_name.toUpperCase()}</TableCell>
                                        <TableCell>{timeFormat(category.created_at)}</TableCell>
                                        <TableCell>{timeFormat(category.updated_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <CategoryForm category={category} />
                                            <Button className="ml-2" size="icon" variant="destructive" onClick={() => handleDelete(category.id)}>
                                                <X />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CarSettingLayout>
        </AppLayout>
    );
}
