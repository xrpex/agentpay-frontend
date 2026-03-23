import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import MarketplacePage from "./pages/MarketplacePage.jsx";
import ToolDetailPage from "./pages/ToolDetailPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DocsPage from "./pages/DocsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MarketplacePage />} />
          <Route path="tool/:id" element={<ToolDetailPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="about" element={<AboutPage />} />
          {/* Admin shortcut → Dashboard */}
          <Route path="admin" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
