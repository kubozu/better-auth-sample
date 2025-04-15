"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";

import { authClient } from "@/lib/auth";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLogin, setIsLogin] = React.useState<boolean>(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    if (!isLogin) {
      try {
        const { data, error } = await authClient.signUp.email(
          {
            email,
            password,
            name: email.split("@")[0],
          },
          {
            onRequest: () => {
              setIsLoading(true);
            },
            onSuccess: () => {
              router.push("/dashboard");
            },
            onError: (ctx) => {
              alert(ctx.error.message);
            },
          }
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const { data, error } = await authClient.signIn.email(
          {
            email,
            password,
          },
          {
            onRequest: () => {
              setIsLoading(true);
            },
            onSuccess: () => {
              router.push("/dashboard");
            },
            onError: (ctx) => {
              alert(ctx.error.message);
            },
          }
        );
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function handleGoogleSignIn() {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex justify-center">
        <button
          type="button"
          className="text-sm underline underline-offset-4 hover:text-primary"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              autoCapitalize="none"
              autoComplete={isLogin ? "current-password" : "new-password"}
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLogin ? "Sign In with Email" : "Sign Up with Email"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
      >
        {isLoading ? (
          <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg
            className="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            width={256}
            height={262}
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285f4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            ></path>
            <path
              fill="#34a853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            ></path>
            <path
              fill="#fbbc05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
            ></path>
            <path
              fill="#eb4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            ></path>
          </svg>
        )}{" "}
        {isLogin ? "Sign in with Google" : "Sign up with Google"}
      </Button>
    </div>
  );
}
