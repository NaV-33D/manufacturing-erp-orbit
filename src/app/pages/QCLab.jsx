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
import { Shield, Search, CheckCircle, XCircle } from 'lucide-react';

const QCLab = () => {
  const { hasPermission, hasModule } = useAuth();
  const [showTestModal, setShowTestModal] = useState(false);

  const pendingBatches = [
    {
      id: 1,
      batch: 'B-3345',
      product: 'White Enamel Paint - 20L',
      woNo: 'WO-2024-045',
      qty: 980,
      priority: 'High',
      receivedDate: '2024-02-22'
    },
    {
      id: 2,
      batch: 'B-3346',
      product: 'Blue Emulsion Paint - 20L',
      woNo: 'WO-2024-046',
      qty: 950,
      priority: 'Medium',
      receivedDate: '2024-02-23'
    },
    {
      id: 3,
      batch: 'LOT-2024-045',
      product: 'Titanium Dioxide',
      woNo: 'GRN-2024-045',
      qty: 980,
      priority: 'High',
      receivedDate: '2024-02-22'
    },
  ];

  const testParameters = [
    { 
      parameter: 'Viscosity', 
      expectedRange: '80-100 KU', 
      actualValue: '',
      result: null 
    },
    { 
      parameter: 'Density', 
      expectedRange: '1.2-1.4 g/cm³', 
      actualValue: '',
      result: null 
    },
    { 
      parameter: 'pH Level', 
      expectedRange: '8.0-9.0', 
      actualValue: '',
      result: null 
    },
    { 
      parameter: 'Gloss @ 60°', 
      expectedRange: '85-95 GU', 
      actualValue: '',
      result: null 
    },
  ];

  const testedBatches = [
    {
      id: 1,
      batch: 'B-3340',
      product: 'White Enamel Paint - 20L',
      testDate: '2024-02-20',
      testedBy: 'Emma QC',
      result: 'Passed'
    },
    {
      id: 2,
      batch: 'B-3341',
      product: 'White Enamel Paint - 20L',
      testDate: '2024-02-21',
      testedBy: 'Emma QC',
      result: 'Passed'
    },
    {
      id: 3,
      batch: 'B-3343',
      product: 'Pigment - Blue',
      testDate: '2024-02-22',
      testedBy: 'Emma QC',
      result: 'Failed'
    },
  ];

  if (!hasModule('qc')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access QC Lab.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">QC Lab</h1>
          <p className="text-gray-500 mt-1">Quality control testing and batch approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Tests</p>
                <p className="text-2xl font-semibold mt-1">{pendingBatches.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F59E0B]/10">
                <Search className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Passed Today</p>
                <p className="text-2xl font-semibold mt-1">15</p>
              </div>
              <div className="p-3 rounded-lg bg-[#10B981]/10">
                <CheckCircle className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Failed Today</p>
                <p className="text-2xl font-semibold mt-1">2</p>
              </div>
              <div className="p-3 rounded-lg bg-[#EF4444]/10">
                <XCircle className="w-6 h-6 text-[#EF4444]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending QC Tests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch No</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{batch.batch}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{batch.product}</TableCell>
                    <TableCell className="text-sm text-gray-500">{batch.woNo}</TableCell>
                    <TableCell>
                      <Badge className={
                        batch.priority === 'High' 
                          ? 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20'
                          : batch.priority === 'Medium'
                          ? 'bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }>
                        {batch.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {hasPermission('qc', 'create') && (
                        <Button 
                          size="sm" 
                          className="bg-[#0B74FF]"
                          onClick={() => setShowTestModal(true)}
                        >
                          Test
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
            <CardTitle>Recent Test Results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch No</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Test Date</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testedBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{batch.batch}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{batch.product}</TableCell>
                    <TableCell>{batch.testDate}</TableCell>
                    <TableCell>
                      <Badge className={
                        batch.result === 'Passed' 
                          ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                          : 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20'
                      }>
                        {batch.result === 'Passed' ? (
                          <CheckCircle className="w-3 h-3 mr-1 inline" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1 inline" />
                        )}
                        {batch.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Test Entry Modal */}
      <Dialog open={showTestModal} onOpenChange={setShowTestModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>QC Test Entry</DialogTitle>
            <DialogDescription>
              Batch: B-3345 | White Enamel Paint - 20L | WO-2024-045
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Test Parameters</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Expected Range</TableHead>
                      <TableHead>Actual Value</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testParameters.map((param, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{param.parameter}</TableCell>
                        <TableCell className="text-gray-600">{param.expectedRange}</TableCell>
                        <TableCell>
                          <Input 
                            placeholder="Enter value" 
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-gray-500">
                            -
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <div className="mt-4 space-y-2">
              <Label>Remarks</Label>
              <Input placeholder="Enter test remarks (optional)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestModal(false)}>Cancel</Button>
            {hasPermission('qc', 'approve') && (
              <>
                <Button className="bg-[#10B981]">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button variant="outline" className="text-[#EF4444] border-[#EF4444]">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            {!hasPermission('qc', 'approve') && (
              <Button className="bg-[#0B74FF]">Submit for Approval</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QCLab;
