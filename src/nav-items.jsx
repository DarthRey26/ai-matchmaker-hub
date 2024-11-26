import { FileTextIcon, HomeIcon, UsersIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import MatchingView from "./pages/MatchingView.jsx";
import Documents from "./pages/Documents.jsx";
import ModelComparison from "./pages/ModelComparison.jsx";
import MatchingProcess from "./pages/MatchingProcess.jsx";

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
  {
    title: "Documents",
    to: "/documents",
    icon: <FileTextIcon className="h-4 w-4" />,
    page: <Documents />,
  },
  {
    title: "Model Comparison",
    to: "/model-comparison",
    icon: <UsersIcon className="h-4 w-4" />,
    page: <ModelComparison />,
    hidden: true,
  },
  {
    title: "Matching Process",
    to: "/matching/process",
    icon: <UsersIcon className="h-4 w-4" />,
    page: <MatchingProcess />,
    hidden: true,
  },
];