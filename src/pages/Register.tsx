import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";

type UserRole = "company_master" | "company_user" | "interviewer";

const roles = [
  {
    id: "company_master" as UserRole,
    title: "Company Admin",
    description: "Create and manage your company account, purchase credits, and invite team members",
    icon: Building2,
  },
  {
    id: "company_user" as UserRole,
    title: "Company User",
    description: "Schedule interviews and access reports for your organization",
    icon: User,
  },
  {
    id: "interviewer" as UserRole,
    title: "Lation Interviewer",
    description: "Conduct technical interviews and evaluate candidates",
    icon: Check,
  },
];

const Register = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    // Simulate registration - will be replaced with actual auth
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center">
          <Link to="/" className="flex items-center gap-3 justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">L</span>
            </div>
            <span className="text-3xl font-bold text-primary-foreground">Lation</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Join Lation
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Start your journey to better technical hiring with expert interviews and AI-powered insights.
          </p>

          <div className="mt-12 flex flex-col gap-4 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm">1</div>
              <span>Choose your role</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm">2</div>
              <span>Create your account</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm">3</div>
              <span>Start scheduling interviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Lation</span>
            </Link>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            </div>

            {step === 1 ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Role</h2>
                  <p className="text-muted-foreground">
                    Select how you'll be using Lation
                  </p>
                </div>

                <div className="space-y-4">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className="w-full p-4 rounded-xl border border-border hover:border-primary bg-card hover:bg-secondary/50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <role.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{role.title}</h3>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={() => setStep(1)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back
                  </button>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Account</h2>
                  <p className="text-muted-foreground">
                    {selectedRole === "company_master" && "Set up your company account"}
                    {selectedRole === "company_user" && "Join your company's team"}
                    {selectedRole === "interviewer" && "Apply as a Lation Interviewer"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  {selectedRole === "company_master" && (
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="companyName"
                          name="companyName"
                          placeholder="Acme Inc."
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {selectedRole === "company_user" && (
                    <div className="space-y-2">
                      <Label htmlFor="companyCode">Company Invite Code</Label>
                      <Input
                        id="companyCode"
                        name="companyCode"
                        placeholder="Enter code from your admin"
                        value={formData.companyCode}
                        onChange={handleInputChange}
                        className="h-11"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              </>
            )}

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
