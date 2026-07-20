import "./global.css";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

function SectionRouteShell() {
  return (
    <>
      <Index />
      <Placeholder />
    </>
  );
}

const sectionPaths = [
  "our-work",
  "who-we-are",
  "news",
  "support",
  "objectives",
  "about-us",
  "news-and-stories",
  "contacts",
  "tech-and-innovation",
  "education",
  "economic-empowerment",
  "disability-inclusion",
  "wellness-and-mental-health",
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Index />} />
            {sectionPaths.map((path) => <Route key={path} path={path} element={<SectionRouteShell />} />)}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
