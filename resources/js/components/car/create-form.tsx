import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "../ui/checkbox";
import { ImagePlus } from 'lucide-react';
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const createForm = () => {
     const [previews, setPreviews] = useState<string[]>([]);
  const formSchema = z.object({
    brand_name: z.string({ required_error: "Please select car brand name." }),
    model_name: z.string({ required_error: "Please select car model name." }),
    version_name: z.string({ required_error: "Please select car model version name." }),
    category: z.string({ required_error: "Please select car category." }),
    fuel_type: z.string({ required_error: "Please select car fuel type." }),
    status: z.string({ required_error: "Please select car status." }),
    color: z.string({ required_error: "Please select car color." }),
    transmission: z.string({ required_error: "Please select car transmission." }),
    streering: z.string({ required_error: "Please select car streering." }),
    Wheel_drive: z.string({ required_error: "Please select car wheel driver." }),
    engine_size: z.string({ required_error: "Please select car engine size." }),
    chassis_number: z.string({ required_error: "Please enter car chassis number." }),
    engine_code: z.string({ required_error: "Please enter car engine code." }),
    steating_capacity: z.string({ required_error: "Please enter car seating capacity." }),
    mileage: z.string({ required_error: "Please enter car mileage." }),
    model_code: z.string({ required_error: "Please enter car model code." }),
        price: z.string({ required_error: "Please enter the price." }),
    promo: z.string().optional(),
    publication_status: z.string( { required_error: "Please select publication status." }),
  
    air_conditioning: z.boolean().optional(),
    sunroof: z.boolean().optional(),
    leather_seats: z.boolean().optional(),
    bluetooth: z.boolean().optional(),
    backup_camera: z.boolean().optional(),
    navigation_system: z.boolean().optional(),
    parking_sensors: z.boolean().optional(),
    heated_seats: z.boolean().optional(),
    cruise_control: z.boolean().optional(),
    keyless_entry: z.boolean().optional(),
    image: z
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload an image")
      .refine((file) => ["image/png", "image/jpg", "image/jpeg"].includes(file.type), "Invalid image type"),
    images: z.array(z.instanceof(File)).max(6, "You can upload a maximum of 6 images").optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      brand_name: "",
      model_name: "",
      version_name: "",
      category: "",
      fuel_type: "",
      status: "",
      color: "",
      transmission: "",
      streering: "",
      Wheel_drive: "",
      engine_size: "",
      chassis_number: "",
      engine_code: "",
      steating_capacity: "",
      mileage: "",
      model_code: "",
      price: "",
      promo: "",
      publication_status: "",
      air_conditioning: false,
      sunroof: false,
      leather_seats: false,
      bluetooth: false,
      backup_camera: false,
      navigation_system: false,
      parking_sensors: false,
      heated_seats: false,
      cruise_control: false,
      keyless_entry: false,
      images: [],
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data);
  };

  const selectFieldsGroup1 = [
    { name: "brand_name", label: "Brand", options: ["Santafe", "Sorento", "F3"] },
    { name: "model_name", label: "Model", options: ["Santafe", "Sorento", "F3"] },
    { name: "version_name", label: "Version", options: ["2022", "2023"] },
  ];
  const selectFieldsGroup2 = [
    { name: "category", label: "Category", options: ["SUV", "Van", "Sedan"] },
    { name: "fuel_type", label: "Fuel Type", options: ["Diesel", "Petrol", "Electric"] },
  ];
  const selectFieldsGroup3 = [
    { name: "status", label: "Status", options: ["New", "Used"] },
    { name: "publication_status", label: "Publication Status", options: ["published", "pending", "archiver"] },
  ];
  const selectFieldsGroup4 = [
    { name: "color", label: "Color", options: ["Red", "Blue", "Yellow"] },
    { name: "transmission", label: "Transmission", options: ["Auto", "Manual"] },
    { name: "streering", label: "Streering", options: ["Left", "Right"] },
  ];
  const selectFieldsGroup5 = [
    { name: "Wheel_drive", label: "Wheel Drive", options: ["FWD", "RWD", "AWD"] },
    { name: "engine_size", label: "Engine Size", options: ["2.0L", "2.5L", "3.0L"] },
  ];

  const inputFieldsGroup1 = [
    { name: "chassis_number", label: "Chassis Number" },
    { name: "engine_code", label: "Engine Code" },
    { name: "model_code", label: "Model Code" },
  ];
  const inputFieldsGroup2 = [
    { name: "steating_capacity", label: "Seating Capacity" },
    { name: "mileage", label: "Mileage" },
  ];
  const inputFieldsGroup3 = [
    { name: "price", label: "Price ($)" },
    { name: "promo", label: "Promo" },
  ]
    const carOptions = [
    { name: "air_conditioning", label: "Air Conditioning" },
    { name: "sunroof", label: "Sunroof" },
    { name: "leather_seats", label: "Leather Seats" },
    { name: "bluetooth", label: "Bluetooth" },
    { name: "backup_camera", label: "Backup Camera" },
    { name: "navigation_system", label: "Navigation System" },
    { name: "parking_sensors", label: "Parking Sensors" },
    { name: "heated_seats", label: "Heated Seats" },
    { name: "cruise_control", label: "Cruise Control" },
    { name: "keyless_entry", label: "Keyless Entry" }
  ];
     const onDrop = (acceptedFiles: File[]) => {
    const validTypes = ["image/jpeg", "image/png"];
    const existingFiles = form.getValues("images") ?? [];
    const newValidFiles = acceptedFiles.filter(
      (file) =>
        validTypes.includes(file.type) &&
        !existingFiles.some((f) => f.name === file.name && f.size === file.size)
    );

    if (newValidFiles.length > 0) {
      const newPreviews = newValidFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
      form.setValue("images", [...existingFiles, ...newValidFiles]);
      form.clearErrors("images");
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...(form.getValues("images") ?? [])];
    const updatedPreviews = [...previews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    form.setValue("images", updatedImages);
    setPreviews(updatedPreviews);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] },
    multiple: true,
    maxFiles: 6,
    maxSize: 2 * 1024 * 1024, // 2MB limit
  });

  return (
    <div className="container mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {[selectFieldsGroup1, selectFieldsGroup2,selectFieldsGroup3, selectFieldsGroup4, selectFieldsGroup5].map((group, idx) => (
            <div key={`select-group-${idx}`} className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">
              {group.map(({ name, label, options }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={typeof field.value === "string" ? field.value : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {options.map((opt) => (
                            <SelectItem key={opt} value={opt.toLowerCase()}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          ))}

         


       

          {[inputFieldsGroup1, inputFieldsGroup2,inputFieldsGroup3].map((group, idx) => (
            <div key={`input-group-${idx}`} className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">
              {group.map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={label}
                          {...field}
                          value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          ))}
<div>
      <div className="mb-4">
                <FormLabel className="text-base">Car options</FormLabel>
                <FormDescription>
                  Select cars options.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">
                   
            {carOptions.map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={typeof field.value === "boolean" ? field.value : false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                          {label}
                        </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
</div>
          <div>
            <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
                <FormLabel>Car Images</FormLabel>
                <FormControl>
                  <div
                    {...getRootProps()}
                    className="border border-dashed border-gray-300 p-4 rounded-md text-center cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    <p>{isDragActive ? "Drop images here..." : "Drag & drop images or click to select (max 6)"}</p>
                  </div>
                </FormControl>
                <FormDescription>Upload JPEG/PNG images only. Max 6 images.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="rounded shadow object-cover h-40 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting} className="w-fit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default createForm;
