"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth"
import { auth } from "@/lib/firebase/firebase-client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GoogleLogoIcon } from "@phosphor-icons/react"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"

type LoginFormValues = {
  email: string
  password: string
}

export function LoginForm({
  className,
  onSubmit: _onSubmit,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  
  const [authError, setAuthError] = useState<string | null>(null)

  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onFormSubmit = async (data: LoginFormValues) => {
    setAuthError(null)
    
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      
      router.refresh()
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Login failed:", err)
      setAuthError("Invalid email or password. Please try again.")
    }
  }

  const handleGoogleLogin = async () => {
    setAuthError(null)
    setIsGoogleLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      
      router.refresh()
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Google login failed:", err)
      setAuthError("Failed to sign in with Google.")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const isLoading = isSubmitting || isGoogleLoading

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onFormSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        
        {authError && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {authError}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="newton@skunkworks1983.com"
            disabled={isLoading}
            required
            {...register("email", { required: true })}
          />
        </Field>
        
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input 
            id="password" 
            type="password" 
            disabled={isLoading}
            required 
            {...register("password", { required: true })} 
          />
        </Field>
        
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </Field>
        
        <FieldSeparator>Or continue with</FieldSeparator>
        
        <Field>
          <Button 
            variant="outline" 
            type="button" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <GoogleLogoIcon />
            {isGoogleLoading ? "Connecting..." : "Login with Google"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}