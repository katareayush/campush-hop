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
import { Bus, Plus, Search, Settings, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Shuttles = () => {
  const { shuttles } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredShuttles = shuttles.filter(shuttle => 
    shuttle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    shuttle.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteShuttle = (shuttleId: string) => {
    // Simulate deleting a shuttle
    toast({
      title: "Shuttle deleted",
      description: "The shuttle has been successfully deleted.",
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
          <h1 className="text-3xl font-bold">Shuttle Management</h1>
          <p className="text-gray-600">View and manage all shuttles</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Shuttle
          </Button>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-l-4 border-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Shuttles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{shuttles.length}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-l-4 border-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Shuttles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {shuttles.filter(s => s.status === "active").length}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden border-l-4 border-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Inactive Shuttles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {shuttles.filter(s => s.status === "inactive").length}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>All Shuttles</CardTitle>
            <CardDescription>A list of all shuttles in the system</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search shuttles..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShuttles.map((shuttle, index) => (
                  <motion.tr
                    key={shuttle.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-3">
                          <Bus className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-medium">{shuttle.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{shuttle.driverName}</TableCell>
                    <TableCell>{shuttle.capacity}</TableCell>
                    <TableCell>
                      <Badge variant={shuttle.status === "active" ? "default" : "outline"}>
                        {shuttle.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteShuttle(shuttle.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </motion.div>
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

export default Shuttles;
