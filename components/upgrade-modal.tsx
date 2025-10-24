"use client";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { authClient } from "@/lib/auth-client";

interface UpgradeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const UpgradeModal = ({ open, onOpenChange } : UpgradeModalProps) => {
    return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Upgrade</AlertDialogTitle>
                <AlertDialogDescription>
                    You need an active subscription to perform this action. Upgrade to a paid plan to use all feature.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={ () => authClient.checkout( { slug: "pro"} ) }>Upgrade Now</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
)}