import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { useDropzone } from "react-dropzone";
import React from 'react';
import { ImagePlus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const create = () => {


  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("");

  const formSchema = z.object({
    logo: z
      //Rest of validations done via react dropzone
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload an image"),
    feature_name: z.string().min(2, {
    message: "Feature name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
    message: "Feature description must be at least 10 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      logo: new File([""], "filename"),
      feature_name: "",
    },
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("logo", acceptedFiles[0]);
        form.clearErrors("logo");
      } catch (error) {
        setPreview(null);
        form.resetField("logo");
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
            Create a new car Feature .
          </DialogDescription>
        </DialogHeader>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

<FormField
          control={form.control}
          name="feature_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand name</FormLabel>
              <FormControl>
                <Input placeholder="Feature name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

 <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the feature"
                  rows={3}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={() => (
            <FormItem className="w-1/2">
              <FormLabel
                className={`${
                  fileRejections.length !== 0 && "text-destructive"
                }`}
              >
                
                  Upload your image
                  <span
                    className={
                      form.formState.errors.logo || fileRejections.length !== 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }
                  ></span>
              </FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 "
                >
                  {preview && (
                    <img
                      src={preview as string}
                      alt="Uploaded Feature image"
                      className="max-h-[400px] rounded-lg"
                    />
                  )}
                  <ImagePlus
                    className={`size-40 ${preview ? "hidden" : "block"}`}
                  />
                  <Input {...getInputProps()} type="file" />
              <FormDescription>
                {isDragActive ? (
                    "Drop the image!"
                  ) : (
                    "Click here or drag an image to upload it"
                  )}
              </FormDescription>
                 
                </div>
              </FormControl>
              <FormMessage>
                {fileRejections.length !== 0 && (
               
                   " Image must be less than 1MB and of type png, jpg, or jpeg"
                 
                )}
              </FormMessage>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>

      </DialogContent>
    </Dialog>
  )
}

export default create
