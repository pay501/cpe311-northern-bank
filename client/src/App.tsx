import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Transfer from "./pages/Transfer";
import Loan from "./pages/Loan"
import Transaction from "./pages/Transaction";
import WaitLoan from "./pages/WaitLoan";
import Settings from "./pages/settings";
import Chat from "./pages/Chat";

const App: React.FC = () => {

  
  
  return (
    <Router>
      <Routes>
        <Route path="/authen" element={<Login />} />
        
        {/* Protected Routes with Layout */}
        <Route path="/create-user" element={<Layout />}>
          <Route index element={<Register />} />
        </Route>

        <Route path="/loan-history" element={<Layout />}>
          <Route index element={<WaitLoan />} />
        </Route>

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        
        <Route path="/fundtransfer" element={<Layout/>}>
          <Route index element={<Transfer/>} />
        </Route>

        <Route path="/chat-bot" element={<Layout/>}>
          <Route index element={<Chat/>}/>
        </Route>

        <Route path="/settings" element={<Layout/>}>
          <Route index element={<Settings/>} />
        </Route>
        <Route path="/loan" element={<Layout/>}>
          <Route index element={<Loan/>}/>
        </Route>

        <Route path="/transfer-history" element={<Layout/>}>
          <Route index element={<Transaction/>}/>
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
