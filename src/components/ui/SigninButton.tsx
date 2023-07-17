"use client";

import { FC, useState } from "react";
import Button from "@/ui/Button";
import { signIn } from "next-auth/react";
import { buttonVariants } from "@/ui/Button";

interface SigninButtonProps {}

const SigninButton: FC<SigninButtonProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (error) {
      //   toast({
      //     title: "Error signing in",
      //     messge: "Please try again later",
      //     type: "Error",
      //   });
    }
  };

  return (
    <Button onClick={signInWithGoogle} isLoading={isLoading}>
      Sign In
    </Button>
  );
};

export default SigninButton;
