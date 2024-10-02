import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { HomeIcon, UsersIcon, FileTextIcon, ChevronLeftIcon, ChevronRightIcon, FileIcon } from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          <li>
            <Link to="/">
              <Button variant="ghost" className={`w-full justify-${isCollapsed ? 'center' : 'start'}`}>
                <HomeIcon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && 'Dashboard'}
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/matching">
              <Button variant="ghost" className={`w-full justify-${isCollapsed ? 'center' : 'start'}`}>
                <UsersIcon className={`h-6 w-6 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && 'Student-Company Matching'}
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/documents">
              <Button variant="ghost" className={`w-full justify-${isCollapsed ? 'center' : 'start'}`}>
                <FileTextIcon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && 'View Documents'}
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/extracted-text">
              <Button variant="ghost" className={`w-full justify-${isCollapsed ? 'center' : 'start'}`}>
                <FileIcon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && 'Extracted Text'}
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
