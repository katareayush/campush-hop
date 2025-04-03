import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { Calendar, Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Bookings = () => {
  const { bookings } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = bookings.filter(booking =>
    booking.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.pickupStopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.dropoffStopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookingStatusChange = (bookingId: string, newStatus: string) => {
    // Simulate updating booking status
    toast({
      title: "Booking status updated",
      description: `Booking ${bookingId} status changed to ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-gray-600">View and manage all shuttle bookings</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>A list of all shuttle bookings in the system</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search bookings..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Dropoff</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{booking.routeName}</TableCell>
                    <TableCell>{booking.pickupStopName}</TableCell>
                    <TableCell>{booking.dropoffStopName}</TableCell>
                    <TableCell>
                      {new Date(booking.scheduledTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "completed"
                              ? "secondary"
                              : booking.status === "cancelled"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBookingStatusChange(booking.id, "confirmed")}
                              >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="sr-only">Confirm</span>
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBookingStatusChange(booking.id, "cancelled")}
                              >
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span className="sr-only">Cancel</span>
                              </Button>
                            </motion.div>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBookingStatusChange(booking.id, "completed")}
                            >
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="sr-only">Mark Complete</span>
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Bookings;
