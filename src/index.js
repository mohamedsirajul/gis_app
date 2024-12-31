import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import AddCsv from "./Components/superAdmin/addcsv";
import PropertyDetails from "./Components/users/PropertyDetails";
import UserLogin from "./Components/users/user_Login";
import AdminLogin from "./Components/admin/admin_Login";
import Users from "./Components/admin/users";
import AssignTask from "./Components/admin/AssignTask";
import ViewTask from "./Components/admin/viewTask";
import SViewTask from "./Components/superAdmin/viewTask";

import ViewSurvey from "./Components/admin/survey_Data";
import SViewSurvey from "./Components/superAdmin/survey_Data";

// import Footer from "./Components/footer";
import SuperAdminLogin from "./Components/superAdmin/superadmin_Login";
import SuperAdminDashboard from "./Components/superAdmin/dashboard";

import Fad from "./Components/floorAnalysisdata/fad";
import Surveyor from "./Components/superAdmin/surveyor";
import AdminData from "./Components/superAdmin/adminData";
import Vfa from "./Components/ViewFloorAnalysis/vfa";
import FadLogin from "./Components/floorAnalysisdata/fad_Login";
import VfaLogin from "./Components/ViewFloorAnalysis/vfa_Login";
import FadData from "./Components/superAdmin/fad_data";
import VfaData from "./Components/superAdmin/vfa_Admin";
import ViewVfa from "./Components/superAdmin/view_vfa";
import Homes from "./Components/Home";
import AddDroneCsv from "./Components/superAdmin/adddronecsv";
import AddExistingTax from "./Components/superAdmin/addexistingtaxcsv";
import FilterAd from "./Components/floorAnalysisdata/filter_assessments";
import VerificationLogin from "./Components/verification/verificationlogin";
import AdminVerificationLogin from "./Components/adminVerification/admin_verificationlogin";
import SadminVerificationLogin from "./Components/sadminVerification/sadmin_verificationlogin";
import EditSadminVerifyProperties from "./Components/sadminVerification/editsadminverifyproperties";
import EditAdminVerifyProperties from "./Components/adminVerification/editadminverifyproperties";
import EditVerificationProperties from "./Components/verification/editverificationproperties";

// Function to check if the user is logged in
const isUserLoggedIn = () => {
  return localStorage.getItem("user_token") !== null;
};

const isAdminLoggedIn = () => {
  return localStorage.getItem("admin_token") !== null;
};

const isSuperAdminLoggedIn = () => {
  return localStorage.getItem("super_admin_token") !== null;
};
const isFdaAdminLoggedIn = () => {
  return localStorage.getItem("fad_token") !== null;
};
const isVfaAdminLoggedIn = () => {
  return localStorage.getItem("vfa_token") !== null;
};
const isVerificationLoggedIn = () => {
  return localStorage.getItem("verification_token") !== null;
};
const isAdminVerificationLoggedIn = () => {
  return localStorage.getItem("admin_verification_token") !== null;
};
const isSadminVerificationLoggedIn = () => {
  return localStorage.getItem("sadmin_verification_token") !== null;
};
// Function to render routes based on login status
const renderRoutes = () => {
  if (isSuperAdminLoggedIn()) {
    return (
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={<SuperAdminDashboard />}>
          <Route index element={<Navigate replace to="surveyor" />} />
          <Route path="surveyor" element={<Surveyor />} />
          <Route path="sviewTask/:user_id" element={<SViewTask />} />
          <Route path="sviewSurvey/:user_id" element={<SViewSurvey />} />
          <Route path="admin" element={<AdminData />} />
          <Route path="fadadmin" element={<FadData />} />
          <Route path="vfa_admin" element={<VfaData />} />
          <Route path="view_vfa" element={<ViewVfa />} />

          <Route path="addpropcsv" element={<AddCsv />} />
          <Route path="adddronecsv" element={<AddDroneCsv />} />
          <Route path="addexistaxcsv" element={<AddExistingTax />} />
        </Route>
        <Route path="*" element={<Navigate to="/surveyor" replace />} />
      </Routes>
    );
  } else if (isAdminLoggedIn()) {
    return (
      <Routes>
        <Route path="/" element={<Navigate replace to="/users" />} />
        <Route path="/admin_login" element={<Navigate replace to="/users" />} />
        <Route path="/users" element={<Users />} />
        <Route path="/assignTask/:user_id" element={<AssignTask />} />
        <Route path="/viewTask/:user_id" element={<ViewTask />} />
        <Route path="/viewSurvey/:user_id" element={<ViewSurvey />} />
        <Route path="/filterad" element={<FilterAd />} />
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    );
  } else if (isFdaAdminLoggedIn()) {
    return (
      <Routes>
        <Route path="/" element={<Navigate replace to="/fad" />} />
        <Route path="/user_login" element={<Navigate replace to="/fad" />} />
        <Route path="/admin_login" element={<Navigate replace to="/fad" />} />
        <Route path="/fad" element={<Fad />} />
        <Route path="/filterad" element={<FilterAd />} />

        <Route path="*" element={<Navigate to="/fad" replace />} />
      </Routes>
    );
  } else if (isVfaAdminLoggedIn()) {
    return (
      <Routes>
        <Route path="/" element={<Navigate replace to="/vfa" />} />
        <Route path="/user_login" element={<Navigate replace to="/vfa" />} />
        <Route path="/vfa" element={<Vfa />} />
        <Route path="*" element={<Navigate to="/vfa" replace />} />
      </Routes>
    );
  } 
  else if (isVerificationLoggedIn()) {
    return (
      <Routes>
        <Route path="/" element={<Navigate replace to="/verification" />} />
        <Route path="/verification" element={<EditVerificationProperties />} />
        <Route 
          path="/Gis_finder_ward_01/index.html" 
          element={<Navigate to="/Gis_finder_ward_01/index.html" />} 
        />
        <Route 
          path="/Gis_finder_ward_36/index.html" 
          element={<Navigate to="/Gis_finder_ward_36/index.html" />} 
        />
        <Route path="*" element={<Navigate to="/verification" replace />} />
      </Routes>
    );
  } 
  else if (isAdminVerificationLoggedIn()) {
    return (
      <Routes>
        <Route path="/" element={<Navigate replace to="/admin_verification" />} />
        <Route path="/admin_verification" element={<EditAdminVerifyProperties />} />
        <Route 
          path="/Gis_finder_ward_01/index.html" 
          element={<Navigate to="/Gis_finder_ward_01/index.html" />} 
        />
        <Route 
          path="/Gis_finder_ward_36/index.html" 
          element={<Navigate to="/Gis_finder_ward_36/index.html" />} 
        />
        <Route path="*" element={<Navigate to="/admin_verification" replace />} />
      </Routes>
    );
  }
  else if (isSadminVerificationLoggedIn()) {
    return (
      <Routes>
        <Route path="/" element={<Navigate replace to="/sadmin_verification" />} />
        <Route path="/sadmin_verification" element={<EditSadminVerifyProperties />} />

        <Route 
          path="/Gis_finder_ward_01/index.html" 
          element={<Navigate to="/Gis_finder_ward_01/index.html" />} 
        />
        <Route 
          path="/Gis_finder_ward_36/index.html" 
          element={<Navigate to="/Gis_finder_ward_36/index.html" />} 
        />
        <Route path="*" element={<Navigate to="/sadmin_verification" replace />} />
      </Routes>
    );
  }
  else if (isUserLoggedIn()) {
    return (
      <Routes>
        <Route path="/" element={<Navigate replace to="/prop_details" />} />
        <Route
          path="/user_login"
          element={<Navigate replace to="/prop_details" />}
        />
        <Route path="/prop_details" element={<PropertyDetails />} />
        <Route 
          path="/Gis_finder_ward_01/index.html" 
          element={<Navigate to="/Gis_finder_ward_01/index.html" />} 
        />
        <Route 
          path="/Gis_finder_ward_36/index.html" 
          element={<Navigate to="/Gis_finder_ward_36/index.html" />} 
        />
        <Route path="*" element={<Navigate to="/prop_details" replace />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<Homes />} />
        <Route path="/user_login" element={<UserLogin />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/sadmin_login" element={<SuperAdminLogin />} />
        <Route path="/fadadmin_login" element={<FadLogin />} />
        <Route path="/vfa_admin_login" element={<VfaLogin />} />
        <Route path="/verification" element={<VerificationLogin />} />
        <Route path="/admin_verification" element={<AdminVerificationLogin />} />
        <Route path="/sadmin_verification" element={<SadminVerificationLogin />} />

        <Route path="/prop_details" element={<Navigate to="/" replace />} />
        <Route path="/users" element={<Navigate to="/admin_login" replace />} />
        <Route path="/verification" element={<Navigate to="/verification" replace />} />
      
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>{renderRoutes()}</BrowserRouter>
    {/* <Footer /> */}
  </React.StrictMode>,
  document.getElementById("root")
);
