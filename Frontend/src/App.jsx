import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import AssessmentsList from "./pages/AssessmentsList";
import AssessmentWizard from "./pages/AssessmentWizard";
import Journals from "./pages/Journals";
import JournalEditor from "./pages/JournalEditor";
import Chatbot from "./pages/Chatbot";
import Recommendations from "./pages/Recommendations";
import DoctorDirectory from "./pages/DoctorDirectory";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Phase 5: Journaling */}
            <Route path="/journal" element={<Journals />} />
            <Route path="/journal/new" element={<JournalEditor />} />

            {/* Phase 4: Assessments */}
            <Route path="/assessments" element={<AssessmentsList />} />
            <Route path="/assessments/:type" element={<AssessmentWizard />} />

            {/* Phase 5: Chatbot */}
            <Route path="/chatbot" element={<Chatbot />} />

            {/* Phase 6: Recommendations & Polish */}
            <Route path="/recommendations" element={<Recommendations />} />

            <Route path="/doctors" element={<DoctorDirectory />} />

            <Route
              path="/profile"
              element={
                <div className="p-8 text-xl">
                  Profile Page (Complete module structure installed!)
                </div>
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
