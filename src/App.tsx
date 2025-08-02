import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StockAnalysis from "./pages/StockAnalysis";
import BatchAnalysis from "./pages/BatchAnalysis";
import BatchReport from "./pages/BatchReport";
import Portfolio from "./pages/Portfolio";
import ResearchReport from "./pages/ResearchReport";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import EarningsAnalysis from "./pages/EarningsAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analyze/:symbol" element={<StockAnalysis />} />
          <Route path="/batch-analyze" element={<BatchAnalysis />} />
          <Route path="/batch-report" element={<BatchReport />} />
          <Route path="/report/:symbol" element={<ResearchReport />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/earnings" element={<EarningsAnalysis />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
