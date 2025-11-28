// src/components/car/settings/permission/permissionForm.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { parseInitialPermissions } from '@/utils/util';
import { ModuleItem } from '@/pages/management/module/module';


// --- TYPE DEFINITIONS (Ensure these match your actual data structures) ---

// Define the type for data that the server expects
type PermissionFormData = {
    module: string; // The selected module ID
    actions: string[] // Array of checked actions (e.g., ['create', 'view'])
};

// Define the full Inertia form type
type PermissionInertiaForm = PermissionFormData & {
    _method?: 'patch';
};

// Define the Permission item received from the backend (for update mode)
interface PermissionItem {
    id: number;
    name: string; // e.g., "create user"
    guard_name: string;
}


interface permissionFormProps {
    permission?: PermissionItem // Optional: presence defines 'update' mode
    actions?: string[]; // Available CRUD actions: ['create', 'view', 'update', 'delete']
    modules?: ModuleItem[]; // Available modules
}

// ------------------------------------------------------------------------


const permissionForm: React.FC<permissionFormProps> = ({ permission, actions, modules }) => {
    const [open, setOpen] = useState(false);
    const isUpdate = !!permission;
    const title = isUpdate ? `Update ${permission?.name}` : 'Create New permission';
    
    // Define the Inertia route name and HTTP method
    let routeName: string;
    let submitText: string;
    if (isUpdate) {
        routeName = 'permission.update'; 
        submitText = 'Update Permission';
    } else {
        routeName = 'permission.store'; 
        submitText = 'Create Permission';
    }

    // Initialize Inertia form
    const { data, setData, post, patch, processing, errors, reset } = useForm<PermissionInertiaForm>({
        module: "", 
        actions: [], 
    });

    // Local state to manage which checkboxes are checked (for UI control)
    const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

    // Handler to update both the local checkbox state and the Inertia form data
    const handleActionCheckedChange = (action: string, isChecked: boolean) => {
        
        // 1. Update local UI state
        setCheckedActions(prev => ({
            ...prev,
            [action]: isChecked, 
        }));
        
        // 2. Update Inertia form state (data.actions) by computing a new array and passing it directly
        const currentActions = data.actions || []; // Read current value from the form
        let newActions: string[];
        if (isChecked && !currentActions.includes(action)) {
            newActions = [...currentActions, action]; // Add action
        } else if (!isChecked && currentActions.includes(action)) {
            newActions = currentActions.filter(a => a !== action); // Remove action
        } else {
            newActions = currentActions; // No change needed
        }
        setData('actions', newActions);
    };

    // --- EFFECT HOOK FOR INITIALIZING UPDATE DATA ---
    useEffect(() => {
        if (isUpdate && permission && modules && actions) {
            
            // 1. Parse the existing permission name
            const { initialModuleId, initialActions } = parseInitialPermissions(
                permission, 
                modules, 
                actions
            );
            
            // 2. Set the Inertia form data
            setData({
                module: initialModuleId,
                actions: initialActions,
                _method: 'patch',
            });
            
            // 3. Set the local state for Checkbox display
            const initialCheckedState: Record<string, boolean> = {};
            actions.forEach(action => {
                 initialCheckedState[action] = initialActions.includes(action);
            });
            setCheckedActions(initialCheckedState);
            
        } else if (!isUpdate) {
             // Reset state for create mode
             reset();
             setCheckedActions({});
        }
    }, [isUpdate, permission, modules, actions]); // Dependencies trigger on component load/prop changes
    
    // --- SUBMISSION HANDLER ---
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        
        // The permission ID is required for the PATCH route
        const routeParams = isUpdate ? { permission: permission!.id } : undefined;

        if (isUpdate) {
            patch(route(routeName, routeParams), {
                onSuccess: () => { setOpen(false); reset() },
                onError: (errors) => { console.error('Update error:', errors); },
            });
        } else {
            post(route(routeName), { 
                onSuccess: () => { 
                    reset(); 
                    setCheckedActions({}); // Also reset local state
                },
                onError: (errors) => { console.error('Create error:', errors); },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isUpdate ? (
                    <Button variant="ghost" size="icon" title={`Edit ${permission.name}`}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button variant="outline">Add New</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {isUpdate ? 'Modify the module and actions for this permission.' : 'Define a new permission by selecting a module and actions.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6">
                    
                    {/* Module Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="module"> Module</Label>
                        <Select
                            value={data.module}
                            onValueChange={(value) => setData('module', value)}
                            disabled={processing} 
                        >
                            <SelectTrigger id="module">
                                <SelectValue placeholder="Select a module" />
                            </SelectTrigger>
                            <SelectContent>
                                {modules?.map(module => (
                                    <SelectItem key={module.id} value={module.id.toString()}>
                                        {module.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.module} />
                    </div>
          
                    {/* Actions Checkbox Grid */}
                    <div className="grid grid-cols-4 gap-4 justify-center p-2 border rounded-md">
                        <div className="col-span-4 text-sm font-semibold mb-2">Select Actions (CRUD)</div>
                        {actions?.map((action, key) => (
                            <div key={key} className="flex flex-col items-center gap-3">
                                 <Label htmlFor={action} className="capitalize text-sm">{action}</Label>
                                  <Checkbox 
                                    id={action} 
                                    // CRITICAL: Set the checked prop from the local state
                                    checked={checkedActions[action] || false} 
                                    onCheckedChange={(checked: boolean) => {
                                        // Pass a callback that calls the handler
                                        handleActionCheckedChange(action, checked);
                                    }}  
                                    disabled={processing || !data.module} // Disable if no module is selected
                                />
                               
                            </div>
                        ))}
                    </div>
                    {/* Display error for 'actions' if any */}
                    {errors.actions && <InputError message={errors.actions} />}

                    <Button type="submit" disabled={processing || !data.module || data.actions.length === 0} className="w-full">
                        {processing ? 'Submitting...' : submitText}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default permissionForm;