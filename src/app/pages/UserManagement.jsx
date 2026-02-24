import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const UserManagement = () => {
  const { hasPermission } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: 'John Admin', email: 'admin@paint.com', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Mike Engineer', email: 'engineer@paint.com', role: 'Process Engineer', status: 'Active' },
    { id: 3, name: 'Sarah Sales', email: 'sales@paint.com', role: 'Sales Executive', status: 'Active' },
    { id: 4, name: 'David Production', email: 'production@paint.com', role: 'Production Manager', status: 'Active' },
    { id: 5, name: 'Lisa Purchase', email: 'purchase@paint.com', role: 'Purchase Officer', status: 'Active' },
    { id: 6, name: 'Tom Store', email: 'store@paint.com', role: 'Store Manager', status: 'Active' },
    { id: 7, name: 'Emma QC', email: 'qc@paint.com', role: 'QC Lead', status: 'Active' },
    { id: 8, name: 'Jack Dispatch', email: 'dispatch@paint.com', role: 'Dispatch Executive', status: 'Active' },
  ];

  const roles = [
    'Super Admin',
    'Process Engineer',
    'Sales Executive',
    'Production Manager',
    'Purchase Officer',
    'Store Manager',
    'QC Lead',
    'Dispatch Executive',
    'Machine Operator'
  ];

  const modules = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'users', name: 'User Management' },
    { id: 'masterData', name: 'Master Data' },
    { id: 'bom', name: 'BOM & Routing' },
    { id: 'sales', name: 'Sales Orders' },
    { id: 'mrp', name: 'MRP Planning' },
    { id: 'purchase', name: 'Purchase' },
    { id: 'grn', name: 'GRN' },
    { id: 'inventory', name: 'Inventory' },
    { id: 'workOrder', name: 'Work Orders' },
    { id: 'qc', name: 'QC Lab' },
    { id: 'dispatch', name: 'Dispatch' },
    { id: 'reports', name: 'Reports' },
  ];

  const permissions = ['Create', 'Read', 'Update', 'Delete', 'Approve'];

  const [permissionMatrix, setPermissionMatrix] = useState({});

  const togglePermission = (moduleId, permission) => {
    setPermissionMatrix(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permission.toLowerCase()]: !prev[moduleId]?.[permission.toLowerCase()]
      }
    }));
  };

  if (!hasPermission('users', 'read')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access User Management.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage users and their permissions</p>
        </div>
        {hasPermission('users', 'create') && (
          <Button onClick={() => setShowCreateModal(true)} className="bg-[#0B74FF]">
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        )}
      </div>

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
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {hasPermission('users', 'update') && (
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
                        {hasPermission('users', 'delete') && (
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
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
                      {permissions.map(permission => (
                        <th key={permission} className="text-center p-3 font-medium">{permission}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module) => (
                      <tr key={module.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{module.name}</td>
                        {permissions.map(permission => (
                          <td key={permission} className="text-center p-3">
                            <Checkbox
                              checked={permissionMatrix[module.id]?.[permission.toLowerCase()] || false}
                              onCheckedChange={() => togglePermission(module.id, permission)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-6">
                <Button className="bg-[#0B74FF]">Save Permissions</Button>
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
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button className="bg-[#0B74FF]">Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Permissions Modal */}
      <Dialog open={showPermissionModal} onOpenChange={setShowPermissionModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Assign Permissions - {selectedUser?.name}</DialogTitle>
            <DialogDescription>Configure module access and permissions</DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-96 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Module</th>
                  {permissions.map(permission => (
                    <th key={permission} className="text-center p-3 font-medium text-xs">{permission}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{module.name}</td>
                    {permissions.map(permission => (
                      <td key={permission} className="text-center p-3">
                        <Checkbox />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPermissionModal(false)}>
              Cancel
            </Button>
            <Button className="bg-[#0B74FF]">Save Permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
