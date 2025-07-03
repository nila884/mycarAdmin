import { Head, router } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import Create from '@/components/car/settings/seller/create';
import Update from '@/components/car/settings/seller/update'; // Ensure this path is correct

import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { timeFormat } from '@/lib/utils'; // Assuming you have a timeFormat utility
import { X } from 'lucide-react'; // For the delete icon

// Define the type for a single seller item, matching the transformed data from SellerService
interface SellerItem {
    id: number;
    seller_name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    created_at: string;
    updated_at: string;
}

// Define the props for the seller component
interface SellerProps {
    sellers: SellerItem[]; // Array of seller items passed from backend
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car seller settings',
        href: '/car/settings/seller',
    },
];

export default function Seller({ sellers }: SellerProps) {

    function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this seller?')) return;

        router.delete(`/car/settings/seller/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Seller deleted successfully!');
            },
            onError: (errors) => {
                console.error('Error deleting seller:', errors);
                alert('Failed to delete seller. Please try again.'); // Basic error feedback
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seller settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car seller settings" description="Add new, update, and delete car sellers" />

                    <Create />

                    <Table>
                        <TableCaption>A list of car sellers.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Seller Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead>Last update</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sellers.length > 0 ? (
                                sellers.map((seller) => (
                                    <TableRow key={seller.id}>
                                        <TableCell className="font-medium">{seller.seller_name}</TableCell>
                                        <TableCell>{seller.email}</TableCell>
                                        <TableCell>{seller.phone}</TableCell>
                                        <TableCell>{seller.address}</TableCell>
                                        <TableCell>{seller.country}</TableCell>
                                        <TableCell>{timeFormat(seller.created_at)}</TableCell>
                                        <TableCell>{timeFormat(seller.updated_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Update seller={seller} /> 
                                                <Button
                                                    className='ml-2'
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(seller.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">
                                        No sellers found.
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