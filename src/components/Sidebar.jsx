import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { HomeIcon, UsersIcon, FileTextIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: "/", icon: <HomeIcon className="h-5 w-5" />, label: "Dashboard" },
    { to: "/matching", icon: <UsersIcon className="h-5 w-5" />, label: "Matching" },
    { to: "/documents", icon: <FileTextIcon className="h-5 w-5" />, label: "Documents" },
  ];

  return (
    <div className={`bg-gray-800 text-white ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen p-4 transition-all duration-300 ease-in-out`}>
      <div className="flex justify-between items-center mb-6">
        {!isCollapsed && <h2 className="text-2xl font-bold">IRIS</h2>}
        <Button variant="ghost" onClick={() => setIsCollapsed(!isCollapsed)} className="p-1">
          {isCollapsed ? <ChevronRightIcon className="h-6 w-6" /> : <ChevronLeftIcon className="h-6 w-6" />}
        </Button>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>
                <Button variant="ghost" className={`w-full justify-${isCollapsed ? 'center' : 'start'}`}>
                  {item.icon}
                  {!isCollapsed && <span className="ml-2">{item.label}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
