"use client"

import { PlusIcon } from "lucide-react"
import { memo, useState } from "react"
import { Button } from "./ui/button"

export const AddNodeButton = memo(() => {
    return (
        <Button onClick={() => {}} className="bg-background" size={"icon"} variant={"outline"}>
            <PlusIcon />
        </Button>
    )
})

AddNodeButton.displayName = "AddNodeButton"