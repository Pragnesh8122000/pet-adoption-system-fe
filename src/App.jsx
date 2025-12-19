import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PetList from "./pages/PetList";
import PetDetails from "./pages/PetDetails";
import MyApplications from "./pages/MyApplications";
import PetsManagement from "./pages/admin/PetsManagement";
import ApplicationsManagement from "./pages/admin/ApplicationsManagement";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes with MainLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Navigate to="/pets" replace />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PetList />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PetDetails />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute>
                <RoleGuard
                  allowedRoles={["user"]}
                  fallback={<Navigate to="/" replace />}
                >
                  <MainLayout>
                    <MyApplications />
                  </MainLayout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/pets"
            element={
              <ProtectedRoute>
                <RoleGuard
                  allowedRoles={["admin"]}
                  fallback={<Navigate to="/" replace />}
                >
                  <MainLayout>
                    <PetsManagement />
                  </MainLayout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute>
                <RoleGuard  
                  allowedRoles={["admin"]}
                  fallback={<Navigate to="/" replace />}
                >
                  <MainLayout>
                    <ApplicationsManagement />
                  </MainLayout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Redirect all other paths to login or home */}
          <Route path="*" element={<Navigate to="/pets" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </>
  );
}

export default App;
