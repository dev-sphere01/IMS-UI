import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./Pages/Auth/Login";
import SetSecurityQuestions from "./Pages/Auth/SetSecurityQuestions";
import ForgetPassword from "./Pages/Auth/ForgetPassword";
import SignUp from "./Pages/Auth/SignUp";
import ChangePassword from "./Pages/Auth/ChangePassword";
import Home from "./Pages/Home/Home";
import Enquiry from "./Pages/Forms/Enquiry";
import EnquiryGrid from "./Pages/Masters/EnquiryGrid";
import AdmissionForm from "./Pages/Forms/AdmissionForm";
import AdmissionTable from "./Pages/Masters/AdmissionTable";
import FeeForm from "./Pages/Forms/FeeForm";
import FeeTable from "./Pages/Masters/FeeTable";
import CourseForm from "./Pages/Forms/CourseForm";
import CourseTable from "./Pages/Masters/CourseTable";
import BatchTimingTable from "./Pages/Masters/BatchTimingTable";
import GoalTable from "./Pages/Masters/GoalTable";
import MasterManagement from "./Pages/Masters/MasterManagement";
import Mail from "./Pages/Mail/Mail";
import Report from "./Pages/Report/Report";
import Time from "./Pages/Time/Time";
import Progress from "./Pages/Progress/Progress";
import Settings from "./Pages/Settings/Settings";

import HomeLayout from "./layouts/HomeLayout";

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300">
        <BrowserRouter>
          <Routes>
          {/* Auth Routes - No Layout */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/setSecurityQuestion"
            element={<SetSecurityQuestions />}
          />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes with HomeLayout */}
          <Route
            path="/enquiry"
            element={
              <HomeLayout>
                <Enquiry />
              </HomeLayout>
            }
          />
          <Route
            path="/enquiryGrid"
            element={
              <HomeLayout>
                <EnquiryGrid />
              </HomeLayout>
            }
          />
          <Route
            path="/admissionForm"
            element={
              <HomeLayout>
                <AdmissionForm />
              </HomeLayout>
            }
          />
          <Route
            path="/admissionTable"
            element={
              <HomeLayout>
                <AdmissionTable />
              </HomeLayout>
            }
          />
          <Route
            path="/feeform"
            element={
              <HomeLayout>
                <FeeForm />
              </HomeLayout>
            }
          />
          <Route
            path="/feeTable"
            element={
              <HomeLayout>
                <FeeTable />
              </HomeLayout>
            }
          />
          <Route
            path="/mail"
            element={
              <HomeLayout>
                <Mail />
              </HomeLayout>
            }
          />
          <Route
            path="/report"
            element={
              <HomeLayout>
                <Report />
              </HomeLayout>
            }
          />
          <Route
            path="/time"
            element={
              <HomeLayout>
                <Time />
              </HomeLayout>
            }
          />
          <Route
            path="/progress"
            element={
              <HomeLayout>
                <Progress />
              </HomeLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <HomeLayout>
                <Settings />
              </HomeLayout>
            }
          />
          <Route
            path="/course"
            element={
              <HomeLayout>
                <CourseForm />
              </HomeLayout>
            }
          />
          <Route
            path="/course/:id"
            element={
              <HomeLayout>
                <CourseForm />
              </HomeLayout>
            }
          />
          <Route
            path="/courseGrid"
            element={
              <HomeLayout>
                <CourseTable />
              </HomeLayout>
            }
          />
          <Route
            path="/master-management"
            element={
              <HomeLayout>
                <MasterManagement />
              </HomeLayout>
            }
          />
          <Route
            path="/batch-timing-table"
            element={
              <HomeLayout>
                <BatchTimingTable />
              </HomeLayout>
            }
          />
          <Route
            path="/goal-table"
            element={
              <HomeLayout>
                <GoalTable />
              </HomeLayout>
            }
          />

          <Route path="/*" element={
            <HomeLayout>
              <Home />
            </HomeLayout>
          } />
        </Routes>
      </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
