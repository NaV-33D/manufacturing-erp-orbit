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

const ModulesTab = ({
  filters,
  setFilters,
  statusOptions,
  filteredModules,
  badgeForActive,
  setEditingModule,
  setEditModuleForm,
  setShowEditModule,
  setConfirmDelete,
}) => {
  return (
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
  );
};

export default ModulesTab;
