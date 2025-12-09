import { CredentialType } from '@prisma/client';
import React from 'react'
import { useCreateCredential, useUpdateCredential } from '../hooks/use-credentials';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

interface CredentialFormProps {
    initialData: {
        id: string;
        name: string;
        type: CredentialType
        value: string;
    }
}

const CredentialFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(CredentialType),
    value: z.string().min(1, "API Key is required"),
});

type FormValues = z.infer<typeof CredentialFormSchema>;

const CredentialForm = ({ initialData } : CredentialFormProps) => {
    const createCredential = useCreateCredential()
    const updateCredential = useUpdateCredential()
    const { handleError, modal } = useUpgradeModal();

    const isEdit = !!initialData?.id;

    const form = useForm<FormValues>({
        resolver: zodResolver(CredentialFormSchema),
        defaultValues: initialData || {
            name: '',
            type: CredentialType.OPENAI_API,
            value: '',
        },
    })
  return (
    <div>
      
    </div>
  )
}

export default CredentialForm
