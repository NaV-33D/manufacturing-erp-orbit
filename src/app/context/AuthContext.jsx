import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginUser } from "../apis/login";
import { httpClient as http } from "../apis/http";
import {
  getUser,
  getToken,
  getPerms,
  setPerms,
  setToken,
  setUser,
  permsAreFresh,
  clearAuth,
} from "../../security/authStorage";
import { normalizePermissions } from "../../security/permissions";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(() => getUser());
  const [perms, setPermState] = useState(() => getPerms());
  const [loadingPerms, setLoadingPerms] = useState(false);

  const refreshPermissions = async () => {
    const user = getUser();
    const token = getToken();
    if (!user || !token) {
      clearAuth();
      setUserSession(null);
      setPermState(null);
      return { ok: false, reason: "No user/token" };
    }

    const hasSuperAdmin = user?.roles?.some((role) => {
      if (!role) return false;
      if (typeof role === "string") return role === "SUPER_ADMIN";
      return (
        role === "SUPER_ADMIN" ||
        role?.code === "SUPER_ADMIN" ||
        role?.role_code === "SUPER_ADMIN"
      );
    });

    if (hasSuperAdmin) {
      const allPermsMap = { __ALL__: { __ALL__: true } };
      setPerms(allPermsMap);
      setPermState(allPermsMap);
      return { ok: true, source: "super_admin" };
    }

    const roleIds = user?.roles
      ?.filter((role) => {
        if (!role) return false;
        if (typeof role === "string") return false;
        return !!role.id;
      })
      .map((role) => role.id);

    if (!roleIds || roleIds.length === 0) {
      return { ok: false, reason: "No valid roleIds found" };
    }

    try {
      setLoadingPerms(true);
      const allPermissionsLists = [];

      for (const roleId of roleIds) {
        try {
          const res = await http.get(`/roles/${roleId}`);
          const permissions = res?.data?.data?.permissions || [];
          allPermissionsLists.push(...permissions);
        } catch (err) {
          console.warn(`Failed to fetch permissions for role ${roleId}:`, err);
        }
      }

      const mergedPermsMap = normalizePermissions(allPermissionsLists);
      setPerms(mergedPermsMap);
      setPermState(mergedPermsMap);
      return { ok: true, source: "api", rolesCount: roleIds.length };
    } catch (e) {
      console.error("Failed to refresh permissions:", e);
      clearAuth();
      setUserSession(null);
      setPermState(null);
      return { ok: false, reason: "Permissions API failed" };
    } finally {
      setLoadingPerms(false);
    }
  };

  useEffect(() => {
    refreshPermissions();
  }, [userSession]);

  const loginWithApi = async ({ email, password }) => {
    const response = await loginUser({ email, password });
    const token = response?.data?.token;
    const user = response?.data?.user;

    if (!token || !user) {
      throw new Error("Invalid login response");
    }

    setToken(token);
    setUser(user);
    setUserSession(user);
    await refreshPermissions();
    return response;
  };

  const logout = () => {
    clearAuth();
    setUserSession(null);
    setPermState(null);
  };

  // utilities to support existing demo pages
  const moduleCodeMap = {
    dashboard: "DASHBOARD",
    users: "USER_MANAGEMENT",
    masterData: "MASTER_DATA",
    bom: "BOM",
    sales: "SALES",
    mrp: "MRP",
    purchase: "PURCHASE",
    grn: "GRN",
    inventory: "INVENTORY",
    workOrder: "WORK_ORDER",
    qc: "QC",
    dispatch: "DISPATCH",
    reports: "REPORTS",
  };

  const hasPermission = (module, action) => {
    const hasSuperAdmin = userSession?.roles?.some((role) => {
      if (!role) return false;
      if (typeof role === "string") return role === "SUPER_ADMIN";
      return (
        role === "SUPER_ADMIN" ||
        role?.code === "SUPER_ADMIN" ||
        role?.role_code === "SUPER_ADMIN"
      );
    });
    if (hasSuperAdmin) {
      console.log(`[SUPER_ADMIN] Access granted to ${module}.${action}`);
      return true;
    }
    const moduleCode = moduleCodeMap[module] || module.toUpperCase();
    const permCode = String(action).toUpperCase();
    const hasAccess = !!perms?.[moduleCode]?.[permCode];
    return hasAccess;
  };

  const hasModule = (module) => {
    const hasSuperAdmin = userSession?.roles?.some((role) => {
      if (!role) return false;
      if (typeof role === "string") return role === "SUPER_ADMIN";
      return (
        role === "SUPER_ADMIN" ||
        role?.code === "SUPER_ADMIN" ||
        role?.role_code === "SUPER_ADMIN"
      );
    });
    if (hasSuperAdmin) return true;

    const moduleCode = moduleCodeMap[module] || module.toUpperCase();
    return !!perms?.[moduleCode];
  };

  const value = useMemo(
    () => ({
      userSession,
      currentUser: userSession,
      perms,
      loadingPerms,
      refreshPermissions,
      loginWithApi,
      logout,
      hasPermission,
      hasModule,
    }),
    [userSession, perms, loadingPerms],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
