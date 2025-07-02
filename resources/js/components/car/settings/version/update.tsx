// src/components/car/settings/version/update.tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,SelectContent,SelectItem,SelectTrigger,SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react'; // Import useEffect for setting initial data

// Define types for VersionItem and ModelItem
interface VersionItem {
    id: number;
    car_model_id: number;
    car_model_name: string;
    version_name: string;
    version_year: string;
    created_at: string;
    updated_at: string;
}

interface ModelItem {
    id: number;
    model_name: string;
}

// Define form data type for update, including _method for PATCH request
type EditVersionForm = {
    version_name: string;
    version_year: string;
    model_name: string; // We'll send model_name and convert to car_model_id in backend
    _method?: 'patch'; // For Inertia's PUT/PATCH requests
};

// Define props for the UpdateVersion component
interface UpdateVersionProps {
    version: VersionItem;
    models: ModelItem[];
}

const Update: React.FC<UpdateVersionProps> = ({ version, models }) => {
  // Use Inertia's useForm for handling form state, submission, and errors
  const { data, setData, post, processing, errors, reset } = useForm<EditVersionForm>({
    version_name: version.version_name,
    version_year: version.version_year,
    model_name: version.car_model_name, // Set initial model name
    _method: 'patch', // Explicitly set the method for Inertia
  });

  // Effect to reset form data if the 'version' prop changes
  useEffect(() => {
    setData({
      version_name: version.version_name,
      version_year: version.version_year,
      model_name: version.car_model_name,
      _method: 'patch',
    });
    reset('model_name', 'version_name', 'version_year'); 
  }, [version]);


  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Send the data using Inertia's post method, which will correctly handle the _method: 'patch'
    post(route('carversion.update', version.id), {
      onSuccess: () => {
        alert('Car version updated successfully!');
      },
      onError: (submissionErrors) => {
        console.error('Validation Errors:', submissionErrors);
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
          <DialogTitle>Edit Version</DialogTitle>
          <DialogDescription>
            Edit an existing car version.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="w-full space-y-6">
          {/* Car Model Select */}
          <div className="grid gap-2">
            <Label htmlFor="model_name">Car Model</Label>
            <Select
              value={data.model_name}
              onValueChange={(value) => setData('model_name', value)}
              disabled={processing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Car Model" />
              </SelectTrigger>
              <SelectContent>
                {models.length > 0 ? (
                  models.map((model) => (
                    <SelectItem key={model.id} value={model.model_name}>
                      {model.model_name.toUpperCase()}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No Car models available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <InputError message={errors.model_name} className="mt-2" />
          </div>

          {/* Version Name Input */}
          <div className="grid gap-2">
            <Label htmlFor="version_name">Car Model Version Name</Label>
            <Input
              id="version_name"
              placeholder="Car version name"
              value={data.version_name}
              onChange={(e) => setData('version_name', e.target.value)}
              disabled={processing}
            />
            <InputError message={errors.version_name} className="mt-2" />
          </div>

          {/* Version Year Input */}
          <div className="grid gap-2">
            <Label htmlFor="version_year">Car Model Version Year</Label>
            <Input
              id="version_year"
              placeholder="e.g., 2023"
              value={data.version_year}
              onChange={(e) => setData('version_year', e.target.value)}
              disabled={processing}
            />
            <InputError message={errors.version_year} className="mt-2" />
          </div>

          <Button type="submit" disabled={processing}>
            {processing ? 'Updating...' : 'Update Version'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Update;