import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Menu,
  X,
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
  const { state, toggleSidebar, isMobile, openMobile, setOpenMobile } =
    useSidebar();
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
    <>
      {/* Mobile overlay */}
      {openMobile && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={toggleSidebar}
        />
      )}
      <Sidebar collapsible="icon" className="bg-white border-r relative z-50">
        <SidebarHeader className="h-16 flex flex-col justify-center px-4 border-b border-gray-100">
          <div className="flex items-center gap-2 w-full pt-1">
            {/* <div className="bg-blue-600 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0">
            EP
          </div> */}
            <Factory className="w-6 h-6 text-[#F97316] shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full overflow-hidden">
                <span className="font-semibold text-gray-900 truncate">
                  Manufacturing ERP
                </span>
                {!isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className="text-gray-900 hover:bg-gray-100 p-1 rounded-md shrink-0 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="py-2">
          <SidebarMenu className="px-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <SidebarMenuItem key={item.id} className="mb-1">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setOpenMobile(false);
                    }}
                    className={`
                    w-full flex items-center gap-3 px-3 py-2 cursor-pointer
                    transition-all duration-200 ease-in-out text-sm relative rounded-md
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium hover:bg-blue-50 hover:text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md" />
                      )}
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
                          isActive ? "text-blue-600" : "text-gray-500"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          {/* <div className="px-4 mt-6 mb-2">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quick Actions
            </h3>
          )}
        </div>
        
        <SidebarMenu className="px-2">
          <SidebarMenuItem className="mb-1">
            <SidebarMenuButton
              asChild
              tooltip="Help & Support"
              className="w-full flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-200 ease-in-out text-sm relative rounded-md text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center gap-3 w-full">
                <HelpCircle className="w-5 h-5 shrink-0 text-gray-500" />
                <span className="truncate">Help & Support</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Documentation"
              className="w-full flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-200 ease-in-out text-sm relative rounded-md text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center gap-3 w-full">
                <FileText className="w-5 h-5 shrink-0 text-gray-500" />
                <span className="truncate">Documentation</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-100 p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="w-full flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 h-auto"
                  >
                    <Avatar className="h-8 w-8 shrink-1">
                      <AvatarFallback className="bg-blue-400 text-white rounded-2xl text-sm font-medium">
                        {getInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-900 truncate w-full">
                        {currentUser.name}
                      </span>
                      <span className="text-xs text-gray-500 truncate w-full">
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
                    avatar
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        {isCollapsed && !isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm text-gray-500 hover:text-gray-900 z-50 flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </Sidebar>
    </>
  );
};

const LayoutShell = () => {
  const { currentUser, mockUsers, switchUser } = useAuth();
  const navigate = useNavigate();
  const { toggleSidebar, isMobile, openMobile } = useSidebar();

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative z-30">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={toggleSidebar}
            >
              {isMobile && openMobile ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <Search className="w-5 h-5 text-gray-400 hidden sm:block" />
            <Input
              placeholder="Search..."
              className="border-0 focus-visible:ring-0 bg-gray-50 hidden sm:flex"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher for Demo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
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
  );
};

const Layout = () => {
  return (
    <SidebarProvider>
      <LayoutShell />
    </SidebarProvider>
  );
};

export default Layout;
