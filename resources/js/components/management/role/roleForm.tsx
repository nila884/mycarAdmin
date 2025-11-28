// src/components/management/role/roleForm.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import React, { useState } from 'react';
import { RoleItem } from '@/pages/management/role/role';
import { PermissionItem } from '@/pages/management/permission/permission';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming you have a Checkbox component

// Define the base type for data that the server expects
type RoleFormData = {
    name: string;
    // CRITICAL: Array of permission IDs (must be string array for form data initialization)
    permission: string[];
    _method?: 'patch';
};

interface RoleFormProps {
    role?: RoleItem; // Optional: presence defines 'update' mode
    permissions: PermissionItem[]; // All available permissions
}

const RoleForm: React.FC<RoleFormProps> = ({ role, permissions }) => {
    const [open, setOpen] = useState(false);
    const isUpdate = !!role;
    const title = isUpdate ? `Update ${role?.name}` : 'Create New Role';
    const routeName = isUpdate ? 'role.update' : 'role.store';
    const submitText = isUpdate ? 'Update Role' : 'Create Role';

    // CRITICAL: Initialize data with existing permissions if updating
    const { data, setData, post, patch, processing, errors } = useForm<RoleFormData>({
        name: role?.name || "",
        // Initialize permission array with IDs from the role object (converted to string)
        permission: isUpdate ? role!.permissions.map(p => p.id.toString()) : [],
        _method: isUpdate ? 'patch' : undefined,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use post for create, put for update
        const submitMethod = isUpdate ? patch : post;

        submitMethod(route(routeName, { role: role?.id }), {
            onSuccess: () => {
                setOpen(false);
            },
            onError: (errors) => {
                console.error('Submission error:', errors);
            },
        });
    };

    // Helper function to handle checkbox state
    const handlePermissionChange = (permissionId: number, isChecked: boolean) => {
        setData(prevData => {
            let newPermissions = [...prevData.permission];
            const idString = permissionId.toString();

            if (isChecked) {
                // Add ID if checked and not already present
                if (!newPermissions.includes(idString)) {
                    newPermissions.push(idString);
                }
            } else {
                // Remove ID if unchecked
                newPermissions = newPermissions.filter(id => id !== idString);
            }
            return {
                ...prevData,
                permission: newPermissions,
            };
        });
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? 'ghost' : 'outline'} size={isUpdate ? 'icon' : 'default'}>
                    {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add New'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Input 
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing} 
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* CRITICAL: Permission Checkbox Group */}
                    <div className="grid gap-2 p-4 border rounded-lg bg-gray-50 max-h-96 overflow-y-auto">
                        <Label className="text-lg font-semibold mb-2">Assign Permissions</Label>
                        <InputError message={errors.permission} />
                        
                        {/* Using a responsive grid for the list of permissions */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`perm-${permission.id}`} 
                                        // Check if the permission ID is in the data.permission array
                                        checked={data.permission.includes(permission.id.toString())}
                                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                                        disabled={processing}
                                    />
                                    <Label htmlFor={`perm-${permission.id}`} className="cursor-pointer text-sm font-medium leading-none">
                                        {permission.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" disabled={processing || !data.name} className="w-full">
                        {processing ? 'Submitting...' : submitText}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RoleForm;