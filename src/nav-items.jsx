import { FileTextIcon, HomeIcon, UsersIcon, FileIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import MatchingView from "./pages/MatchingView.jsx";
import Documents from "./pages/Documents.jsx";
import ExtractedText from "./pages/ExtractedText.jsx";

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
    title: "Extracted Text",
    to: "/extracted-text",
    icon: <FileIcon className="h-4 w-4" />,
    page: <ExtractedText />,
  },
];
