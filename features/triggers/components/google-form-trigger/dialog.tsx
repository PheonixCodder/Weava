"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { generateGoogleFormScript } from "./utils"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange}: Props) => {
    const params = useParams()
    const workflowId = params?.workflowId as string

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`
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
                    <DialogTitle>Google Form Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL to configure your Google Form's app script to trigger
                        this workflow when a form is submitted.
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
                            <li>Open your Google Form</li>
                            <li>Click the three dots menu &gt; Script editor</li>
                            <li>In the script editor, replace any existing code with the following script:</li>
                            <li>Replace the WEBHOOK_URL with your webhook url above</li>
                            <li>Save and click "Triggers" &gt; Add Trigger</li>
                            <li>Choose: From form &gt; On form submit &gt; Save</li>
                            </ol>
                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <h4 className="font-medium text-sm">Google Apps Script:</h4>
                        <Button type="button" variant={'outline'} onClick={async () => {
                            const script = generateGoogleFormScript(webhookUrl)
                            try {
                                await navigator.clipboard.writeText(script)
                                toast.success('Google Apps Script copied to clipboard')
                            } catch (error) {
                                toast.error('Failed to copy script')
                            }
                        }}>
                            <CopyIcon className="size-4 mr-2" />
                            Copy Google Apps Script
                        </Button>
                        <p>This script includes your webhook URL and handles form submissions</p>
                            </div>
                            <div className="rounded-lg bg-muted p-4 space-y-2" >
                                <h4 className="font-medium text-sm">Available Variables</h4>
                                <ul className="text-sm text-muted-foreground space-y-4">
                                    <li>
                                        <code className="bg-background px-1 py-0.5 rounded">
                                            {"{{googleForm.respondentEmail}}" }
                                            - Respondent's email address
                                        </code>
                                    </li>
                                    <li>
                                        <code className="bg-background px-1 py-0.5 rounded">
                                            {"{{googleForm.respondentEmail['Question Name']}}" }
                                            - Specific answer
                                        </code>
                                    </li>
                                    <li>
                                        <code className="bg-background px-1 py-0.5 rounded">
                                            {"{{json googleForm.responses}}" }
                                            - Specific answer
                                        </code>
                                    </li>
                                </ul>
                            </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}