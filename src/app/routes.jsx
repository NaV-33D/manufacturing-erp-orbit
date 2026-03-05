import React from "react";
import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagementMaster";
import MasterData from "./pages/MasterData";
import BomRouting from "./pages/BomRouting";
import SalesOrder from "./pages/SalesOrder";
import MRPPlanning from "./pages/MRPPlanning";
import Purchase from "./pages/Purchase";
import GRN from "./pages/GRN";
import Inventory from "./pages/Inventory";
import WorkOrder from "./pages/WorkOrder";
import QCLab from "./pages/QCLab";
import Dispatch from "./pages/Dispatch";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import RequireAuth from "../security/RequireAuth";

// helpers for route protection
import { protect } from "../security/routePerms.jsx";
import Settings from "./pages/Settings.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/unauthorized",
    element: (
      <RequireAuth>
        <Unauthorized />
      </RequireAuth>
    ),
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: protect("/", <Dashboard />) },
      { path: "users", element: protect("/users", <UserManagement />) },
      { path: "master-data", element: protect("/master-data", <MasterData />) },
      { path: "bom-routing", element: protect("/bom-routing", <BomRouting />) },
      { path: "sales", element: protect("/sales", <SalesOrder />) },
      { path: "mrp", element: protect("/mrp", <MRPPlanning />) },
      { path: "purchase", element: protect("/purchase", <Purchase />) },
      { path: "grn", element: protect("/grn", <GRN />) },
      { path: "inventory", element: protect("/inventory", <Inventory />) },
      { path: "work-order", element: protect("/work-order", <WorkOrder />) },
      { path: "qc", element: protect("/qc", <QCLab />) },
      { path: "dispatch", element: protect("/dispatch", <Dispatch />) },
      { path: "reports", element: protect("/reports", <Reports />) },
      { path: "/settings", element: protect("/settings", <Settings />) },
    ],
  },
]);
