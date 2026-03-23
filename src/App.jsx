import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import MarketplacePage from "./pages/MarketplacePage.jsx";
import ToolDetailPage from "./pages/ToolDetailPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import AdminPanelPage from "./pages/AdminPanelPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MarketplacePage />} />
          <Route path="tool/:id" element={<ToolDetailPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="about" element={<AboutPage />} />
          {/* Hidden admin panel — not in nav */}
          <Route path="_ap" element={<AdminPanelPage />} />
          {/* Legacy redirects */}
          <Route path="admin" element={<Navigate to="/_ap" replace />} />
          <Route path="docs" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
