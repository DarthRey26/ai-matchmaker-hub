import { HomeIcon, UsersIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import MatchingView from "./pages/MatchingView.jsx";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Matching",
    to: "/matching",
    icon: <UsersIcon className="h-4 w-4" />,
    page: <MatchingView />,
  },
];
