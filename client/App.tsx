import "./global.css";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { FocusPageView, NewsPage, OurWorkPage, SupportPage, WhoWeArePage } from "./pages/FoundationPages";
import { focusPages } from "./pages/foundation-content";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Index />} />
            <Route path="our-work" element={<OurWorkPage />} />
            <Route path="who-we-are" element={<WhoWeArePage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="support" element={<SupportPage />} />
            {focusPages.map((page) => <Route key={page.path} path={page.path.slice(1)} element={<FocusPageView page={page} />} />)}
            <Route path="objectives" element={<Navigate to="/our-work" replace />} />
            <Route path="about-us" element={<Navigate to="/who-we-are" replace />} />
            <Route path="news-and-stories" element={<Navigate to="/news" replace />} />
            <Route path="contacts" element={<Navigate to="/support" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
