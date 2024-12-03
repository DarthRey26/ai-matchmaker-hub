import { FileTextIcon, HomeIcon, UsersIcon, SparklesIcon, UploadIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import MatchingView from "./pages/MatchingView.jsx";
import Documents from "./pages/Documents.jsx";
import ModelComparison from "./pages/ModelComparison.jsx";
import MatchingProcess from "./pages/MatchingProcess.jsx";
import MatchingProcessAI from "./pages/MatchingProcessAI.jsx";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-5 w-5" />,
    page: <Index />,
  },
  {
    title: "Student-Company Matching",
    to: "/matching",
    icon: <UsersIcon className="h-5 w-5" />,
    page: <MatchingView />,
  },
  {
    title: "Upload Documents",
    to: "/documents",
    icon: <UploadIcon className="h-5 w-5" />,
    page: <Documents />,
  },
  {
    title: "Model Comparison",
    to: "/model-comparison",
    icon: <UsersIcon className="h-5 w-5" />,
    page: <ModelComparison />,
    hidden: true,
  },
  {
    title: "Matching Process",
    to: "/matching/process",
    icon: <UsersIcon className="h-5 w-5" />,
    page: <MatchingProcess />,
    hidden: true,
  },
  {
    title: "AI Matching Process",
    to: "/matching/process-ai",
    icon: <SparklesIcon className="h-5 w-5" />,
    page: <MatchingProcessAI />,
    hidden: true,
  },
];