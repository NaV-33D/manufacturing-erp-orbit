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
import { Plus, Edit, Shield, Search, FileText } from 'lucide-react';

const SalesOrder = () => {
  const { hasPermission, hasModule } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const salesOrders = [
    { 
      id: 1, 
      soNo: 'SO-2024-567',
      customer: 'ABC Construction',
      orderDate: '2024-02-20',
      deliveryDate: '2024-02-28',
      amount: '$12,500',
      status: 'Confirmed'
    },
    { 
      id: 2, 
      soNo: 'SO-2024-568',
      customer: 'XYZ Builders',
      orderDate: '2024-02-21',
      deliveryDate: '2024-03-01',
      amount: '$8,750',
      status: 'Draft'
    },
    { 
      id: 3, 
      soNo: 'SO-2024-569',
      customer: 'Modern Homes Inc',
      orderDate: '2024-02-19',
      deliveryDate: '2024-02-25',
      amount: '$15,200',
      status: 'Delivered'
    },
    { 
      id: 4, 
      soNo: 'SO-2024-570',
      customer: 'Paint Retailers Co',
      orderDate: '2024-02-22',
      deliveryDate: '2024-03-05',
      amount: '$22,000',
      status: 'Confirmed'
    },
  ];

  const orderLines = [
    { item: 'White Enamel Paint - 20L', qty: 100, uom: 'PC', price: 45, amount: 4500 },
    { item: 'Blue Emulsion Paint - 20L', qty: 50, uom: 'PC', price: 42, amount: 2100 },
  ];

  if (!hasModule('sales')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access Sales Orders.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sales Orders</h1>
          <p className="text-gray-500 mt-1">Manage customer orders and deliveries</p>
        </div>
        {hasPermission('sales', 'create') && (
          <Button onClick={() => setShowCreateModal(true)} className="bg-[#0B74FF]">
            <Plus className="w-4 h-4 mr-2" />
            Create Sales Order
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Order List</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search orders..." className="pl-9 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SO Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.soNo}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.deliveryDate}</TableCell>
                  <TableCell className="font-medium">{order.amount}</TableCell>
                  <TableCell>
                    <Badge className={
                      order.status === 'Delivered' 
                        ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                        : order.status === 'Confirmed'
                        ? 'bg-[#0B74FF]/10 text-[#0B74FF] hover:bg-[#0B74FF]/20'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                    {hasPermission('sales', 'update') && order.status !== 'Delivered' && (
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

      {/* Create Sales Order Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Sales Order</DialogTitle>
            <DialogDescription>Create a new customer order</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="c1">ABC Construction</SelectItem>
                        <SelectItem value="c2">XYZ Builders</SelectItem>
                        <SelectItem value="c3">Modern Homes Inc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Date *</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Delivery Address</Label>
                  <Input placeholder="Enter delivery address" />
                </div>
              </CardContent>
            </Card>

            {/* Order Lines */}
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
                    {orderLines.map((line, idx) => (
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
                      <TableCell className="font-semibold text-lg">$6,600</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button variant="outline">Save Draft</Button>
            <Button className="bg-[#0B74FF]">Confirm Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesOrder;
