"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

import { authClient } from "@/lib/auth-client";

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
              <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
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
          <FaGoogle className="mr-2 h-4 w-4" />
        )}{" "}
        {isLogin ? "Sign in with Google" : "Sign up with Google"}
      </Button>
    </div>
  );
}
