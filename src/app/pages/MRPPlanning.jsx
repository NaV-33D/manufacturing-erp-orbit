import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { AlertTriangle, Shield, Play } from 'lucide-react';

const MRPPlanning = () => {
  const { hasPermission, hasModule } = useAuth();
  const [showShortages, setShowShortages] = useState(false);

  const shortages = [
    {
      id: 1,
      item: 'Titanium Dioxide',
      required: 500,
      available: 150,
      shortage: 350,
      uom: 'KG',
      suggestedVendor: 'Titanium Dioxide Co.'
    },
    {
      id: 2,
      item: 'Acrylic Resin',
      required: 800,
      available: 200,
      shortage: 600,
      uom: 'KG',
      suggestedVendor: 'Resin Suppliers Ltd'
    },
    {
      id: 3,
      item: 'Pigment - Blue',
      required: 120,
      available: 50,
      shortage: 70,
      uom: 'KG',
      suggestedVendor: 'Pigment Industries'
    },
    {
      id: 4,
      item: 'Solvent',
      required: 600,
      available: 100,
      shortage: 500,
      uom: 'LTR',
      suggestedVendor: 'Chemical Solutions'
    },
  ];

  if (!hasModule('mrp')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access MRP Planning.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const runMRP = () => {
    setShowShortages(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">MRP Planning</h1>
          <p className="text-gray-500 mt-1">Material Requirements Planning & Shortage Analysis</p>
        </div>
        {hasPermission('mrp', 'create') && (
          <Button onClick={runMRP} className="bg-[#0B74FF]">
            <Play className="w-4 h-4 mr-2" />
            Run MRP
          </Button>
        )}
      </div>

      {!showShortages ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Ready to Run MRP</h3>
            <p className="text-gray-500 mb-6">
              Click the "Run MRP" button to analyze material requirements and identify shortages based on current sales orders and production plans.
            </p>
            {hasPermission('mrp', 'create') && (
              <Button onClick={runMRP} className="bg-[#0B74FF]">
                <Play className="w-4 h-4 mr-2" />
                Run MRP
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Shortages</p>
                    <p className="text-2xl font-semibold mt-1">{shortages.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#EF4444]/10">
                    <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">PR to Generate</p>
                    <p className="text-2xl font-semibold mt-1">{shortages.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Estimated Value</p>
                    <p className="text-2xl font-semibold mt-1">$124,500</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Material Shortages</CardTitle>
                {hasPermission('mrp', 'create') && (
                  <Button className="bg-[#10B981]">
                    Generate Purchase Requisition
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Required Qty</TableHead>
                    <TableHead>Available Qty</TableHead>
                    <TableHead>Shortage</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead>Suggested Vendor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shortages.map((item) => (
                    <TableRow key={item.id} className="bg-[#EF4444]/5">
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell>{item.required}</TableCell>
                      <TableCell>{item.available}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                          <span className="font-semibold text-[#EF4444]">{item.shortage}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.uom}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.suggestedVendor}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default MRPPlanning;
