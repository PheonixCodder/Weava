"use client";

import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { Button } from "../ui/button";
import { NodeSelector } from "./node-selector";

export const AddNodeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen} >
    <Button
      className="bg-background"
      size={"icon"}
      variant={"outline"}
    >
      <PlusIcon />
    </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
