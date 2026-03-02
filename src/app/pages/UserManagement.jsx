import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Edit, Trash2, Shield } from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  assignPermissionToRole,
  assignRoleToUser,
  createUser,
  deleteUser,
  getModules,
  getPermissions,
  getRoles,
  getUsers,
} from "../apis/userManagement";

const UserManagement = () => {
  const { hasPermission } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [permissionDefinitions, setPermissionDefinitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role_id: "",
  });

  const permissions = useMemo(() => {
    if (permissionDefinitions.length > 0) {
      return permissionDefinitions.map(
        (permission) => permission.name || permission.code,
      );
    }
    return ["Create", "Read", "Update", "Delete"];
  }, [permissionDefinitions]);

  const [permissionMatrix, setPermissionMatrix] = useState({});

  const togglePermission = (moduleId, permission) => {
    setPermissionMatrix((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permission.toLowerCase()]: !prev[moduleId]?.[permission.toLowerCase()],
      },
    }));
  };

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [
        usersResponse,
        rolesResponse,
        modulesResponse,
        permissionsResponse,
      ] = await Promise.all([
        getUsers({ page: 1, limit: 50, search }),
        getRoles(),
        getModules(),
        getPermissions(),
      ]);

      const userRows = usersResponse?.data?.users || usersResponse?.data || [];
      const roleRows = rolesResponse?.data?.roles || rolesResponse?.data || [];
      const moduleRows =
        modulesResponse?.data?.modules || modulesResponse?.data || [];
      const permissionRows =
        permissionsResponse?.data?.permissions ||
        permissionsResponse?.data ||
        [];

      setUsers(userRows);
      setRoles(roleRows);
      setModules(moduleRows);
      setPermissionDefinitions(permissionRows);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load user management data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermission("users", "read")) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleCreateUser = async () => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      const payload = {
        username: createForm.username,
        email: createForm.email,
        password: createForm.password,
        first_name: createForm.first_name,
        last_name: createForm.last_name,
        phone: createForm.phone,
      };

      const created = await createUser(payload);

      if (createForm.role_id && created?.data?.id) {
        await assignRoleToUser({
          user_id: created.data.id,
          role_id: Number(createForm.role_id),
        });
      }

      setSuccessMessage("User created successfully.");
      setShowCreateModal(false);
      setCreateForm({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        role_id: "",
      });
      await loadData();
    } catch (error) {
      setErrorMessage(error.message || "Failed to create user.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivateUser = async (id) => {
    try {
      await deleteUser(id);
      setSuccessMessage("User deactivated successfully.");
      await loadData();
    } catch (error) {
      setErrorMessage(error.message || "Failed to deactivate user.");
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser?.id) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const roleId = selectedUser?.role_id || selectedUser?.roleId;
      if (!roleId) {
        throw new Error("Please assign a role before setting permissions.");
      }

      for (const module of modules) {
        for (const permission of permissions) {
          const isGranted = Boolean(
            permissionMatrix[module.id]?.[permission.toLowerCase()],
          );
          const permissionMatch = permissionDefinitions.find(
            (item) =>
              item.code?.toLowerCase() === permission.toLowerCase() ||
              item.name?.toLowerCase() === permission.toLowerCase(),
          );

          if (permissionMatch) {
            await assignPermissionToRole({
              role_id: Number(roleId),
              module_id: Number(module.id),
              permission_id: Number(permissionMatch.id),
              is_granted: isGranted,
            });
          }
        }
      }

      setSuccessMessage("Permissions updated successfully.");
      setShowPermissionModal(false);
    } catch (error) {
      setErrorMessage(error.message || "Failed to update permissions.");
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
              You don't have permission to access User Management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage users and their permissions
          </p>
        </div>
        {hasPermission("users", "create") && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#0B74FF]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        )}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Input
          placeholder="Search users by name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={loadData}>
          Refresh
        </Button>
      </div>

      {errorMessage ? (
        <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
      ) : null}
      {successMessage ? (
        <p className="mb-4 text-sm text-emerald-700">{successMessage}</p>
      ) : null}

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-gray-500 py-10"
                      >
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {[user.first_name, user.last_name]
                            .filter(Boolean)
                            .join(" ") ||
                            user.username ||
                            user.name ||
                            "-"}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.role_name ||
                              user.role ||
                              user.role_code ||
                              "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.is_active === false
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20"
                            }
                          >
                            {user.is_active === false ? "Inactive" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {hasPermission("users", "update") && (
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowPermissionModal(true);
                            }}
                          >
                            <Shield className="w-4 h-4" />
                          </Button>
                          {hasPermission("users", "delete") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDeactivateUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Module</th>
                      {permissions.map((permission) => (
                        <th
                          key={permission}
                          className="text-center p-3 font-medium"
                        >
                          {permission}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module) => (
                      <tr key={module.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">
                          {module.name || module.module_name || module.code}
                        </td>
                        {permissions.map((permission) => (
                          <td key={permission} className="text-center p-3">
                            <Checkbox
                              checked={
                                permissionMatrix[module.id]?.[
                                  permission.toLowerCase()
                                ] || false
                              }
                              onCheckedChange={() =>
                                togglePermission(module.id, permission)
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  className="bg-[#0B74FF]"
                  onClick={handleSavePermissions}
                  disabled={isSaving}
                >
                  Save Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                value={createForm.username}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    username: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={createForm.email}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={createForm.first_name}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      first_name: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={createForm.last_name}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      last_name: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={createForm.role_id}
                onValueChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, role_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem
                      key={role.id || role.role_code}
                      value={String(role.id || "")}
                    >
                      {role.role_name || role.role_code || role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={createForm.phone}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    phone: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={createForm.password}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0B74FF]"
              onClick={handleCreateUser}
              disabled={isSaving}
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Permissions Modal */}
      <Dialog open={showPermissionModal} onOpenChange={setShowPermissionModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Assign Permissions -{" "}
              {[selectedUser?.first_name, selectedUser?.last_name]
                .filter(Boolean)
                .join(" ") ||
                selectedUser?.username ||
                selectedUser?.name ||
                "User"}
            </DialogTitle>
            <DialogDescription>
              Configure module access and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-96 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Module</th>
                  {permissions.map((permission) => (
                    <th
                      key={permission}
                      className="text-center p-3 font-medium text-xs"
                    >
                      {permission}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">
                      {module.name || module.module_name || module.code}
                    </td>
                    {permissions.map((permission) => (
                      <td key={permission} className="text-center p-3">
                        <Checkbox
                          checked={
                            permissionMatrix[module.id]?.[
                              permission.toLowerCase()
                            ] || false
                          }
                          onCheckedChange={() =>
                            togglePermission(module.id, permission)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPermissionModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#0B74FF]"
              onClick={handleSavePermissions}
              disabled={isSaving}
            >
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
