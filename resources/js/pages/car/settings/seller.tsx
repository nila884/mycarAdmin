
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { timeFormat } from '@/lib/utils';
import { X } from 'lucide-react';
import { CountryObject, Seller as SellerObject} from '@/lib/object';
import SellerForm from '@/components/car/settings/seller/sellerForm';

interface SellerProps {
    sellers: SellerObject[]; 
    countries: CountryObject[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car seller settings',
        href: '/car/settings/seller',
    },
];

export default function Seller({ sellers,countries }: SellerProps) {
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
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seller settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car seller settings" description="Add new, update, and delete car sellers" />

                    <SellerForm countries={countries} />

                    <Table>
                        <TableCaption>A list of car sellers.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Seller Name</TableHead>
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
                                        <TableCell>{seller.phone}</TableCell>
                                        <TableCell>{seller.address}</TableCell>
                                        <TableCell>{seller.country}</TableCell>
                                        <TableCell>{timeFormat(seller.created_at)}</TableCell>
                                        <TableCell>{timeFormat(seller.updated_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <SellerForm countries={countries} seller={seller} />
                                                <Button className="ml-2" size="icon" variant="destructive" onClick={() => handleDelete(seller.id)}>
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
