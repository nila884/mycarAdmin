import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CountryObject } from '@/lib/object';
import { useForm } from '@inertiajs/react';
import { ImagePlus, Pencil, Plus, XCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
    country?: CountryObject;
}

const CountryForm: React.FC<Props> = ({ country }) => {
    const isUpdate = !!country;
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(country?.flags || null);

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: isUpdate ? 'patch' : undefined,
        country_name: country?.country_name || '',
        code: country?.code || '',
        prefix: country?.prefix || '',
        currency: country?.currency || '',
        import_regulation_information: country?.import_regulation_information || '',
        flags: null as File | null,
    });

    useEffect(() => {
        if (open && !isUpdate) {
            reset();
            setPreview(null);
        }
    }, [open,isUpdate,reset]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                setData('flags', file);
                const reader = new FileReader();
                reader.onload = () => setPreview(reader.result);
                reader.readAsDataURL(file);
            }
        },
        [setData],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg'] },
        maxSize: 512 * 1024,
        multiple: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isUpdate ? route('shipping.country.update', country.id) : route('shipping.country.store');

        post(url, {
            forceFormData: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
                    {isUpdate ? (
                        <Pencil className="h-4 w-4" />
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" /> Add Country
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Edit Country' : 'Register New Country'}</DialogTitle>
                    <DialogDescription>Enter country details and upload a flag icon.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Country Name</Label>
                        <Input value={data.country_name} onChange={(e) => setData('country_name', e.target.value)} placeholder="e.g. Japan" />
                        <InputError message={errors.country_name} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>ISO Code</Label>
                            <Input value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="JPN" />
                            <InputError message={errors.code} />
                        </div>
                        <div className="space-y-2">
                            <Label>Dial Prefix</Label>
                            <Input value={data.prefix} onChange={(e) => setData('prefix', e.target.value)} placeholder="+81" />
                            <InputError message={errors.prefix} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Regulation Information</Label>
                        <Textarea
                            value={data.import_regulation_information}
                            onChange={(e) => setData('import_regulation_information', e.target.value)}
                            placeholder="Import rules..."
                            className="h-20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Flag Image</Label>
                        <div
                            {...getRootProps()}
                            className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${isDragActive ? 'border-primary bg-slate-50' : 'border-slate-200'}`}
                        >
                            <input {...getInputProps()} />
                            {preview ? (
                                <div className="relative inline-block">
                                    <img src={preview as string} className="h-12 w-auto rounded shadow-sm" alt="Preview" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreview(null);
                                            setData('flags', null);
                                        }}
                                    >
                                        <XCircle className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-slate-400">
                                    <ImagePlus className="mb-1 h-8 w-8" />
                                    <span className="text-xs">Click or drag flag</span>
                                </div>
                            )}
                        </div>
                        <InputError message={errors.flags} />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {isUpdate ? 'Update Changes' : 'Create Country'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CountryForm;
