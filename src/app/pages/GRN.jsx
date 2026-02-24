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
import { Plus, Shield, Search } from 'lucide-react';

const GRN = () => {
  const { hasPermission, hasModule } = useAuth();
  const [showCreateGRN, setShowCreateGRN] = useState(false);

  const grns = [
    {
      id: 1,
      grnNo: 'GRN-2024-045',
      poNo: 'PO-2024-128',
      vendor: 'Titanium Dioxide Co.',
      receivedDate: '2024-02-22',
      status: 'Accepted'
    },
    {
      id: 2,
      grnNo: 'GRN-2024-046',
      poNo: 'PO-2024-130',
      vendor: 'Pigment Industries',
      receivedDate: '2024-02-23',
      status: 'Pending QC'
    },
  ];

  const grnLines = [
    { item: 'Titanium Dioxide', orderedQty: 1000, receivedQty: 980, uom: 'KG', lotNo: 'LOT-2024-045', expiry: '2025-02-22' },
    { item: 'Acrylic Resin', orderedQty: 500, receivedQty: 500, uom: 'KG', lotNo: 'LOT-2024-046', expiry: '2025-02-22' },
  ];

  if (!hasModule('grn')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access GRN module.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Goods Receipt Note (GRN)</h1>
          <p className="text-gray-500 mt-1">Manage material receipts and lot tracking</p>
        </div>
        {hasPermission('grn', 'create') && (
          <Button onClick={() => setShowCreateGRN(true)} className="bg-[#0B74FF]">
            <Plus className="w-4 h-4 mr-2" />
            Create GRN
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>GRN List</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search GRNs..." className="pl-9 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GRN Number</TableHead>
                <TableHead>PO Reference</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grns.map((grn) => (
                <TableRow key={grn.id}>
                  <TableCell className="font-medium">{grn.grnNo}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{grn.poNo}</Badge>
                  </TableCell>
                  <TableCell>{grn.vendor}</TableCell>
                  <TableCell>{grn.receivedDate}</TableCell>
                  <TableCell>
                    <Badge className={
                      grn.status === 'Accepted' 
                        ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                        : 'bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20'
                    }>
                      {grn.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create GRN Modal */}
      <Dialog open={showCreateGRN} onOpenChange={setShowCreateGRN}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create GRN</DialogTitle>
            <DialogDescription>Record goods receipt from purchase order</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">GRN Header</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Purchase Order *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select PO" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="po1">PO-2024-128 - Titanium Dioxide Co.</SelectItem>
                        <SelectItem value="po2">PO-2024-130 - Pigment Industries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Receipt Date *</Label>
                    <Input type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Receipt Lines</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Ordered</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>UOM</TableHead>
                      <TableHead>Lot Number</TableHead>
                      <TableHead>Expiry Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grnLines.map((line, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{line.item}</TableCell>
                        <TableCell>{line.orderedQty}</TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            defaultValue={line.receivedQty} 
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>{line.uom}</TableCell>
                        <TableCell>
                          <Input 
                            placeholder="Enter lot no" 
                            defaultValue={line.lotNo}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="date" 
                            className="w-40"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateGRN(false)}>Cancel</Button>
            {hasPermission('grn', 'approve') ? (
              <>
                <Button className="bg-[#10B981]">Accept</Button>
                <Button variant="outline" className="text-[#EF4444]">Reject</Button>
              </>
            ) : (
              <Button className="bg-[#0B74FF]">Submit</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GRN;
