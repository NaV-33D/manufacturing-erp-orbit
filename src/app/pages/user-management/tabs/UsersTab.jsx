import { TabsContent } from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

const UsersTab = ({
  filters,
  setFilters,
  statusOptions,
  applyUsers,
  resetUsers,
  isLoading,
  filteredUsers,
  badgeForActive,
  setEditingUser,
  setEditUserForm,
  setShowEditUser,
  openUserRoles,
  setConfirmDelete,
  usersPage,
  setUsersPage,
}) => {
  return (
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
                    <TableCell className="font-medium">{u.username || "-"}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {[u.first_name, u.last_name].filter(Boolean).join(" ") || "-"}
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
                      <Button variant="outline" size="sm" onClick={() => openUserRoles(u)}>
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
  );
};

export default UsersTab;
