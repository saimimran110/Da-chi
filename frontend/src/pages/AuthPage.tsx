import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser, loginUser } from "@/assets/data"
import { toast } from "sonner"
import { ArrowRight, Loader2 } from "lucide-react"
import logo from "./logo.jpg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (activeTab === "login") {
        // Login
        const data = await loginUser(formData.email, formData.password)
        localStorage.setItem("userId", data._id)
        localStorage.setItem("token", data.token)
        toast.success("Login successful!")
        navigate("/") // Redirect to dashboard
      } else {
        // Signup
        await registerUser(formData.name, formData.email, formData.password)
        toast.success("Signup successful! Please login.")
        setActiveTab("login") // Switch to login form
      }
    } catch (error: any) {
      toast.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
  <div className="w-full max-w-md">
    {/* Logo Section */}
    <div className="flex justify-center mb-8">
      <div className="w-32 h-32 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
        <img src={logo} alt="logo" className="w-full h-full object-cover rounded-full" />
      </div>
    </div>

        <Card className="w-full shadow-lg border-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login"
                ? "Enter your credentials to sign in to your account"
                : "Create an account to get started"}
            </CardDescription>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-[90%] mx-auto mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <TabsContent value="signup" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={activeTab === "signup"}
                      disabled={isLoading}
                    />
                  </div>
                </TabsContent>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {activeTab === "login" && (
                      <a href="#" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    <>
                      {activeTab === "login" ? "Sign in" : "Create account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Tabs>

          <CardFooter className="flex flex-col space-y-4 mt-2">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-500">or continue with</span>
              </div>
            </div>

            <div className="w-full">
              <Button variant="outline" type="button" className="w-full" disabled={isLoading}>
                Google
              </Button>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-4">
          By continuing, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-slate-800">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-slate-800">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default AuthPage
