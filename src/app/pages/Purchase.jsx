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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Edit, Shield, Search, CheckCircle } from 'lucide-react';

const Purchase = () => {
  const { hasPermission, hasModule } = useAuth();
  const [showCreatePO, setShowCreatePO] = useState(false);

  const vendors = [
    { id: 1, code: 'V001', name: 'Titanium Dioxide Co.', category: 'Raw Material', rating: 4.5, status: 'Active' },
    { id: 2, code: 'V002', name: 'Resin Suppliers Ltd', category: 'Raw Material', rating: 4.2, status: 'Active' },
    { id: 3, code: 'V003', name: 'Pigment Industries', category: 'Raw Material', rating: 4.8, status: 'Active' },
    { id: 4, code: 'V004', name: 'Chemical Solutions', category: 'Raw Material', rating: 4.0, status: 'Active' },
  ];

  const purchaseOrders = [
    {
      id: 1,
      poNo: 'PO-2024-128',
      vendor: 'Titanium Dioxide Co.',
      orderDate: '2024-02-20',
      expectedDate: '2024-02-28',
      amount: '$45,000',
      status: 'Approved'
    },
    {
      id: 2,
      poNo: 'PO-2024-129',
      vendor: 'Resin Suppliers Ltd',
      orderDate: '2024-02-21',
      expectedDate: '2024-03-01',
      amount: '$32,500',
      status: 'Draft'
    },
    {
      id: 3,
      poNo: 'PO-2024-130',
      vendor: 'Pigment Industries',
      orderDate: '2024-02-19',
      expectedDate: '2024-02-27',
      amount: '$28,000',
      status: 'Sent'
    },
  ];

  const poLines = [
    { item: 'Titanium Dioxide', qty: 1000, uom: 'KG', price: 35, amount: 35000 },
    { item: 'Acrylic Resin', qty: 500, uom: 'KG', price: 20, amount: 10000 },
  ];

  if (!hasModule('purchase')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access Purchase module.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Purchase</h1>
          <p className="text-gray-500 mt-1">Manage vendors and purchase orders</p>
        </div>
      </div>

      <Tabs defaultValue="po" className="space-y-4">
        <TabsList>
          <TabsTrigger value="po">Purchase Orders</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="po">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Purchase Order List</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search POs..." className="pl-9 w-64" />
                  </div>
                  {hasPermission('purchase', 'create') && (
                    <Button onClick={() => setShowCreatePO(true)} className="bg-[#0B74FF]">
                      <Plus className="w-4 h-4 mr-2" />
                      Create PO
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.poNo}</TableCell>
                      <TableCell>{po.vendor}</TableCell>
                      <TableCell>{po.orderDate}</TableCell>
                      <TableCell>{po.expectedDate}</TableCell>
                      <TableCell className="font-medium">{po.amount}</TableCell>
                      <TableCell>
                        <Badge className={
                          po.status === 'Approved' 
                            ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                            : po.status === 'Sent'
                            ? 'bg-[#0B74FF]/10 text-[#0B74FF] hover:bg-[#0B74FF]/20'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }>
                          {po.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {hasPermission('purchase', 'update') && (
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {hasPermission('purchase', 'approve') && po.status === 'Draft' && (
                          <Button size="sm" className="bg-[#10B981]">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vendor List</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search vendors..." className="pl-9 w-64" />
                  </div>
                  {hasPermission('purchase', 'create') && (
                    <Button className="bg-[#0B74FF]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Vendor
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.code}</TableCell>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vendor.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-[#F59E0B]">★</span>
                          <span>{vendor.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20">
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {hasPermission('purchase', 'update') && (
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create PO Modal */}
      <Dialog open={showCreatePO} onOpenChange={setShowCreatePO}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>Create a new purchase order</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">PO Header</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vendor *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map(v => (
                          <SelectItem key={v.id} value={v.code}>{v.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Delivery Date *</Label>
                    <Input type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Order Lines</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Line
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>UOM</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poLines.map((line, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{line.item}</TableCell>
                        <TableCell>{line.qty}</TableCell>
                        <TableCell>{line.uom}</TableCell>
                        <TableCell>${line.price}</TableCell>
                        <TableCell className="font-medium">${line.amount}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">Total</TableCell>
                      <TableCell className="font-semibold text-lg">$45,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePO(false)}>Cancel</Button>
            <Button variant="outline">Save Draft</Button>
            {hasPermission('purchase', 'approve') ? (
              <Button className="bg-[#10B981]">Create & Approve</Button>
            ) : (
              <Button className="bg-[#0B74FF]">Submit for Approval</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Purchase;
