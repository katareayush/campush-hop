
import React, { createContext, useContext, useState, useEffect } from "react";

// Types for our data models
export interface Shuttle {
  id: string;
  name: string;
  capacity: number;
  licensePlate?: string; // Added this property
  currentLocation?: {
    lat: number;
    lng: number;
  };
  status: "active" | "inactive" | "maintenance";
  driverName: string;
  driverContact: string;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  stops: RouteStop[];
  color: string;
  estimatedTime: number; // in minutes
  active: boolean;
}

export interface RouteStop {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  order: number;
  estimatedTimeFromStart: number; // in minutes
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string; // Added this property
  routeId: string;
  routeName: string;
  shuttleId: string;
  shuttleName: string;
  pickupStopId: string;
  pickupStopName: string;
  dropoffStopId: string;
  dropoffStopName: string;
  bookingTime: string;
  scheduledTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isAdmin?: boolean; // Added this property
  studentId?: string;
  profileImage?: string;
  createdAt: string;
}

// Context interface
interface DataContextType {
  shuttles: Shuttle[];
  routes: Route[];
  bookings: Booking[];
  users: User[]; // Added this property
  userBookings: (userId: string) => Booking[];
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => void;
  cancelBooking: (bookingId: string) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void; // Added this method
  getRoute: (routeId: string) => Route | undefined;
  getShuttle: (shuttleId: string) => Shuttle | undefined;
  updateShuttle: (shuttle: Shuttle) => void;
  updateRoute: (route: Route) => void;
  addShuttle: (shuttle: Omit<Shuttle, "id">) => void;
  addRoute: (route: Omit<Route, "id">) => void;
  deleteShuttle: (shuttleId: string) => void;
  deleteRoute: (routeId: string) => void;
  loading: boolean;
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Sample data for our app
const SAMPLE_ROUTES: Route[] = [
  {
    id: "route_1",
    name: "Main Campus Loop",
    description: "Circles around the main campus buildings",
    color: "#3B82F6",
    estimatedTime: 15,
    active: true,
    stops: [
      {
        id: "stop_1",
        name: "Main Gate",
        location: { lat: 28.4513, lng: 77.5826 },
        order: 1,
        estimatedTimeFromStart: 0
      },
      {
        id: "stop_2",
        name: "Academic Block",
        location: { lat: 28.4520, lng: 77.5835 },
        order: 2,
        estimatedTimeFromStart: 3
      },
      {
        id: "stop_3",
        name: "Hostel Complex",
        location: { lat: 28.4530, lng: 77.5840 },
        order: 3,
        estimatedTimeFromStart: 7
      },
      {
        id: "stop_4",
        name: "Sports Center",
        location: { lat: 28.4525, lng: 77.5850 },
        order: 4,
        estimatedTimeFromStart: 10
      },
      {
        id: "stop_5",
        name: "Main Gate",
        location: { lat: 28.4513, lng: 77.5826 },
        order: 5,
        estimatedTimeFromStart: 15
      }
    ]
  },
  {
    id: "route_2",
    name: "City Connector",
    description: "Connects campus to major city locations",
    color: "#0D9488",
    estimatedTime: 30,
    active: true,
    stops: [
      {
        id: "stop_6",
        name: "Main Gate",
        location: { lat: 28.4513, lng: 77.5826 },
        order: 1,
        estimatedTimeFromStart: 0
      },
      {
        id: "stop_7",
        name: "Metro Station",
        location: { lat: 28.4570, lng: 77.5920 },
        order: 2,
        estimatedTimeFromStart: 10
      },
      {
        id: "stop_8",
        name: "Shopping Mall",
        location: { lat: 28.4600, lng: 77.5950 },
        order: 3,
        estimatedTimeFromStart: 15
      },
      {
        id: "stop_9",
        name: "City Center",
        location: { lat: 28.4630, lng: 77.5980 },
        order: 4,
        estimatedTimeFromStart: 20
      },
      {
        id: "stop_10",
        name: "Main Gate",
        location: { lat: 28.4513, lng: 77.5826 },
        order: 5,
        estimatedTimeFromStart: 30
      }
    ]
  }
];

const SAMPLE_SHUTTLES: Shuttle[] = [
  {
    id: "shuttle_1",
    name: "Shuttle A",
    capacity: 20,
    licensePlate: "HR-01-A-1234",
    currentLocation: { lat: 28.4520, lng: 77.5830 },
    status: "active",
    driverName: "Rajesh Kumar",
    driverContact: "+91 9876543210"
  },
  {
    id: "shuttle_2",
    name: "Shuttle B",
    capacity: 15,
    licensePlate: "HR-01-B-5678",
    currentLocation: { lat: 28.4580, lng: 77.5930 },
    status: "active",
    driverName: "Amit Singh",
    driverContact: "+91 9876543211"
  },
  {
    id: "shuttle_3",
    name: "Shuttle C",
    capacity: 25,
    licensePlate: "HR-01-C-9012",
    status: "maintenance",
    driverName: "Suresh Patel",
    driverContact: "+91 9876543212"
  }
];

// Sample users for our app
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

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "booking_1",
    userId: "2",
    userName: "Student User",
    userEmail: "student@bennett.edu.in",
    routeId: "route_1",
    routeName: "Main Campus Loop",
    shuttleId: "shuttle_1",
    shuttleName: "Shuttle A",
    pickupStopId: "stop_1",
    pickupStopName: "Main Gate",
    dropoffStopId: "stop_3",
    dropoffStopName: "Hostel Complex",
    bookingTime: new Date(Date.now() - 3600000).toISOString(),
    scheduledTime: new Date(Date.now() + 1800000).toISOString(),
    status: "confirmed",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shuttles, setShuttles] = useState<Shuttle[]>(SAMPLE_SHUTTLES);
  const [routes, setRoutes] = useState<Route[]>(SAMPLE_ROUTES);
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
  const [loading, setLoading] = useState(true);

  // Simulate loading data from MongoDB
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Here we would normally fetch data from MongoDB
      // For now we're using sample data
      console.log("Data loaded from simulated MongoDB");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter bookings for a specific user
  const userBookings = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  // Add a new booking
  const addBooking = (bookingData: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setBookings(prev => [...prev, newBooking]);
    
    // Here we would save to MongoDB
    console.log("Booking saved to simulated MongoDB", newBooking);
  };

  // Cancel a booking
  const cancelBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "cancelled" } 
          : booking
      )
    );
    
    // Here we would update in MongoDB
    console.log("Booking cancelled in simulated MongoDB", bookingId);
  };
  
  // Update a booking
  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, ...updates } 
          : booking
      )
    );
    
    // Here we would update in MongoDB
    console.log("Booking updated in simulated MongoDB", bookingId, updates);
  };

  // Get route by ID
  const getRoute = (routeId: string) => {
    return routes.find(route => route.id === routeId);
  };

  // Get shuttle by ID
  const getShuttle = (shuttleId: string) => {
    return shuttles.find(shuttle => shuttle.id === shuttleId);
  };

  // Update shuttle
  const updateShuttle = (updatedShuttle: Shuttle) => {
    setShuttles(prev => 
      prev.map(shuttle => 
        shuttle.id === updatedShuttle.id ? updatedShuttle : shuttle
      )
    );
    
    // Here we would update in MongoDB
    console.log("Shuttle updated in simulated MongoDB", updatedShuttle);
  };

  // Update route
  const updateRoute = (updatedRoute: Route) => {
    setRoutes(prev => 
      prev.map(route => 
        route.id === updatedRoute.id ? updatedRoute : route
      )
    );
    
    // Here we would update in MongoDB
    console.log("Route updated in simulated MongoDB", updatedRoute);
  };

  // Add shuttle
  const addShuttle = (shuttleData: Omit<Shuttle, "id">) => {
    const newShuttle: Shuttle = {
      ...shuttleData,
      id: `shuttle_${Date.now()}`
    };
    
    setShuttles(prev => [...prev, newShuttle]);
    
    // Here we would save to MongoDB
    console.log("Shuttle saved to simulated MongoDB", newShuttle);
  };

  // Add route
  const addRoute = (routeData: Omit<Route, "id">) => {
    const newRoute: Route = {
      ...routeData,
      id: `route_${Date.now()}`
    };
    
    setRoutes(prev => [...prev, newRoute]);
    
    // Here we would save to MongoDB
    console.log("Route saved to simulated MongoDB", newRoute);
  };

  // Delete shuttle
  const deleteShuttle = (shuttleId: string) => {
    setShuttles(prev => prev.filter(shuttle => shuttle.id !== shuttleId));
    
    // Here we would delete from MongoDB
    console.log("Shuttle deleted from simulated MongoDB", shuttleId);
  };

  // Delete route
  const deleteRoute = (routeId: string) => {
    setRoutes(prev => prev.filter(route => route.id !== routeId));
    
    // Here we would delete from MongoDB
    console.log("Route deleted from simulated MongoDB", routeId);
  };

  return (
    <DataContext.Provider
      value={{
        shuttles,
        routes,
        bookings,
        users,
        userBookings,
        addBooking,
        cancelBooking,
        updateBooking,
        getRoute,
        getShuttle,
        updateShuttle,
        updateRoute,
        addShuttle,
        addRoute,
        deleteShuttle,
        deleteRoute,
        loading
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
