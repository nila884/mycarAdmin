// categoryForm.tsx
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategoryItem } from '@/pages/car/settings/category';
import { useForm } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';



type CategoryFormData = {
    category_name: string;
    _method?: 'patch';
};

export default function CategoryForm({ category }: { category?: CategoryItem }) {
    const isUpdate = !!category;
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm<CategoryFormData>({
        category_name: category?.category_name ?? '',
        _method: isUpdate ? 'patch' : undefined,
    });

    useEffect(() => {
        if (open) {
            setData({
                category_name: category?.category_name ?? '',
                _method: isUpdate ? 'patch' : undefined,
            });
        }
    }, [open,category,isUpdate,setData]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(isUpdate ? route('car.settings.category.update', category!.id) : route('car.settings.category.store'), { onSuccess: () => setOpen(false) });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
                    {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add Category'}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Update Category' : 'Create Category'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label>Category</Label>
                        <Input value={data.category_name} onChange={(e) => setData('category_name', e.target.value)} />
                        <InputError message={errors.category_name} />
                    </div>

                    <Button disabled={processing} className="w-full">
                        {processing ? 'Saving…' : isUpdate ? 'Update' : 'Create'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
