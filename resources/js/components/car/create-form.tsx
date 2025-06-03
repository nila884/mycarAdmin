import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
const createForm = () => {

     const formSchema = z.object({
     brand_name: z
       .string({
         required_error: "Please select car brand name.",
       }),
    model_name: z
       .string({
         required_error: "Please select car model name.",
       }),

      });
    
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
          brand_name: "",
          model_name: "",
        },
      });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
            console.log("Form submitted with data:", data);
            // Here you can handle the form submission, e.g., send data to an API
        };
      

  return (
<div className="container mx-auto py-10">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

 <FormField
          control={form.control}
          name="brand_name"
          render={({ field }) => (
            <FormItem >
              <FormLabel>Brand names</FormLabel>
              <Select  onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Brand name" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent >
                  <SelectItem value="santafe">Santafe</SelectItem>
                  <SelectItem value="sorento">Sorento</SelectItem>
                  <SelectItem value="f3">F3</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This is car brand name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="model_name"
          render={({ field }) => (
            <FormItem >
              <FormLabel>Model names</FormLabel>
              <Select  onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select car Model name" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent >
                  <SelectItem value="santafe">Santafe</SelectItem>
                  <SelectItem value="sorento">Sorento</SelectItem>
                  <SelectItem value="f3">F3</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This is car model name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="brand_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand name</FormLabel>
              <FormControl>
                <Input placeholder="Brand name" {...field} />
              </FormControl>
              <FormDescription>
                This is car brand name.
              </FormDescription>
              <FormMessage />
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
    </div>
  )
}

export default createForm
