import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  CalendarIcon, 
  Plus, 
  X, 
  FileText,
  CheckCircle2,
  Clock,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobDescription: "",
    additionalComments: "",
    recruiterEmail: "",
    ccEmails: [] as string[],
    newCcEmail: "",
    resume: null as File | null,
  });
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [availabilityNotes, setAvailabilityNotes] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCcEmail = () => {
    if (formData.newCcEmail && formData.newCcEmail.includes("@")) {
      setFormData({
        ...formData,
        ccEmails: [...formData.ccEmails, formData.newCcEmail],
        newCcEmail: "",
      });
    }
  };

  const handleRemoveCcEmail = (email: string) => {
    setFormData({
      ...formData,
      ccEmails: formData.ccEmails.filter((e) => e !== email),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDates.length === 0) {
      toast.error("Please select at least one available date");
      return;
    }

    setIsLoading(true);
    
    // Simulate submission - will be replaced with actual API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Interview request submitted successfully!");
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
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Schedule Your Interview
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fill in the details below to request a technical interview. Our expert interviewers will evaluate your candidate within 24 hours.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[
            { icon: FileText, label: "Details" },
            { icon: CalendarIcon, label: "Availability" },
            { icon: Users, label: "Submit" },
          ].map((step, index) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">{step.label}</span>
              {index < 2 && <div className="w-12 h-px bg-border hidden sm:block" />}
            </div>
          ))}
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Job Description Section */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Job Details</h2>
                <p className="text-sm text-muted-foreground">Describe the role and requirements</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="jobDescription" className="text-base">
                  Job Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  placeholder="Paste the complete job description here, including required skills, experience level, and responsibilities..."
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  className="min-h-[200px] resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Include technical requirements, frameworks, and specific skills to evaluate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalComments" className="text-base">
                  Additional Evaluation Notes
                </Label>
                <Textarea
                  id="additionalComments"
                  name="additionalComments"
                  placeholder="Any specific areas you want us to focus on? Particular concerns or must-have skills?"
                  value={formData.additionalComments}
                  onChange={handleInputChange}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload Section */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Candidate Resume</h2>
                <p className="text-sm text-muted-foreground">Upload the candidate's resume</p>
              </div>
            </div>

            <div className="space-y-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                  formData.resume ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}
              >
                {formData.resume ? (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-foreground">{formData.resume.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, resume: null })}
                      className="ml-4 p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-foreground mb-1">Drop file here or click to upload</p>
                    <p className="text-sm text-muted-foreground">PDF or DOCX, max 10MB</p>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Candidate Availability</h2>
                <p className="text-sm text-muted-foreground">Select available dates for the interview</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base mb-3 block">Select Available Dates <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11",
                        selectedDates.length === 0 && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDates.length > 0
                        ? `${selectedDates.length} date(s) selected`
                        : "Select dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={(dates) => setSelectedDates(dates || [])}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                {selectedDates.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedDates.map((date) => (
                      <span
                        key={date.toISOString()}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {format(date, "MMM d, yyyy")}
                        <button
                          type="button"
                          onClick={() => setSelectedDates(selectedDates.filter((d) => d !== date))}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="availabilityNotes" className="text-base">Time Preferences</Label>
                <Textarea
                  id="availabilityNotes"
                  placeholder="e.g., Mornings only, after 2 PM EST, flexible..."
                  value={availabilityNotes}
                  onChange={(e) => setAvailabilityNotes(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>
                <p className="text-sm text-muted-foreground">Who should receive the evaluation report?</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recruiterEmail" className="text-base">
                  Primary Recruiter Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="recruiterEmail"
                  name="recruiterEmail"
                  type="email"
                  placeholder="recruiter@company.com"
                  value={formData.recruiterEmail}
                  onChange={handleInputChange}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">CC Recipients</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Add email to CC"
                    value={formData.newCcEmail}
                    onChange={(e) => setFormData({ ...formData, newCcEmail: e.target.value })}
                    className="h-11"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCcEmail())}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddCcEmail}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.ccEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.ccEmails.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => handleRemoveCcEmail(email)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Credit Info */}
          <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">This interview will use 1 credit</p>
              <p className="text-sm text-muted-foreground">You have 10 credits remaining</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button type="button" variant="outline" size="lg" asChild>
              <Link to="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" variant="accent" size="lg" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Interview Request"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.form>
      </main>
    </div>
  );
};

export default ScheduleInterview;
