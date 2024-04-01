import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormFileUpload from "@/components/custom/FormFileUpload";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required."
  }),
  img_url: z.string().min(1, {
    message: "Server image is required."
  })
});


const TestPage = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          img_url: "",
        }
      });
    
      const isLoading = form.formState.isSubmitting;
    
      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
      }
    
      const handleClose = () => {
        form.reset();
      }
    
      return (
        <div className="content-center gap-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8 px-6">
                  <div className="flex items-center justify-center text-center">
                    
                    <FormFileUpload
                        disabled={false}
                        mediaType='pdf'
                        control={form.control}
                        name="img_url"
                        label="Imagem"
                    />
                  </div>
    
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                        >
                          Server name
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            placeholder="Enter server name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                  <Button type="submit">
                    Create
                  </Button>
              </form>
            </Form>
        </div>
      )
}
 
export default TestPage;