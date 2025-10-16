import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Learn from "./pages/Learn";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/learn" element={<Learn />} />
          {/* Only Home and Learn More */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;