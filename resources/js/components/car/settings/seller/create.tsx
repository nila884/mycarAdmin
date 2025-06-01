import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FormSchema = z.object({

    seller_name: z.string().min(2, {
    message: "seller name must be at least 2 characters.",
  }),
    country: z
    .string({
      required_error: "Please select a Country to display.",
    }),
    phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^\+?[0-9]{10,15}$/, { message: "Invalid phone number" }),
    email: z
    .string()
    .email({ message: "Invalid email address" }),
    address: z.string().min(5, {
      message: "Address must be at least 5 characters.",
    }),

})
const create = () => {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      seller_name: "",
    }
  })
   function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // Handle form submission here
  }

  return (
<Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New seller</DialogTitle>
          <DialogDescription>
            Create a new car seller .
          </DialogDescription>
        </DialogHeader>
<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

<FormField
          control={form.control}
          name="seller_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car seller</FormLabel>
              <FormControl>
                <Input placeholder="seller name" {...field} />
              </FormControl>
              <FormDescription>
                This is car seller name.
              </FormDescription>
              <FormMessage />
            </FormItem>
            
          )}
        />

<FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Country to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="korea">Korea</SelectItem>
                </SelectContent>
              </Select>
             
              <FormMessage />
            </FormItem>
          )}
        />

     <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+250..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>

      </DialogContent>
    </Dialog>
  )
}

export default create
