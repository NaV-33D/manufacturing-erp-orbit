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
  Search,
  LogOut,
} from "lucide-react";
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

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
} from "./ui/sidebar";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasModule, currentUser } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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
    <Sidebar collapsible="icon" className="bg-white border-r">
      <SidebarHeader className="h-16 flex items-center justify-center px-4 border-b border-gray-100">
        <div className="flex items-center gap-2 w-full pt-1">
          <Factory className="w-6 h-6 text-[#F97316] shrink-0" />
          {!isCollapsed && (
            <span className="font-semibold text-gray-900 truncate">
              Manufacturing ERP
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarMenu>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex items-center gap-3 px-3 py-2 cursor-pointer
transition-all duration-200 ease-in-out text-md font-medium
${
  isActive
    ? "bg-blue-700 text-white font-medium text-lg"
    : "text-gray-700 hover:bg-gray-100"
}
                  `}
                >
                  <div>
                    <Icon
                      size={56}
                      className={` transition-colors duration-200 ${
                        isActive ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 h-auto"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="bg-blue-600 text-white rounded-lg text-xs">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left flex-1 truncate">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {currentUser.role}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

const Layout = () => {
  const { currentUser, mockUsers, switchUser } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
        <AppSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                  >
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
                      className={
                        currentUser.id === user.id
                          ? "bg-accent"
                          : "cursor-pointer"
                      }
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

              {/* User Profile on Top Nav - Keeping it as requested */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {getInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <div className="text-sm font-medium text-gray-900">
                        {currentUser.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {currentUser.role}
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6 bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
