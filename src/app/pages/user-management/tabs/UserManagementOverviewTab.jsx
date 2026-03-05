import { TabsContent } from "../../../components/ui/tabs";
import { Card, CardContent } from "../../../components/ui/card";

const metricCards = [
  { key: "users", label: "Users" },
  { key: "modules", label: "Modules" },
  { key: "permissions", label: "Permissions" },
  { key: "roles", label: "Roles" },
];

const UserManagementOverviewTab = ({ users, modules, permissions, roles }) => {
  // console.log(users, modules, permissions, roles);

  const metrics = {
    users: users.length,
    modules: modules.length,
    permissions: permissions.length,
    roles: roles.length,
  };

  return (
    <TabsContent value="management" className="mt-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <Card key={card.key}>
            <CardContent className="p-5">
              <div className="text-sm text-gray-500">{card.label}</div>
              <div className="text-2xl font-semibold text-gray-900 mt-1">
                {metrics[card.key]}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-5 text-sm text-gray-600">
          Use the tabs to manage users, modules, permissions, and role access.
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default UserManagementOverviewTab;
