import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  Factory,
  LayoutDashboard,
  Users,
  Database,
  GitBranch,
  ShoppingCart,
  TrendingUp,
  Package,
  Warehouse,
  ClipboardList,
  Settings,
  FlaskConical,
  Truck,
  FileText,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, hasModule, mockUsers, switchUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
      module: "dashboard",
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      path: "/users",
      module: "users",
    },
    {
      id: "master-data",
      label: "Master Data",
      icon: Database,
      path: "/master-data",
      module: "masterData",
    },
    {
      id: "bom",
      label: "BOM & Routing",
      icon: GitBranch,
      path: "/bom-routing",
      module: "bom",
    },
    {
      id: "sales",
      label: "Sales Orders",
      icon: ShoppingCart,
      path: "/sales",
      module: "sales",
    },
    {
      id: "mrp",
      label: "MRP Planning",
      icon: TrendingUp,
      path: "/mrp",
      module: "mrp",
    },
    {
      id: "purchase",
      label: "Purchase",
      icon: Package,
      path: "/purchase",
      module: "purchase",
    },
    {
      id: "grn",
      label: "GRN",
      icon: ClipboardList,
      path: "/grn",
      module: "grn",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Warehouse,
      path: "/inventory",
      module: "inventory",
    },
    {
      id: "work-order",
      label: "Work Orders",
      icon: Settings,
      path: "/work-order",
      module: "workOrder",
    },
    {
      id: "qc",
      label: "QC Lab",
      icon: FlaskConical,
      path: "/qc",
      module: "qc",
    },
    {
      id: "dispatch",
      label: "Dispatch",
      icon: Truck,
      path: "/dispatch",
      module: "dispatch",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      path: "/reports",
      module: "reports",
    },
  ];

  const visibleNavItems = navigationItems.filter((item) =>
    hasModule(item.module),
  );

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <div
        className={`bg-[#0F172A] text-white transition-all duration-300 flex flex-col ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#334155]">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Factory className="w-6 h-6 text-[#F97316]" />
              <span className="font-semibold">Manufacturing ERP</span>
            </div>
          )}
          {sidebarCollapsed && (
            <Factory className="w-6 h-6 text-[#F97316] mx-auto" />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-[#0B74FF] text-white"
                    : "text-gray-300 hover:bg-[#334155]"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
                title={sidebarCollapsed ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-12 flex items-center justify-center border-t border-[#334155] hover:bg-[#334155] transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search..."
              className="border-0 focus-visible:ring-0 bg-gray-50"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher for Demo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Switch Role (Demo)
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Switch User Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockUsers.map((user) => (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => switchUser(user.id)}
                    className={currentUser.id === user.id ? "bg-accent" : ""}
                  >
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.role}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            {/* <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
            </button> */}

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors">
                  <Avatar>
                    <AvatarFallback className="bg-[#0B74FF] text-white">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentUser.role}
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
