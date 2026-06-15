import { Routes, Route, Navigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import CreateLinkPage from "../pages/CreateLinkPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import { SHORT_BASE_URL } from "../lib/constants";

const shortBaseUrl = SHORT_BASE_URL.replace(/\/+$/, "");

function RedirectHandler() {
  const { code } = useParams<{ code: string }>();
  if (code) {
    window.location.replace(`${shortBaseUrl}/${encodeURIComponent(code)}`);
  }
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-2">
        <div className="h-5 w-5 border-2 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
        <p className="text-xs text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/create" element={<CreateLinkPage />} />
        <Route path="/analytics/:shortCode" element={<AnalyticsPage />} />
      </Route>
      <Route path="/:code" element={<RedirectHandler />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
