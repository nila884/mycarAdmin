import { Head, router } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import PermissionList from '@/components/management/role/permissionList';
import RoleForm from '@/components/management/role/roleForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import Layout from '@/layouts/management/layout';
import { timeFormat } from '@/lib/utils'; // Import the timeFormat function
import { PermissionItem } from '@/pages/management/permission/permission';
import { X } from 'lucide-react';

export interface RoleItem {
    id: number;
    name: string;
    permissions: PermissionItem[];
    created_at: string;
    updated_at: string;
}

interface RoleProps {
    roles: {
        data: RoleItem[];
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
    permissions: PermissionItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role settings',
        href: '/management/role/list',
    },
];

// Update the component to accept props
export default function role({ roles, permissions }: RoleProps) {
    // Destructure roles from props

    console.log(roles.data);

    function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this role?')) return;

        router.delete(`/management/role/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // optional: toast or reload logic
            },
        });
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role settings" />

            <Layout>
                <div className="space-y-6">
                    <HeadingSmall title="Rrole settings" description="Add new ,Update and delete roles name" />

                    <RoleForm permissions={permissions} />
                    <div className="rounded-md border">
                        <Table className="max-w-3xl">
                            <TableCaption>A list of roles.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">role name</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead>Created at</TableHead>
                                    <TableHead>Last update</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Map over the roles data to render table rows */}
                                {roles.data.length > 0 ? (
                                    roles.data.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell className="font-medium">{role.name.toUpperCase()}</TableCell>
                                            <TableCell className="flex flex-wrap gap-2">
                                                {role.permissions.length === 0 ? (
                                                    <Badge variant="secondary">no permission</Badge>
                                                ) : (
                                                    <PermissionList permissions={role.permissions} />
                                                )}
                                            </TableCell>
                                            <TableCell>{timeFormat(role.created_at)}</TableCell>
                                            <TableCell>{timeFormat(role.updated_at)}</TableCell>
                                            <TableCell className="text-right">
                                                {/* <UpdateFeature feature={feature} />  */}
                                                <RoleForm role={role} permissions={permissions} />
                                                <Button className="ml-2" size="icon" variant="destructive" onClick={() => handleDelete(role.id)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No role found.
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
