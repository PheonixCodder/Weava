"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const StripeTriggerDialog = ({ open, onOpenChange}: Props) => {
    const params = useParams()
    const workflowId = params?.workflowId as string

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`
    const copyToClipboard = () => {
        try {
        navigator.clipboard.writeText(webhookUrl)
        toast.success('Webhook URL copied to clipboard')
        } catch (error) {
            toast.error('Failed to copy URL')
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stripe Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Configure your Stripe trigger by setting up the webhook URL below in your Stripe dashboard.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Webhook URL</Label>
                        <div className="flex gap-2">
                            <Input id="webhook-url" value={webhookUrl} readOnly className="font-mono text-sm" />
                            <Button type="button" size={"icon"} variant={'outline'} onClick={copyToClipboard}><CopyIcon className="size-4" /></Button>
                        </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Setup Instructions</h4>
                        <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                            <li>Open your Stripe Dashboard</li>
                            <li>Go to Developers &gt; Webhooks</li>
                            <li>Click "Add Endpoint"</li>
                            <li>Replace the webhook url above</li>
                            <li>Select events to listen for (e.g., payment_intent.succeeded)</li>
                            <li>Save and copy the signing secret</li>
                            </ol>
                            </div>
                            <div className="rounded-lg bg-muted p-4 space-y-2" >
                                <h4 className="font-medium text-sm">Available Variables</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.amount}}"}</code> - Payment Amount</li>
                                    <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.currency}}"}</code> - Currency Code</li>
                                    <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.customerId}}"}</code> - Customer ID</li>
                                    <li><code className="bg-background px-1 py-0.5 rounded">{"{{json stripe}}"}</code> - Full Event data as JSON</li>
                                    <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.eventType}}"}</code> - Event type (e.g., payment_intent.succeeded)</li>
                                </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}