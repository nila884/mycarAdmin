import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import Create from '@/components/car/settings/category/create';
import Update from '@/components/car/settings/category/update';

import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define the type for a single category item
interface CategoryItem {
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
export default function category({ categories }: CategoryProps) { // Destructure categories from props
  console.log(categories); // Log categories to check if data is passed correctly  

  return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Car Category settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car category settings" description="Add new ,Update and delete car categories name" />

                    <Create />

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
                                        <TableCell className="font-medium">{category.category_name}</TableCell>
                                        <TableCell>{category.created_at}</TableCell>
                                        <TableCell>{category.updated_at}</TableCell>
                                                                            <TableCell className="text-right">
                                            {/* Render the EditCategory component for each row */}
                                            <Update category={category} />
                                            {/* You can add a delete button here too */}
                                            {/* <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>Delete</Button> */}
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