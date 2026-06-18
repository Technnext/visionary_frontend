import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader';

const HomePage           = lazy(() => import('../pages/HomePage'));
const AboutPage          = lazy(() => import('../pages/AboutPage'));
const ServicesPage       = lazy(() => import('../pages/ServicesPage'));
const ServiceDetailPage  = lazy(() => import('../pages/ServiceDetailPage'));
const IndustriesPage     = lazy(() => import('../pages/IndustriesPage'));
const IndustryDetailPage = lazy(() => import('../pages/IndustryDetailPage'));
const InsightsPage       = lazy(() => import('../pages/InsightsPage'));
const InsightDetailPage  = lazy(() => import('../pages/InsightDetailPage'));
const CareersPage        = lazy(() => import('../pages/CareersPage'));
const ContactPage        = lazy(() => import('../pages/ContactPage'));

const MortgageServicesPage = lazy(() => import('../pages/MortgageServicesPage'));
const MortgageServicePage = lazy(() => import('../pages/MortgageServicePage'));
const JobDetailsPage      = lazy(() => import('../pages/JobDetailsPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"                    element={<HomePage />} />
          <Route path="/about"               element={<AboutPage />} />
          <Route path="/services"            element={<ServicesPage />} />
          <Route path="/services/:slug"      element={<ServiceDetailPage />} />
          <Route path="/industries"          element={<IndustriesPage />} />
          <Route path="/industries/:slug"    element={<IndustryDetailPage />} />
          <Route path="/insights"            element={<InsightsPage />} />
          <Route path="/insights/:slug"      element={<InsightDetailPage />} />
          <Route path="/mortgage-services"      element={<MortgageServicesPage />} />
          <Route path="/mortgage-services/:slug" element={<MortgageServicePage />} />
          <Route path="/careers"             element={<CareersPage />} />
          <Route path="/careers/:jobId"       element={<JobDetailsPage />} />
          <Route path="/contact"             element={<ContactPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
