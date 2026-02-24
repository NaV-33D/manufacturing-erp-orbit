import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Factory } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple conceptual login
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
          <Factory className="w-8 h-8 text-[#F97316]" />
        </div>
        <span className="text-2xl font-bold text-gray-900">Manufacturing ERP</span>
      </div>

      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-50"
              />
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Manufacturing ERP. All rights reserved.
      </p>
    </div>
  );
}
