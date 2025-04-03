
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { Bus, MapPin, Clock, Users } from "lucide-react";

const AdminDashboard = () => {
  const { shuttles, routes, bookings } = useData();
  
  // Calculate statistics
  const activeShuttles = shuttles.filter(s => s.status === "active").length;
  const activeRoutes = routes.filter(r => r.active).length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const totalBookingsToday = bookings.filter(b => {
    const bookingDate = new Date(b.bookingTime);
    const today = new Date();
    return bookingDate.getDate() === today.getDate() &&
           bookingDate.getMonth() === today.getMonth() &&
           bookingDate.getFullYear() === today.getFullYear();
  }).length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage the campus shuttle system</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Shuttles</CardTitle>
            <Bus className="w-5 h-5 text-campus-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeShuttles}</div>
            <p className="text-sm text-muted-foreground">
              out of {shuttles.length} total shuttles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <MapPin className="w-5 h-5 text-campus-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeRoutes}</div>
            <p className="text-sm text-muted-foreground">
              out of {routes.length} total routes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="w-5 h-5 text-campus-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingBookings}</div>
            <p className="text-sm text-muted-foreground">
              awaiting confirmation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
            <Users className="w-5 h-5 text-campus-dark" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBookingsToday}</div>
            <p className="text-sm text-muted-foreground">
              total rides booked today
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest shuttle bookings across campus</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 5).map(booking => (
                  <div key={booking.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{booking.userName}</div>
                      <div className="text-sm text-gray-500">
                        {booking.pickupStopName} → {booking.dropoffStopName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(booking.scheduledTime).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        booking.status === "confirmed" 
                          ? "bg-green-100 text-green-800" 
                          : booking.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : booking.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No bookings found</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Shuttle Status</CardTitle>
            <CardDescription>Current status of all shuttles</CardDescription>
          </CardHeader>
          <CardContent>
            {shuttles.length > 0 ? (
              <div className="space-y-4">
                {shuttles.map(shuttle => (
                  <div key={shuttle.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{shuttle.name}</div>
                      <div className="text-sm text-gray-500">
                        Driver: {shuttle.driverName}
                      </div>
                      <div className="text-xs text-gray-400">
                        Capacity: {shuttle.capacity} passengers
                      </div>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        shuttle.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : shuttle.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-orange-100 text-orange-800"
                      }`}>
                        {shuttle.status.charAt(0).toUpperCase() + shuttle.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No shuttles found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
