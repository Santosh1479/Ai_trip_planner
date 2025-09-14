import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TripForm from './pages/TripForm';
import Itinerary from './components/Itinerary';
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import UserLogout from "./pages/UserLogout";
import UserContext from "./context/UserContext";

export default function App() {
  const [trip, setTrip] = useState(null);

  return (
    <UserContext>
      <div className="">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/Tripform" element={<TripForm />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route
            path="/home"
            element={
              <UserProtectWrapper>
                <TripForm />
              </UserProtectWrapper>
            }
          />
          <Route
            path="/users/logout"
            element={
              <UserProtectWrapper>
                <UserLogout />
              </UserProtectWrapper>
            }
          />
        </Routes>
      </div>
    </UserContext>
  );
}
