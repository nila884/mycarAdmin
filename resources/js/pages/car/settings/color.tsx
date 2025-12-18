import { Head, router } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Layout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { timeFormat } from '@/lib/utils'; // Import the timeFormat function
import {  X } from 'lucide-react';
import ColorForm from '@/components/car/settings/color/colorForm';


export interface ColorItem {
    id: number;
    name: string;
    hex_code:string;
    created_at: string;
    updated_at: string;
}

interface colorProps {
    colors:{
        data: ColorItem[];
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
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'color  settings',
        href: '/management/color/list',
    },
];

// Update the component to accept props
export default function color({ colors }: colorProps) { 
console.log(colors);

    
  function handleDelete(id: number) {
  if (!window.confirm('Are you sure you want to delete this color?')) return;

  router.delete(route('color.destroy', id), {
    preserveScroll: true,
    onSuccess: () => {
      

    },
  });
}
  return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Color settings" />

            <Layout>
                <div className="space-y-6">
                    <HeadingSmall title="Color settings" description="Add new ,Update and delete colors name" />
                    <ColorForm />
    <div className="rounded-md border">
                    <Table className=" max-w-3xl">
                        <TableCaption>A list of color.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Color name</TableHead>
                                <TableHead className="w-[100px]">Hex code</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead>Last update</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Map over the colors data to render table rows */}
                            {colors.data.length > 0 ? (
                                colors.data.map((color) => (
                                    <TableRow key={color.id}>
                                        <TableCell className="font-medium">{color.name.toUpperCase()}</TableCell>
                                        <TableCell className="font-medium">{color.hex_code?.toUpperCase()}</TableCell>
                                        <TableCell>{timeFormat(color.created_at)}</TableCell>
                                        <TableCell>{timeFormat(color.updated_at)}</TableCell>
                                                                            <TableCell className="text-right">
                                                   {/* <UpdateFeature feature={feature} />  */}
                                                   <ColorForm  color={color} />
                                                <Button
                                                    className='ml-2'
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(color.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
      
                                         </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No color found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    </div>
                </div>
            </Layout>
        </AppLayout>
    );
}