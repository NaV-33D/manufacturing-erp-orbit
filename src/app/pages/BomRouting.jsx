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
import { Plus, Edit, GitBranch, Shield, Search, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const BomRouting = () => {
  const { hasPermission, hasModule } = useAuth();
  const [showBomModal, setShowBomModal] = useState(false);
  const [showRoutingModal, setShowRoutingModal] = useState(false);

  const boms = [
    { 
      id: 1, 
      code: 'BOM-WP-001', 
      item: 'White Enamel Paint - 20L',
      version: 'V1.2',
      batchSize: 1000,
      yield: 95,
      status: 'Approved'
    },
    { 
      id: 2, 
      code: 'BOM-BP-001', 
      item: 'Blue Emulsion Paint - 20L',
      version: 'V1.0',
      batchSize: 1000,
      yield: 92,
      status: 'Approved'
    },
    { 
      id: 3, 
      code: 'BOM-RP-001', 
      item: 'Red Primer - 20L',
      version: 'V1.1',
      batchSize: 800,
      yield: 88,
      status: 'Draft'
    },
  ];

  const bomMaterials = [
    { item: 'Titanium Dioxide', qty: 250, uom: 'KG', scrap: 2 },
    { item: 'Acrylic Resin', qty: 400, uom: 'KG', scrap: 1 },
    { item: 'Pigment - White', qty: 50, uom: 'KG', scrap: 3 },
    { item: 'Solvent', qty: 300, uom: 'LTR', scrap: 1 },
  ];

  const routings = [
    {
      id: 1,
      code: 'RT-WP-001',
      item: 'White Enamel Paint - 20L',
      version: 'V1.0',
      totalDuration: 180,
      status: 'Approved'
    },
    {
      id: 2,
      code: 'RT-BP-001',
      item: 'Blue Emulsion Paint - 20L',
      version: 'V1.0',
      totalDuration: 200,
      status: 'Approved'
    },
  ];

  const routingSteps = [
    { stepNo: 10, stepName: 'Material Preparation', workCenter: 'WC-001', duration: 30 },
    { stepNo: 20, stepName: 'Mixing', workCenter: 'WC-001', duration: 60 },
    { stepNo: 30, stepName: 'Grinding', workCenter: 'WC-003', duration: 45 },
    { stepNo: 40, stepName: 'Filling', workCenter: 'WC-004', duration: 45 },
  ];

  if (!hasModule('bom')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access BOM & Routing.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">BOM & Routing</h1>
          <p className="text-gray-500 mt-1">Manage bill of materials and production routing</p>
        </div>
      </div>

      <Tabs defaultValue="bom" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bom">Bill of Materials</TabsTrigger>
          <TabsTrigger value="routing">Routing</TabsTrigger>
        </TabsList>

        <TabsContent value="bom">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>BOM List</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search BOMs..." className="pl-9 w-64" />
                  </div>
                  {hasPermission('bom', 'create') && (
                    <Button onClick={() => setShowBomModal(true)} className="bg-[#0B74FF]">
                      <Plus className="w-4 h-4 mr-2" />
                      Create BOM
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>BOM Code</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Batch Size</TableHead>
                    <TableHead>Yield %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boms.map((bom) => (
                    <TableRow key={bom.id}>
                      <TableCell className="font-medium">{bom.code}</TableCell>
                      <TableCell>{bom.item}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{bom.version}</Badge>
                      </TableCell>
                      <TableCell>{bom.batchSize} LTR</TableCell>
                      <TableCell>
                        <span className="text-[#10B981] font-medium">{bom.yield}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          bom.status === 'Approved' 
                            ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                            : bom.status === 'Draft'
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20'
                        }>
                          {bom.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {hasPermission('bom', 'update') && (
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {hasPermission('bom', 'approve') && bom.status === 'Draft' && (
                          <Button size="sm" className="bg-[#10B981]">
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

        <TabsContent value="routing">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Routing List</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search routings..." className="pl-9 w-64" />
                  </div>
                  {hasPermission('bom', 'create') && (
                    <Button onClick={() => setShowRoutingModal(true)} className="bg-[#0B74FF]">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Routing
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Routing Code</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Total Duration (min)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routings.map((routing) => (
                    <TableRow key={routing.id}>
                      <TableCell className="font-medium">{routing.code}</TableCell>
                      <TableCell>{routing.item}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{routing.version}</Badge>
                      </TableCell>
                      <TableCell>{routing.totalDuration} min</TableCell>
                      <TableCell>
                        <Badge className="bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20">
                          {routing.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {hasPermission('bom', 'update') && (
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

      {/* Create BOM Modal */}
      <Dialog open={showBomModal} onOpenChange={setShowBomModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Bill of Materials</DialogTitle>
            <DialogDescription>Define materials required for production</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Header Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">BOM Header</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
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
                    <Label>Batch Size *</Label>
                    <Input type="number" placeholder="1000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Version</Label>
                    <Input placeholder="V1.0" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Materials Grid */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Raw Materials</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Material
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
                      <TableHead>Scrap %</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bomMaterials.map((material, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{material.item}</TableCell>
                        <TableCell>{material.qty}</TableCell>
                        <TableCell>{material.uom}</TableCell>
                        <TableCell>{material.scrap}%</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBomModal(false)}>Cancel</Button>
            <Button variant="outline">Save Draft</Button>
            {hasPermission('bom', 'approve') && (
              <Button className="bg-[#10B981]">Submit for Approval</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Routing Modal */}
      <Dialog open={showRoutingModal} onOpenChange={setShowRoutingModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Routing</DialogTitle>
            <DialogDescription>Define production steps and work centers</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Routing Header</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <Label>Version</Label>
                    <Input placeholder="V1.0" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Routing Steps */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Production Steps</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Step No</TableHead>
                      <TableHead>Step Name</TableHead>
                      <TableHead>Work Center</TableHead>
                      <TableHead>Duration (min)</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routingSteps.map((step, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{step.stepNo}</TableCell>
                        <TableCell>{step.stepName}</TableCell>
                        <TableCell>{step.workCenter}</TableCell>
                        <TableCell>{step.duration}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoutingModal(false)}>Cancel</Button>
            <Button className="bg-[#0B74FF]">Save Routing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BomRouting;
