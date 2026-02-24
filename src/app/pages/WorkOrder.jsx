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
import { Plus, Shield, Search, Play, CheckCircle } from 'lucide-react';

const WorkOrder = () => {
  const { hasPermission, hasModule, currentUser } = useAuth();
  const [showCreateWO, setShowCreateWO] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);

  const workOrders = [
    {
      id: 1,
      woNo: 'WO-2024-045',
      item: 'White Enamel Paint - 20L',
      batchNo: 'B-3345',
      qty: 1000,
      status: 'In Progress',
      startDate: '2024-02-22',
      completedSteps: 2,
      totalSteps: 4
    },
    {
      id: 2,
      woNo: 'WO-2024-046',
      item: 'Blue Emulsion Paint - 20L',
      batchNo: 'B-3346',
      qty: 1000,
      status: 'Released',
      startDate: '2024-02-23',
      completedSteps: 0,
      totalSteps: 4
    },
    {
      id: 3,
      woNo: 'WO-2024-047',
      item: 'Red Primer - 20L',
      batchNo: 'B-3347',
      qty: 800,
      status: 'Completed',
      startDate: '2024-02-20',
      completedSteps: 4,
      totalSteps: 4
    },
  ];

  const productionSteps = [
    { 
      stepNo: 10, 
      stepName: 'Material Preparation', 
      workCenter: 'WC-001', 
      status: 'Completed',
      outputQty: 1000,
      operator: 'Bob Operator'
    },
    { 
      stepNo: 20, 
      stepName: 'Mixing', 
      workCenter: 'WC-001', 
      status: 'Completed',
      outputQty: 980,
      operator: 'Bob Operator'
    },
    { 
      stepNo: 30, 
      stepName: 'Grinding', 
      workCenter: 'WC-003', 
      status: 'In Progress',
      outputQty: null,
      operator: 'Bob Operator'
    },
    { 
      stepNo: 40, 
      stepName: 'Filling', 
      workCenter: 'WC-004', 
      status: 'Pending',
      outputQty: null,
      operator: null
    },
  ];

  const requiredMaterials = [
    { item: 'Titanium Dioxide', required: 250, issued: 250, uom: 'KG' },
    { item: 'Acrylic Resin', required: 400, issued: 400, uom: 'KG' },
    { item: 'Pigment - White', required: 50, issued: 50, uom: 'KG' },
    { item: 'Solvent', required: 300, issued: 300, uom: 'LTR' },
  ];

  const isMachineOperator = currentUser.role === 'Machine Operator';

  if (!hasModule('workOrder')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access Work Orders.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Work Orders</h1>
          <p className="text-gray-500 mt-1">
            {isMachineOperator ? 'Execute assigned production tasks' : 'Manage production work orders'}
          </p>
        </div>
        {hasPermission('workOrder', 'create') && !isMachineOperator && (
          <Button onClick={() => setShowCreateWO(true)} className="bg-[#0B74FF]">
            <Plus className="w-4 h-4 mr-2" />
            Create Work Order
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{isMachineOperator ? 'Assigned Work Orders' : 'Work Order List'}</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search work orders..." className="pl-9 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>WO Number</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Batch No</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((wo) => (
                <TableRow key={wo.id}>
                  <TableCell className="font-medium">{wo.woNo}</TableCell>
                  <TableCell>{wo.item}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">{wo.batchNo}</Badge>
                  </TableCell>
                  <TableCell>{wo.qty} LTR</TableCell>
                  <TableCell>{wo.startDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div 
                          className="bg-[#0B74FF] h-2 rounded-full" 
                          style={{ width: `${(wo.completedSteps / wo.totalSteps) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {wo.completedSteps}/{wo.totalSteps}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      wo.status === 'Completed' 
                        ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                        : wo.status === 'In Progress'
                        ? 'bg-[#0B74FF]/10 text-[#0B74FF] hover:bg-[#0B74FF]/20'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }>
                      {wo.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {wo.status === 'In Progress' && (
                      <Button 
                        size="sm" 
                        className="bg-[#0B74FF]"
                        onClick={() => setShowExecutionModal(true)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Execute
                      </Button>
                    )}
                    {wo.status === 'Released' && hasPermission('workOrder', 'approve') && (
                      <Button size="sm" className="bg-[#10B981]">Start</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create WO Modal */}
      <Dialog open={showCreateWO} onOpenChange={setShowCreateWO}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Work Order</DialogTitle>
            <DialogDescription>Create a new production work order</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fg1">White Enamel Paint - 20L</SelectItem>
                    <SelectItem value="fg2">Blue Emulsion Paint - 20L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity *</Label>
                <Input type="number" placeholder="1000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>BOM Version</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select BOM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">BOM-WP-001 V1.2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Routing Version</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Routing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">RT-WP-001 V1.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Planned Start Date *</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateWO(false)}>Cancel</Button>
            <Button className="bg-[#0B74FF]">Create WO</Button>
            {hasPermission('workOrder', 'approve') && (
              <Button className="bg-[#10B981]">Create & Release</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step Execution Modal */}
      <Dialog open={showExecutionModal} onOpenChange={setShowExecutionModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Execute Work Order - WO-2024-045</DialogTitle>
            <DialogDescription>White Enamel Paint - 20L | Batch: B-3345</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Step Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Production Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'Completed' ? 'bg-[#10B981] text-white' :
                        step.status === 'In Progress' ? 'bg-[#0B74FF] text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {step.status === 'Completed' ? <CheckCircle className="w-4 h-4" /> : step.stepNo / 10}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{step.stepName}</p>
                            <p className="text-sm text-gray-500">{step.workCenter}</p>
                          </div>
                          <Badge className={
                            step.status === 'Completed' ? 'bg-[#10B981]/10 text-[#10B981]' :
                            step.status === 'In Progress' ? 'bg-[#0B74FF]/10 text-[#0B74FF]' :
                            'bg-gray-200 text-gray-700'
                          }>
                            {step.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Step Execution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Step: Grinding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Materials Required</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Issued</TableHead>
                        <TableHead>UOM</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requiredMaterials.slice(0, 2).map((mat, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{mat.item}</TableCell>
                          <TableCell>{mat.required}</TableCell>
                          <TableCell className="text-[#10B981] font-medium">{mat.issued}</TableCell>
                          <TableCell>{mat.uom}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Output Quantity *</Label>
                    <Input type="number" placeholder="Enter output qty" />
                  </div>
                  <div className="space-y-2">
                    <Label>Operator</Label>
                    <Input value="Bob Operator" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExecutionModal(false)}>Cancel</Button>
            <Button className="bg-[#10B981]">
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkOrder;
