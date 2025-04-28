
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import ErrorBoundary from "./components/ErrorBoundary";
import NavBar from "./components/NavBar";
import AirportListPage from "./pages/AirportListPage";
import FacilityCategoryPage from "./pages/FacilityCategoryPage";
import FacilityListPage from "./pages/FacilityListPage";
import FacilityDetailPage from "./pages/FacilityDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ToastProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main>
              <Routes>
                <Route path="/" element={<AirportListPage />} />
                <Route path="/airports/:airportId" element={<FacilityCategoryPage />} />
                <Route path="/airports/:airportId/:typeId" element={<FacilityListPage />} />
                <Route path="/facilities/:facilityId" element={<FacilityDetailPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </ErrorBoundary>
      </ToastProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
