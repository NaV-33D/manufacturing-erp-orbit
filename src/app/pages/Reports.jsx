import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Shield, Download, FileBarChart } from 'lucide-react';

const Reports = () => {
  const { hasModule } = useAuth();
  const [reportType, setReportType] = useState('production');

  const productionReportData = [
    { date: '2024-02-20', woNo: 'WO-2024-043', item: 'White Enamel Paint', planned: 1000, produced: 950, yield: '95%' },
    { date: '2024-02-21', woNo: 'WO-2024-044', item: 'Blue Emulsion Paint', planned: 1000, produced: 920, yield: '92%' },
    { date: '2024-02-22', woNo: 'WO-2024-045', item: 'White Enamel Paint', planned: 1000, produced: 980, yield: '98%' },
  ];

  const yieldReportData = [
    { product: 'White Enamel Paint', totalProduced: 2930, scrap: 120, yield: '96.1%', avgYield: '95%' },
    { product: 'Blue Emulsion Paint', totalProduced: 1840, scrap: 160, yield: '92.0%', avgYield: '92%' },
    { product: 'Red Primer', totalProduced: 1520, scrap: 180, yield: '89.4%', avgYield: '88%' },
  ];

  const vendorPerformanceData = [
    { vendor: 'Titanium Dioxide Co.', totalOrders: 12, onTime: 11, quality: '98%', rating: '4.5/5' },
    { vendor: 'Resin Suppliers Ltd', totalOrders: 10, onTime: 9, quality: '95%', rating: '4.2/5' },
    { vendor: 'Pigment Industries', totalOrders: 15, onTime: 14, quality: '99%', rating: '4.8/5' },
  ];

  const inventoryAgingData = [
    { item: 'Titanium Dioxide', qty: 850, age0to30: 650, age31to60: 150, age61to90: 50, above90: 0 },
    { item: 'Acrylic Resin', qty: 650, age0to30: 550, age31to60: 100, age61to90: 0, above90: 0 },
    { item: 'White Enamel Paint', qty: 250, age0to30: 250, age31to60: 0, age61to90: 0, above90: 0 },
  ];

  const qcFailureData = [
    { product: 'White Enamel Paint', totalTests: 45, passed: 43, failed: 2, failureRate: '4.4%' },
    { product: 'Blue Emulsion Paint', totalTests: 32, passed: 30, failed: 2, failureRate: '6.3%' },
    { product: 'Red Primer', totalTests: 28, passed: 26, failed: 2, failureRate: '7.1%' },
  ];

  if (!hasModule('reports')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access Reports.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderReportContent = () => {
    switch(reportType) {
      case 'production':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Production Report</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>WO Number</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Planned Qty</TableHead>
                    <TableHead>Produced Qty</TableHead>
                    <TableHead>Yield %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionReportData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell className="font-medium">{row.woNo}</TableCell>
                      <TableCell>{row.item}</TableCell>
                      <TableCell>{row.planned} LTR</TableCell>
                      <TableCell className="font-medium">{row.produced} LTR</TableCell>
                      <TableCell>
                        <span className="text-[#10B981] font-medium">{row.yield}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={3} className="font-medium">Total</TableCell>
                    <TableCell className="font-medium">3000 LTR</TableCell>
                    <TableCell className="font-medium">2850 LTR</TableCell>
                    <TableCell className="font-medium text-[#10B981]">95.0%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case 'yield':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Yield Report</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Total Produced</TableHead>
                    <TableHead>Scrap</TableHead>
                    <TableHead>Actual Yield %</TableHead>
                    <TableHead>Standard Yield %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {yieldReportData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{row.product}</TableCell>
                      <TableCell>{row.totalProduced} LTR</TableCell>
                      <TableCell className="text-[#EF4444]">{row.scrap} LTR</TableCell>
                      <TableCell>
                        <span className="text-[#10B981] font-medium">{row.yield}</span>
                      </TableCell>
                      <TableCell className="text-gray-600">{row.avgYield}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case 'vendor':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vendor Performance Report</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>On-Time Delivery</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Overall Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorPerformanceData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{row.vendor}</TableCell>
                      <TableCell>{row.totalOrders}</TableCell>
                      <TableCell>
                        <span className="text-[#10B981]">{row.onTime}/{row.totalOrders}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-[#10B981] font-medium">{row.quality}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-[#F59E0B]">★</span>
                          <span className="font-medium">{row.rating}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case 'inventory':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inventory Aging Report</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Total Qty</TableHead>
                    <TableHead>0-30 Days</TableHead>
                    <TableHead>31-60 Days</TableHead>
                    <TableHead>61-90 Days</TableHead>
                    <TableHead>Above 90 Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryAgingData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{row.item}</TableCell>
                      <TableCell>{row.qty}</TableCell>
                      <TableCell className="text-[#10B981]">{row.age0to30}</TableCell>
                      <TableCell className="text-[#F59E0B]">{row.age31to60}</TableCell>
                      <TableCell className="text-[#EF4444]">{row.age61to90}</TableCell>
                      <TableCell className="text-[#EF4444] font-medium">{row.above90}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case 'qc':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>QC Failure Rate Report</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Total Tests</TableHead>
                    <TableHead>Passed</TableHead>
                    <TableHead>Failed</TableHead>
                    <TableHead>Failure Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qcFailureData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{row.product}</TableCell>
                      <TableCell>{row.totalTests}</TableCell>
                      <TableCell className="text-[#10B981]">{row.passed}</TableCell>
                      <TableCell className="text-[#EF4444]">{row.failed}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          parseFloat(row.failureRate) < 5 ? 'text-[#10B981]' :
                          parseFloat(row.failureRate) < 10 ? 'text-[#F59E0B]' :
                          'text-[#EF4444]'
                        }`}>
                          {row.failureRate}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Generate and view various business reports</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Report Type *</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production Report</SelectItem>
                  <SelectItem value="yield">Yield Report</SelectItem>
                  <SelectItem value="vendor">Vendor Performance</SelectItem>
                  <SelectItem value="inventory">Inventory Aging</SelectItem>
                  <SelectItem value="qc">QC Failure Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input type="date" defaultValue="2024-02-01" />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input type="date" defaultValue="2024-02-23" />
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-[#0B74FF]">
                <FileBarChart className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {renderReportContent()}
    </div>
  );
};

export default Reports;
