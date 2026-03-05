import React, { useMemo } from "react";
import { useAuth } from "../app/context/AuthContext";
import { hasPermission } from "./permissions";
import { AUTH_ONLY, ROUTE_PERMS, GROUP_PATHS } from "./routePerms.jsx";

export const canSeeMenuPath = (perms, path) => {
  const groupModules = GROUP_PATHS[path];
  if (groupModules) {
    return groupModules.some((moduleCode) =>
      hasPermission(perms, moduleCode, "READ"),
    );
  }
  const rule = ROUTE_PERMS[path];
  if (!rule) return false;
  if (rule.module === AUTH_ONLY) return true;
  return hasPermission(perms, rule.module, rule.perm || "READ");
};

export const useAccess = (moduleCode) => {
  const { perms, loadingPerms } = useAuth();

  return useMemo(() => {
    const can = (perm) => {
      if (!moduleCode) return false;
      return hasPermission(perms, moduleCode, perm);
    };

    return {
      loading: loadingPerms,
      module: moduleCode,

      canRead: can("READ"),
      canCreate: can("CREATE"),
      canUpdate: can("UPDATE"),
      canDelete: can("DELETE"),
      canExport: can("EXPORT"),

      can,
    };
  }, [perms, loadingPerms, moduleCode]);
};

export const Can = ({ module, perm = "READ", children, fallback = null }) => {
  const access = useAccess(module);

  if (access.loading) return null;
  if (!access.can(perm)) return fallback;

  return <>{children}</>;
};

export const PermissionButton = ({
  module,
  perm = "READ",
  fallback = null,
  children,
  ...props
}) => {
  return (
    <Can module={module} perm={perm} fallback={fallback}>
      <button {...props}>{children}</button>
    </Can>
  );
};
