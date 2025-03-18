
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";
import { FitnessCenterLogo } from "@/components/FitnessCenterLogo";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px] [mask-image:radial-gradient(white,transparent_70%)]" />
      
      <div className="w-full max-w-md px-4 z-10">
        <Card className="glass-card border-white/10">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <FitnessCenterLogo className="w-12 h-12" />
            </div>
            <CardTitle className="text-2xl font-bold text-text-light">Create an account</CardTitle>
            <CardDescription className="text-text-muted">
              Sign up to start your fitness journey with us
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm mode="signup" />
            
            <div className="mt-6 text-center text-sm text-text-muted">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:text-primary/90 transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
