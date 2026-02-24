import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Info } from 'lucide-react';

const DemoNotice = () => {
  const { currentUser } = useAuth();

  return (
    <Card className="bg-[#0B74FF]/5 border-[#0B74FF]/20 mb-6">
      <CardContent className="p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#0B74FF] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-medium">Demo Mode:</span> You are viewing the ERP as{' '}
            <span className="font-semibold text-[#0B74FF]">{currentUser.name}</span>{' '}
            ({currentUser.role}). Use the "Switch Role (Demo)" button in the top navbar to experience the ERP from different user perspectives with role-based access control.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoNotice;
