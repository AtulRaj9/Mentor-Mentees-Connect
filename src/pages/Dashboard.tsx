import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Search, LogOut, Edit, MessageSquare, Calendar, Star, CheckCircle, XCircle, Shield } from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadProfile();
    checkAdminRole();
  }, []);

  useEffect(() => {
    if (profile) {
      loadConnections();
      loadSessions();
    }
  }, [profile]);

  const checkAdminRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!data);
  };

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      navigate("/profile-setup");
      return;
    }

    setProfile(data);
    setLoading(false);
  };

  const loadConnections = async () => {
    const { data } = await supabase
      .from("connections")
      .select("*, mentor:profiles!connections_mentor_id_fkey(name, email), mentee:profiles!connections_mentee_id_fkey(name, email)")
      .or(`mentor_id.eq.${profile.id},mentee_id.eq.${profile.id}`)
      .order("created_at", { ascending: false });

    setConnections(data || []);
  };

  const loadSessions = async () => {
    const { data } = await supabase
      .from("sessions")
      .select("*, mentor:profiles!sessions_mentor_id_fkey(name), mentee:profiles!sessions_mentee_id_fkey(name), feedback(rating, comment)")
      .or(`mentor_id.eq.${profile.id},mentee_id.eq.${profile.id}`)
      .order("date", { ascending: false });

    setSessions(data || []);
  };

  const handleConnectionAction = async (connectionId: string, action: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("connections")
      .update({ status: action })
      .eq("id", connectionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update connection",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Connection ${action}`,
    });
    loadConnections();
  };

  const handleSessionAction = async (sessionId: string, status: "confirmed" | "rejected" | "completed") => {
    const { error } = await supabase
      .from("sessions")
      .update({ status })
      .eq("id", sessionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update session",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Session ${status}`,
    });
    loadSessions();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: "secondary",
      accepted: "default",
      confirmed: "default",
      rejected: "destructive",
      completed: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">DES MentorConnect</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            {isAdmin && (
              <Button onClick={() => navigate("/admin")} variant="ghost" size="icon">
                <Shield className="h-5 w-5" />
              </Button>
            )}
            <Button onClick={handleLogout} variant="ghost">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Welcome, {profile?.name}!</CardTitle>
            <Button onClick={() => navigate("/profile-edit")} variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Role:</strong> <span className="capitalize">{profile?.role}</span></p>
                <p><strong>Department:</strong> {profile?.department}</p>
                <p><strong>Year:</strong> {profile?.year}</p>
              </div>
              <div className="space-y-2">
                {profile?.skills && profile.skills.length > 0 && (
                  <div>
                    <strong>Skills:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.skills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/find-mentors")}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {profile?.role === "mentor" ? "Find Mentees" : "Find Mentors"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {profile?.role === "mentor" ? "Discover mentees" : "Discover mentors"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Sessions</h3>
                  <p className="text-sm text-muted-foreground">
                    {sessions.filter(s => s.status === "pending" || s.status === "confirmed").length} upcoming
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Connections</h3>
                  <p className="text-sm text-muted-foreground">
                    {connections.filter(c => c.status === "accepted").length} active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="connections">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Connections</CardTitle>
              </CardHeader>
              <CardContent>
                {connections.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No connections yet</p>
                ) : (
                  <div className="space-y-4">
                    {connections.map((connection) => {
                      const otherPerson = connection.mentor_id === profile.id ? connection.mentee : connection.mentor;
                      const isMentor = connection.mentor_id === profile.id;
                      return (
                        <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{otherPerson?.name}</p>
                            <div className="mt-2">{getStatusBadge(connection.status)}</div>
                          </div>
                          <div className="flex gap-2">
                            {connection.status === "accepted" && (
                              <Button onClick={() => navigate(`/messages?connection=${connection.id}`)} variant="outline" size="sm">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Chat
                              </Button>
                            )}
                            {connection.status === "pending" && isMentor && (
                              <>
                                <Button onClick={() => handleConnectionAction(connection.id, "accepted")} size="sm">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Accept
                                </Button>
                                <Button onClick={() => handleConnectionAction(connection.id, "rejected")} variant="destructive" size="sm">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>My Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No sessions yet</p>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => {
                      const otherPerson = session.mentor_id === profile.id ? session.mentee : session.mentor;
                      const isMentor = session.mentor_id === profile.id;
                      return (
                        <div key={session.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">Session with {otherPerson?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(session.date).toLocaleDateString()} at {session.time}
                              </p>
                            </div>
                            {getStatusBadge(session.status)}
                          </div>
                          <div className="flex gap-2 mt-3">
                            {session.status === "pending" && isMentor && (
                              <>
                                <Button onClick={() => handleSessionAction(session.id, "confirmed")} size="sm">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Confirm
                                </Button>
                                <Button onClick={() => handleSessionAction(session.id, "rejected")} variant="destructive" size="sm">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {session.status === "confirmed" && (
                              <Button onClick={() => handleSessionAction(session.id, "completed")} variant="outline" size="sm">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Complete
                              </Button>
                            )}
                            {session.status === "completed" && !session.feedback?.length && (
                              <Button onClick={() => navigate(`/feedback?session=${session.id}`)} variant="outline" size="sm">
                                <Star className="mr-2 h-4 w-4" />
                                Leave Feedback
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
