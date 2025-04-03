
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
import { useToast } from "@/hooks/use-toast";
import { useData, Route } from "@/contexts/DataContext";
import { MapPin, Plus, Pencil, Trash } from "lucide-react";

const Routes = () => {
  const { routes, deleteRoute } = useData();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleDeleteRoute = async (routeId: string) => {
    setDeletingId(routeId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    deleteRoute(routeId);
    
    toast({
      title: "Route deleted",
      description: "The route has been deleted successfully.",
    });
    
    setDeletingId(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shuttle Routes</h1>
          <p className="text-gray-600">Manage your shuttle routes and stops</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Route
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Routes</CardTitle>
          <CardDescription>A list of all shuttle routes and their stops</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Stops</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: route.color }}
                      ></div>
                      <div className="font-medium">{route.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      {route.stops.length} Stops
                    </div>
                  </TableCell>
                  <TableCell>{route.estimatedTime} min</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      route.active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {route.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteRoute(route.id)}
                        disabled={deletingId === route.id}
                      >
                        {deletingId === route.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                        ) : (
                          <Trash className="w-4 h-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {routes.map((route) => (
        <Card key={route.id}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: route.color }}
              ></div>
              <CardTitle>{route.name}</CardTitle>
            </div>
            <CardDescription>{route.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col">
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    {route.stops.map((stop, index) => (
                      <div key={stop.id} className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-campus-primary"></div>
                        {index < route.stops.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex-1 space-y-8">
                    {route.stops.map(stop => (
                      <div key={stop.id} className="py-2">
                        <p className="font-medium">{stop.name}</p>
                        <p className="text-sm text-gray-500">
                          Stop #{stop.order} • {stop.estimatedTimeFromStart} min from start
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Routes;
