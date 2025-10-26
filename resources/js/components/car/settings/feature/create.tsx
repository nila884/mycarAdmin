import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm as useHookForm } from "react-hook-form" // Renamed to avoid conflict with Inertia's useForm
import { z } from "zod"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { useDropzone } from "react-dropzone";
import React from 'react';
import { ImagePlus, XCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useForm as useInertiaForm } from '@inertiajs/react'; // Import Inertia's useForm
import { Switch } from '@/components/ui/switch';

// Define the form data type
type CreateFeatureForm = {
    feature_name: string;
    description: string;
    is_main: boolean;
    icon: File | null; // File type for upload
};

const Create = () => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>(null);
  const [fileRejectionError, setFileRejectionError] = React.useState<string | null>(null);

  const formSchema = z.object({
    feature_name: z.string().min(2, {
        message: "Feature name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Feature description must be at least 10 characters.",
    }),
    is_main: z.boolean(),
    icon: z
      .any() // Use any for initial validation, refine later
      .nullable()
      .refine((file) => !file || file instanceof File, "icon must be a file or null")
      .refine((file) => !file || file.size <= 1000000, "Image size must be less than 1MB"),
  });

  // Use react-hook-form for local form state and validation
  const form = useHookForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      feature_name: "",
      description: "",
      icon: null,
      is_main: false,
    },
  });

  // Use Inertia's useForm for handling submission and Inertia-specific state
  const { data, setData, post, processing, errors, reset: inertiaReset } = useInertiaForm<CreateFeatureForm>({
    feature_name: "",
    description: "",
    icon: null,
    is_main:false
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
          setData('icon', file); // Set the file in Inertia's form data
          form.setValue("icon", file); // Set in react-hook-form as well for validation
          form.clearErrors("icon");
          setFileRejectionError(null);
        };
        reader.readAsDataURL(file);
      } else if (fileRejections.length > 0) {
        setPreview(null);
        setData('icon', null); // Clear Inertia form data
        form.resetField("icon"); // Clear react-hook-form field
        setFileRejectionError("Image must be less than 1MB and of type png, jpg, or jpeg.");
      }
    },
    [setData, form],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1000000, // 1MB
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form data submitted:", values);
    // Use Inertia's post method with the data from its state
    post(route('carfeature.store'), {
      onSuccess: () => {
        alert('Car feature created successfully!');
        form.reset(); // Reset react-hook-form fields
        inertiaReset(); // Reset Inertia form state
        setPreview(null); // Clear preview
        setFileRejectionError(null);
      },
      onError: (submissionErrors) => {
        console.error('Validation Errors:', submissionErrors);
        // Inertia automatically passes errors to its `errors` object.
        // You might need to manually map them to react-hook-form if you want
        // react-hook-form's error display to pick them up, e.g.:
        // if (submissionErrors.feature_name) form.setError('feature_name', { message: submissionErrors.feature_name });
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Feature</DialogTitle>
          <DialogDescription>
            Create a new car Feature.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6"> {/* Changed w-2/3 to w-full */}

            <FormField
              control={form.control}
              name="feature_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feature Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Feature name"
                      {...field}
                      value={data.feature_name} // Bind to Inertia's data
                      onChange={(e) => {
                        field.onChange(e); // Update react-hook-form
                        setData('feature_name', e.target.value); // Update Inertia's data
                      }}
                      disabled={processing} // Disable when processing
                    />
                  </FormControl>
                  <FormMessage>{errors.feature_name}</FormMessage> {/* Display Inertia error */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the feature"
                      rows={3}
                      className="resize-none"
                      {...field}
                      value={data.description} // Bind to Inertia's data
                      onChange={(e) => {
                        field.onChange(e); // Update react-hook-form
                        setData('description', e.target.value); // Update Inertia's data
                      }}
                      disabled={processing} // Disable when processing
                    />
                  </FormControl>
                  <FormMessage>{errors.description}</FormMessage> {/* Display Inertia error */}
                </FormItem>
              )}
            />

 <FormField
              control={form.control}
              name="is_main" // Name uses the key from the Zod schema
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Main Feature</FormLabel>
                    <DialogDescription className="text-sm">
                      Check this to designate the feature as a 'Main' or critical feature.
                    </DialogDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={data.is_main}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setData('is_main', checked);
                      }}
                      disabled={processing}
                    />
                  </FormControl>
                  <FormMessage>{errors.is_main}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={() => (
                <FormItem className="w-full"> {/* Changed w-1/2 to w-full */}
                  <FormLabel
                    className={`${
                      (errors.icon || fileRejectionError) && "text-destructive"
                    }`}
                  >
                    Upload your image
                  </FormLabel>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer
                        ${isDragActive ? 'border-primary' : 'border-gray-300'}
                        ${(errors.icon || fileRejectionError) ? 'border-destructive' : ''}
                      `}
                    >
                      <Input {...getInputProps()} />
                      {preview ? (
                        <>
                          <img
                            src={preview as string}
                            alt="Uploaded Feature image"
                            className="max-h-[200px] w-auto object-contain rounded-lg mb-2" // Max height 200px for better fit
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent dropzone from activating
                              setPreview(null);
                              setData('icon', null); // Clear Inertia form data
                              form.resetField("icon"); // Clear react-hook-form field
                              setFileRejectionError(null);
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <ImagePlus
                          className={`size-20 text-gray-400 mb-2 ${preview ? "hidden" : "block"}`} // Size 20 for better fit
                        />
                      )}
                      <p className="text-sm text-center text-gray-500">
                        {isDragActive ? "Drop the image here..." : "Drag 'n' drop an image here, or click to select one"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        (PNG, JPG, JPEG up to 1MB)
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage>{errors.icon || fileRejectionError}</FormMessage> {/* Display Inertia error or local error */}
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={processing} // Use Inertia's processing state
            >
              {processing ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default Create;