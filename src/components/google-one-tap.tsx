"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffectOnce } from "react-use";

export const GoogleOneTap = () => {
  const router = useRouter();
  useEffectOnce(() => {
    authClient.oneTap({
      fetchOptions: {
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    });
  });
  return null;
};
