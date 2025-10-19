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
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
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
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">
            Login to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Social Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 w-full hover:bg-gray-100 transition"
                  type="button"
                  disabled={isPending}
                >
                  <Github className="w-5 h-5" />
                  Continue with Github
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 w-full hover:bg-gray-100 transition"
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

              {/* Email & Password */}
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
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
                          placeholder="Password"
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
                  "Login"
                )}
              </Button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className=" underline underline-offset-4 transition"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
