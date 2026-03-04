import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Settings = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Configuration panel is coming soon.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Static Placeholder</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          This section is intentionally static for now.
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
