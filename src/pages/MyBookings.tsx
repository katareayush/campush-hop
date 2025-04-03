
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Clock, Calendar, MapPin, Bus, X } from "lucide-react";
import { useState } from "react";

const MyBookings = () => {
  const { user } = useAuth();
  const { userBookings, cancelBooking } = useData();
  const { toast } = useToast();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  // Get user's bookings
  const myBookings = user ? userBookings(user.id) : [];
  
  // Filter bookings by status
  const upcomingBookings = myBookings.filter(b => 
    b.status === "confirmed" || b.status === "pending"
  );
  const pastBookings = myBookings.filter(b => 
    b.status === "completed" || b.status === "cancelled"
  );
  
  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    cancelBooking(bookingId);
    
    toast({
      title: "Booking cancelled",
      description: "Your shuttle booking has been cancelled successfully."
    });
    
    setCancellingId(null);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-gray-600">Manage your shuttle reservations</p>
      </div>
      
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming" className="relative">
            Upcoming
            {upcomingBookings.length > 0 && (
              <span className="absolute top-0.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-campus-primary text-xs text-white">
                {upcomingBookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="p-3 mb-4 rounded-full bg-gray-100">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium">No upcoming bookings</h3>
                <p className="mt-1 text-gray-500">
                  You don't have any upcoming shuttle bookings
                </p>
                <Button 
                  variant="default" 
                  className="mt-6"
                  onClick={() => window.location.href = '/book'}
                >
                  Book a Shuttle
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div 
                  className="h-2" 
                  style={{ 
                    backgroundColor: booking.status === "confirmed" ? "#10B981" : "#F59E0B"
                  }}
                ></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {booking.routeName}
                    </CardTitle>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === "confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <CardDescription>
                    Shuttle {booking.shuttleName} • Booking #{booking.id.slice(-5)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center mb-1">
                          <Clock className="w-4 h-4 mr-1 text-campus-primary" />
                          <span className="text-sm font-medium">Departure Time</span>
                        </div>
                        <p className="text-gray-600">
                          {formatDate(booking.scheduledTime)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <Calendar className="w-4 h-4 mr-1 text-campus-primary" />
                          <span className="text-sm font-medium">Booking Date</span>
                        </div>
                        <p className="text-gray-600">
                          {formatDate(booking.bookingTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-3 h-3 rounded-full bg-campus-primary"></div>
                          <div className="flex-1 w-px my-1 bg-gray-200"></div>
                          <div className="w-3 h-3 rounded-full bg-campus-secondary"></div>
                        </div>
                        <div className="flex-1 space-y-6">
                          <div>
                            <p className="text-sm font-medium">Pickup</p>
                            <p className="text-sm text-gray-600">{booking.pickupStopName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Dropoff</p>
                            <p className="text-sm text-gray-600">{booking.dropoffStopName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <Button
                        variant="outline"
                        className="text-red-500 hover:text-white hover:bg-red-500"
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                      >
                        {cancellingId === booking.id ? (
                          <>
                            <span className="animate-pulse">Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Cancel Booking
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="p-3 mb-4 rounded-full bg-gray-100">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium">No past bookings</h3>
                <p className="mt-1 text-gray-500">
                  You don't have any past shuttle bookings
                </p>
              </CardContent>
            </Card>
          ) : (
            pastBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div 
                  className="h-2" 
                  style={{ 
                    backgroundColor: booking.status === "completed" ? "#6366F1" : "#EF4444"
                  }}
                ></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {booking.routeName}
                    </CardTitle>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === "completed" 
                        ? "bg-indigo-100 text-indigo-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <CardDescription>
                    Shuttle {booking.shuttleName} • Booking #{booking.id.slice(-5)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center mb-1">
                          <Clock className="w-4 h-4 mr-1 text-gray-500" />
                          <span className="text-sm font-medium">Departure Time</span>
                        </div>
                        <p className="text-gray-600">
                          {formatDate(booking.scheduledTime)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                          <span className="text-sm font-medium">Booking Date</span>
                        </div>
                        <p className="text-gray-600">
                          {formatDate(booking.bookingTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                          <div className="flex-1 w-px my-1 bg-gray-200"></div>
                          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        </div>
                        <div className="flex-1 space-y-6">
                          <div>
                            <p className="text-sm font-medium">Pickup</p>
                            <p className="text-sm text-gray-600">{booking.pickupStopName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Dropoff</p>
                            <p className="text-sm text-gray-600">{booking.dropoffStopName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyBookings;
