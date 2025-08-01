import React from 'react';
import { User, Settings, LogOut, Shield, CreditCard, HelpCircle, Bell, BarChart3 } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Separator } from './separator';

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
  const user = {
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Senior Analyst',
    avatar: null,
    plan: 'Professional',
    lastLogin: '2 hours ago'
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
              {user.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {user.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {user.role}
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                {user.plan}
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Last login: {user.lastLogin}
        </p>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-3 h-auto text-left hover:bg-gray-50"
              onClick={() => {
                item.onClick();
                onClose();
              }}
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-600">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
              </div>
            </Button>
            {index < menuItems.length - 1 && (
              <Separator className="mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => {
            console.log('Logout');
            onClose();
          }}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default UserProfileDropdown; 