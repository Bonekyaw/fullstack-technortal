import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router";

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
import { PasswordInput } from "./password-input";

const formSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Password must be 8 digits",
    })
    .max(8, {
      message: "Password must be 8 digits",
    })
    .regex(/^\d+$/, {
      message: "Password is invalid",
    }),
  confirmPassword: z
    .string()
    .min(8, {
      message: "Password must be 8 digits",
    })
    .max(8, {
      message: "Password must be 8 digits",
    })
    .regex(/^\d+$/, {
      message: "Password is invalid",
    }),
});

export function PasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    console.log(values);
    // Calling API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    navigate("/");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Please confirm passwords</CardTitle>
          <CardDescription>Passwords must be 8 digits long.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn("flex flex-col gap-6", className)}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        inputMode="numeric"
                        // minLength={8}
                        // maxLength={8}
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        inputMode="numeric"
                        // minLength={8}
                        // maxLength={8}
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
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Confirming..." : "Confirm"}
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
