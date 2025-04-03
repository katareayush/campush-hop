
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useData, Route, RouteStop } from "@/contexts/DataContext";
import { Calendar, Clock, MapPin, Bus } from "lucide-react";

const BookShuttle = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { routes, shuttles, addBooking } = useData();
  
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [pickupStop, setPickupStop] = useState<string>("");
  const [dropoffStop, setDropoffStop] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  const selectedRouteObj = routes.find(route => route.id === selectedRoute);
  
  // Generate time slots for the next 12 hours, every 30 minutes
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    for (let i = 0; i < 24; i++) {
      let hour = (currentHour + Math.floor(i / 2)) % 24;
      let minute = i % 2 === 0 ? 0 : 30;
      
      // Skip past time slots
      if (i === 0 && currentMinute > 30) continue;
      if (i === 1 && currentMinute > 30) continue;
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      
      slots.push({
        id: timeString,
        time: timeString,
        date: date.toISOString(),
        label: date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      });
    }
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  
  const handleSelectRoute = (routeId: string) => {
    setSelectedRoute(routeId);
    setPickupStop("");
    setDropoffStop("");
  };
  
  const handleSubmit = () => {
    if (!selectedRoute || !selectedTime || !pickupStop || !dropoffStop) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (pickupStop === dropoffStop) {
      toast({
        title: "Invalid selection",
        description: "Pickup and dropoff locations cannot be the same",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Find an available shuttle for this route
    const availableShuttle = shuttles.find(s => s.status === "active");
    
    if (!availableShuttle) {
      toast({
        title: "No shuttles available",
        description: "Sorry, there are no shuttles available at this time",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    // Find the selected route
    const route = routes.find(r => r.id === selectedRoute);
    
    if (!route) {
      toast({
        title: "Route not found",
        description: "The selected route could not be found",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    // Find pickup and dropoff stops
    const pickup = route.stops.find(s => s.id === pickupStop);
    const dropoff = route.stops.find(s => s.id === dropoffStop);
    
    if (!pickup || !dropoff) {
      toast({
        title: "Invalid stops",
        description: "The selected stops could not be found",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    // Create the booking
    const selectedTimeObj = timeSlots.find(t => t.id === selectedTime);
    
    if (!selectedTimeObj) {
      toast({
        title: "Invalid time slot",
        description: "The selected time slot is not available",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    // Add booking to context
    addBooking({
      userId: user?.id || "",
      userName: user?.name || "",
      routeId: route.id,
      routeName: route.name,
      shuttleId: availableShuttle.id,
      shuttleName: availableShuttle.name,
      pickupStopId: pickup.id,
      pickupStopName: pickup.name,
      dropoffStopId: dropoff.id,
      dropoffStopName: dropoff.name,
      bookingTime: new Date().toISOString(),
      scheduledTime: selectedTimeObj.date,
      status: "confirmed"
    });
    
    // Success message
    toast({
      title: "Booking successful!",
      description: `Your shuttle will arrive at ${pickup.name} at ${selectedTimeObj.label}`,
    });
    
    // Reset form
    setSelectedRoute("");
    setSelectedTime("");
    setPickupStop("");
    setDropoffStop("");
    setLoading(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Book a Shuttle</h1>
        <p className="text-gray-600">Reserve your spot on the next campus shuttle</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Route selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bus className="w-5 h-5 text-campus-primary" />
              <CardTitle>Select Route</CardTitle>
            </div>
            <CardDescription>Choose a shuttle route for your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="route">Route</Label>
                <Select
                  value={selectedRoute}
                  onValueChange={handleSelectRoute}
                >
                  <SelectTrigger id="route" className="w-full">
                    <SelectValue placeholder="Select a route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map(route => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name} ({route.estimatedTime} mins)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedRouteObj && (
                <div className="p-3 mt-2 space-y-2 border rounded-lg border-muted">
                  <h4 className="font-medium">{selectedRouteObj.name}</h4>
                  <p className="text-sm text-gray-600">{selectedRouteObj.description}</p>
                  <div 
                    className="w-full h-2 rounded-full" 
                    style={{ backgroundColor: selectedRouteObj.color }}
                  ></div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-600">
                      {selectedRouteObj.stops.length} stops • {selectedRouteObj.estimatedTime} min journey
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Time selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-campus-primary" />
              <CardTitle>Select Time</CardTitle>
            </div>
            <CardDescription>Choose when you want to travel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Departure Time</Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.slice(0, 6).map((slot) => (
                    <Button 
                      key={slot.id}
                      variant={selectedTime === slot.id ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedTime(slot.id)}
                    >
                      {slot.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {selectedTime && (
                <div className="p-3 mt-2 space-y-2 border rounded-lg border-muted">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-campus-primary" />
                    <span className="font-medium">
                      {new Date().toLocaleDateString(undefined, { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-campus-primary" />
                    <span className="font-medium">
                      {timeSlots.find(t => t.id === selectedTime)?.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      
        {/* Pickup location */}
        {selectedRouteObj && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-campus-primary" />
                <CardTitle>Pickup Location</CardTitle>
              </div>
              <CardDescription>Where will you board the shuttle?</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={pickupStop} 
                onValueChange={setPickupStop}
                className="space-y-2"
              >
                {selectedRouteObj.stops.map(stop => (
                  <div key={stop.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={stop.id} id={`pickup-${stop.id}`} />
                    <Label 
                      htmlFor={`pickup-${stop.id}`}
                      className="flex-1 p-2 transition-colors border rounded-md cursor-pointer hover:bg-muted"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{stop.name}</div>
                          <div className="text-xs text-gray-500">
                            Stop #{stop.order} • {stop.estimatedTimeFromStart} min from start
                          </div>
                        </div>
                        {dropoffStop === stop.id && (
                          <div className="text-xs text-red-500">
                            Cannot be the same as drop-off
                          </div>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )}
        
        {/* Dropoff location */}
        {selectedRouteObj && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-campus-secondary" />
                <CardTitle>Drop-off Location</CardTitle>
              </div>
              <CardDescription>Where will you exit the shuttle?</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={dropoffStop} 
                onValueChange={setDropoffStop}
                className="space-y-2"
              >
                {selectedRouteObj.stops.map(stop => (
                  <div key={stop.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={stop.id} id={`dropoff-${stop.id}`} />
                    <Label 
                      htmlFor={`dropoff-${stop.id}`}
                      className="flex-1 p-2 transition-colors border rounded-md cursor-pointer hover:bg-muted"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{stop.name}</div>
                          <div className="text-xs text-gray-500">
                            Stop #{stop.order} • {stop.estimatedTimeFromStart} min from start
                          </div>
                        </div>
                        {pickupStop === stop.id && (
                          <div className="text-xs text-red-500">
                            Cannot be the same as pickup
                          </div>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading || !selectedRoute || !selectedTime || !pickupStop || !dropoffStop || pickupStop === dropoffStop}
          className="px-8"
          size="lg"
        >
          {loading ? "Booking..." : "Book Shuttle"}
        </Button>
      </div>
    </div>
  );
};

export default BookShuttle;
