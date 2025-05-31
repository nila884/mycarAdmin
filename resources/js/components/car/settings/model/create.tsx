import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import {
  Select,SelectContent,SelectItem,SelectTrigger,SelectValue,
} from "@/components/ui/select"

const FormSchema = z.object({
  brand_name: z
    .string({
      required_error: "Please select an email to display.",
    }),
    model_name: z.string().min(2, {
    message: "Model name must be at least 2 characters.",
  }),
})
const create = () => {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      model_name: "",
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
          <DialogTitle>New Model</DialogTitle>
          <DialogDescription>
            Create a new car model .
          </DialogDescription>
        </DialogHeader>
<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

<FormField
          control={form.control}
          name="model_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car model</FormLabel>
              <FormControl>
                <Input placeholder="Model name" {...field} />
              </FormControl>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>

      </DialogContent>
    </Dialog>
  )
}

export default create
