'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { ImagePlus, XCircle, Pencil, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';

interface FeatureItem {
    id: number;
    feature_name: string;
    description: string;
    is_main: boolean;
    icon: string | null;
}

type FeatureFormData = {
    feature_name: string;
    description: string;
    is_main: boolean;
    icon: File | null;
    _method?: 'patch'; 
    clear_icon: boolean;
};

interface FeatureFormProps {
    feature?: FeatureItem;
}

const FeatureForm: React.FC<FeatureFormProps> = ({ feature }) => {
    const isUpdate = !!feature;
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(feature?.icon ?? null);
    const [fileRejectionError, setFileRejectionError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm<FeatureFormData>({
        feature_name: feature?.feature_name ?? '',
        description: feature?.description ?? '',
        is_main: feature?.is_main ?? false,
        icon: null,
        _method: isUpdate ? 'patch' : undefined,
        clear_icon: false,
    });

    // Reset form and sync when dialog opens
    useEffect(() => {
        if (open) {
            setData({
                feature_name: feature?.feature_name ?? '',
                description: feature?.description ?? '',
                is_main: feature?.is_main ?? false,
                icon: null,
                _method: isUpdate ? 'patch' : undefined,
                clear_icon: false,
            });
            setPreview(feature?.icon ?? null);
            setFileRejectionError(null);
            clearErrors();
        }
    }, [open, feature, isUpdate, setData, clearErrors]);

    const onDrop = React.useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            // Reset icon errors on new drop attempt
            clearErrors('icon');
            setFileRejectionError(null);

            if (fileRejections.length > 0) {
                const error = fileRejections[0].errors[0];
                if (error.code === 'file-too-large') {
                    setFileRejectionError('Icon size must be less than 1MB.');
                } else if (error.code === 'file-invalid-type') {
                    setFileRejectionError('Only PNG, JPG, or JPEG files are allowed.');
                }
                return;
            }

            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                const reader = new FileReader();
                reader.onload = () => {
                    setPreview(reader.result);
                    setData((prev) => ({ ...prev, icon: file, clear_icon: false }));
                };
                reader.readAsDataURL(file);
            }
        },
        [setData, clearErrors]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: 1048576, // 1MB exactly
        accept: { 'image/png': [], 'image/jpg': [], 'image/jpeg': [] },
    });

    const handleClearIcon = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        setFileRejectionError(null);
        setData((prev) => ({ ...prev, icon: null, clear_icon: true }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Extra frontend check for required icon on Create
        if (!isUpdate && !data.icon) {
            setError('icon', 'An icon is required for new features.');
            return;
        }
        
        const url = isUpdate ? route('carfeature.update', feature.id) : route('carfeature.store');

        post(url, {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                if (!isUpdate) reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? "outline" : "default"} size={isUpdate ? "icon" : "default"}>
                    {isUpdate ? <Pencil className="h-4 w-4" /> : <><Plus className="mr-2 h-4 w-4" /> Add Feature</>}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Edit Feature' : 'Create Feature'}</DialogTitle>
                    <DialogDescription>
                        {isUpdate ? `Update details for ${feature.feature_name}` : 'Add a new feature to the car inventory system.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="feature_name">Feature Name</Label>
                        <Input
                            id="feature_name"
                            value={data.feature_name}
                            onChange={(e) => setData('feature_name', e.target.value)}
                            placeholder="e.g. Sunroof, Leather Seats"
                        />
                        <InputError message={errors.feature_name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Briefly describe this feature..."
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label>Main Feature</Label>
                            <p className="text-sm text-muted-foreground">Display prominently on car details.</p>
                        </div>
                        <Switch
                            checked={data.is_main}
                            onCheckedChange={(checked) => setData('is_main', checked)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Feature Icon</Label>
                        <div
                            {...getRootProps()}
                            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                                isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                            } ${(errors.icon || fileRejectionError) ? 'border-destructive bg-destructive/5' : ''}`}
                        >
                            <input {...getInputProps()} />
                            {preview ? (
                                <div className="relative">
                                    <img src={preview as string} alt="Preview" className="max-h-[120px] rounded-lg object-contain" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                        onClick={handleClearIcon}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <ImagePlus className="size-10 text-gray-400" />
                                    <p className="text-xs text-center text-gray-500">
                                        Drag icon (Max 1MB)
                                    </p>
                                </div>
                            )}
                        </div>
                        <InputError message={errors.icon || fileRejectionError || ''} />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing ? 'Processing...' : isUpdate ? 'Update Feature' : 'Create Feature'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FeatureForm;