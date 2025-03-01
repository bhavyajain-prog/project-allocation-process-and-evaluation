import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Login from "./components/Login";
// import StudentHome from "./components/StudentHome";
// import MentorHome from "./components/MentorHome";
// import AdminHome from "./components/AdminHome";
// import Reports from "./components/Reports";
// import Settings from "./components/Settings";
import Home from "./components/Home";
import Unauthorized from "./components/NotFound";

import RoleBasedRoute from "./RoleBasedRoute";

import "./App.css";

export default function App() {
  return <Home />;
}

// export default function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/unauthorized" element={<Unauthorized />} />

//           {/* Role-Based Protected Routes
//           <Route
//             path="/student/home"
//             element={
//               <RoleBasedRoute allowedRoles={["student"]}>
//                 <StudentHome />
//               </RoleBasedRoute>
//             }
//           />
//           <Route
//             path="/mentor/home"
//             element={
//               <RoleBasedRoute allowedRoles={["mentor"]}>
//                 <MentorHome />
//               </RoleBasedRoute>
//             }
//           />
//           <Route
//             path="/admin/home"
//             element={
//               <RoleBasedRoute allowedRoles={["admin"]}>
//                 <AdminHome />
//               </RoleBasedRoute>
//             }
//           />

//           <Route
//             path="/reports"
//             element={
//               <RoleBasedRoute allowedRoles={["mentor", "admin"]}>
//                 <Reports />
//               </RoleBasedRoute>
//             }
//           />
//           <Route
//             path="/settings"
//             element={
//               <RoleBasedRoute allowedRoles={["student", "mentor", "admin"]}>
//                 <Settings />
//               </RoleBasedRoute>
//             }
//           /> */}
//           <Route path="*" element={<Navigate to="/unauthorized" />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }
