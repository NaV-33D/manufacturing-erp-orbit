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
import { Plus, Edit, Archive, Shield, Search, Building, MapPin, Trash2 } from 'lucide-react';


const MasterData = () => {
  const { hasPermission, hasModule } = useAuth();
  const [showItemModal, setShowItemModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [activeTab, setActiveTab] = useState('items');

  const items = [
    { id: 1, code: 'RM-001', name: 'Titanium Dioxide', category: 'Raw Material', type: 'Raw', uom: 'KG', status: 'Active', batchSize: 1000 },
    { id: 2, code: 'RM-002', name: 'Acrylic Resin', category: 'Raw Material', type: 'Raw', uom: 'KG', status: 'Active', batchSize: 500 },
    { id: 3, code: 'RM-003', name: 'Pigment - Blue', category: 'Raw Material', type: 'Raw', uom: 'KG', status: 'Active', batchSize: 200 },
    { id: 4, code: 'WIP-001', name: 'Base White Paint', category: 'WIP', type: 'WIP', uom: 'LTR', status: 'Active', batchSize: 5000 },
    { id: 5, code: 'FG-001', name: 'White Enamel Paint - 20L', category: 'Finished Goods', type: 'Finished', uom: 'LTR', status: 'Active', yieldPercent: 95 },
    { id: 6, code: 'FG-002', name: 'Blue Emulsion Paint - 20L', category: 'Finished Goods', type: 'Finished', uom: 'LTR', status: 'Active', yieldPercent: 92 },
  ];

  const categories = [
    { id: 1, name: 'Raw Material', type: 'Raw', count: 45 },
    { id: 2, name: 'WIP', type: 'WIP', count: 12 },
    { id: 3, name: 'Finished Goods', type: 'Finished', count: 28 },
    { id: 4, name: 'Packaging Material', type: 'Raw', count: 15 },
  ];

  const uoms = [
    { id: 1, code: 'KG', name: 'Kilogram', type: 'Weight' },
    { id: 2, code: 'LTR', name: 'Liter', type: 'Volume' },
    { id: 3, code: 'PC', name: 'Piece', type: 'Count' },
    { id: 4, code: 'BOX', name: 'Box', type: 'Count' },
  ];

  const workCenters = [
    { id: 1, code: 'WC-001', name: 'Mixing Center 1', capacity: '500 L/hr', status: 'Active' },
    { id: 2, code: 'WC-002', name: 'Mixing Center 2', capacity: '500 L/hr', status: 'Active' },
    { id: 3, code: 'WC-003', name: 'Grinding Mill 1', capacity: '300 KG/hr', status: 'Active' },
    { id: 4, code: 'WC-004', name: 'Filling Line 1', capacity: '200 Units/hr', status: 'Active' },
    { id: 5, code: 'WC-005', name: 'Filling Line 2', capacity: '200 Units/hr', status: 'Maintenance' },
  ];

  const warehouses = [
    { id: 1, code: 'WH001', name: 'Main Mumbai Warehouse', location: 'Colaba Bazar S.O, MAHARASHTRA', type: 'GENERAL', capacity: '30,000 sq. ft.', status: 'Active' }
  ];


  if (!hasModule('masterData')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access Master Data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Master Data</h1>
          <p className="text-gray-500 mt-1">Manage items, categories, UOMs, work centers and warehouses</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="uom">UOM</TabsTrigger>
          <TabsTrigger value="workcenters">Work Centers</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Item Master</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search items..." className="pl-9 w-64" />
                  </div>
                  {hasPermission('masterData', 'create') && (
                    <Button onClick={() => setShowItemModal(true)} className="bg-[#0B74FF]">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Item
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          item.type === 'Raw' ? 'border-[#F59E0B] text-[#F59E0B]' :
                          item.type === 'WIP' ? 'border-[#0B74FF] text-[#0B74FF]' :
                          'border-[#10B981] text-[#10B981]'
                        }>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.uom}</TableCell>
                      <TableCell>
                        <Badge className="bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {hasPermission('masterData', 'update') && (
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {hasPermission('masterData', 'delete') && (
                          <Button variant="ghost" size="sm" className="text-gray-600">
                            <Archive className="w-4 h-4" />
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

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Item Categories</CardTitle>
                {hasPermission('masterData', 'create') && (
                  <Button className="bg-[#0B74FF]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{category.type}</Badge>
                        {hasPermission('masterData', 'update') && (
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <h3 className="font-medium mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.count} items</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uom">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Units of Measure</CardTitle>
                {hasPermission('masterData', 'create') && (
                  <Button className="bg-[#0B74FF]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add UOM
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uoms.map((uom) => (
                    <TableRow key={uom.id}>
                      <TableCell className="font-medium">{uom.code}</TableCell>
                      <TableCell>{uom.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{uom.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {hasPermission('masterData', 'update') && (
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

        <TabsContent value="workcenters">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Work Centers</CardTitle>
                {hasPermission('masterData', 'create') && (
                  <Button className="bg-[#0B74FF]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Work Center
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workCenters.map((wc) => (
                    <TableRow key={wc.id}>
                      <TableCell className="font-medium">{wc.code}</TableCell>
                      <TableCell>{wc.name}</TableCell>
                      <TableCell>{wc.capacity}</TableCell>
                      <TableCell>
                        <Badge className={
                          wc.status === 'Active' 
                            ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                            : 'bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20'
                        }>
                          {wc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {hasPermission('masterData', 'update') && (
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

        <TabsContent value="warehouses">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Warehouses</h2>
              <p className="text-gray-500 mt-1">Manage your warehouse locations and details</p>
            </div>
            {hasPermission('masterData', 'create') && (
              <Button onClick={() => setShowWarehouseModal(true)} className="bg-[#0B74FF]">
                <Plus className="w-4 h-4 mr-2" />
                Add Warehouse
              </Button>
            )}
          </div>
          
          <Card>
            <CardHeader className="border-b py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-900">All Warehouses ({warehouses.length})</CardTitle>
                <div className="text-sm text-gray-500">Showing {warehouses.length} of {warehouses.length} warehouses</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse Code</TableHead>
                    <TableHead>Warehouse Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((wh) => (
                    <TableRow key={wh.id}>
                      <TableCell className="font-semibold text-gray-900">{wh.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Building className="w-4 h-4 text-gray-400" />
                          {wh.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {wh.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#EEF2FF] border-none">
                          {wh.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">{wh.capacity}</TableCell>
                      <TableCell>
                        <Badge className="bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 border-none">
                          {wh.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {hasPermission('masterData', 'update') && (
                            <button className="text-[#0B74FF] hover:text-blue-700">
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {hasPermission('masterData', 'delete') && (
                            <button className="text-red-500 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <span className="text-sm text-gray-500">Page 1 of 1</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Item Modal */}
      <Dialog open={showItemModal} onOpenChange={setShowItemModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Item</DialogTitle>
            <DialogDescription>Add a new item to the master data</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemCode">Item Code *</Label>
                <Input id="itemCode" placeholder="e.g., FG-001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input id="itemName" placeholder="Enter item name" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raw">Raw Material</SelectItem>
                    <SelectItem value="wip">WIP</SelectItem>
                    <SelectItem value="finished">Finished Goods</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="uom">UOM *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select UOM" />
                  </SelectTrigger>
                  <SelectContent>
                    {uoms.map(uom => (
                      <SelectItem key={uom.id} value={uom.code}>{uom.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchSize">Batch Size</Label>
                <Input id="batchSize" type="number" placeholder="Enter batch size" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yieldPercent">Yield % (for finished goods)</Label>
                <Input id="yieldPercent" type="number" placeholder="e.g., 95" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItemModal(false)}>Cancel</Button>
            <Button className="bg-[#0B74FF]">Save Draft</Button>
            <Button className="bg-[#10B981]">Create & Activate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Warehouse Modal */}
      <Dialog open={showWarehouseModal} onOpenChange={setShowWarehouseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Warehouse</DialogTitle>
            <DialogDescription>Add a new warehouse location to master data</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whCode">Warehouse Code *</Label>
                <Input id="whCode" placeholder="e.g., WH002" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whName">Warehouse Name *</Label>
                <Input id="whName" placeholder="Enter warehouse name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="Enter full address" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whType">Type *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">GENERAL</SelectItem>
                    <SelectItem value="COLD_STORAGE">COLD STORAGE</SelectItem>
                    <SelectItem value="BONDED">BONDED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input id="capacity" placeholder="e.g., 30,000 sq. ft." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whStatus">Status *</Label>
                <Select defaultValue="Active">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarehouseModal(false)}>Cancel</Button>
            <Button className="bg-[#0B74FF]">Save Warehouse</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterData;
