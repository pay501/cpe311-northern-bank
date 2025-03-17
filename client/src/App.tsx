import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Transfer from "./pages/Transfer";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/authen" element={<Login />} />
        <Route path="/create-user" element={<Register />} />
        
        {/* Protected Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/fundtransfer" element={<Layout/>}>
          <Route index element={<Transfer/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
