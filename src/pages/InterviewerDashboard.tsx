import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  Calendar,
  FileText,
  User,
  Bell,
  Settings,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  Video,
  Star,
  Download,
  BarChart3,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for interviewer dashboard
const pendingRequests = [
  {
    id: 1,
    position: "Senior React Developer",
    company: "TechCorp Inc.",
    experience: "5+ years",
    skills: ["React", "TypeScript", "Node.js"],
    submitted: "2 hours ago",
  },
  {
    id: 2,
    position: "Backend Engineer",
    company: "DataFlow Labs",
    experience: "3-5 years",
    skills: ["Python", "Django", "PostgreSQL"],
    submitted: "5 hours ago",
  },
];

const upcomingInterviews = [
  {
    id: 1,
    position: "Full Stack Developer",
    candidate: "Alex Thompson",
    company: "InnovateLab",
    date: "Dec 30, 2025",
    time: "2:00 PM EST",
    meetingLink: "https://teams.microsoft.com/...",
  },
  {
    id: 2,
    position: "DevOps Engineer",
    candidate: "Maria Garcia",
    company: "CloudScale",
    date: "Dec 31, 2025",
    time: "10:00 AM EST",
    meetingLink: "https://teams.microsoft.com/...",
  },
];

const completedInterviews = [
  {
    id: 1,
    position: "Frontend Developer",
    candidate: "James Wilson",
    company: "ByteWorks",
    date: "Dec 27, 2025",
    status: "pending_evaluation",
  },
];

const InterviewerDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationData, setEvaluationData] = useState({
    recordingLink: "",
    technicalScore: 4,
    communicationScore: 4,
    problemSolvingScore: 4,
    comments: "",
    recommendation: "hire",
  });

  const handleAcceptRequest = (id: number) => {
    toast.success("Interview request accepted! AI is generating questions...");
    // In real app, this would trigger AI question generation
  };

  const handleRejectRequest = (id: number) => {
    toast.info("Interview request declined.");
  };

  const handleSubmitEvaluation = () => {
    toast.success("Evaluation submitted! PDF report will be generated and sent.");
    setShowEvaluation(false);
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
              to="/interviewer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/interviewer/requests"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              Interview Requests
              <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                {pendingRequests.length}
              </span>
            </Link>
            <Link
              to="/interviewer/upcoming"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Upcoming
            </Link>
            <Link
              to="/interviewer/evaluations"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <FileText className="w-5 h-5" />
              Evaluations
            </Link>
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">IN</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">Interviewer Name</p>
              <p className="text-xs text-muted-foreground truncate">Lation Interviewer</p>
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
            <div className="lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">L</span>
                </div>
              </Link>
            </div>

            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-foreground">Interviewer Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your interview assignments</p>
            </div>

            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{pendingRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{upcomingInterviews.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Interviews</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">47</p>
                  <p className="text-sm text-muted-foreground">Completed This Month</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pending Requests */}
            <div className="bg-card rounded-xl border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Pending Interview Requests</h2>
                <p className="text-sm text-muted-foreground">Review and accept new interviews</p>
              </div>
              <div className="divide-y divide-border">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{request.position}</h3>
                        <p className="text-sm text-muted-foreground">{request.company}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{request.submitted}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {request.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-card rounded-xl border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Upcoming Interviews</h2>
                <p className="text-sm text-muted-foreground">Your scheduled interviews</p>
              </div>
              <div className="divide-y divide-border">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{interview.position}</h3>
                        <p className="text-sm text-muted-foreground">
                          {interview.candidate} • {interview.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {interview.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {interview.time}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="accent" size="sm" className="flex-1">
                        <Video className="w-4 h-4 mr-1" />
                        Join Meeting
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Evaluations */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Pending Evaluations</h2>
                <p className="text-sm text-muted-foreground">Complete evaluations for finished interviews</p>
              </div>
              <div className="divide-y divide-border">
                {completedInterviews.map((interview) => (
                  <div key={interview.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{interview.position}</h3>
                        <p className="text-sm text-muted-foreground">
                          {interview.candidate} • {interview.company} • {interview.date}
                        </p>
                      </div>
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => setShowEvaluation(true)}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Submit Evaluation
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Evaluation Modal */}
      {showEvaluation && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Submit Evaluation</h2>
                <p className="text-sm text-muted-foreground">Frontend Developer - James Wilson</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowEvaluation(false)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Interview Recording Link</Label>
                <Input
                  placeholder="Paste Microsoft Teams recording link"
                  value={evaluationData.recordingLink}
                  onChange={(e) =>
                    setEvaluationData({ ...evaluationData, recordingLink: e.target.value })
                  }
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Technical Skills", key: "technicalScore" },
                  { label: "Communication", key: "communicationScore" },
                  { label: "Problem Solving", key: "problemSolvingScore" },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label>{item.label}</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          onClick={() =>
                            setEvaluationData({
                              ...evaluationData,
                              [item.key]: score,
                            })
                          }
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${(evaluationData as any)[item.key] >= score
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Recommendation</Label>
                <div className="flex gap-2">
                  {[
                    { value: "strong_hire", label: "Strong Hire", color: "bg-green-600" },
                    { value: "hire", label: "Hire", color: "bg-primary" },
                    { value: "no_hire", label: "No Hire", color: "bg-destructive" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setEvaluationData({ ...evaluationData, recommendation: option.value })
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${evaluationData.recommendation === option.value
                          ? `${option.color} text-primary-foreground`
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Comments</Label>
                <Textarea
                  placeholder="Detailed feedback about the candidate's performance..."
                  value={evaluationData.comments}
                  onChange={(e) =>
                    setEvaluationData({ ...evaluationData, comments: e.target.value })
                  }
                  className="min-h-[120px]"
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEvaluation(false)}>
                Cancel
              </Button>
              <Button variant="accent" onClick={handleSubmitEvaluation}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit Evaluation
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InterviewerDashboard;
