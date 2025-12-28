import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSubmit, useActionData, useNavigation } from "react-router";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  // Field,
  FieldDescription,
  // FieldGroup,
  // FieldLabel,
  // FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  phone: z
    .string()
    .min(7, {
      message: "Phone number is too short",
    })
    .max(12, {
      message: "Phone number is too long",
    })
    .regex(/^\d+$/, {
      message: "Phone number is invalid",
    }),
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData() as { error?: string } | undefined;
  const navigation = useNavigation();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Calling API
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // navigate("/register/otp");
    submit(values, { method: "post", action: "." });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to Our Shop</CardTitle>
          <CardDescription>Feel free to register below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn("flex flex-col gap-6", className)}
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="09778**********"
                        required
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {actionData?.error && (
                <p className="text-sm text-red-600 text-center">
                  {actionData.error}
                </p>
              )}
              <Button
                type="submit"
                //disabled={form.formState.isSubmitting}
                disabled={navigation.state === "submitting"}
              >
                {/* {form.formState.isSubmitting ? "Registering..." : "Register"} */}
                {navigation.state === "submitting"
                  ? "Registering..."
                  : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
