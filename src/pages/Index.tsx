import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Calendar, Star, TrendingUp, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              DES MentorConnect
            </h1>
          </div>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} variant="default">
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate("/auth")} variant="ghost">
                  Sign In
                </Button>
                <Button onClick={() => navigate("/auth")} variant="hero">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Connect.{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Learn.
              </span>{" "}
              Grow.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Bridge the gap between senior and junior students at Deccan Education Society.
              Find mentors, share knowledge, and grow together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                variant="hero"
                className="text-lg px-8"
              >
                Find a Mentor
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                variant="outline"
                className="text-lg px-8"
              >
                Become a Mentor
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            Why Choose DES MentorConnect?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Easy Discovery</h4>
                <p className="text-muted-foreground">
                  Find mentors by department, year, and skills with our intuitive search system
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 bg-accent/10 rounded-full w-fit">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Simple Scheduling</h4>
                <p className="text-muted-foreground">
                  Book mentorship sessions with just a few clicks and manage them easily
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Feedback System</h4>
                <p className="text-muted-foreground">
                  Rate and review sessions to help others find the best mentors
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 bg-accent/10 rounded-full w-fit">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Track Progress</h4>
                <p className="text-muted-foreground">
                  Monitor your learning journey and see your growth over time
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">DES Community</h4>
                <p className="text-muted-foreground">
                  Built specifically for Deccan Education Society students
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 bg-accent/10 rounded-full w-fit">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Student-Built</h4>
                <p className="text-muted-foreground">
                  Created by students, for students, with love and dedication
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 mb-16">
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
            <CardContent className="py-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join hundreds of students already benefiting from peer mentorship at DES
              </p>
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                variant="hero"
                className="text-lg px-8"
              >
                Create Your Account
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 DES MentorConnect. Built with ❤️ for Deccan Education Society students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
