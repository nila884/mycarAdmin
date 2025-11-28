import { Head, router } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import Layout from '@/layouts/management/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { timeFormat } from '@/lib/utils';
import PermissionForm from '@/components/management/permission/permissionForm';
import { ModuleItem } from '../module/module';
import { X } from 'lucide-react';


export interface PermissionItem {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

interface PermissionProps {
    permissions:{
        data: PermissionItem[];
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
    modules: ModuleItem[];
    actions: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permission settings',
        href: '/management/permission/list',
    },
];

// Update the component to accept props
export default function Permission({ permissions,actions,modules }: PermissionProps) { // Destructure permissions from props

console.log(permissions);

   
        
  function handleDelete(id: number) {
  if (!window.confirm('Are you sure you want to delete this permission? '+id)) return;

  router.delete(`/management/permission/${id}`, {
    preserveScroll: true,
    onSuccess: () => {
      // optional: toast or reload logic
    },
  });
}
  return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permission settings" />

            <Layout>
                <div className="space-y-6">
                    <HeadingSmall title="Permission settings" description="Add new ,Update and delete permissions name" />

                    <PermissionForm actions={actions} modules={modules}/>
    <div className="rounded-md border">
                    <Table className=" max-w-4xl">
                        <TableCaption>A list of permissions.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">permission name</TableHead>
                                <TableHead> Guard name </TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead>Last update</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Map over the permissions data to render table rows */}
                            {permissions.data.length > 0 ? (
                                permissions.data.map((permission) => (
                                    <TableRow key={permission.id}>
                                        <TableCell className="font-medium">{permission.name.toUpperCase()}</TableCell>
                                        <TableCell className="font-medium">{permission.guard_name}</TableCell>
                                        <TableCell>{timeFormat(permission.created_at)}</TableCell>
                                        <TableCell>{timeFormat(permission.updated_at)}</TableCell>
                                                                            <TableCell className="text-right">
                                                   {/* <UpdateFeature feature={feature} />  */}
                                                   <PermissionForm  permission={permission} actions={actions} modules={modules} />
                                                <Button
                                                    className='ml-2'
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(permission.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
      
                                         </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No permission found.
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