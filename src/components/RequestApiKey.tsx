"use client";

import { FC, FormEvent, useState } from "react";
import { Key } from "lucide-react";
import { createApiKey } from "../helpers/create-api-key.ts";
import { toast } from "./ui/Toast";
import LargeHeading from "@/ui/LargeHeading";
import Paragraph from "@/ui/Paragraph";
import { Input } from "@/ui/Input";
import CopyButton from "@/components/CopyButton";

const RequestApiKey: FC = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const createNewApiKey = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsCreating(true);

    try {
      const generatedApiKey = await createApiKey();
      setApiKey(generatedApiKey);
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Error",
          message: err.message,
          type: "error",
        });

        return;
      }

      toast({
        title: "Error",
        message: "Something went wrong",
        type: "error",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="containter md:max-w-2xl">
      <div className="flex flex-col gap-6 items-center ">
        <Key className="mx-auto h-12 w-12 text-gray-400" />
        <LargeHeading>Request your API key</LargeHeading>
        <Paragraph>You haven&apos;t requested an API key yet.</Paragraph>
      </div>
      <form onSubmit={createNewApiKey} className="mt-6 sm:flex sm:items-center">
        <div className="relative rounded-md shadow-sm sm:min-w-0 sm:flex-1">
          {apiKey ? (
            <CopyButton
              type="button"
              valueToCopy={apiKey}
              className="absolute inset-y-0 right-0 animate-in fade-in duration-300"
            />
          ) : /* "??" means if the variable means null or undefined  */
          null}
          <Input
            readOnly
            value={apiKey ?? ""}
            placeholder="Request API key to display it here"
          />
        </div>
      </form>
    </div>
  );
};

export default RequestApiKey;
