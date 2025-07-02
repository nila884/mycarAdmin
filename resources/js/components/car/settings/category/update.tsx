// resources/js/components/car/settings/category/Edit.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error'; // Assuming you have this for Inertia errors
import { useForm } from '@inertiajs/react';

// Define the type for the category data that will be passed for editing
interface CategoryData {
    id: number;
    category_name: string; // The property for the category name
}

interface EditCategoryProps {
    category: CategoryData; // The specific category object to edit
}

const Update = ({ category }: EditCategoryProps) => {
console.log('Update component initialized with category:', category);

    const { data, setData, patch, processing, errors, reset } = useForm({
        category_name: category.category_name, // Initialize with the existing category name
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('carcategory.update', category.id), {
            onSuccess: () => {
                reset(); // Optionally reset if dialog remains open, but usually close
               console.log('Update successful');
                // You might want to show a toast message here
            },
            onError: (formErrors) => {
                // errors object in useForm is automatically populated
                console.error('Update error:', formErrors);
            },
            onFinish: () => {
                // Any logic to run after success or error
                console.log('Update process finished');
            }
        });
    };

    return (
         <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">update</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>New category</DialogTitle>
                  <DialogDescription>
                    Create a new car category.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="w-2/3 space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="category_name">Car category</Label>
                    <Input
                      id="category_name"
                      placeholder="category name"
                      value={data.category_name}
                      onChange={(e) => setData('category_name', e.target.value)}
                      disabled={processing}
                    />
                    <InputError message={errors.category_name} className="mt-2" />
                  </div>
        
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Submitting...' : 'Submit'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
    );
};

export default Update;