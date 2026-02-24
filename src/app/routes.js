import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
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

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "users", Component: UserManagement },
      { path: "master-data", Component: MasterData },
      { path: "bom-routing", Component: BomRouting },
      { path: "sales", Component: SalesOrder },
      { path: "mrp", Component: MRPPlanning },
      { path: "purchase", Component: Purchase },
      { path: "grn", Component: GRN },
      { path: "inventory", Component: Inventory },
      { path: "work-order", Component: WorkOrder },
      { path: "qc", Component: QCLab },
      { path: "dispatch", Component: Dispatch },
      { path: "reports", Component: Reports },
    ],
  },
]);
