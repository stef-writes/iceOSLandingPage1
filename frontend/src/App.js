import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Philosophy from "./pages/Philosophy";
import Technology from "./pages/Technology";
import Market from "./pages/Market";
import LearnMore from "./pages/LearnMore";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/philosophy" element={<Philosophy />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/market" element={<Market />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;