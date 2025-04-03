
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import BookShuttle from "@/pages/BookShuttle";
import MyBookings from "@/pages/MyBookings";
import ShuttleMap from "@/pages/ShuttleMap";
import Profile from "@/pages/Profile";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminShuttles from "@/pages/admin/Shuttles";
import AdminRoutes from "@/pages/admin/Routes";
import AdminBookings from "@/pages/admin/Bookings";
import AdminUsers from "@/pages/admin/Users";

// Layout Components
import UserLayout from "@/components/layouts/UserLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Routes */}
              <Route element={<ProtectedRoute role="user" />}>
                <Route element={<UserLayout />}>
                  <Route path="/book" element={<BookShuttle />} />
                  <Route path="/bookings" element={<MyBookings />} />
                  <Route path="/map" element={<ShuttleMap />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute role="admin" />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/shuttles" element={<AdminShuttles />} />
                  <Route path="/admin/routes" element={<AdminRoutes />} />
                  <Route path="/admin/bookings" element={<AdminBookings />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                </Route>
              </Route>
              
              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
