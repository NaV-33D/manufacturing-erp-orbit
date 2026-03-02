import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";
import { Plus, Shield } from "lucide-react";
import {
  assignPermissionToRole,
  bulkAssignRolesToUser,
  updateUser,
  updateRole,
  updatePermission,
  updateModule,
  createModule,
  createPermission,
  createRole,
  createUser,
  deleteModule,
  deletePermission,
  deleteRole,
  deleteUser,
  getModules,
  getPermissions,
  getRoles,
  getUsers,
  getRoleById,
  removePermissionFromRole,
} from "../apis/userManagement";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const UserManagementMaster = () => {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [filters, setFilters] = useState({
    usersSearch: "",
    usersStatus: "all",
    modulesSearch: "",
    modulesStatus: "all",
    permissionsSearch: "",
    rolesSearch: "",
    rolesStatus: "all",
  });

  const [usersPage, setUsersPage] = useState(1);
  const usersLimit = 10;

  const [confirmDelete, setConfirmDelete] = useState(null); // { type, row }

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role_id: "",
  });

  const [showCreateRole, setShowCreateRole] = useState(false);
  const [createRoleForm, setCreateRoleForm] = useState({
    role_name: "",
    role_code: "",
    description: "",
  });

  const [showCreatePermission, setShowCreatePermission] = useState(false);
  const [createPermissionForm, setCreatePermissionForm] = useState({
    name: "",
    code: "",
    description: "",
  });

  const [showCreateModule, setShowCreateModule] = useState(false);
  const [createModuleForm, setCreateModuleForm] = useState({
    name: "",
    code: "",
    description: "",
    display_order: "",
    icon: "",
  });

  const [editingUser, setEditingUser] = useState(null);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    is_active: true,
  });

  const [editingRole, setEditingRole] = useState(null);
  const [showEditRole, setShowEditRole] = useState(false);
  const [editRoleForm, setEditRoleForm] = useState({
    role_name: "",
    role_code: "",
    description: "",
    is_active: true,
  });

  const [editingPermission, setEditingPermission] = useState(null);
  const [showEditPermission, setShowEditPermission] = useState(false);
  const [editPermissionForm, setEditPermissionForm] = useState({
    name: "",
    code: "",
    description: "",
  });

  const [editingModule, setEditingModule] = useState(null);
  const [showEditModule, setShowEditModule] = useState(false);
  const [editModuleForm, setEditModuleForm] = useState({
    name: "",
    code: "",
    description: "",
    display_order: "",
    icon: "",
    is_active: true,
  });

  const [showUserRoles, setShowUserRoles] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoleSelection, setUserRoleSelection] = useState({});

  const [showRoleAccess, setShowRoleAccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleAccessMatrix, setRoleAccessMatrix] = useState({});

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const [uRes, rRes, mRes, pRes] = await Promise.all([
        getUsers({
          page: usersPage,
          limit: usersLimit,
          search: filters.usersSearch.trim() || undefined,
        }),
        getRoles(),
        getModules(),
        getPermissions(),
      ]);

      const uData = uRes?.data || uRes;
      const rData = rRes?.data || rRes;
      const mData = mRes?.data || mRes;
      const pData = pRes?.data || pRes;

      setUsers(uData?.users || uData || []);
      setRoles(rData?.roles || rData || []);
      setModules(mData?.modules || mData || []);
      setPermissions(pData?.permissions || pData || []);
    } catch (e) {
      setErrorMessage(e.message || "Failed to load user management data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermission("users", "read")) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersPage]);

  const filteredUsers = useMemo(() => {
    const q = filters.usersSearch.trim().toLowerCase();
    const st = filters.usersStatus;
    return users.filter((u) => {
      const active = u.is_active !== false;
      const matchesStatus =
        st === "all" ? true : st === "active" ? active : !active;
      const hay = [u.username, u.email, u.phone, u.first_name, u.last_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = q ? hay.includes(q) : true;
      return matchesStatus && matchesSearch;
    });
  }, [filters.usersSearch, filters.usersStatus, users]);

  const filteredModules = useMemo(() => {
    const q = filters.modulesSearch.trim().toLowerCase();
    const st = filters.modulesStatus;
    return modules.filter((m) => {
      const active = m.is_active !== false;
      const matchesStatus =
        st === "all" ? true : st === "active" ? active : !active;
      const hay = [m.name, m.module_name, m.code, m.description, m.icon]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = q ? hay.includes(q) : true;
      return matchesStatus && matchesSearch;
    });
  }, [filters.modulesSearch, filters.modulesStatus, modules]);

  const filteredPermissions = useMemo(() => {
    const q = filters.permissionsSearch.trim().toLowerCase();
    return permissions.filter((p) => {
      const hay = [p.name, p.code, p.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return q ? hay.includes(q) : true;
    });
  }, [filters.permissionsSearch, permissions]);

  const filteredRoles = useMemo(() => {
    const q = filters.rolesSearch.trim().toLowerCase();
    const st = filters.rolesStatus;
    return roles.filter((r) => {
      const active = r.is_active !== false;
      const matchesStatus =
        st === "all" ? true : st === "active" ? active : !active;
      const hay = [r.role_name, r.role_code, r.description, r.name, r.code]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = q ? hay.includes(q) : true;
      return matchesStatus && matchesSearch;
    });
  }, [filters.rolesSearch, filters.rolesStatus, roles]);

  const badgeForActive = (isActive) => (
    <Badge
      className={
        isActive
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : "bg-red-100 text-red-700 hover:bg-red-200"
      }
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  const applyUsers = () => {
    setUsersPage(1);
    loadData();
  };

  const resetUsers = () => {
    setFilters((p) => ({ ...p, usersSearch: "", usersStatus: "all" }));
    setUsersPage(1);
    loadData();
  };

  const openUserRoles = (user) => {
    setSelectedUser(user);
    const next = {};
    roles.forEach((role) => {
      next[role.id] = false;
    });
    setUserRoleSelection(next);
    setShowUserRoles(true);
  };

  const saveUserRoles = async () => {
    if (!selectedUser?.id) return;
    setIsSaving(true);
    setErrorMessage("");
    try {
      const roleIds = Object.entries(userRoleSelection)
        .filter(([, checked]) => checked)
        .map(([roleId]) => Number(roleId));
      await bulkAssignRolesToUser({
        user_id: Number(selectedUser.id),
        role_ids: roleIds,
      });
      setSuccessMessage("User roles updated successfully.");
      setShowUserRoles(false);
      await loadData();
    } catch (e) {
      setErrorMessage(e.message || "Failed to update user roles.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRoleAccess = async (module, perm) => {
    if (!selectedRole?.id) return;
    const key = `${module.id}:${perm.id}`;
    const prevChecked = Boolean(roleAccessMatrix[key]);
    const nextChecked = !prevChecked;

    // optimistic update
    setRoleAccessMatrix((prev) => ({
      ...prev,
      [key]: nextChecked,
    }));

    try {
      if (nextChecked) {
        await assignPermissionToRole({
          role_id: Number(selectedRole.id),
          module_id: Number(module.id),
          permission_id: Number(perm.id),
          is_granted: true,
        });
      } else {
        await removePermissionFromRole({
          role_id: Number(selectedRole.id),
          module_id: Number(module.id),
          permission_id: Number(perm.id),
        });
      }
    } catch (e) {
      // revert on error
      setRoleAccessMatrix((prev) => ({
        ...prev,
        [key]: prevChecked,
      }));
      setErrorMessage(e.message || "Failed to update role access.");
    }
  };

  const openRoleAccess = async (role) => {
    setSelectedRole(role);
    setShowRoleAccess(true);
    setErrorMessage("");
    setRoleAccessMatrix({});
    try {
      const res = await getRoleById(role.id);
      const payload = res?.data || res;
      const perms =
        payload?.permissions || payload?.data?.permissions || [];
      const matrix = {};
      perms.forEach((item) => {
        if (!item?.is_granted) return;
        const moduleId = item.module?.id || item.module_id;
        const permissionId = item.permission?.id || item.permission_id;
        if (!moduleId || !permissionId) return;
        matrix[`${moduleId}:${permissionId}`] = true;
      });
      setRoleAccessMatrix(matrix);
    } catch (e) {
      setErrorMessage(e.message || "Failed to load role access.");
    }
  };

  const submitCreateUser = async () => {
    setIsSaving(true);
    setErrorMessage("");
    try {
      const created = await createUser({
        username: createUserForm.username,
        email: createUserForm.email,
        password: createUserForm.password,
        first_name: createUserForm.first_name,
        last_name: createUserForm.last_name,
        phone: createUserForm.phone,
      });
      const userId = created?.data?.id || created?.id;
      if (createUserForm.role_id && userId) {
        await bulkAssignRolesToUser({
          user_id: Number(userId),
          role_ids: [Number(createUserForm.role_id)],
        });
      }
      setSuccessMessage("User created successfully.");
      setShowCreateUser(false);
      setCreateUserForm({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        role_id: "",
      });
      await loadData();
    } catch (e) {
      setErrorMessage(e.message || "Failed to create user.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitCreateRole = async () => {
    setIsSaving(true);
    setErrorMessage("");
    try {
      await createRole({
        role_name: createRoleForm.role_name,
        role_code: createRoleForm.role_code,
        description: createRoleForm.description,
      });
      setSuccessMessage("Role created successfully.");
      setShowCreateRole(false);
      setCreateRoleForm({ role_name: "", role_code: "", description: "" });
      await loadData();
    } catch (e) {
      setErrorMessage(e.message || "Failed to create role.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitCreatePermission = async () => {
    setIsSaving(true);
    setErrorMessage("");
    try {
      await createPermission({
        name: createPermissionForm.name,
        code: createPermissionForm.code,
        description: createPermissionForm.description,
      });
      setSuccessMessage("Permission created successfully.");
      setShowCreatePermission(false);
      setCreatePermissionForm({ name: "", code: "", description: "" });
      await loadData();
    } catch (e) {
      setErrorMessage(e.message || "Failed to create permission.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitCreateModule = async () => {
    setIsSaving(true);
    setErrorMessage("");
    try {
      await createModule({
        name: createModuleForm.name,
        code: createModuleForm.code,
        description: createModuleForm.description,
        display_order: createModuleForm.display_order
          ? Number(createModuleForm.display_order)
          : undefined,
        icon: createModuleForm.icon,
      });
      setSuccessMessage("Module created successfully.");
      setShowCreateModule(false);
      setCreateModuleForm({
        name: "",
        code: "",
        description: "",
        display_order: "",
        icon: "",
      });
      await loadData();
    } catch (e) {
      setErrorMessage(e.message || "Failed to create module.");
    } finally {
      setIsSaving(false);
    }
  };

  const doDelete = async () => {
    if (!confirmDelete?.type || !confirmDelete?.row) return;
    setIsSaving(true);
    setErrorMessage("");
    try {
      if (confirmDelete.type === "user") await deleteUser(confirmDelete.row.id);
      if (confirmDelete.type === "module")
        await deleteModule(confirmDelete.row.id);
      if (confirmDelete.type === "permission")
        await deletePermission(confirmDelete.row.id);
      if (confirmDelete.type === "role") await deleteRole(confirmDelete.row.id);
      setSuccessMessage("Deleted successfully.");
      setConfirmDelete(null);
      await loadData();
    } catch (e) {
      setErrorMessage(e.message || "Failed to delete.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitEditUser = async () => {
    if (!editingUser?.id) return;
    setIsSaving(true);
    setErrorMessage("");
    try {
      await updateUser(editingUser.id, {
        username: editUserForm.username,
        email: editUserForm.email,
        first_name: editUserForm.first_name,
        last_name: editUserForm.last_name,
        phone: editUserForm.phone,
        is_active: editUserForm.is_active,
      });
      setSuccessMessage("User updated successfully.");
      setShowEditUser(false);
      setEditingUser(null);
      await loadData();
    } catch (e) {
      setErrorMessage(e.message || "Failed to update user.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitEditRole = async () => {
    if (!editingRole?.id) return;
    setIsSaving(true);
    setErrorMessage("");
    try {
      await updateRole(editingRole.id, {
        role_name: editRoleForm.role_name,
        role_code: editRoleForm.role_code,
        description: editRoleForm.description,
        is_active: editRoleForm.is_active,
      });
      setSuccessMessage("Role updated successfully.");
      setShowEditRole(false);
      setEditingRole(null);
      await loadData();
    } catch (e) {
      setErrorMessage(e.message || "Failed to update role.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitEditPermission = async () => {
    if (!editingPermission?.id) return;
    setIsSaving(true);
    setErrorMessage("");
    try {
      await updatePermission(editingPermission.id, {
        name: editPermissionForm.name,
        code: editPermissionForm.code,
        description: editPermissionForm.description,
      });
      setSuccessMessage("Permission updated successfully.");
      setShowEditPermission(false);
      setEditingPermission(null);
      await loadData();
    } catch (e) {
      setErrorMessage(e.message || "Failed to update permission.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitEditModule = async () => {
    if (!editingModule?.id) return;
    setIsSaving(true);
    setErrorMessage("");
    try {
      await updateModule(editingModule.id, {
        name: editModuleForm.name,
        code: editModuleForm.code,
        description: editModuleForm.description,
        display_order: editModuleForm.display_order
          ? Number(editModuleForm.display_order)
          : undefined,
        icon: editModuleForm.icon,
        is_active: editModuleForm.is_active,
      });
      setSuccessMessage("Module updated successfully.");
      setShowEditModule(false);
      setEditingModule(null);
      await loadData();
    } catch (e) {
      setErrorMessage(e.message || "Failed to update module.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!hasPermission("users", "read")) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">
              You don&apos;t have permission to access User Management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-1">
          Manage users, modules, permissions and roles
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>

            {activeTab === "users" && hasPermission("users", "create") ? (
              <Button className="bg-[#0B74FF]" onClick={() => setShowCreateUser(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            ) : null}
            {activeTab === "modules" && hasPermission("users", "create") ? (
              <Button className="bg-[#0B74FF]" onClick={() => setShowCreateModule(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            ) : null}
            {activeTab === "permissions" && hasPermission("users", "create") ? (
              <Button className="bg-[#0B74FF]" onClick={() => setShowCreatePermission(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Permission
              </Button>
            ) : null}
            {activeTab === "roles" && hasPermission("users", "create") ? (
              <Button className="bg-[#0B74FF]" onClick={() => setShowCreateRole(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Role
              </Button>
            ) : null}
          </div>

          {errorMessage ? (
            <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
          ) : null}
          {successMessage ? (
            <p className="mt-4 text-sm text-emerald-700">{successMessage}</p>
          ) : null}

          <TabsContent value="users" className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search username / email / phone"
                value={filters.usersSearch}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, usersSearch: e.target.value }))
                }
                className="w-72"
              />
              <Select
                value={filters.usersStatus}
                onValueChange={(value) =>
                  setFilters((p) => ({ ...p, usersStatus: value }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={applyUsers}>Apply</Button>
              <Button variant="outline" onClick={resetUsers}>
                Reset
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500 py-10"
                        >
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length ? (
                      filteredUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">
                            {u.username || "-"}
                          </TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            {[u.first_name, u.last_name].filter(Boolean).join(" ") ||
                              "-"}
                          </TableCell>
                          <TableCell>{u.phone || "-"}</TableCell>
                          <TableCell>{badgeForActive(u.is_active !== false)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingUser(u);
                                setEditUserForm({
                                  username: u.username || "",
                                  email: u.email || "",
                                  first_name: u.first_name || "",
                                  last_name: u.last_name || "",
                                  phone: u.phone || "",
                                  is_active: u.is_active !== false,
                                });
                                setShowEditUser(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openUserRoles(u)}
                            >
                              Roles
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setConfirmDelete({ type: "user", row: u })}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 py-10">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <span className="text-sm text-gray-500">Page {usersPage}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={usersPage <= 1}
                      onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUsersPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search name / code / description"
                value={filters.modulesSearch}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, modulesSearch: e.target.value }))
                }
                className="w-72"
              />
              <Select
                value={filters.modulesStatus}
                onValueChange={(value) =>
                  setFilters((p) => ({ ...p, modulesStatus: value }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => null}>Apply</Button>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters((p) => ({
                    ...p,
                    modulesSearch: "",
                    modulesStatus: "all",
                  }))
                }
              >
                Reset
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sl No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Icon</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModules.length ? (
                      filteredModules.map((m, idx) => (
                        <TableRow key={m.id || `${m.code}-${idx}`}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{m.name || m.module_name || "-"}</TableCell>
                          <TableCell>{m.code || "-"}</TableCell>
                          <TableCell>{m.description || "-"}</TableCell>
                          <TableCell>{m.display_order ?? "-"}</TableCell>
                          <TableCell>{m.icon || "-"}</TableCell>
                          <TableCell>{badgeForActive(m.is_active !== false)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingModule(m);
                                setEditModuleForm({
                                  name: m.name || m.module_name || "",
                                  code: m.code || "",
                                  description: m.description || "",
                                  display_order:
                                    m.display_order !== undefined && m.display_order !== null
                                      ? String(m.display_order)
                                      : "",
                                  icon: m.icon || "",
                                  is_active: m.is_active !== false,
                                });
                                setShowEditModule(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setConfirmDelete({ type: "module", row: m })}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-500 py-10">
                          No modules found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search name / code / description"
                value={filters.permissionsSearch}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    permissionsSearch: e.target.value,
                  }))
                }
                className="w-72"
              />
              <Button onClick={() => null}>Apply</Button>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters((p) => ({ ...p, permissionsSearch: "" }))
                }
              >
                Reset
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.length ? (
                      filteredPermissions.map((p) => (
                        <TableRow key={p.id || p.code}>
                          <TableCell>{p.name || "-"}</TableCell>
                          <TableCell>{p.code || "-"}</TableCell>
                          <TableCell>{p.description || "-"}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingPermission(p);
                                setEditPermissionForm({
                                  name: p.name || "",
                                  code: p.code || "",
                                  description: p.description || "",
                                });
                                setShowEditPermission(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setConfirmDelete({ type: "permission", row: p })
                              }
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-10">
                          No permissions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search role name / code / description"
                value={filters.rolesSearch}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, rolesSearch: e.target.value }))
                }
                className="w-72"
              />
              <Select
                value={filters.rolesStatus}
                onValueChange={(value) =>
                  setFilters((p) => ({ ...p, rolesStatus: value }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => null}>Apply</Button>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters((p) => ({ ...p, rolesSearch: "", rolesStatus: "all" }))
                }
              >
                Reset
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Role Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.length ? (
                      filteredRoles.map((r) => (
                        <TableRow key={r.id || r.role_code}>
                          <TableCell className="font-medium">
                            {r.role_name || r.name || "-"}
                          </TableCell>
                          <TableCell>{r.role_code || r.code || "-"}</TableCell>
                          <TableCell>{r.description || "-"}</TableCell>
                          <TableCell>{badgeForActive(r.is_active !== false)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingRole(r);
                                setEditRoleForm({
                                  role_name: r.role_name || r.name || "",
                                  role_code: r.role_code || r.code || "",
                                  description: r.description || "",
                                  is_active: r.is_active !== false,
                                });
                                setShowEditRole(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRoleAccess(r)}
                            >
                              Manage Access
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setConfirmDelete({ type: "role", row: r })}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-10">
                          No roles found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm delete */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {confirmDelete?.type}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={doDelete} disabled={isSaving}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Create a new user</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cu-username">Username</Label>
              <Input
                id="cu-username"
                value={createUserForm.username}
                onChange={(e) => setCreateUserForm((p) => ({ ...p, username: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cu-email">Email</Label>
              <Input
                id="cu-email"
                type="email"
                value={createUserForm.email}
                onChange={(e) => setCreateUserForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cu-first">First name</Label>
                <Input
                  id="cu-first"
                  value={createUserForm.first_name}
                  onChange={(e) => setCreateUserForm((p) => ({ ...p, first_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cu-last">Last name</Label>
                <Input
                  id="cu-last"
                  value={createUserForm.last_name}
                  onChange={(e) => setCreateUserForm((p) => ({ ...p, last_name: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cu-phone">Phone</Label>
              <Input
                id="cu-phone"
                value={createUserForm.phone}
                onChange={(e) => setCreateUserForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cu-role">Role (optional)</Label>
              <Select
                value={createUserForm.role_id}
                onValueChange={(value) => setCreateUserForm((p) => ({ ...p, role_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.role_name || r.name || r.role_code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cu-pass">Password</Label>
              <Input
                id="cu-pass"
                type="password"
                value={createUserForm.password}
                onChange={(e) => setCreateUserForm((p) => ({ ...p, password: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateUser(false)}>
              Cancel
            </Button>
            <Button className="bg-[#0B74FF]" onClick={submitCreateUser} disabled={isSaving}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="eu-username">Username</Label>
              <Input
                id="eu-username"
                value={editUserForm.username}
                onChange={(e) =>
                  setEditUserForm((p) => ({ ...p, username: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eu-email">Email</Label>
              <Input
                id="eu-email"
                type="email"
                value={editUserForm.email}
                onChange={(e) =>
                  setEditUserForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eu-first">First name</Label>
                <Input
                  id="eu-first"
                  value={editUserForm.first_name}
                  onChange={(e) =>
                    setEditUserForm((p) => ({
                      ...p,
                      first_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eu-last">Last name</Label>
                <Input
                  id="eu-last"
                  value={editUserForm.last_name}
                  onChange={(e) =>
                    setEditUserForm((p) => ({
                      ...p,
                      last_name: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eu-phone">Phone</Label>
              <Input
                id="eu-phone"
                value={editUserForm.phone}
                onChange={(e) =>
                  setEditUserForm((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="eu-active"
                checked={editUserForm.is_active}
                onCheckedChange={(checked) =>
                  setEditUserForm((p) => ({
                    ...p,
                    is_active: Boolean(checked),
                  }))
                }
              />
              <Label htmlFor="eu-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUser(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0B74FF]"
              onClick={submitEditUser}
              disabled={isSaving}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Role */}
      <Dialog open={showCreateRole} onOpenChange={setShowCreateRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
            <DialogDescription>Create a new role</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cr-name">Role name</Label>
              <Input
                id="cr-name"
                value={createRoleForm.role_name}
                onChange={(e) => setCreateRoleForm((p) => ({ ...p, role_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cr-code">Role code</Label>
              <Input
                id="cr-code"
                value={createRoleForm.role_code}
                onChange={(e) => setCreateRoleForm((p) => ({ ...p, role_code: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cr-desc">Description</Label>
              <Input
                id="cr-desc"
                value={createRoleForm.description}
                onChange={(e) => setCreateRoleForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateRole(false)}>
              Cancel
            </Button>
            <Button className="bg-[#0B74FF]" onClick={submitCreateRole} disabled={isSaving}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role */}
      <Dialog open={showEditRole} onOpenChange={setShowEditRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="er-name">Role name</Label>
              <Input
                id="er-name"
                value={editRoleForm.role_name}
                onChange={(e) =>
                  setEditRoleForm((p) => ({ ...p, role_name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="er-code">Role code</Label>
              <Input
                id="er-code"
                value={editRoleForm.role_code}
                onChange={(e) =>
                  setEditRoleForm((p) => ({ ...p, role_code: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="er-desc">Description</Label>
              <Input
                id="er-desc"
                value={editRoleForm.description}
                onChange={(e) =>
                  setEditRoleForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="er-active"
                checked={editRoleForm.is_active}
                onCheckedChange={(checked) =>
                  setEditRoleForm((p) => ({
                    ...p,
                    is_active: Boolean(checked),
                  }))
                }
              />
              <Label htmlFor="er-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditRole(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0B74FF]"
              onClick={submitEditRole}
              disabled={isSaving}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Permission */}
      <Dialog open={showCreatePermission} onOpenChange={setShowCreatePermission}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Permission</DialogTitle>
            <DialogDescription>Create a new permission</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cp-name">Name</Label>
              <Input
                id="cp-name"
                value={createPermissionForm.name}
                onChange={(e) => setCreatePermissionForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cp-code">Code</Label>
              <Input
                id="cp-code"
                value={createPermissionForm.code}
                onChange={(e) => setCreatePermissionForm((p) => ({ ...p, code: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cp-desc">Description</Label>
              <Input
                id="cp-desc"
                value={createPermissionForm.description}
                onChange={(e) =>
                  setCreatePermissionForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePermission(false)}>
              Cancel
            </Button>
            <Button className="bg-[#0B74FF]" onClick={submitCreatePermission} disabled={isSaving}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permission */}
      <Dialog
        open={showEditPermission}
        onOpenChange={setShowEditPermission}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>Update permission details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ep-name">Name</Label>
              <Input
                id="ep-name"
                value={editPermissionForm.name}
                onChange={(e) =>
                  setEditPermissionForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ep-code">Code</Label>
              <Input
                id="ep-code"
                value={editPermissionForm.code}
                onChange={(e) =>
                  setEditPermissionForm((p) => ({ ...p, code: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ep-desc">Description</Label>
              <Input
                id="ep-desc"
                value={editPermissionForm.description}
                onChange={(e) =>
                  setEditPermissionForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditPermission(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#0B74FF]"
              onClick={submitEditPermission}
              disabled={isSaving}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Module */}
      <Dialog open={showCreateModule} onOpenChange={setShowCreateModule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Module</DialogTitle>
            <DialogDescription>Create a new module</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cm-name">Name</Label>
              <Input
                id="cm-name"
                value={createModuleForm.name}
                onChange={(e) => setCreateModuleForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cm-code">Code</Label>
              <Input
                id="cm-code"
                value={createModuleForm.code}
                onChange={(e) => setCreateModuleForm((p) => ({ ...p, code: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cm-desc">Description</Label>
              <Input
                id="cm-desc"
                value={createModuleForm.description}
                onChange={(e) =>
                  setCreateModuleForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cm-order">Display order</Label>
                <Input
                  id="cm-order"
                  value={createModuleForm.display_order}
                  onChange={(e) =>
                    setCreateModuleForm((p) => ({ ...p, display_order: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cm-icon">Icon</Label>
                <Input
                  id="cm-icon"
                  value={createModuleForm.icon}
                  onChange={(e) => setCreateModuleForm((p) => ({ ...p, icon: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModule(false)}>
              Cancel
            </Button>
            <Button className="bg-[#0B74FF]" onClick={submitCreateModule} disabled={isSaving}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Module */}
      <Dialog open={showEditModule} onOpenChange={setShowEditModule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
            <DialogDescription>Update module details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="em-name">Name</Label>
              <Input
                id="em-name"
                value={editModuleForm.name}
                onChange={(e) =>
                  setEditModuleForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="em-code">Code</Label>
              <Input
                id="em-code"
                value={editModuleForm.code}
                onChange={(e) =>
                  setEditModuleForm((p) => ({ ...p, code: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="em-desc">Description</Label>
              <Input
                id="em-desc"
                value={editModuleForm.description}
                onChange={(e) =>
                  setEditModuleForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="em-order">Display order</Label>
                <Input
                  id="em-order"
                  value={editModuleForm.display_order}
                  onChange={(e) =>
                    setEditModuleForm((p) => ({
                      ...p,
                      display_order: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="em-icon">Icon</Label>
                <Input
                  id="em-icon"
                  value={editModuleForm.icon}
                  onChange={(e) =>
                    setEditModuleForm((p) => ({ ...p, icon: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="em-active"
                checked={editModuleForm.is_active}
                onCheckedChange={(checked) =>
                  setEditModuleForm((p) => ({
                    ...p,
                    is_active: Boolean(checked),
                  }))
                }
              />
              <Label htmlFor="em-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModule(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0B74FF]"
              onClick={submitEditModule}
              disabled={isSaving}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Roles */}
      <Dialog open={showUserRoles} onOpenChange={setShowUserRoles}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Assign Roles -{" "}
              {[selectedUser?.first_name, selectedUser?.last_name]
                .filter(Boolean)
                .join(" ") ||
                selectedUser?.username ||
                selectedUser?.email ||
                "User"}
            </DialogTitle>
            <DialogDescription>Select roles to assign</DialogDescription>
          </DialogHeader>
          <div className="py-2 max-h-96 overflow-y-auto space-y-3">
            {roles.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <Checkbox
                  checked={Boolean(userRoleSelection[r.id])}
                  onCheckedChange={() =>
                    setUserRoleSelection((prev) => ({
                      ...prev,
                      [r.id]: !prev[r.id],
                    }))
                  }
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {r.role_name || r.name || r.role_code}
                  </div>
                  <div className="text-xs text-gray-500">
                    {r.description || r.role_code || ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserRoles(false)}>
              Cancel
            </Button>
            <Button className="bg-[#0B74FF]" onClick={saveUserRoles} disabled={isSaving}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Access */}
      <Dialog open={showRoleAccess} onOpenChange={setShowRoleAccess}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              Manage Access -{" "}
              {selectedRole?.role_name || selectedRole?.name || selectedRole?.role_code || "Role"}
            </DialogTitle>
            <DialogDescription>
              Modules as rows; permissions as columns
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 max-h-[70vh] overflow-y-auto w-full">
            <div className="w-full">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Module</th>
                    {permissions.map((p) => (
                      <th key={p.id || p.code} className="text-center p-3 font-medium text-xs">
                        {p.name || p.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modules.map((m) => (
                    <tr key={m.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">
                        {m.name || m.module_name || m.code}
                      </td>
                      {permissions.map((p) => {
                        const key = `${m.id}:${p.id}`;
                        const checked = Boolean(roleAccessMatrix[key]);
                        return (
                          <td key={p.id || p.code} className="text-center p-3">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleRoleAccess(m, p)}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleAccess(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementMaster;

