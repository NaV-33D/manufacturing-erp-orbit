import React from "react";
import { useAuth } from "../app/context/AuthContext";
import { hasPermission } from "./permissions";
import UnauthorizedContent from "./UnauthorizedContent";

const RequirePermission = ({ moduleCode, permCode, children }) => {
  const { perms, loadingPerms } = useAuth();

  if (loadingPerms) return null;

  const ok = hasPermission(perms, moduleCode, permCode);

  //   if (!ok) {
  //     return <UnauthorizedContent moduleCode={moduleCode} permCode={permCode} />;
  //   }

  return children;
};

export default RequirePermission;
