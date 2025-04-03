
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Bus, Clock, Calendar, MapPin } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const navigateToApp = () => {
    if (!user) {
      navigate("/login");
    } else if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/book");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <header className="bg-gradient-to-r from-campus-primary to-campus-secondary text-white">
        <div className="container flex flex-col items-center px-4 py-16 mx-auto text-center md:py-32 md:px-10 lg:px-32">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl animate-fade-in">
            Campus<span className="text-campus-accent">Hop</span>
          </h1>
          <p className="max-w-lg mt-4 text-xl md:text-2xl animate-fade-in">
            Bennett University's Smart Shuttle Booking System
          </p>
          <Button 
            onClick={navigateToApp}
            size="lg" 
            className="px-8 py-6 mt-8 text-lg bg-white hover-scale text-campus-primary hover:bg-gray-100"
          >
            {user ? "Go to Dashboard" : "Get Started"}
          </Button>
        </div>
      </header>

      {/* Features section */}
      <section className="py-12 bg-white md:py-20">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">
            Get Around Campus Easily
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white rounded-lg shadow hover:shadow-md hover-scale">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-campus-primary text-white">
                <Bus className="w-8 h-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Track Shuttles</h3>
              <p className="text-gray-600">See real-time locations of all campus shuttles</p>
            </div>
            
            <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white rounded-lg shadow hover:shadow-md hover-scale">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-campus-secondary text-white">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Book Rides</h3>
              <p className="text-gray-600">Reserve your spot on the next available shuttle</p>
            </div>
            
            <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white rounded-lg shadow hover:shadow-md hover-scale">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-campus-accent text-campus-dark">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Find Routes</h3>
              <p className="text-gray-600">Explore shuttle routes and stop locations</p>
            </div>
            
            <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white rounded-lg shadow hover:shadow-md hover-scale">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-campus-dark text-white">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Save Time</h3>
              <p className="text-gray-600">Never miss a shuttle with timely notifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 bg-gray-50 md:py-20">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Hop On?</h2>
          <p className="max-w-lg mx-auto mb-8 text-xl text-gray-600">
            Download the app and start booking campus shuttles today
          </p>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <Button 
              onClick={navigateToApp}
              size="lg" 
              className="w-full md:w-auto px-8 hover-scale"
            >
              {user ? "Go to Dashboard" : "Sign Up Now"}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full md:w-auto px-8 hover-scale"
              onClick={() => navigate("/login")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-campus-dark text-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h3 className="text-2xl font-bold">Campus<span className="text-campus-accent">Hop</span></h3>
              <p className="text-gray-300">Bennett University's Campus Shuttle Service</p>
            </div>
            <div>
              <p className="text-gray-300">&copy; {new Date().getFullYear()} CampusHop. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
