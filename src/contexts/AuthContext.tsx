
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

// Define the user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isAdmin?: boolean;
  studentId?: string;
  profileImage?: string;
  createdAt?: string;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, studentId: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAdmin: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demo (would normally be in a database)
const SAMPLE_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@bennett.edu.in",
    role: "admin",
    isAdmin: true,
    profileImage: "/placeholder.svg",
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "2",
    name: "Student User",
    email: "student@bennett.edu.in",
    role: "user",
    isAdmin: false,
    studentId: "BU20210001",
    profileImage: "/placeholder.svg",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('campusHopUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("User loaded from localStorage", parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('campusHopUser');
      }
    }
    setLoading(false);
  }, []);
  
  // Login function (simulated)
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user with matching email (in real app, would check password hash)
    const foundUser = SAMPLE_USERS.find(u => u.email === email);
    
    if (foundUser && password === "password") {
      // Set the user's role and isAdmin property
      const userData = {
        ...foundUser,
        isAdmin: foundUser.role === "admin"
      };
      
      setUser(userData);
      localStorage.setItem('campusHopUser', JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
      
      // Navigate based on user role
      if (userData.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/book');
      }
      
      console.log("User logged in and saved to simulated MongoDB", userData);
      
      setLoading(false);
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };
  
  // Register function (simulated)
  const register = async (name: string, email: string, password: string, studentId: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if email already exists
    if (SAMPLE_USERS.some(u => u.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email already exists. Please use a different email.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
    
    // Create new user (in real app, would store in database)
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: "user",
      isAdmin: false,
      studentId,
      profileImage: "/placeholder.svg",
      createdAt: new Date().toISOString()
    };
    
    // Update local state (in real app, would be database operation)
    SAMPLE_USERS.push(newUser);
    
    setUser(newUser);
    localStorage.setItem('campusHopUser', JSON.stringify(newUser));
    
    toast({
      title: "Registration successful",
      description: `Welcome to Campus Hop, ${newUser.name}!`,
    });
    
    console.log("New user registered and saved to simulated MongoDB", newUser);
    
    navigate('/book');
    setLoading(false);
    return true;
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusHopUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };
  
  // Update profile function
  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('campusHopUser', JSON.stringify(updatedUser));
      
      // Update user in sample users array (simulating DB update)
      const userIndex = SAMPLE_USERS.findIndex(u => u.id === user.id);
      if (userIndex >= 0) {
        SAMPLE_USERS[userIndex] = { ...SAMPLE_USERS[userIndex], ...updates };
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      console.log("User profile updated in simulated MongoDB", updatedUser);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin: user?.isAdmin || false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
