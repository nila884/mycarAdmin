import { Head, router } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import ModuleForm from '@/components/management/module/moduleForm';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import Layout from '@/layouts/management/layout';
import { timeFormat } from '@/lib/utils'; // Import the timeFormat function
import { X } from 'lucide-react';

export interface ModuleItem {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface ModuleProps {
    modules: {
        data: ModuleItem[];
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
        title: 'Module  settings',
        href: '/management/module/list',
    },
];

// Update the component to accept props
export default function module({ modules }: ModuleProps) {
    // Destructure modules from props

    function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this module?')) return;

        router.delete(route('management.modules.destroy',id), {
            preserveScroll: true,
            onSuccess: () => {
                // optional: toast or reload logic
            },
        });
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Module settings" />

            <Layout>
                <div className="space-y-6">
                    <HeadingSmall title="Module settings" description="Add new ,Update and delete modules name" />

                    <ModuleForm />
                    <div className="rounded-md border">
                        <Table className="max-w-3xl">
                            <TableCaption>A list of module.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">module name</TableHead>
                                    <TableHead>Created at</TableHead>
                                    <TableHead>Last update</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Map over the modules data to render table rows */}
                                {modules.data.length > 0 ? (
                                    modules.data.map((module) => (
                                        <TableRow key={module.id}>
                                            <TableCell className="font-medium">{module.name.toUpperCase()}</TableCell>
                                            <TableCell>{timeFormat(module.created_at)}</TableCell>
                                            <TableCell>{timeFormat(module.updated_at)}</TableCell>
                                            <TableCell className="text-right">
                                                {/* <UpdateFeature feature={feature} />  */}
                                                <ModuleForm module={module} />
                                                <Button className="ml-2" size="icon" variant="destructive" onClick={() => handleDelete(module.id)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No module found.
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
