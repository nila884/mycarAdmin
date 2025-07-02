// src/components/car/settings/model/update.tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,SelectContent,SelectItem,SelectTrigger,SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error'; // Assuming this component exists for displaying errors
import { useForm } from '@inertiajs/react'; // Import useForm from Inertia.js
import { useEffect } from 'react'; // Import useEffect for setting initial data

// Define types for CarModel and Brand
interface CarModelItem {
    id: number;
    model_name: string;
    brand_id: number;
    brand_name: string;
    created_at: string;
    updated_at: string;
}

interface BrandItem {
    id: number;
    brand_name: string;
}

// Define form data type for update, including _method for PATCH request
type EditModelForm = {
    model_name: string;
    brand_name: string;
    _method?: 'patch'; // For Inertia's PUT/PATCH requests
};

// Define props for the UpdateModel component
interface UpdateModelProps {
    model: CarModelItem;
    brands: BrandItem[];
}

const UpdateModel: React.FC<UpdateModelProps> = ({ model, brands }) => {
  // Use Inertia's useForm for handling form state, submission, and errors
  const { data, setData, post, processing, errors, reset } = useForm<EditModelForm>({
    model_name: model.model_name,
    brand_name: model.brand_name, // Set initial brand name
    _method: 'patch', // Explicitly set the method for Inertia
  });

  // Effect to reset form data if the 'model' prop changes (e.g., when a different model is selected for editing)
  useEffect(() => {
    setData({
      model_name: model.model_name,
      brand_name: model.brand_name,
      _method: 'patch',
    });
    // Reset Inertia's internal errors and dirty state when the model changes
    reset('model_name', 'brand_name');
  }, [model]);


  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Send the data using Inertia's post method, which will correctly handle the _method: 'patch'
    post(route('carmodel.update', model.id), {
      onSuccess: () => {
        // Optionally show a success message or close the dialog
        alert('Car model updated successfully!');
      },
      onError: (submissionErrors) => {
        console.error('Validation Errors:', submissionErrors);
        // Inertia's useForm automatically populates the 'errors' object
      },
      onFinish: () => {
        // Any cleanup logic after submission attempt
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Model</DialogTitle>
          <DialogDescription>
            Edit an existing car model.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="w-full space-y-6">
          {/* Brand Name Select */}
          <div className="grid gap-2">
            <Label htmlFor="brand_name">Brand Name</Label>
            <Select
              value={data.brand_name}
              onValueChange={(value) => setData('brand_name', value)}
              disabled={processing} // Disable select while processing
            >
              <SelectTrigger id="brand_name">
                <SelectValue placeholder="Select Brand name" />
              </SelectTrigger>
              <SelectContent>
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.brand_name}>
                      {brand.brand_name.toUpperCase()}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No brands available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {/* Display Inertia validation errors for brand_name */}
            <InputError message={errors.brand_name} className="mt-2" />
          </div>

          {/* Car Model Input */}
          <div className="grid gap-2">
            <Label htmlFor="model_name">Car Model</Label>
            <Input
              id="model_name"
              placeholder="Model name"
              value={data.model_name}
              onChange={(e) => setData('model_name', e.target.value)}
              disabled={processing} // Disable input while processing
            />
            {/* Display Inertia validation errors for model_name */}
            <InputError message={errors.model_name} className="mt-2" />
          </div>

          <Button type="submit" disabled={processing}>
            {processing ? 'Updating...' : 'Update Model'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateModel;