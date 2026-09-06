import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, EyeOff, Loader2, Smartphone, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  plan: z.enum(["basic", "premium_monthly", "premium_annual"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function EmbeddedSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      plan: "premium_monthly"
    }
  });

  // Handle URL parameters to pre-select plan
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    
    if (planParam === 'basic') {
      setValue('plan', 'basic');
    } else if (planParam === 'premium') {
      setValue('plan', 'premium_monthly');
    }
  }, [setValue]);

  const selectedPlan = watch("plan");

  const plans = {
    basic: {
      name: "Basic Plan",
      price: "R300",
      period: "/month",
      features: ["Custom workout plans", "Mobile app access", "Progress tracking", "Community access"]
    },
    premium_monthly: {
      name: "Premium Monthly",
      price: "R450",
      period: "/month",
      features: ["Everything in Basic", "1-on-1 coaching sessions", "Nutrition planning", "Priority support", "Advanced analytics"],
      popular: true
    },
    premium_annual: {
      name: "Premium Annual",
      price: "R4500",
      period: "/year",
      features: ["Everything in Premium", "2 months free", "Exclusive content", "Priority booking"],
      savings: "Save R900"
    }
  };

  const onSubmit = async (data: SignupForm) => {
    setIsSubmitting(true);
    
    try {
      // Track signup attempt
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'signup_attempt',
          data: { 
            plan: data.plan,
            timestamp: new Date().toISOString(),
            source: 'embedded_form'
          }
        })
      });

      // Submit to Sudor API through your backend proxy
      const response = await fetch('/api/sudor/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          plan: data.plan,
          source: 'launchfit_website',
          utm_source: 'website',
          utm_medium: 'embedded_form',
          utm_campaign: 'signup'
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        
        // Track successful signup
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'signup_success',
            data: { 
              plan: data.plan,
              email: data.email,
              timestamp: new Date().toISOString()
            }
          })
        });
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Track failed signup
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'signup_error',
          data: { 
            plan: data.plan,
            error: error.message,
            timestamp: new Date().toISOString()
          }
        })
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Welcome to Launch!</h1>
            <p className="text-gray-300 text-lg">
              Your account has been created successfully. Check your email for next steps.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 justify-center text-yellow-400">
                <Mail className="h-5 w-5" />
                <span>Welcome email sent</span>
              </div>
              <div className="flex items-center gap-3 justify-center text-yellow-400">
                <Smartphone className="h-5 w-5" />
                <span>Download instructions included</span>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-20 h-20 bg-yellow-400 rounded-xl flex items-center justify-center">
            <span className="text-black font-bold text-lg">LAUNCH</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-gray-300">Join thousands transforming their fitness journey</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Signup Form */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription className="text-gray-300">
                Fill out the form below to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="bg-white/10 border-white/20 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className="bg-white/10 border-white/20 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="plan">Choose your Plan</Label>
                  <Select onValueChange={(value) => setValue("plan", value as any)} defaultValue="premium_monthly">
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Plan (R300/month)</SelectItem>
                      <SelectItem value="premium_monthly">Premium Monthly (R450/month)</SelectItem>
                      <SelectItem value="premium_annual">Premium Annual (R4500/year)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create an account"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Plan Details */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {plans[selectedPlan].name}
                {plans[selectedPlan].popular && (
                  <Badge className="bg-yellow-400 text-black">Most Popular</Badge>
                )}
                {plans[selectedPlan].savings && (
                  <Badge className="bg-green-500 text-white">{plans[selectedPlan].savings}</Badge>
                )}
              </CardTitle>
              <div className="text-3xl font-bold text-yellow-400">
                {plans[selectedPlan].price}
                <span className="text-lg text-gray-300">{plans[selectedPlan].period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plans[selectedPlan].features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}