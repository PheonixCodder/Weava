"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Github } from "lucide-react";
import GoogleIcon from "@mui/icons-material/Google";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpSchema) => {
const { data, error } = await authClient.signUp.email({
  name: values.email,
    email: values.email,
    password: values.password,
    callbackURL:"/"
}, {
        onSuccess: (ctx) => {
          router.push("/");
        },
        onError: (ctx) => {
            toast.error(ctx.error.message);
        },
});
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Join us and get started today</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Social Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 w-full transition"
                  type="button"
                  disabled={isPending}
                >
                  <Github className="w-5 h-5" />
                  Continue with GitHub
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 w-full transition"
                  type="button"
                  disabled={isPending}
                >
                  <GoogleIcon className="text-[18px]!" />
                  Continue with Google
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <span className="flex-1 border-t border-gray-300" />
                <span className="text-gray-500 text-sm">or</span>
                <span className="flex-1 border-t border-gray-300" />
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="rounded-lg border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          type="password"
                          {...field}
                          className="rounded-lg border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm your password"
                          type="password"
                          {...field}
                          className="rounded-lg border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full flex items-center justify-center transition rounded-lg"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 transition"
                >
                  Login
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
