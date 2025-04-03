
import { Outlet, Link, useLocation } from "react-router-dom";
import { Map, Calendar, User, Clock, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const UserLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSafariMobile, setIsSafariMobile] = useState(false);

  useEffect(() => {
    // Detect iOS Safari to apply specific CSS fixes
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const isSafari = iOS && webkit && !ua.match(/CriOS/i);
    setIsSafariMobile(isSafari);
  }, []);

  const navItems = [
    { path: "/book", label: "Book Shuttle", icon: Calendar },
    { path: "/map", label: "Live Map", icon: Map },
    { path: "/bookings", label: "My Bookings", icon: Clock },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top header for mobile */}
      <header className={`sticky top-0 z-30 bg-white border-b border-gray-200 md:hidden ${isSafariMobile ? 'mobile-top-safe' : ''}`}>
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center">
            <span className="text-lg font-bold text-campus-primary">CampusHop</span>
          </Link>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="touch-target">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="touch-target">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="py-4 mb-4 border-b">
                  <div className="flex items-center">
                    <div className="w-10 h-10 overflow-hidden rounded-full bg-campus-primary">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="object-cover w-full h-full" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-white">
                          {user?.name?.[0] || "U"}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <nav className="flex-1">
                  <ul className="space-y-1">
                    {navItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center px-3 py-3 rounded-md text-sm ${
                            isActive(item.path)
                              ? "bg-campus-primary text-white"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={closeMenu}
                        >
                          <item.icon className="w-4 h-4 mr-3" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="py-4 mt-auto border-t">
                  <Button variant="outline" className="w-full text-sm" onClick={logout}>
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
        <aside className="sticky top-0 hidden h-screen w-56 lg:w-64 border-r border-gray-200 bg-white p-4 md:block">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-campus-primary">CampusHop</span>
              </Link>
            </div>
            
            <nav className="flex-1">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-2.5 rounded-md ${
                        isActive(item.path)
                          ? "bg-campus-primary text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2.5" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="pt-4 mt-auto border-t border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 overflow-hidden rounded-full bg-campus-primary">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-white">
                      {user?.name?.[0] || "U"}
                    </div>
                  )}
                </div>
                <div className="ml-2.5">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full text-sm" onClick={logout}>
                Log Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          <div className="max-w-5xl mx-auto page-transition">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom navigation for mobile */}
      <div className={`fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 ${isSafariMobile ? 'mobile-bottom-safe' : ''} md:hidden`}>
        <nav className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center flex-1 py-2 touch-target ${
                isActive(item.path) ? "text-campus-primary" : "text-gray-500"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? "text-campus-primary" : "text-gray-500"}`} />
              <span className="text-xs mt-0.5">{item.label.split(" ")[0]}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default UserLayout;
