import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,SelectContent,SelectItem,SelectTrigger,SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';

// Define the type for a single model item
interface ModelItem {
    id: number;
    model_name: string;
}

// Define the type for your form data
type CreateVersionForm = {
    version_name: string;
    version_year: string;
    model_name: string; // We'll send model_name and convert to car_model_id in backend
};

// Define the props for this component
interface CreateProps {
    models: ModelItem[]; // Expecting an array of car model items
}

const Create = ( {models}:CreateProps) => {
// Use Inertia's useForm for handling form state, submission, and errors
  const { data, setData, post, processing, errors, reset } = useForm<CreateVersionForm>({
    version_name: "",
    version_year: "",
    model_name: "", // Initialize model_name
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Send the data using Inertia's post method
    post(route('carversion.store'), { // Target the carversion.store route
      onSuccess: () => {
        reset(); // Reset form fields on successful submission
        alert('Car version created successfully!'); // Or use a toast notification
      },
      onError: (submissionErrors) => {
        console.error('Submission error:', submissionErrors);
      },
      onFinish: () => {
        // Any cleanup logic after submission attempt
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
          <DialogTitle>New Version</DialogTitle>
          <DialogDescription>
            Create a new car version.
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
                      {model.model_name}
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
            {processing ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Create;