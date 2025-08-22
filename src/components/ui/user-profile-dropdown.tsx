import React from 'react';
import { User, Settings, LogOut, Shield, CreditCard, HelpCircle, Bell, BarChart3 } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Separator } from './separator';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
    onClose();
  };

  const menuItems = [
    {
      icon: <User className="h-4 w-4" />,
      label: 'Profile',
      description: 'View and edit your profile',
      onClick: () => onNavigate('/profile')
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: 'Settings',
      description: 'Manage your preferences',
      onClick: () => onNavigate('/settings')
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      label: 'Analytics',
      description: 'View usage statistics',
      onClick: () => onNavigate('/analytics')
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      label: 'Billing',
      description: 'Manage subscription',
      onClick: () => onNavigate('/billing')
    },
    {
      icon: <Shield className="h-4 w-4" />,
      label: 'Security',
      description: 'Password and security settings',
      onClick: () => onNavigate('/security')
    },
    {
      icon: <HelpCircle className="h-4 w-4" />,
      label: 'Help & Support',
      description: 'Get help and contact support',
      onClick: () => onNavigate('/support')
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {/* User Info Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {user?.username || 'User'}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {user?.profile?.subscription_type || 'Free'}
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                {user?.profile?.api_calls_remaining || 0} calls left
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Last login: {user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'Unknown'}
        </p>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <div className="text-gray-400">
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 transition-colors text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <div>
            <div className="text-sm font-medium">Logout</div>
            <div className="text-xs text-red-500">Sign out of your account</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default UserProfileDropdown; 