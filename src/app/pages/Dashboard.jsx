import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import DemoNotice from '../components/DemoNotice';

const Dashboard = () => {
  const { currentUser } = useAuth();

  // Mock data for charts
  const productionData = [
    { month: 'Jan', production: 4500, target: 5000 },
    { month: 'Feb', production: 5200, target: 5000 },
    { month: 'Mar', production: 4800, target: 5000 },
    { month: 'Apr', production: 5500, target: 5500 },
    { month: 'May', production: 6000, target: 5500 },
    { month: 'Jun', production: 5800, target: 6000 },
  ];

  const yieldData = [
    { name: 'White Paint', value: 95 },
    { name: 'Blue Paint', value: 92 },
    { name: 'Red Paint', value: 88 },
    { name: 'Green Paint', value: 90 },
  ];

  const machineUtilization = [
    { machine: 'Mixer-1', utilization: 85 },
    { machine: 'Mixer-2', utilization: 78 },
    { machine: 'Mixer-3', utilization: 92 },
    { machine: 'Filler-1', utilization: 88 },
    { machine: 'Filler-2', utilization: 75 },
  ];

  const COLORS = ['#0B74FF', '#10B981', '#F59E0B', '#EF4444'];

  // Render different dashboards based on role
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'Super Admin':
        return renderSuperAdminDashboard();
      case 'Production Manager':
        return renderProductionManagerDashboard();
      case 'Sales Executive':
        return renderSalesDashboard();
      case 'QC Lead':
        return renderQCDashboard();
      default:
        return renderDefaultDashboard();
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, trend, color }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${
                trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}-100`}>
            <Icon className={`w-6 h-6 text-${color}-600`} style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSuperAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Sales Orders" 
          value="148" 
          change="+12.5% from last month"
          trend="up"
          icon={ShoppingCart}
          color="#0B74FF"
        />
        <StatCard 
          title="Active Work Orders" 
          value="32" 
          change="+8.3% from last week"
          trend="up"
          icon={Package}
          color="#10B981"
        />
        <StatCard 
          title="Pending QC" 
          value="12" 
          change="-5 from yesterday"
          trend="down"
          icon={AlertTriangle}
          color="#F59E0B"
        />
        <StatCard 
          title="Inventory Value" 
          value="$2.4M" 
          change="+3.2% from last month"
          trend="up"
          icon={DollarSign}
          color="#10B981"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="production" fill="#0B74FF" name="Production" />
                <Bar dataKey="target" fill="#10B981" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Yield %</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={yieldData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {yieldData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Work Order WO-2024-045 completed', time: '2 hours ago', status: 'success' },
                { title: 'Purchase Order PO-2024-128 approved', time: '4 hours ago', status: 'success' },
                { title: 'QC Test failed for Batch B-3344', time: '5 hours ago', status: 'error' },
                { title: 'MRP Planning generated 8 shortages', time: '1 day ago', status: 'warning' },
                { title: 'New Sales Order SO-2024-567 created', time: '2 days ago', status: 'info' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-[#10B981]' :
                    activity.status === 'error' ? 'bg-[#EF4444]' :
                    activity.status === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#0B74FF]'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { po: 'PO-2024-128', vendor: 'Titanium Dioxide Co.', amount: '$45,000', status: 'Approved' },
                { po: 'PO-2024-129', vendor: 'Resin Suppliers Ltd', amount: '$32,500', status: 'Draft' },
                { po: 'PO-2024-130', vendor: 'Pigment Industries', amount: '$28,000', status: 'Sent' },
                { po: 'PO-2024-131', vendor: 'Chemical Solutions', amount: '$18,500', status: 'Approved' },
              ].map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{order.po}</p>
                    <p className="text-xs text-gray-500">{order.vendor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Approved' ? 'bg-[#10B981]/10 text-[#10B981]' :
                      order.status === 'Draft' ? 'bg-gray-200 text-gray-700' :
                      'bg-[#0B74FF]/10 text-[#0B74FF]'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderProductionManagerDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Running Work Orders" 
          value="18" 
          icon={Package}
          color="#0B74FF"
        />
        <StatCard 
          title="MRP Shortages" 
          value="8" 
          icon={AlertTriangle}
          color="#EF4444"
        />
        <StatCard 
          title="Avg Machine Utilization" 
          value="84%" 
          change="+2% from last week"
          trend="up"
          icon={TrendingUp}
          color="#10B981"
        />
        <StatCard 
          title="Batch Yield" 
          value="91.2%" 
          change="+1.5% improvement"
          trend="up"
          icon={CheckCircle}
          color="#10B981"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Machine Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={machineUtilization} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="machine" type="category" />
                <Tooltip />
                <Bar dataKey="utilization" fill="#0B74FF" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="production" stroke="#0B74FF" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderSalesDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Open Orders" 
          value="42" 
          icon={ShoppingCart}
          color="#0B74FF"
        />
        <StatCard 
          title="Delivered Orders" 
          value="156" 
          change="+18 this week"
          trend="up"
          icon={CheckCircle}
          color="#10B981"
        />
        <StatCard 
          title="Pending Dispatch" 
          value="12" 
          icon={Clock}
          color="#F59E0B"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { so: 'SO-2024-567', customer: 'ABC Construction', amount: '$12,500', status: 'Confirmed' },
              { so: 'SO-2024-568', customer: 'XYZ Builders', amount: '$8,750', status: 'Draft' },
              { so: 'SO-2024-569', customer: 'Modern Homes Inc', amount: '$15,200', status: 'Delivered' },
              { so: 'SO-2024-570', customer: 'Paint Retailers Co', amount: '$22,000', status: 'Confirmed' },
            ].map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{order.so}</p>
                  <p className="text-xs text-gray-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{order.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'Delivered' ? 'bg-[#10B981]/10 text-[#10B981]' :
                    order.status === 'Confirmed' ? 'bg-[#0B74FF]/10 text-[#0B74FF]' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderQCDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Pending Tests" 
          value="12" 
          icon={Clock}
          color="#F59E0B"
        />
        <StatCard 
          title="Passed Batches" 
          value="45" 
          change="+8 today"
          trend="up"
          icon={CheckCircle}
          color="#10B981"
        />
        <StatCard 
          title="Rejected Batches" 
          value="3" 
          icon={AlertTriangle}
          color="#EF4444"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batches Waiting for Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { batch: 'B-3345', product: 'White Enamel Paint', wo: 'WO-2024-045', priority: 'High' },
              { batch: 'B-3346', product: 'Blue Emulsion', wo: 'WO-2024-046', priority: 'Medium' },
              { batch: 'B-3347', product: 'Red Primer', wo: 'WO-2024-047', priority: 'High' },
              { batch: 'B-3348', product: 'Green Paint', wo: 'WO-2024-048', priority: 'Low' },
            ].map((batch, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{batch.batch}</p>
                  <p className="text-xs text-gray-500">{batch.product} • {batch.wo}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  batch.priority === 'High' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                  batch.priority === 'Medium' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {batch.priority}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderDefaultDashboard = () => (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Paint Manufacturing ERP</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          You are logged in as <span className="font-medium">{currentUser.name}</span> ({currentUser.role}).
          Your dashboard will be customized based on your role and permissions.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {currentUser.name}</p>
      </div>
      <DemoNotice />
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;