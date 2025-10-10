import { Route, Routes } from "react-router-dom";
import Header from "../components/layout/Header/Header";
import LoginFormWithFormik from "../features/auth/components/LoginFormWithFormik";
import LoginPage from "../features/auth/pages/LoginPage";
import AdvancedForm from "../features/dashboard/pages/AdvancedForm";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import EmailTemplate from "../features/template-builder/EmailTemplate";

const AppRoutes = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={
              <EmailTemplate/>
            }
          />
          <Route path="/login" element={<LoginPage isSignup={false} />} />
          <Route path="/signup" element={<LoginPage isSignup={true} />} />
          <Route
            path="/formik"
            element={<LoginFormWithFormik isSignup={true} />}
          />
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
              <DashboardPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/form"
            element={
              // <ProtectedRoute>
              <AdvancedForm />
              // </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;
