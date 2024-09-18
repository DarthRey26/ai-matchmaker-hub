import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { HomeIcon, UsersIcon, FileTextIcon } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">IRIS</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start">
                <HomeIcon className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/matching">
              <Button variant="ghost" className="w-full justify-start">
                <UsersIcon className="mr-2 h-4 w-4" />
                Student-Company Matching
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/documents">
              <Button variant="ghost" className="w-full justify-start">
                <FileTextIcon className="mr-2 h-4 w-4" />
                View Documents
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;