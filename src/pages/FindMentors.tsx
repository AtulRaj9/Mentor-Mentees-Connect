import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, UserPlus, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const FindMentors = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mentors, setMentors] = useState<any[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [userRole, setUserRole] = useState<"mentor" | "mentee">("mentee");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionNote, setSessionNote] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadMentors();
    }
  }, [currentUserId, userRole]);

  useEffect(() => {
    const filtered = mentors.filter((mentor) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        mentor.name.toLowerCase().includes(searchLower) ||
        mentor.department.toLowerCase().includes(searchLower) ||
        (mentor.skills || []).some((skill: string) =>
          skill.toLowerCase().includes(searchLower)
        );
      const matchesDept = departmentFilter === "all" || mentor.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
    setFilteredMentors(filtered);
  }, [searchTerm, mentors, departmentFilter]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    setCurrentUserId(user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile) {
      setUserRole(profile.role);
    }
  };

  const loadMentors = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", userRole === "mentor" ? "mentee" : "mentor");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load mentors",
        variant: "destructive",
      });
      return;
    }

    setMentors(data || []);
    setFilteredMentors(data || []);

    const uniqueDepts = Array.from(new Set(data?.map(m => m.department) || []));
    setDepartments(uniqueDepts);
  };

  const handleConnect = async (mentorId: string) => {
    const { error } = await supabase.from("connections").insert({
      mentor_id: userRole === "mentor" ? currentUserId : mentorId,
      mentee_id: userRole === "mentor" ? mentorId : currentUserId,
      status: "pending",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
      return;
    }

    await supabase.from("notifications").insert({
      user_id: mentorId,
      title: "New Connection Request",
      message: `You have a new connection request`,
      type: "connection",
    });

    toast({
      title: "Success",
      description: "Connection request sent!",
    });
  };

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !sessionDate || !sessionTime) return;

    const { error } = await supabase.from("sessions").insert({
      mentor_id: selectedMentor.id,
      mentee_id: currentUserId,
      date: sessionDate,
      time: sessionTime,
      mentee_note: sessionNote,
      status: "pending",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to book session",
        variant: "destructive",
      });
      return;
    }

    await supabase.from("notifications").insert({
      user_id: selectedMentor.id,
      title: "New Session Request",
      message: `New session request for ${sessionDate}`,
      type: "session",
    });

    toast({
      title: "Success",
      description: "Session request sent!",
    });
    setSelectedMentor(null);
    setSessionDate("");
    setSessionTime("");
    setSessionNote("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
      <div className="container mx-auto">
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
            <CardTitle>Find {userRole === "mentor" ? "Mentees" : "Mentors"}</CardTitle>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredMentors.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No {userRole === "mentor" ? "mentees" : "mentors"} found
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMentors.map((mentor) => (
                  <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-2">{mentor.name}</h3>
                      <div className="space-y-1 mb-3">
                        <Badge variant="secondary">{mentor.department}</Badge>
                        <Badge variant="outline">{mentor.year}</Badge>
                      </div>
                      {mentor.skills && mentor.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {mentor.skills.slice(0, 3).map((skill: string) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleConnect(mentor.id)}
                          className="flex-1"
                          variant="outline"
                          size="sm"
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Connect
                        </Button>
                        {userRole === "mentee" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => setSelectedMentor(mentor)}
                                className="flex-1"
                                size="sm"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Book
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Book Session with {mentor.name}</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleBookSession} className="space-y-4">
                                <div>
                                  <Label htmlFor="date">Date</Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={sessionDate}
                                    onChange={(e) => setSessionDate(e.target.value)}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="time">Time</Label>
                                  <Input
                                    id="time"
                                    type="time"
                                    value={sessionTime}
                                    onChange={(e) => setSessionTime(e.target.value)}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="note">Note (optional)</Label>
                                  <Textarea
                                    id="note"
                                    value={sessionNote}
                                    onChange={(e) => setSessionNote(e.target.value)}
                                    placeholder="What would you like to learn?"
                                    rows={3}
                                  />
                                </div>
                                <Button type="submit" className="w-full">
                                  Send Session Request
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FindMentors;
