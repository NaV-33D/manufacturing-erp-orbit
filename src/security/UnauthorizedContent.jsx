import React from "react";
import { useLocation } from "react-router";
import { Card, CardContent } from "../app/components/ui/card";
import { Shield } from "lucide-react";

const UnauthorizedContent = ({ moduleCode, permCode }) => {
  const location = useLocation();

  return (
    <div className="h-full flex items-center justify-center p-8">
      <Card className="max-w-lg border-red-200 bg-red-50">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 mb-2">Access Denied</h2>
              <p className="text-red-800 mb-4">
                You don't have permission to access this page.
              </p>
              {moduleCode && permCode && (
                <p className="text-sm text-red-700">
                  Required permission: <code className="bg-red-100 px-2 py-1 rounded">{moduleCode}.{permCode}</code>
                </p>
              )}
              <p className="text-sm text-red-600 mt-4">
                Please contact your administrator if you believe this is a mistake.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedContent;
