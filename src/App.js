
import React, { useEffect } from "react";
import { useState } from 'react';
import './App.css';
import Dashboard from './page/Dashboard';
import Login from './Login';
import { Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Settings from "./page/settings/Settings";
import i18next from 'i18next';

let dashboardkeyIndex = 0

function App() {
  const [cookies, setCookie] = useCookies(['user']);
  const [dashboardkey, setDashboardkey] = useState("dashboard");

  const navigate = useNavigate(); // react-router-dom v6

  const BackButtonListener = ({ children }) => {
    const [pressed, setPressed] = React.useState(false)
    React.useEffect(() => {
      window.onpopstate = e => {
        dashboardkeyIndex++
        setDashboardkey("dashboard" + dashboardkeyIndex)
      };
    });
   return (
      <div></div>
    );
  };

  useEffect(() => {
    document.title = i18next.t("app_name")
    if (cookies.user == null || cookies.user.id == null) {
      navigate('/', { replace: true });
    }
    else {
      navigate('/dashboard', { replace: true });
    }
  }, []);

  return (
    <div>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard 
          key={dashboardkey} />} />
        <Route path="/history" element={<Dashboard 
          hist={true}  />} />
        <Route path="/trail" element={<Dashboard 
          trail={true}  />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <BackButtonListener />
    </div>
  )
  
}

export default App;
