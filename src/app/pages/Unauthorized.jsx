import React from "react";
import { Alert } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center p-8">
      <Alert variant="destructive" className="max-w-lg">
        <h3 className="font-semibold text-lg">Access Denied</h3>
        <div>You do not have permission to view this page.</div>
        <div className="mt-4">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
      </Alert>
    </div>
  );
}
