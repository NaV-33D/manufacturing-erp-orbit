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

const RolesTab = ({
  filters,
  setFilters,
  statusOptions,
  filteredRoles,
  badgeForActive,
  setEditingRole,
  setEditRoleForm,
  setShowEditRole,
  openRoleAccess,
  setConfirmDelete,
}) => {
  return (
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
                    <TableCell className="font-medium">{r.role_name || r.name || "-"}</TableCell>
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
                      <Button variant="outline" size="sm" onClick={() => openRoleAccess(r)}>
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
  );
};

export default RolesTab;
