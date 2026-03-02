# Project Flow

This project is a frontend-only Manufacturing ERP dashboard built with React + Vite. It uses mock data and role-based access checks from context (no backend/API integration yet).

## 1) Application startup flow

1. `src/main.tsx` mounts `App`.
2. `src/app/App.tsx` wraps the app with:
   - `AuthProvider` (user, roles, permissions)
   - `RouterProvider` (page routing)
   - `Toaster` (notifications)
3. `src/app/routes.js` decides page rendering:
   - `/login` -> Login page
   - `/` -> Layout shell with sidebar + topbar + nested pages

## 2) Authentication and access flow

1. User opens `/login`.
2. Login submit navigates to `/` (conceptual login).
3. `AuthContext` provides current user + permission helpers:
   - `hasModule(module)` to show/hide module access
   - `hasPermission(module, action)` for create/read/update/delete/approve actions
4. Sidebar in `Layout.jsx` only shows modules allowed for the current role.
5. Each page checks permission/module and shows **Access Denied** card if unauthorized.

## 3) UI navigation flow

1. After login, user lands on Dashboard.
2. Sidebar drives module navigation:
   - Dashboard
   - User Management
   - Master Data
   - BOM & Routing
   - Sales Orders
   - MRP Planning
   - Purchase
   - GRN
   - Inventory
   - Work Orders
   - QC Lab
   - Dispatch
   - Reports
3. Topbar includes role switcher (demo mode), allowing quick permission simulation.

## 4) Core ERP business flow (functional flow)

Main operational flow represented by the screens:

1. **Master Data**
   - Create and maintain items, categories, UOM, work centers, warehouses.
2. **BOM & Routing**
   - Define product BOM (materials, yield, versions).
   - Define routing (step sequence, work centers, durations).
3. **Sales Orders**
   - Create customer orders (draft/confirm/delivered).
4. **MRP Planning**
   - Run MRP to calculate shortages from demand.
   - Generate purchase requisition suggestions.
5. **Purchase**
   - Create and approve purchase orders to vendors.
6. **GRN (Goods Receipt Note)**
   - Receive purchased materials by lot/batch.
   - Accept/reject receipt based on role permissions.
7. **Inventory**
   - Track on-hand, available, hold, allocated stock.
   - Track batches and hold stock.
8. **Work Orders**
   - Create/release production work orders using BOM + routing.
   - Execute production steps and capture output quantities.
9. **QC Lab**
   - Test incoming/produced batches.
   - Approve or reject batches.
10. **Dispatch**
    - Allocate available batches to sales orders.
    - Create delivery note and shipment details.
11. **Reports**
    - View/export production, yield, vendor, inventory aging, and QC reports.

## 5) End-to-end flow map

`Login -> Dashboard -> Master Data -> BOM & Routing -> Sales Orders -> MRP -> Purchase -> GRN -> Inventory -> Work Orders -> QC Lab -> Dispatch -> Reports`

## 6) Important implementation note

Current flow is UI-driven with mock datasets in page components and `AuthContext`. Actions (create/approve/submit) currently represent intended workflow states and do not persist to a backend database.
