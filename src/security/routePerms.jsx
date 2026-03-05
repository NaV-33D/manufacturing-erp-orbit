import React from "react";
import RequireAuth from "./RequireAuth";
import RequirePermission from "./RequirePermission";

export const AUTH_ONLY = "AUTH_ONLY";

// modify the codes as required by backend
export const ROUTE_PERMS = {
  "/": { module: "DASHBOARD", perm: "READ" },
  "/users": { module: "USER_MANAGEMENT", perm: "READ" },
  "/master-data": { module: "MASTER_DATA", perm: "READ" },
  "/bom-routing": { module: "BOM", perm: "READ" },
  "/sales": { module: "SALES", perm: "READ" },
  "/mrp": { module: "MRP", perm: "READ" },
  "/purchase": { module: "PURCHASE", perm: "READ" },
  "/grn": { module: "GRN", perm: "READ" },
  "/inventory": { module: "INVENTORY", perm: "READ" },
  "/work-order": { module: "WORK_ORDER", perm: "READ" },
  "/qc": { module: "QC", perm: "READ" },
  "/dispatch": { module: "DISPATCH", perm: "READ" },
  "/reports": { module: "REPORTS", perm: "READ" },
  "/unauthorized": { module: AUTH_ONLY, perm: AUTH_ONLY },
};

export const GROUP_PATHS = {
  // example if you have path grouping
  "/masters": [
    "USER_MANAGEMENT",
    "WAREHOUSE",
    "SUPPLIERS",
    "DOCKS",
    "SLOTTINGRULES",
    "CLIENTS",
    "LOCATIONS",
    "SKUS",
    "MODULES",
    "PERMISSIONS",
    "ROLES",
  ],
  "/reports": ["REPORTS", "INVENTORY", "ORDERS", "BILLING"],
};

export const protect = (path, element) => {
  const rule = ROUTE_PERMS[path];
  if (!rule) {
    console.warn("[ROUTE_PERMS MISSING]", path);
    return <RequireAuth>{element}</RequireAuth>;
  }

  return (
    <RequireAuth>
      <RequirePermission moduleCode={rule.module} permCode={rule.perm}>
        {element}
      </RequirePermission>
    </RequireAuth>
  );
};
