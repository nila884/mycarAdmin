import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDropzone } from "react-dropzone";
import React from 'react';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react'; // Import useForm from Inertia
import { ImagePlus } from 'lucide-react'; // Assuming you have lucide-react installed for icons


type CreateBrandForm = {
    brand_name: string;
    logo: File | null; // Add image field, can be null initially
};

const Create = () => {

  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>(null);
  const [fileRejectionError, setFileRejectionError] = React.useState<string | null>(null);

  // Initialize Inertia's useForm with the new 'image' field
  const { data, setData, post, processing, errors, reset } = useForm<CreateBrandForm>({
    brand_name: "",
    logo: null,
  });

  // Callback for when files are dropped or selected
  const onDrop = React.useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      // Handle accepted files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result); // Set image preview
          setData('logo', file); // Set the file in Inertia's form data
          setFileRejectionError(null); // Clear any previous file rejection errors
        };
        reader.readAsDataURL(file);
      } else if (fileRejections.length > 0) {
        // Handle file rejections (e.g., wrong type, too large)
        setPreview(null);
        setData('logo', null);
        // You can customize this error message based on fileRejections[0].errors
        setFileRejectionError("Image must be less than 1MB and of type png, jpg, or jpeg.");
      }
    },
    [setData],
  );

  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1000000, // 1MB
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  });

 const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Send the data using Inertia's post method
    // Inertia automatically handles multipart/form-data when a File object is present
    post(route('carbrand.store'), { // Ensure this route is correctly defined in Laravel
      onSuccess: () => {
        reset(); // Reset Inertia form fields
        setPreview(null); // Clear image preview
        setFileRejectionError(null); // Clear any file rejection errors
        // You might want to close the dialog here or show a success message
        alert('Brand created successfully!'); // Simple success alert
      },
      onError: (submissionErrors) => {
        console.error('Submission error:', submissionErrors);
        // Inertia's `errors` object will automatically update
      },
      onFinish: () => {
        // Any cleanup or final actions after success or error
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
          <DialogTitle>New Brand</DialogTitle>
          <DialogDescription>
            Create a new car brand.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="w-full space-y-6"> {/* Adjusted width for better dialog fit */}
          <div className="grid gap-2">
            <Label htmlFor="brand_name">Car brand</Label>
            <Input
              id="brand_name"
              placeholder="brand name"
              value={data.brand_name}
              onChange={(e) => setData('brand_name', e.target.value)}
              disabled={processing} // Disable input while processing
            />
            <InputError message={errors.brand_name} className="mt-2" />
          </div>

          {/* Image Upload Section */}
          <div className="grid gap-2">
            <Label htmlFor="logo">Brand Logo</Label>
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer
                ${isDragActive ? 'border-primary' : 'border-gray-300'}
                ${(errors.logo || fileRejectionError) ? 'border-destructive' : ''}
              `}
            >
              <Input 
              id='logo'
              type="file"
              accept="image/png, image/jpg, image/jpeg"
               {...getInputProps()} />
              {preview ? (
                <img src={preview as string} alt="Brand Logo Preview" className="max-h-[200px] w-auto object-contain rounded-lg mb-2" />
              ) : (
                <ImagePlus className="size-20 text-gray-400 mb-2" />
              )}
              <p className="text-sm text-center text-gray-500">
                {isDragActive ? "Drop the image here..." : "Drag 'n' drop an image here, or click to select one"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (PNG, JPG, JPEG up to 1MB)
              </p>
            </div>
            {/* Display Inertia validation errors for image */}
            {/* <InputError message={errors.image || fileRejectionError} className="mt-2" /> */}
          </div>

          <Button type="submit" disabled={processing}>
            {processing ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Create; // Ensure the export name matches the component name