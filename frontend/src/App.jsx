import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Learn from "./pages/Learn";
import Vision from "./pages/Vision";
import AdminWaitlist from "./pages/AdminWaitlist";
import Verify from "./pages/Verify";
import "./index.css";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/admin/waitlist" element={<AdminWaitlist />} />
          <Route path="/verify" element={<Verify />} />
          {/* Only Home and Learn More */}
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;