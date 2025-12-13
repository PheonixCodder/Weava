"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const formSchema = z.object({
  variableName: z.string().min(1,{ message: "Variable name is required"}).regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, { message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores." }),
  content: z.string().min(1, "Content is required")
    .max(2000, "Content must be at most 2000 characters"),
  webhookUrl: z.string().url("Webhook URL must be a valid URL").min(1, "Webhook URL is required"),
});

export type SlackFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<SlackFormValues>
}

export const SlackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {}
}: Props) => {
  

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    variableName: defaultValues.variableName || "",
    content: defaultValues.content || "",
    webhookUrl: defaultValues.webhookUrl || "",
  },
});

useEffect(() => {
  if (open) {
    form.reset({
    variableName: defaultValues.variableName || "",
    content: defaultValues.content || "",
    webhookUrl: defaultValues.webhookUrl || "",
  });
  }
}, [open, defaultValues, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };


  const watchVariableName = form.watch("variableName") || "mySlack";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slack</DialogTitle>
          <DialogDescription>
            Configure webhook settings for Slack node
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mySlack"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the response data in later nodes. For example:
                    {`{{${watchVariableName}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://slack.com/api/webhooks/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The Slack webhook URL to send messages to.
                  </FormDescription>
                  <FormDescription>
                    Make sure you have "content" variable as key
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[120px] font-mono text-sm"
                      placeholder={`Hello from Weava! This is a message sent to Slack via webhook.`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The message content to send to the Slack channel.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
