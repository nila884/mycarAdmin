import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModuleItem } from '@/pages/management/module/module';
import { useForm } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Define the base type for data that the server expects
type moduleFormData = {
    name: string;
};

// Define the full Inertia form type
type ModuleInertiaForm = moduleFormData & {
    _method?: 'patch';
};

interface ModuleFormProps {
    module?: ModuleItem; // Optional: presence defines 'update' mode
}

const ModuleForm: React.FC<ModuleFormProps> = ({ module }) => {
    const isUpdate = !!module;
    const title = isUpdate ? `Update ${module?.name}` : 'Create New module';
    const routeName = isUpdate ? 'module.update' : 'module.store';
    const submitText = isUpdate ? 'Update module' : 'Create module';

    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors} = useForm<ModuleInertiaForm>({
        _method: isUpdate ? 'patch' : undefined,
        name: isUpdate ? module!.name : '',
    });

    // Reset form state when dialog opens/closes
    useEffect(() => {
        if (open) {
            setData({
                _method: isUpdate ? 'patch' : undefined,
                name: isUpdate ? module!.name : '',
            });
        }
    }, [open, isUpdate, module, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use POST with forceFormData for file upload, Inertia handles PATCH spoofing
        const routeParams = isUpdate ? [module!.id] : [];

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
                    {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add New module'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* module Name */}
                    <div>
                        <Label htmlFor="module_name">module Name</Label>
                        <Input id="module_name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>
                    <Button type="submit" disabled={processing || !data.name} className="w-full">
                        {processing ? 'Submitting...' : submitText}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ModuleForm;
