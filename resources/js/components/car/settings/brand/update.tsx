// car/settings/Brand/Edit.tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDropzone } from "react-dropzone";
import React, { useState, useCallback, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { ImagePlus, XCircle } from 'lucide-react'; // Added XCircle for clearing image

// Define the type for your form data
type EditBrandForm = {
    brand_name: string;
    logo: File | null; // Changed from 'logo' to 'image' to match backend expectation and frontend field name
    _method?: 'patch'; // For Inertia's PUT/PATCH requests
    clear_logo?: boolean; // To explicitly tell backend to clear logo
};

// Define the props for this component, which will include the brand data
interface EditBrandProps {
    brand: {
       id: number;
       brand_name: string;
       logo: string | null; // Corrected to allow null, matching backend
       created_at: string;
       updated_at: string;
    };
}

const Update: React.FC<EditBrandProps> = ({ brand }) => { 
  
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [fileRejectionError, setFileRejectionError] = useState<string | null>(null);
  const [currentLogoPath, setCurrentLogoPath] = useState<string | null>(null);

  // Initialize Inertia's useForm with existing brand data
  const { data, setData, post, processing, errors } = useForm<EditBrandForm>({
    _method: 'patch', // Important: Inertia uses POST internally for PUT/PATCH
    brand_name: brand.brand_name,
    logo: null, // Image is initially null, only set if a new one is selected
    clear_logo: false,
  });

  // Set initial image preview if a logo exists
  useEffect(() => {
    if (brand.logo) {
      // Assuming your public storage is accessible via /storage/
      setPreview(`/storage/${brand.logo}`); // Updated path based on your `brand.tsx` image source
      setCurrentLogoPath(brand.logo);
    }
  }, [brand.logo]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
          setData('logo', file); // Set the file in Inertia's form data
          setData('clear_logo', false); // If new image is uploaded, don't clear old one
          setFileRejectionError(null);
        };
        reader.readAsDataURL(file);
      } else if (fileRejections.length > 0) {
        // Revert preview to current logo if new file is rejected
        setPreview(currentLogoPath ? `/storage/${currentLogoPath}` : null); // Updated path
        setData('logo', null);
        setFileRejectionError("Image must be less than 1MB and of type png, jpg, or jpeg.");
      }
    },
    [setData, currentLogoPath],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1000000, // 1MB
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  });

  const handleClearLogo = () => {
    setPreview(null);
    setData('logo', null); // Clear the image data
    setData('clear_logo', true); // Tell backend to clear the logo
    setCurrentLogoPath(null); // Clear current path display
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Use Inertia's post method for PUT/PATCH, specifying the brand ID
    post(route('carbrand.update', brand.id), {
      onSuccess: () => {
        alert('Brand updated successfully!');
      },
      onError: (submissionErrors) => {
      },
      onFinish: () => {
        // Any cleanup
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline" size="sm">Edit</Button></DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
          <DialogDescription>
            Edit an existing car brand.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="w-full space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="brand_name">Car brand</Label>
            <Input
              id="brand_name"
              placeholder="brand name"
              value={data.brand_name}
              onChange={(e) => setData('brand_name', e.target.value)}
              disabled={processing}
            />
            <InputError message={errors.brand_name} className="mt-2" />
          </div>

          {/* Image Upload Section */}
          <div className="grid gap-2">
            <Label htmlFor="logo">Brand Logo</Label>
            <div
              
              {...getRootProps()}
              className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer
                ${isDragActive ? 'border-primary' : 'border-gray-300'}
                ${(errors.logo || fileRejectionError) ? 'border-destructive' : ''}
              `}
            >
              <Input id='logo' {...getInputProps()} />
              {preview ? (
                <>
                  <img src={preview as string} alt="Brand Logo Preview" className="max-h-[200px] w-auto object-contain rounded-lg mb-2" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dropzone from activating
                      handleClearLogo();
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
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
            {/* Corrected InputError usage for image field */}
            <InputError message={errors.logo || fileRejectionError || undefined} className="mt-2" />
          </div>

          <Button type="submit" disabled={processing}>
            {processing ? 'Updating...' : 'Update Brand'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Update; // Changed export name to match component