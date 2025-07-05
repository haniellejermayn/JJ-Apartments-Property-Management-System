'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Users, 
  DollarSign,
  LogOut 
} from 'lucide-react';
import Image from 'next/image';

export default function Sidebar() {

  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
    },
    {
      name: 'Apartments',
      href: '/apartment-overview',
      icon: Building2,
    },
    {
      name: 'Tenants',
      href: '/tenants-management',
      icon: Users,
    },
    {
      name: 'Financial',
      href: '/financial-tracking',
      icon: DollarSign,
    },
    {
      name: 'Logout',
      href: '/login',
      icon: LogOut,
    },
  ];

  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border-r z-40">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
            <div className="flex justify-center">
                <Image 
                    src="/logo-no-bg.png" 
                    alt="JJ Apartments Logo" 
                    width={125}
                    height={125}
                    className="object-contain"
                    priority
                />
            </div>
            <h1 className="text-lg text-center font-bold text-gray-900">JJ Apartments</h1>
            <p className="text-xs text-center text-gray-500">Property Management</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-yellow-300 text-yellow-800 font-semibold'
                        : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 text-center">
            © 2025 JJ Apartments
          </div>
        </div>
      </div>
    </div>
  );
}