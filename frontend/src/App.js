import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Philosophy from "./pages/Philosophy";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/philosophy" element={<Philosophy />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;