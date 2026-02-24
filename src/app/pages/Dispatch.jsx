import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Plus, Shield, Search, Truck } from 'lucide-react';

const Dispatch = () => {
  const { hasPermission, hasModule } = useAuth();
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const pendingDispatch = [
    {
      id: 1,
      soNo: 'SO-2024-567',
      customer: 'ABC Construction',
      item: 'White Enamel Paint - 20L',
      qty: 100,
      deliveryDate: '2024-02-28'
    },
    {
      id: 2,
      soNo: 'SO-2024-570',
      customer: 'Paint Retailers Co',
      item: 'Blue Emulsion Paint - 20L',
      qty: 50,
      deliveryDate: '2024-03-05'
    },
  ];

  const availableBatches = [
    { batch: 'B-3340', qty: 150, mfgDate: '2024-02-15', status: 'Available' },
    { batch: 'B-3341', qty: 100, mfgDate: '2024-02-18', status: 'Available' },
  ];

  const deliveryNotes = [
    {
      id: 1,
      dnNo: 'DN-2024-089',
      soNo: 'SO-2024-569',
      customer: 'Modern Homes Inc',
      deliveryDate: '2024-02-23',
      trackingNo: 'TRK-45678',
      status: 'Delivered'
    },
    {
      id: 2,
      dnNo: 'DN-2024-090',
      soNo: 'SO-2024-567',
      customer: 'ABC Construction',
      deliveryDate: '2024-02-23',
      trackingNo: 'TRK-45679',
      status: 'In Transit'
    },
  ];

  if (!hasModule('dispatch')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access Dispatch module.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dispatch</h1>
          <p className="text-gray-500 mt-1">Manage deliveries and shipments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Dispatch</p>
                <p className="text-2xl font-semibold mt-1">{pendingDispatch.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F59E0B]/10">
                <Truck className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Transit</p>
                <p className="text-2xl font-semibold mt-1">8</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0B74FF]/10">
                <Truck className="w-6 h-6 text-[#0B74FF]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Delivered Today</p>
                <p className="text-2xl font-semibold mt-1">12</p>
              </div>
              <div className="p-3 rounded-lg bg-[#10B981]/10">
                <Truck className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Dispatch</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-9 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SO Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDispatch.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Badge variant="outline">{order.soNo}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{order.customer}</TableCell>
                    <TableCell className="text-sm">{order.item}</TableCell>
                    <TableCell>{order.qty}</TableCell>
                    <TableCell className="text-right">
                      {hasPermission('dispatch', 'create') && (
                        <Button 
                          size="sm" 
                          className="bg-[#0B74FF]"
                          onClick={() => setShowDeliveryModal(true)}
                        >
                          Create DN
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Deliveries</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-9 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DN Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveryNotes.map((dn) => (
                  <TableRow key={dn.id}>
                    <TableCell>
                      <Badge variant="outline">{dn.dnNo}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{dn.customer}</TableCell>
                    <TableCell className="font-mono text-sm">{dn.trackingNo}</TableCell>
                    <TableCell>
                      <Badge className={
                        dn.status === 'Delivered' 
                          ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                          : 'bg-[#0B74FF]/10 text-[#0B74FF] hover:bg-[#0B74FF]/20'
                      }>
                        {dn.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Delivery Note Modal */}
      <Dialog open={showDeliveryModal} onOpenChange={setShowDeliveryModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Delivery Note</DialogTitle>
            <DialogDescription>
              SO-2024-567 | ABC Construction | White Enamel Paint - 20L (100 PC)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Batch Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Allocate Batches</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Available Qty</TableHead>
                      <TableHead>Mfg Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Allocate Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableBatches.map((batch, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">{batch.batch}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{batch.qty} PC</TableCell>
                        <TableCell>{batch.mfgDate}</TableCell>
                        <TableCell>
                          <Badge className="bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20">
                            {batch.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            className="w-24"
                            max={batch.qty}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Delivery Date *</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Transporter</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transporter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t1">Blue Dart Logistics</SelectItem>
                        <SelectItem value="t2">Safe Transport Co.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle Number</Label>
                    <Input placeholder="e.g., MH-12-AB-1234" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tracking Number</Label>
                    <Input placeholder="Enter tracking number" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeliveryModal(false)}>Cancel</Button>
            <Button className="bg-[#0B74FF]">Create Delivery Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dispatch;
