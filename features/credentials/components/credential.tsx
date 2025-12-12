"use client";
import { CredentialType } from '@prisma/client';
import React from 'react';
import { useCreateCredential, useSuspenseCredential, useUpdateCredential } from '../hooks/use-credentials';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface CredentialFormProps {
  initialData?: {
    id: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}

const credentialTypeOptions = [
  {
    value: CredentialType.OPENAI_API,
    label: 'OpenAI API Key',
    logo: '/images/openai.svg',
  },
  {
    value: CredentialType.ANTHROPIC_API,
    label: 'Anthropic API Key',
    logo: '/images/anthropic.svg',
  },
  {
    value: CredentialType.GOOGLE_API,
    label: 'Gemini API Key',
    logo: '/images/gemini.svg',
  },
  {
    value: CredentialType.STRIPE_API,
    label: 'Stripe API Key',
    logo: '/images/stripe.svg',
  }
];

const CredentialFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "API Key is required"),
});

type FormValues = z.infer<typeof CredentialFormSchema>;

const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();
  const { handleError, modal } = useUpgradeModal();

  const router = useRouter();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(CredentialFormSchema),
    defaultValues: initialData || {
      name: '',
      type: CredentialType.OPENAI_API,
      value: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      await updateCredential.mutateAsync(
        { id: initialData.id, ...values },
        { onError: handleError, onSuccess: () => router.push(`/credentials/${initialData.id}`) }
      );
    } else {
      await createCredential.mutateAsync(values, { onError: handleError, onSuccess: (credential) => {
        router.push(`/credentials/${credential.id}`);
      } } );
    }
  };

  return (
    <>
      {modal}
      <Card className="shadow-sm border rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            {isEdit ? 'Edit Credential' : 'Add Credential'}
          </CardTitle>
          <CardDescription className="text-sm">
            {isEdit
              ? 'Update your credential information.'
              : 'Add a new credential to get started.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Credential Name"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Credential Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select Credential Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {credentialTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <img
                                src={option.logo}
                                alt={option.label}
                                className="w-4 h-4"
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* API Key */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your API Key"
                        className="h-10 font-mono tracking-wide"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-10 text-sm font-medium"
              >
                {isEdit ? 'Update Credential' : createCredential.isPending ? <Loader className='animate-spin' /> : 'Create Credential'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default CredentialForm;



export const CredentialView = ( {credentialId}:{credentialId: string}) => {
  const { data: credential } = useSuspenseCredential(credentialId);

  return <CredentialForm initialData={credential} />;
}