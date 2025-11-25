// src/components/car/settings/permission/permissionForm.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { ImagePlus, XCircle, Pencil } from 'lucide-react';
import React, { useState, useCallback, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { PermissionItem } from '@/pages/management/permission/permission';

// Define the base type for data that the server expects
type PermissionFormData = {
    name: string;
    guard_name: string;

};

// Define the full Inertia form type
type PermissionInertiaForm = PermissionFormData & {
    _method?: 'patch';
};



interface permissionFormProps {
    permission?: PermissionItem // Optional: presence defines 'update' mode
    actions?: String[];
    modules?: String[];
}

const permissionForm: React.FC<permissionFormProps> = ({ permission }) => {
    const isUpdate = !!permission;
    const title = isUpdate ? `Update ${permission?.name}` : 'Create New permission';
    const routeName = isUpdate ? 'permission.update' : 'permission.store';
    const submitText = isUpdate ? 'Update permission' : 'Create permission';

    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<PermissionInertiaForm>({
        _method: isUpdate ? 'patch' : undefined,
        name: isUpdate ? permission!.name : "",
        guard_name: isUpdate ? permission!.guard_name : "",
      
    });

    // Reset form state when dialog opens/closes
    useEffect(() => {
        if (open) {
            setData({
                _method: isUpdate ? 'patch' : undefined,
                name: isUpdate ? permission!.name : "",
                guard_name: isUpdate ? permission!.guard_name : "",
              
            });
        }
    }, [open, isUpdate, permission, setData]);





    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use POST with forceFormData for file upload, Inertia handles PATCH spoofing
        const routeParams = isUpdate ? [permission!.id] : [];
        
        post(route(routeName, ...routeParams), {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
                    {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add New permission'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription/>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* permission Name */}
                    <div>
                        <Label htmlFor="permission_name">permission Name</Label>
                        <Input
                            id="permission_name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>
                            <div>
                        <Label htmlFor="guard name">Guard Name</Label>
                        <Input
                            id="guard_name"
                            value={data.name}
                            onChange={(e) => setData('guard_name', e.target.value)}
                        />
                        <InputError message={errors.guard_name} />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Submitting...' : submitText}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default permissionForm;