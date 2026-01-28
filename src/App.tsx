import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { UserProtectedRoute } from "./components/auth/UserProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Pricing from "./pages/Pricing";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLeadList from "./pages/admin/LeadList";
import AdminLeadDetail from "./pages/admin/LeadDetail";
import AdminServiceList from "./pages/admin/ServiceList";
import AdminServiceEdit from "./pages/admin/ServiceEdit";
import AdminSubscriptionList from "./pages/admin/SubscriptionList";
import AdminSubscriptionDetail from "./pages/admin/SubscriptionDetail";
import AdminLegalDocList from "./pages/admin/LegalDocList";
import AdminLegalDocEdit from "./pages/admin/LegalDocEdit";
import AdminUserAgreements from "./pages/admin/UserAgreements";
import AdminClientList from "./pages/admin/ClientList";
import AdminClientDetail from "./pages/admin/ClientDetail";
import AdminClientEdit from "./pages/admin/ClientEdit";
import AdminClientOverview from "./pages/admin/ClientOverview";
import AdminProjectList from "./pages/admin/ProjectList";
import AdminProjectDetail from "./pages/admin/ProjectDetail";
import AdminProjectEdit from "./pages/admin/ProjectEdit";
import UserLogin from "./pages/auth/UserLogin";
import UserSignup from "./pages/auth/UserSignup";
import Onboarding from "./pages/auth/Onboarding";
import PortalLayout from "./pages/portal/PortalLayout";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalServices from "./pages/portal/PortalServices";
import PortalBookMeeting from "./pages/portal/PortalBookMeeting";
import PortalProfile from "./pages/portal/PortalProfile";
import PortalSubscriptions from "./pages/portal/PortalSubscriptions";
import PortalSubscriptionDetail from "./pages/portal/PortalSubscriptionDetail";
import PortalPayments from "./pages/portal/PortalPayments";
import PortalProjects from "./pages/portal/PortalProjects";
import PortalProjectDetail from "./pages/portal/PortalProjectDetail";
import TermsOfService from "./pages/legal/TermsOfService";
import ServiceLevelAgreement from "./pages/legal/ServiceLevelAgreement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Analytics />
      <SpeedInsights />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CurrencyProvider>
        <UserAuthProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Legal pages */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/sla" element={<ServiceLevelAgreement />} />

            {/* Customer auth routes */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route
              path="/onboarding"
              element={
                <UserProtectedRoute>
                  <Onboarding />
                </UserProtectedRoute>
              }
            />

            {/* Customer portal routes */}
            <Route
              path="/portal"
              element={
                <UserProtectedRoute>
                  <PortalLayout />
                </UserProtectedRoute>
              }
            >
              <Route index element={<PortalDashboard />} />
              <Route path="services" element={<PortalServices />} />
              <Route path="book-meeting" element={<PortalBookMeeting />} />
              <Route path="profile" element={<PortalProfile />} />
              <Route path="subscriptions" element={<PortalSubscriptions />} />
              <Route path="subscriptions/:id" element={<PortalSubscriptionDetail />} />
              <Route path="payments" element={<PortalPayments />} />
              <Route path="projects" element={<PortalProjects />} />
              <Route path="projects/:id" element={<PortalProjectDetail />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="leads" element={<AdminLeadList />} />
              <Route path="leads/:id" element={<AdminLeadDetail />} />
              <Route path="services" element={<AdminServiceList />} />
              <Route path="services/new" element={<AdminServiceEdit />} />
              <Route path="services/:id" element={<AdminServiceEdit />} />
              <Route path="subscriptions" element={<AdminSubscriptionList />} />
              <Route path="subscriptions/:id" element={<AdminSubscriptionDetail />} />
              <Route path="legal" element={<AdminLegalDocList />} />
              <Route path="legal/new" element={<AdminLegalDocEdit />} />
              <Route path="legal/:id" element={<AdminLegalDocEdit />} />
              <Route path="agreements" element={<AdminUserAgreements />} />
              <Route path="clients" element={<AdminClientList />} />
              <Route path="clients/new" element={<AdminClientEdit />} />
              <Route path="clients/:id" element={<AdminClientDetail />} />
              <Route path="clients/:id/edit" element={<AdminClientEdit />} />
              <Route path="clients/:id/overview" element={<AdminClientOverview />} />
              <Route path="projects" element={<AdminProjectList />} />
              <Route path="projects/new" element={<AdminProjectEdit />} />
              <Route path="projects/:id" element={<AdminProjectDetail />} />
              <Route path="projects/:id/edit" element={<AdminProjectEdit />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        </UserAuthProvider>
        </CurrencyProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
