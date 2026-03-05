import { AUTH_ONLY } from "./routePerms.jsx";

// convert backend permission list into a fast lookup map
export const normalizePermissions = (permissionsArray = []) => {
  const map = {};

  permissionsArray.forEach((p) => {
    if (!p?.is_granted) return;

    const moduleCode = p?.module?.code;
    const permCode = p?.permission?.code;

    if (!moduleCode || !permCode) return;

    if (!map[moduleCode]) map[moduleCode] = {};
    map[moduleCode][permCode] = true;
  });

  return map;
};

// simple checks
export const hasPermission = (permsMap, moduleCode, permCode) => {
  if (permsMap?.__ALL__?.__ALL__) return true;
  if (permCode === AUTH_ONLY) return true;
  //   console.log(permsMap, [moduleCode], [permCode]);
  return !!permsMap?.[moduleCode]?.[permCode];
};

export const hasAnyPermission = (permsMap, moduleCode) => {
  const mod = permsMap?.[moduleCode];
  if (!mod) return false;
  return Object.values(mod).some(Boolean);
};
