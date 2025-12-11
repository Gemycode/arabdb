import "./App.css";
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Footer from "./componet/Footer";
import TermsOfUse from "./Pages/TermsOfUse";
import IntellectualPropertyRights from "./Pages/IntellectualPropertyRights";
import Dashboard from "./Dashboard/Dashboard";
import ResetPassword from "./Pages/ResetPassword";
import MovieFilterDemo from "./Pages/MovieFilterDemo";
import SeriesFilterDemo from "./Pages/SeriesFilterDemo";
import Details from "./Pages/Details";
import AdminDashboard from "./Dashboard/AdminDashboard";
import Profile from "./Pages/Profile";
import AddForm from "./Dashboard/AddForm";
import Contact from "./Pages/Contact";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import AboutAs from "./Pages/AboutAs";

const ProtectedRoute = ({ children, roles = ["admin"] }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {


  return (
    <>
      <div>
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Footer" element={<Footer />} />
          <Route path="/TermsOfUse" element={<TermsOfUse />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/AboutAs" element={<AboutAs />} />
          <Route
            path="/IntellectualPropertyRights"
            element={<IntellectualPropertyRights />}
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["admin", "publisher"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute roles={["admin", "publisher"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddForm"
            element={
              <ProtectedRoute roles={["admin", "publisher"]}>
                <AddForm />
              </ProtectedRoute>
            }
          />
          {/* Public Routes - No authentication required */}
          <Route path="/MovieFilterDemo" element={<MovieFilterDemo />} />
          <Route path="/SeriesFilterDemo" element={<SeriesFilterDemo />} />
          <Route path="/Details/:id" element={<Details />} />

          {/* Protected Routes - Authentication required */}
          <Route
            path="/AdminDashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Profile"
            element={
              <ProtectedRoute roles={["user", "admin", "publisher"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/edit/:id"
            element={
              <ProtectedRoute roles={["admin", "publisher"]}>
                <AddForm />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#1f2937',
          color: '#ffffff',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
        }}
      />
    </>
  );
}

export default App;

