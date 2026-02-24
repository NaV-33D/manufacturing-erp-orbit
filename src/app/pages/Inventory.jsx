import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Shield, Search, AlertTriangle } from 'lucide-react';

const Inventory = () => {
  const { hasModule } = useAuth();

  const stockSummary = [
    { id: 1, item: 'Titanium Dioxide', onHand: 850, available: 700, hold: 150, allocated: 0, uom: 'KG', status: 'Healthy' },
    { id: 2, item: 'Acrylic Resin', onHand: 650, available: 500, hold: 0, allocated: 150, uom: 'KG', status: 'Healthy' },
    { id: 3, item: 'Pigment - Blue', onHand: 120, available: 80, hold: 40, allocated: 0, uom: 'KG', status: 'QC Hold' },
    { id: 4, item: 'White Enamel Paint - 20L', onHand: 250, available: 200, hold: 0, allocated: 50, uom: 'PC', status: 'Healthy' },
    { id: 5, item: 'Blue Emulsion Paint - 20L', onHand: 45, available: 45, hold: 0, allocated: 0, uom: 'PC', status: 'Low Stock' },
  ];

  const batchView = [
    { id: 1, batch: 'B-3340', item: 'White Enamel Paint - 20L', qty: 150, uom: 'PC', mfgDate: '2024-02-15', expiry: '2025-02-15', status: 'Available' },
    { id: 2, batch: 'B-3341', item: 'White Enamel Paint - 20L', qty: 100, uom: 'PC', mfgDate: '2024-02-18', expiry: '2025-02-18', status: 'Available' },
    { id: 3, batch: 'B-3342', item: 'Blue Emulsion Paint - 20L', qty: 45, uom: 'PC', mfgDate: '2024-02-20', expiry: '2025-02-20', status: 'Available' },
    { id: 4, batch: 'B-3343', item: 'Pigment - Blue', qty: 40, uom: 'KG', mfgDate: '2024-02-22', expiry: '2025-02-22', status: 'QC Hold' },
  ];

  const holdStock = [
    { id: 1, item: 'Pigment - Blue', batch: 'B-3343', qty: 40, uom: 'KG', reason: 'QC Failed', holdDate: '2024-02-22' },
    { id: 2, item: 'Titanium Dioxide', batch: 'LOT-2024-045', qty: 150, uom: 'KG', reason: 'Awaiting QC', holdDate: '2024-02-22' },
  ];

  if (!hasModule('inventory')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access Inventory.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="text-gray-500 mt-1">Monitor stock levels and batch tracking</p>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Stock Summary</TabsTrigger>
          <TabsTrigger value="batch">Batch View</TabsTrigger>
          <TabsTrigger value="hold">Hold Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Stock Summary</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search items..." className="pl-9 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>On Hand</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Hold</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockSummary.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell>{item.onHand}</TableCell>
                      <TableCell className="font-medium text-[#10B981]">{item.available}</TableCell>
                      <TableCell className={item.hold > 0 ? 'text-[#F59E0B]' : ''}>{item.hold}</TableCell>
                      <TableCell className={item.allocated > 0 ? 'text-[#0B74FF]' : ''}>{item.allocated}</TableCell>
                      <TableCell>{item.uom}</TableCell>
                      <TableCell>
                        <Badge className={
                          item.status === 'Healthy' 
                            ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                            : item.status === 'QC Hold'
                            ? 'bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20'
                            : 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20'
                        }>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Batch/Lot View</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search batches..." className="pl-9 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch/Lot Number</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead>Mfg Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchView.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{batch.batch}</Badge>
                      </TableCell>
                      <TableCell>{batch.item}</TableCell>
                      <TableCell className="font-medium">{batch.qty}</TableCell>
                      <TableCell>{batch.uom}</TableCell>
                      <TableCell>{batch.mfgDate}</TableCell>
                      <TableCell>{batch.expiry}</TableCell>
                      <TableCell>
                        <Badge className={
                          batch.status === 'Available' 
                            ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                            : 'bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20'
                        }>
                          {batch.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hold">
          <Card>
            <CardHeader>
              <CardTitle>Hold Stock</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Batch/Lot</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Hold Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdStock.map((item) => (
                    <TableRow key={item.id} className="bg-[#F59E0B]/5">
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{item.batch}</Badge>
                      </TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{item.uom}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                          <span>{item.reason}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.holdDate}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">Release Hold</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
