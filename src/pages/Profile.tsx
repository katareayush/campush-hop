import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Shield, BookUser } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { userBookings } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const bookings = user ? userBookings(user.id) : [];
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        studentId: user.studentId || "",
        phone: "",
      });
    }
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      updateProfile({
        name: formData.name,
        studentId: formData.studentId,
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600">Manage your account information and view your activity</p>
      </motion.div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="activity">Activity & Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-1"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Photo</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full">Change Photo</Button>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium">{user.isAdmin ? "Administrator" : "Student"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookUser className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Bookings</p>
                      <p className="font-medium">{bookings.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input 
                          id="email"
                          name="email"
                          value={formData.email}
                          className="pl-10"
                          placeholder="Your email address"
                          disabled
                        />
                      </div>
                      <p className="text-sm text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input 
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        placeholder="BU20210001"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input 
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </motion.div>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Your shuttle booking history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex flex-col md:flex-row md:items-center pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            booking.status === "confirmed" ? "bg-green-500" :
                            booking.status === "completed" ? "bg-blue-500" :
                            booking.status === "cancelled" ? "bg-red-500" :
                            "bg-amber-500"
                          }`}></div>
                          <span className="font-medium">{booking.routeName}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          {booking.pickupStopName} → {booking.dropoffStopName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(booking.scheduledTime).toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Badge 
                          variant={
                            booking.status === "confirmed" ? "default" :
                            booking.status === "completed" ? "secondary" :
                            booking.status === "cancelled" ? "destructive" :
                            "outline"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <div className="mb-4 flex justify-center">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="mb-2">You haven't made any bookings yet</p>
                    <Button variant="outline" onClick={() => window.location.href = "/book"}>
                      Book a Shuttle
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
