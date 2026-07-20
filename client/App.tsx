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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Index />} />
            <Route path="our-work" element={<><Index /><Placeholder /></>} />
            <Route path="who-we-are" element={<><Index /><Placeholder /></>} />
            <Route path="news" element={<><Index /><Placeholder /></>} />
            <Route path="support" element={<><Index /><Placeholder /></>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
