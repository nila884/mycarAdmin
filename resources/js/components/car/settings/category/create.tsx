import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // You might need Label for basic input elements
import InputError from '@/components/input-error'; // Assuming you have an InputError component for Inertia errors
import { useForm } from '@inertiajs/react'; // Import useForm from Inertia

// Define the type for your form data
type CreateCategoryForm = {
    category_name: string;
};

const create = () => {
  // Initialize Inertia's useForm
  const { data, setData, post, processing, errors, reset } = useForm<CreateCategoryForm>({
    category_name: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Send the data using Inertia's post method
    post(route('carcategory.store'), { // Assuming a route named 'car.settings.category.store'
      onSuccess: () => {
        reset(); // Reset form fields on successful submission
        // You might want to close the dialog here or show a success message
        
      },
      onError: (errors) => {
        console.error('Submission error:', errors);
        // Inertia's useForm automatically populates the 'errors' object,
        // so you don't need to manually set them here.
      },
      onFinish: () => {
        // Any logic to run after success or error (e.g., stop loading indicator if not handled by processing)

        
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New category</DialogTitle>
          <DialogDescription>
            Create a new car category.
          </DialogDescription>
        </DialogHeader>

        {/* Use a standard form element with onSubmit */}
        <form onSubmit={onSubmit} className="w-2/3 space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="category_name">Car category</Label>
            <Input
              id="category_name"
              placeholder="category name"
              value={data.category_name}
              onChange={(e) => setData('category_name', e.target.value)}
              disabled={processing} // Disable input while processing
            />
            {/* Display Inertia validation errors */}
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

export default create;