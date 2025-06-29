// resources/js/components/car/settings/fuel/Edit.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error'; // Assuming you have this for Inertia errors
import { useForm } from '@inertiajs/react';

// Define the type for the fuel data that will be passed for editing
interface FuelData {
    id: number;
    fuel_type: string; // The property for the fuel name
}

interface EditFuelProps {
    fuel: FuelData; // The specific fuel object to edit
}

const Update = ({ fuel }: EditFuelProps) => {
console.log('Update component initialized with fuel:', fuel);

    const { data, setData, patch, processing, errors, reset } = useForm({
        fuel_type: fuel.fuel_type, // Initialize with the existing fuel name
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('carfuel.update', fuel.id), {
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
                <Button variant="outline">update</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>New fuel</DialogTitle>
                  <DialogDescription>
                    Create a new car fuel.
                  </DialogDescription>
                </DialogHeader>
        
                {/* Use a standard form element with onSubmit */}
                <form onSubmit={onSubmit} className="w-2/3 space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="fuel_type">Car fuel</Label>
                    <Input
                      id="fuel_type"
                      placeholder="fuel name"
                      value={data.fuel_type}
                      onChange={(e) => setData('fuel_type', e.target.value)}
                      disabled={processing} // Disable input while processing
                    />
                    {/* Display Inertia validation errors */}
                    <InputError message={errors.fuel_type} className="mt-2" />
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