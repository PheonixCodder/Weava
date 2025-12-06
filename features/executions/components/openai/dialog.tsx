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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import type { OpenAICompletionModelId } from "@ai-sdk/openai";

export const availableModels: OpenAICompletionModelId[] = [
  "gpt-3.5-turbo-instruct",
] as const;

const formSchema = z.object({
  variableName: z.string().min(1,{ message: "Variable name is required"}).regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, { message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores." }),
  model: z.enum(availableModels),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export type OpenAIFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<OpenAIFormValues>
}

export const OpenAIDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {}
}: Props) => {

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    variableName: defaultValues.variableName || "",
    model: defaultValues.model || availableModels[0],
    systemPrompt: defaultValues.systemPrompt || "",
    userPrompt: defaultValues.userPrompt || "",
  },
});

useEffect(() => {
  if (open) {
    form.reset({
      variableName: defaultValues.variableName || "",
    model: defaultValues.model || availableModels[0],
    systemPrompt: defaultValues.systemPrompt || "",
    userPrompt: defaultValues.userPrompt || "",
    });
  }
}, [open, defaultValues, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };


  const watchVariableName = form.watch("variableName") || "myAIResponse";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI</DialogTitle>
          <DialogDescription>
            Configure settings for openai node
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
                      placeholder="myAIResponse"
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
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The OpenAI model to use for this request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[80px] font-mono text-sm"
                        placeholder={`You are a helpful assistant that provides concise answers.`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Sets the behavior of the assistant. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[120px] font-mono text-sm"
                        placeholder={`Summarize the text {{json httpResponse.data}}`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>The prompt to send to the AI. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects</FormDescription>
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
