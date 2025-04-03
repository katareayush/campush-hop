
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Map, Calendar, ClipboardList, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/shuttles", label: "Shuttles", icon: Calendar },
    { path: "/admin/routes", label: "Routes", icon: Map },
    { path: "/admin/bookings", label: "Bookings", icon: ClipboardList },
    { path: "/admin/users", label: "Users", icon: Users },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top header for mobile */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 md:hidden">
        <div className="flex items-center justify-between p-4">
          <Link to="/admin" className="flex items-center">
            <span className="text-xl font-bold text-campus-primary">CampusHop Admin</span>
          </Link>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <h2 className="text-xl font-bold">Admin Menu</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <nav className="flex-1 py-6">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center px-3 py-2 rounded-md text-sm ${
                            isActive(item.path)
                              ? "bg-campus-primary text-white"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={closeMenu}
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="py-4 mt-auto border-t">
                  <Button variant="outline" className="w-full" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop sidebar */}
      <div className="flex flex-1">
        <aside className="sticky top-0 hidden h-screen w-64 border-r border-gray-200 bg-white p-5 md:block">
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <Link to="/admin" className="flex items-center">
                <span className="text-xl font-bold text-campus-primary">CampusHop Admin</span>
              </Link>
            </div>
            
            <nav className="flex-1">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-md ${
                        isActive(item.path)
                          ? "bg-campus-primary text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="pt-4 mt-auto border-t border-gray-200">
              <Button variant="outline" className="w-full" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6">
          <div className="container max-w-6xl mx-auto page-transition">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom navigation for mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 mobile-bottom-safe md:hidden">
        <nav className="flex justify-around">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center flex-1 py-2 ${
                isActive(item.path) ? "text-campus-primary" : "text-gray-500"
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive(item.path) ? "text-campus-primary" : "text-gray-500"}`} />
              <span className="text-xs mt-0.5">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminLayout;
