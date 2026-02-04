import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Check, ArrowRight, CreditCard, Sparkles, Building2 } from "lucide-react";
import { toast } from "sonner";

const packages = [
  {
    id: "starter",
    name: "Starter",
    credits: 10,
    price: 299,
    pricePerCredit: 29.9,
    description: "Perfect for small teams or occasional hiring needs",
    features: [
      "10 interview credits",
      "24-hour report delivery",
      "AI-generated questions",
      "PDF evaluation reports",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    credits: 25,
    price: 649,
    pricePerCredit: 25.96,
    description: "Ideal for growing companies with regular hiring",
    features: [
      "25 interview credits",
      "Priority scheduling",
      "Advanced AI insights",
      "Custom question templates",
      "Dedicated account manager",
      "Phone & email support",
    ],
    popular: true,
  },
  {
    id: "scale",
    name: "Scale",
    credits: 50,
    price: 1199,
    pricePerCredit: 23.98,
    description: "Built for teams with high-volume hiring needs",
    features: [
      "50 interview credits",
      "Same-day scheduling",
      "Premium AI analysis",
      "White-label reports",
      "API access",
      "Priority 24/7 support",
    ],
    popular: false,
  },
];

const Credits = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = (packageId: string) => {
    setSelectedPackage(packageId);
    setIsProcessing(true);

    // Simulate purchase - will be replaced with actual Stripe integration
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Credits purchased successfully!");
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Lation</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-primary/10 mb-6">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Credit Packages</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Purchase Interview Credits
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Credits are used to schedule technical interviews. Choose the package that fits your hiring needs.
          </p>
        </motion.div>

        {/* Current Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <p className="text-primary-foreground/80 mb-2">Current Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-primary-foreground">15</span>
              <span className="text-primary-foreground/70">credits remaining</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center px-6 border-r border-primary-foreground/20">
              <p className="text-2xl font-bold text-primary-foreground">24</p>
              <p className="text-sm text-primary-foreground/70">Used this month</p>
            </div>
            <div className="text-center px-6">
              <p className="text-2xl font-bold text-primary-foreground">$24.99</p>
              <p className="text-sm text-primary-foreground/70">Avg. per interview</p>
            </div>
          </div>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`relative ${pkg.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div
                className={`h-full bg-card rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:shadow-xl ${
                  pkg.popular ? "border-primary shadow-lg" : "border-border hover:border-primary/30"
                }`}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">${pkg.price}</span>
                  </div>
                  <p className="text-sm text-primary mt-2 font-medium">
                    {pkg.credits} credits • ${pkg.pricePerCredit.toFixed(2)}/credit
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={pkg.popular ? "accent" : "outline"}
                  className="w-full"
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={isProcessing && selectedPackage === pkg.id}
                >
                  {isProcessing && selectedPackage === pkg.id ? (
                    "Processing..."
                  ) : (
                    <>
                      Purchase {pkg.credits} Credits
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl border border-border p-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-6 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">Enterprise Plan</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Need unlimited interviews, custom SLA agreements, or dedicated interviewers? 
            Let's create a tailored solution for your organization.
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Credits;
