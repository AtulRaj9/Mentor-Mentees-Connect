import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Star } from "lucide-react";

const Feedback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (sessionId) {
      checkAuth();
      loadSession();
    }
  }, [sessionId]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserId(user.id);
  };

  const loadSession = async () => {
    const { data, error } = await supabase
      .from("sessions")
      .select("*, mentor:profiles!sessions_mentor_id_fkey(name), mentee:profiles!sessions_mentee_id_fkey(name)")
      .eq("id", sessionId!)
      .single();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Failed to load session",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    setSession(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("feedback").insert({
      session_id: sessionId!,
      rating,
      comment,
      given_by: userId,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Success",
      description: "Feedback submitted successfully",
    });
    navigate("/dashboard");
  };

  const otherPerson = session
    ? session.mentor_id === userId
      ? session.mentee?.name
      : session.mentor?.name
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
      <div className="container max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Leave Feedback for {otherPerson}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  How would you rate this session?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-all"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= rating
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Comments (optional)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share your experience..."
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;