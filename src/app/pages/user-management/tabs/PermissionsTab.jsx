import { TabsContent } from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

const PermissionsTab = ({
  filters,
  setFilters,
  filteredPermissions,
  setEditingPermission,
  setEditPermissionForm,
  setShowEditPermission,
  setConfirmDelete,
}) => {
  return (
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
                        onClick={() => setConfirmDelete({ type: "permission", row: p })}
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
  );
};

export default PermissionsTab;
