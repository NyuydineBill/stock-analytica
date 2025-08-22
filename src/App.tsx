import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ReportConfiguration from "./pages/ReportConfiguration";
import StockAnalysis from "./pages/StockAnalysis";
import BatchAnalysis from "./pages/BatchAnalysis";
import BatchReport from "./pages/BatchReport";
import Portfolio from "./pages/Portfolio";
import ResearchReport from "./pages/ResearchReport";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import EarningsAnalysis from "./pages/EarningsAnalysis";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/report-config" element={
          <ProtectedRoute>
            <ReportConfiguration />
          </ProtectedRoute>
        } />
        <Route path="/analyze/:symbol" element={
          <ProtectedRoute>
            <StockAnalysis />
          </ProtectedRoute>
        } />
        <Route path="/batch-analyze" element={
          <ProtectedRoute>
            <BatchAnalysis />
          </ProtectedRoute>
        } />
        <Route path="/batch-report" element={
          <ProtectedRoute>
            <BatchReport />
          </ProtectedRoute>
        } />
        <Route path="/reports/:id/progress" element={
          <ProtectedRoute>
            <ResearchReport />
          </ProtectedRoute>
        } />
        <Route path="/report/:symbol" element={
          <ProtectedRoute>
            <ResearchReport />
          </ProtectedRoute>
        } />
        <Route path="/portfolio" element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        } />
        <Route path="/earnings" element={
          <ProtectedRoute>
            <EarningsAnalysis />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);
export default App;
