
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { motion } from "framer-motion";
import { Bus, MapPin, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

// Leaflet imports
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Remove default marker icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

// Custom shuttle icon
const shuttleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/2554/2554936.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Custom stop icon
const stopIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/447/447031.png",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

// Bennett University coordinates (approximate)
const BENNETT_COORDINATES = [28.4513, 77.5826];

const ShuttleMap = () => {
  const { routes, shuttles } = useData();
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [mapObj, setMapObj] = useState<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayersRef = useRef<L.LayerGroup[]>([]);
  const [mapInitError, setMapInitError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapObj) return;
    
    try {
      console.log("Initializing map...");
      
      // Create map after a short delay to ensure container is properly sized
      setTimeout(() => {
        if (!mapContainerRef.current) return;
        
        const map = L.map(mapContainerRef.current, {
          zoomControl: !isMobile, // Hide zoom controls on mobile
          attributionControl: !isMobile, // Hide attribution on mobile
          dragging: true,
          tap: true
        }).setView(BENNETT_COORDINATES as L.LatLngExpression, 15);
        
        setMapObj(map);
        
        console.log("Map created successfully");
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);
        
        console.log("Tile layer added");
        
        // Create markers layer group
        markersLayerRef.current = L.layerGroup().addTo(map);
        
        // Create a layer group for each route
        if (routes && routes.length > 0) {
          routes.forEach(() => {
            const routeLayer = L.layerGroup().addTo(map);
            routeLayersRef.current.push(routeLayer);
          });
        }
        
        console.log("Layer groups created");
        
        // Add campus marker
        L.marker(BENNETT_COORDINATES as L.LatLngExpression, {
          icon: new L.Icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/128/5662/5662990.png",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
          })
        })
        .bindPopup("<b>Bennett University</b><br>Main Campus")
        .addTo(map);
        
        console.log("Campus marker added");
        
        // Update loading state
        setLoading(false);
        
        // Fix Leaflet rendering issues by triggering a resize event
        setTimeout(() => {
          map.invalidateSize();
        }, 250);
      }, 100);
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapInitError(`Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
    
    // Cleanup
    return () => {
      if (mapObj) {
        console.log("Removing map");
        mapObj.remove();
      }
    };
  }, [mapContainerRef, routes, isMobile]);
  
  // Fix map size on window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapObj) {
        mapObj.invalidateSize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mapObj]);
  
  // Update markers when shuttles or selected route changes
  useEffect(() => {
    if (!mapObj || !markersLayerRef.current) return;
    
    try {
      // Clear existing markers
      markersLayerRef.current.clearLayers();
      
      // Add shuttle markers
      if (shuttles && shuttles.length > 0) {
        shuttles
          .filter(shuttle => shuttle.status === "active" && shuttle.currentLocation)
          .forEach(shuttle => {
            if (!shuttle.currentLocation) return;
            
            const marker = L.marker(
              [shuttle.currentLocation.lat, shuttle.currentLocation.lng] as L.LatLngExpression,
              { icon: shuttleIcon }
            )
            .bindPopup(`
              <b>${shuttle.name}</b><br>
              Driver: ${shuttle.driverName}<br>
              Contact: ${shuttle.driverContact}<br>
              Status: Active
            `);
            
            marker.addTo(markersLayerRef.current!);
          });
      }
    } catch (error) {
      console.error("Error updating markers:", error);
    }
    
  }, [shuttles, selectedRoute, mapObj]);
  
  // Draw routes and stops when routes or selected route changes
  useEffect(() => {
    if (!mapObj || !routes || routes.length === 0) return;
    
    try {
      // Clear all route layers
      routeLayersRef.current.forEach(layer => layer.clearLayers());
      
      // Draw selected route or all routes
      routes.forEach((route, index) => {
        // Skip if we have a selected route and this isn't it
        if (selectedRoute && selectedRoute !== route.id) return;
        
        // Skip if index is out of bounds
        if (index >= routeLayersRef.current.length) return;
        
        const routeLayer = routeLayersRef.current[index];
        
        // Get stops as LatLng array for the polyline
        const routePoints = route.stops.map(stop => 
          [stop.location.lat, stop.location.lng] as L.LatLngExpression
        );
        
        // Draw route line
        if (routePoints.length > 1) {
          L.polyline(routePoints, {
            color: route.color || '#3B82F6',
            weight: 5,
            opacity: 0.7
          }).addTo(routeLayer);
        }
        
        // Add stop markers
        route.stops.forEach((stop, stopIndex) => {
          const isStart = stopIndex === 0;
          const isEnd = stopIndex === route.stops.length - 1;
          let markerColor = stopIcon;
          
          // Use different colors for start and end
          if (isStart || isEnd) {
            markerColor = new L.Icon({
              iconUrl: isStart 
                ? "https://cdn-icons-png.flaticon.com/128/1301/1301421.png"
                : "https://cdn-icons-png.flaticon.com/128/1301/1301459.png",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            });
          }
          
          L.marker(
            [stop.location.lat, stop.location.lng] as L.LatLngExpression, 
            { icon: markerColor }
          )
          .bindPopup(`
            <b>${stop.name}</b><br>
            Stop #${stop.order}<br>
            Route: ${route.name}
          `)
          .addTo(routeLayer);
        });
        
        // If this is the selected route, fit bounds
        if (selectedRoute === route.id && routePoints.length > 0) {
          mapObj.fitBounds(routePoints);
        }
      });
      
      // If no route is selected, fit all markers
      if (!selectedRoute) {
        // Create bounds
        const bounds = L.latLngBounds([BENNETT_COORDINATES as L.LatLngExpression]);
        
        // Add all stops to bounds
        routes.forEach(route => {
          route.stops.forEach(stop => {
            bounds.extend([stop.location.lat, stop.location.lng]);
          });
        });
        
        // Add all shuttles to bounds
        if (shuttles && shuttles.length > 0) {
          shuttles
            .filter(shuttle => shuttle.currentLocation)
            .forEach(shuttle => {
              if (shuttle.currentLocation) {
                bounds.extend([shuttle.currentLocation.lat, shuttle.currentLocation.lng]);
              }
            });
        }
        
        // Fit bounds with padding
        mapObj.fitBounds(bounds, { padding: [30, 30] });
      }
    } catch (error) {
      console.error("Error drawing routes:", error);
    }
    
  }, [routes, selectedRoute, mapObj, shuttles]);
  
  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId === selectedRoute ? null : routeId);
  };

  const handleRetry = () => {
    setLoading(true);
    setMapInitError(null);
    
    // Clean up any existing map
    if (mapObj) {
      mapObj.remove();
      setMapObj(null);
    }
    
    // Reset layers
    markersLayerRef.current = null;
    routeLayersRef.current = [];
  };
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-2 sm:px-0"
      >
        <h1 className="text-2xl sm:text-3xl font-bold">Live Shuttle Map</h1>
        <p className="text-sm sm:text-base text-gray-600">Track shuttles and routes in real-time</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden h-[400px] md:h-[550px]">
            {loading ? (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-500">Loading map...</p>
                </div>
              </div>
            ) : mapInitError ? (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="flex flex-col items-center px-4 text-center">
                  <div className="h-12 w-12 text-red-500 rounded-full border border-red-500 flex items-center justify-center mb-2">
                    <span className="text-xl font-bold">!</span>
                  </div>
                  <p className="mt-2 text-red-500">{mapInitError}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleRetry}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <div 
                  ref={mapContainerRef} 
                  className="absolute inset-0"
                  style={{ touchAction: "manipulation" }}
                ></div>
                
                {/* Map Legend - Simplified on mobile */}
                <div className={`absolute ${isMobile ? 'bottom-4 right-4' : 'top-4 right-4'} z-10 bg-white p-2 sm:p-3 rounded-lg shadow max-w-[160px] sm:max-w-none`}>
                  <h3 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">Legend</h3>
                  <div className="space-y-1 sm:space-y-2">
                    {routes && (!isMobile || routes.length <= 3) && routes.map(route => (
                      <div key={route.id} className="flex items-center">
                        <div 
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2" 
                          style={{ backgroundColor: route.color }}
                        ></div>
                        <span className="text-xs truncate">{route.name}</span>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <Bus className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-1 sm:mr-2" />
                      <span className="text-xs">Active Shuttle</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1 sm:mr-2" />
                      <span className="text-xs">Shuttle Stop</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="routes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="routes" className="text-sm">Routes</TabsTrigger>
              <TabsTrigger value="shuttles" className="text-sm">Shuttles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="routes" className="h-[320px] sm:h-[400px] md:h-[500px] overflow-y-auto">
              <Card className="border">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base sm:text-lg">Available Routes</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4 space-y-2 sm:space-y-4">
                  {routes && routes.map(route => (
                    <motion.div
                      key={route.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer border-l-4 transition-colors touch-target ${
                          selectedRoute === route.id
                            ? 'bg-gray-50 border-blue-500'
                            : ''
                        }`}
                        style={{ borderLeftColor: selectedRoute === route.id ? '' : route.color }}
                        onClick={() => handleRouteSelect(route.id)}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-sm sm:text-base">{route.name}</h3>
                              <p className="text-xs sm:text-sm text-gray-500">
                                {route.stops.length} stops • {route.estimatedTime} min
                              </p>
                            </div>
                            <Badge variant={route.active ? "default" : "outline"} className="text-xs">
                              {route.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          
                          {selectedRoute === route.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3 }}
                              className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t"
                            >
                              <p className="text-xs sm:text-sm mb-2">{route.description}</p>
                              <div className="space-y-1 sm:space-y-2 max-h-[150px] sm:max-h-[200px] overflow-y-auto pr-1">
                                {route.stops.map((stop, index) => (
                                  <div key={stop.id} className="flex items-center">
                                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                      <span className="text-xs">{index + 1}</span>
                                    </div>
                                    <span className="text-xs sm:text-sm">{stop.name}</span>
                                    <span className="text-xs text-gray-500 ml-auto">
                                      {stop.estimatedTimeFromStart} min
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 sm:mt-4">
                                <Button 
                                  size={isMobile ? "sm" : "default"}
                                  variant="outline"
                                  className="w-full text-xs sm:text-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = "/book";
                                  }}
                                >
                                  Book This Route
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {(!routes || routes.length === 0) && (
                    <div className="py-8 text-center text-gray-500 text-sm">
                      No routes available at the moment
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shuttles" className="h-[320px] sm:h-[400px] md:h-[500px] overflow-y-auto">
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base sm:text-lg">Active Shuttles</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4 space-y-2 sm:space-y-4">
                  {shuttles && shuttles.filter(s => s.status === "active").map((shuttle) => (
                    <motion.div
                      key={shuttle.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="overflow-hidden">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Bus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-sm sm:text-base">{shuttle.name}</div>
                              <div className="text-xs sm:text-sm text-gray-500">Driver: {shuttle.driverName}</div>
                            </div>
                            <div className="ml-auto">
                              <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            </div>
                          </div>
                          
                          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-dashed">
                            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                              <div>
                                <p className="text-gray-500">License</p>
                                <p>{shuttle.licensePlate || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Capacity</p>
                                <p>{shuttle.capacity} seats</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {(!shuttles || shuttles.filter(s => s.status === "active").length === 0) && (
                    <div className="py-8 text-center text-gray-500 text-sm">
                      No active shuttles at the moment
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ShuttleMap;
