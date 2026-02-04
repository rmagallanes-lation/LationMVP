import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  Calendar,
  CreditCard,
  FileText,
  Users,
  Plus,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Download,
} from "lucide-react";

// Mock data for demonstration
const recentInterviews = [
  {
    id: 1,
    position: "Senior React Developer",
    candidate: "John Smith",
    status: "completed",
    date: "Dec 28, 2025",
    score: "Strong Hire",
  },
  {
    id: 2,
    position: "Backend Engineer",
    candidate: "Sarah Johnson",
    status: "scheduled",
    date: "Dec 30, 2025",
    time: "2:00 PM",
  },
  {
    id: 3,
    position: "DevOps Specialist",
    candidate: "Mike Chen",
    status: "pending",
    date: "Awaiting confirmation",
  },
  {
    id: 4,
    position: "Full Stack Developer",
    candidate: "Emily Davis",
    status: "completed",
    date: "Dec 26, 2025",
    score: "Hire",
  },
];

const stats = [
  { label: "Total Interviews", value: "24", icon: Calendar, change: "+3 this month" },
  { label: "Credits Remaining", value: "15", icon: CreditCard, change: "of 25 total" },
  { label: "Pending Reports", value: "2", icon: FileText, change: "Due in 24h" },
  { label: "Team Members", value: "5", icon: Users, change: "+1 this week" },
];

const Dashboard = () => {
  const [userRole] = useState<"company" | "interviewer">("company"); // Will be dynamic

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Clock className="w-3 h-3" />
            Scheduled
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold text-foreground">Lation</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/schedule"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Plus className="w-5 h-5" />
              Schedule Interview
            </Link>
            <Link
              to="/interviews"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Interviews
            </Link>
            <Link
              to="/reports"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <FileText className="w-5 h-5" />
              Reports
            </Link>
            <Link
              to="/team"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Users className="w-5 h-5" />
              Team
            </Link>
            <Link
              to="/credits"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              Credits
            </Link>
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
            <Settings className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Mobile Logo */}
            <div className="lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">L</span>
                </div>
              </Link>
            </div>

            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, John</p>
            </div>

            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
              </Button>
              <Button variant="accent" asChild>
                <Link to="/schedule">
                  <Plus className="w-4 h-4 mr-2" />
                  New Interview
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-primary mt-2">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Interviews */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card rounded-xl border border-border">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Recent Interviews</h2>
                  <p className="text-sm text-muted-foreground">Track your interview requests</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/interviews">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="divide-y divide-border">
                {recentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-foreground truncate">
                            {interview.position}
                          </h3>
                          {getStatusBadge(interview.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {interview.candidate} • {interview.date}
                          {interview.time && ` at ${interview.time}`}
                        </p>
                      </div>
                      {interview.status === "completed" && (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${interview.score === "Strong Hire"
                                ? "text-green-600"
                                : "text-primary"
                              }`}
                          >
                            {interview.score}
                          </span>
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* Credits Card */}
              <div className="bg-primary rounded-xl p-6 text-primary-foreground">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Credit Balance</h3>
                  <CreditCard className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-4xl font-bold mb-1">15</p>
                <p className="text-primary-foreground/70 text-sm mb-4">credits remaining</p>
                <Button
                  variant="secondary"
                  className="w-full bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0"
                  asChild
                >
                  <Link to="/credits">Buy More Credits</Link>
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/schedule">
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Interview
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/team">
                      <Users className="w-4 h-4 mr-2" />
                      Invite Team Member
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/reports">
                      <FileText className="w-4 h-4 mr-2" />
                      View Reports
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
