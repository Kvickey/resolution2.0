// src/App.js
import React, { useState, useEffect } from "react";
import { scrollSpy } from "react-scroll";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import LoginForm from "./components/LoginForm";
import Display from "./pages/Display";
import UploadExcel from "./pages/UploadExcel";
import InstDashboardMain from "./pages/InstDashboardMain";
import { Modal, Box, Typography, Button, Zoom } from "@mui/material";
import "./App.css"; 
import { RxCookie } from "react-icons/rx";
import Cookie from "./assets/images/cookie.png";
import InstDashboard from "./pages/InstDashboard";
import AssignArbitrator from "./pages/AssignArbitrator";
import ReferenceDraftServices from "./pages/ReferenceDraftServices";
import ReferenceDraftReports from "./pages/ReferenceDraftReports";
import ReferenceDraftGenerate from "./pages/ReferenceDraftGenerate";
import ArbDashboard from "./pages/ArbDashboard";
import ArbDashboardMain from "./pages/ArbDashboardMain";
import AcceptanceLetter from "./pages/AcceptanceLetter";
import AcceptanceLetterService from "./pages/AcceptanceLetterService";
import AcceptanceLetterReports from "./pages/AcceptanceLetterReports";
import VirtualMeeting from "./pages/VirtualMeeting";
import FinalHearingNotice from "./pages/FifthHearingNotice";
import Section17Order from "./pages/Section17Order";
import BankDashboard from "./pages/BankDashboard";
import BankDashboardMain from "./pages/BankDashboardMain";
import CaseTrackingLotwise from "./pages/CaseTrackingLotwise";
import CaseTrackingCasewise from "./pages/CaseTrackingCasewise";
import LawyerDashboard from "./pages/LawyerDashboard";
import LawyerDashboardMain from "./pages/LawyerDashboardMain";
import SOC from "./pages/SOC";
import Section17Application from "./pages/Section17Application";
import ITDashboard from "./pages/ITDashboard";
import ITDashboardMain from "./pages/ITDashboardMain";
import ArbInfo from "./pages/ArbInfo";
import BankInfo from "./pages/BankInfo";
import ProductInfo from "./pages/ProductInfo";
import AssignSecondHearingDate from "./pages/AssignSecondHearingDate";
import AssignThirdHearingDate from "./pages/AssignThirdHearingDate";
import AssignForthHearingDate from "./pages/AssignForthHearingDate";
import Terminate from "./pages/Terminate";
import SecondHearingNotice from "./pages/SecondHearingNotice";
import AwardPass from "./pages/AwardPass";
import VirtualMeetingForSecondHearing from "./pages/VirtualMeetingForSecondHearing";
import VirtualMeetingForThirdHearing from "./pages/VirtualMeetingForThirdHearing";
import VirtualMeetingForForthHearing from "./pages/VirtualMeetingForForthHearing";
import VirtualMeetingForFifthHearing from "./pages/VirtualMeetingForFifthHearing";
import ThirdHearingNotice from "./pages/ThirdHearingNotice";
import SecondHearingServices from "./pages/SecondHearingServices";
import SecondHearingReport from "./pages/SecondHearingReport";
import ThirdHearingServices from "./pages/ThirdHearingServices";
import ThirdHearingReport from "./pages/ThirdHearingReport";
import ForthHearingNotice from "./pages/ForthHearingNotice";
import ForthHearingServices from "./pages/ForthHearingServices";
import ForthHearingReports from "./pages/ForthHearingReports";
import FifthHearingNotice from "./pages/FifthHearingNotice";
import FifthHearingReports from "./pages/FifthHearingReports";
import FifthHearingServices from "./pages/FifthHearingServices";
import AssignArbitratorByIntent from "./pages/AssignArbitratorByIntent";
import IntentLetterGenerate from "./pages/IntentLetterGenerate";
import IntentLetterServices from "./pages/IntentLetterServices";
import IntentLetterReports from "./pages/IntentLetterReports";
import ArbitratorList from "./components/ArbitratorList";

const App = () => {
  // useEffect(() => {
  //     scrollSpy.update();
  // }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cookiesConsentOpen, setCookiesConsentOpen] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem("consentGiven");
    if (!consentGiven) {
      setIsModalOpen(true); // Open the main disclaimer modal if consent hasn't been given
    }
  }, []);

  const handleAccept = () => {
    setIsModalOpen(false);
    localStorage.setItem("consentGiven", "true");
    setCookiesConsentOpen(true); // Open the cookies consent modal after accepting the disclaimer
  };

  const handleCookiesConsentClose = () => {
    setCookiesConsentOpen(false);
    localStorage.setItem("cookiesConsent", "true"); // Store cookies consent in local storage
  };
  const handleCookiesConsentCancel = () => {
    setCookiesConsentOpen(false);
    // localStorage.setItem("cookiesConsent", "true"); // Store cookies consent in local storage
  };

  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Display />} />
        
        <Route path="/bankdashboard" element={<BankDashboard />}>
          <Route index element={<BankDashboardMain />} />
          <Route path="dashboard" element={<BankDashboardMain />} />
          <Route path="casetracking">
          <Route path="lotwise" element={<CaseTrackingLotwise />} />
          <Route path="casewise" element={<CaseTrackingCasewise />} />
          </Route>
        </Route>

        <Route path="/instdashboard" element={<InstDashboard />}>
          <Route index element={<InstDashboardMain />} />
          <Route path="dashboard" element={<InstDashboardMain />} />
          <Route path="arbitrator" element={<ArbitratorList />} />
          <Route path="uploadalot" element={<UploadExcel />} />
          <Route path="intentletter">
            <Route path="generateintentletter" element={<IntentLetterGenerate />} />
            <Route path="ilservices" element={<IntentLetterServices/>} />
            <Route path="ilreports" element={<IntentLetterReports />} />
          </Route>
          <Route path="assignArb">
            <Route path="byintent" element={<AssignArbitratorByIntent />} />
            <Route path="bysystem" element={<AssignArbitrator />} />
          </Route>
          <Route path="referencedraft">
            <Route path="generate-rd" element={<ReferenceDraftGenerate />} />
            <Route path="services" element={<ReferenceDraftServices />} />
            <Route path="reports" element={<ReferenceDraftReports />} />
          </Route>
        </Route>

        <Route path="/itdashboard" element={<ITDashboard />}>
          <Route index element={<ITDashboardMain />} />
          <Route path="dashboard" element={<ITDashboardMain />} />
          <Route path="arbitrators" element={<ArbInfo />} />
          {/* <Route path="arbitrators" element={<ArbInfo />} /> */}
          <Route path="bankinfo" element={<BankInfo />} />
          {/* <Route path="trial" element={<Trial />} /> */}
        </Route>

        <Route path="/arbdashboard" element={<ArbDashboard />}>
          <Route index element={<ArbDashboardMain />} />
          <Route path="dashboard" element={<ArbDashboardMain />} />
          <Route path="acceptletter" element={<AcceptanceLetter />} />
          <Route path="acceptletter">
            <Route path="generate_al" element={<AcceptanceLetter />} />
            <Route path="services" element={<AcceptanceLetterService />} />
            <Route path="reports" element={<AcceptanceLetterReports />} />
          </Route>
          <Route path="section17order" element={<Section17Order />} />
          <Route path="firstHearing">
            <Route path="first_Hearing" element={<VirtualMeeting />} />
            <Route path="createSecondHearingNotice" element={<SecondHearingNotice />} />
            <Route path="secondHearingNoticeServices" element={<SecondHearingServices />} />
            <Route path="secondHearingNoticeReports" element={<SecondHearingReport />} />
          </Route>
          <Route path="secondHearing">
            <Route path="second_Hearing" element={<VirtualMeetingForSecondHearing />} />
            <Route path="createThirdHearingNotice" element={<ThirdHearingNotice />} />
            <Route path="thirdHearingNoticeServices" element={<ThirdHearingServices />} />
            <Route path="thirdHearingNoticeReports" element={<ThirdHearingReport />} />
          </Route>
          <Route path="thirdHearing">
            <Route path="third_Hearing" element={<VirtualMeetingForThirdHearing />} />
            <Route path="createForthHearingNotice" element={<ForthHearingNotice />} />
            <Route path="forthHearingNoticeServices" element={<ForthHearingServices />} />
            <Route path="forthHearingNoticeReports" element={<ForthHearingReports />} />
          </Route>
          <Route path="forthHearing">
            <Route path="forth_Hearing" element={<VirtualMeetingForForthHearing />} />
            <Route path="createFifthHearingNotice" element={<FifthHearingNotice />} />
            <Route path="fifthHearingNoticeServices" element={<FifthHearingServices />} />
            <Route path="fifthHearingNoticeReports" element={<FifthHearingReports />} />
          </Route>
          <Route path="fifthHearing">
            <Route path="fifth_Hearing" element={<VirtualMeetingForFifthHearing />} />
          </Route>
          <Route path="awardPass" element={<AwardPass />} />
          <Route path="terminate" element={<Terminate />} />
        </Route>

        <Route path="/lawyerdashboard" element={<LawyerDashboard />}>
          <Route index element={<LawyerDashboardMain />} />
          <Route path="dashboard" element={<LawyerDashboardMain />} />
          <Route path="uploadsoc" element={<SOC />} />
          <Route
            path="section17application"
            element={<Section17Application />}
          />
        </Route>
      </Routes>

      {/* <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="custom-modal">
          <Typography id="modal-title" variant="h6" component="h2">
            <h2>
              Welcome to <span className="text-info fw-bold"> Resolution</span>
            </h2>
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            <p>
              Before you proceed, we kindly request you to read and understand
              our 
               <a href="https://jupitice.com/terms-of-services.php" className="text-decoration-none">
                 Terms of Service
              </a>
              , including our{" "}
              <a href="https://jupitice.com/pdfs/terms/terms-of-use.pdf" className="text-decoration-none">
                Site Terms of Use,
              </a>
              <a href="https://jupitice.com/pdfs/terms/privacy-policy.pdf" className="text-decoration-none">
                Privacy Policy,
              </a>
              <a href="https://jupitice.com/pdfs/terms/cookie-policy.pdf" className="text-decoration-none">
                Cookie Policy,
              </a>{" "}
              and
              <a href="https://jupitice.com/pdfs/terms/mark-use-guidelines.pdf" className="text-decoration-none">
                Mark Use Guidelines.
              </a>
              By using our website, you acknowledge that you have read,
              understood, and agree to be bound by these{" "}
              <a href="https://jupitice.com/terms-of-services.php" className="text-decoration-none">
                Terms of Service
              </a>
              . By accessing and using our website, you agree to be bound and
              comply with these terms. If you do not agree with any part of
              these terms, please refrain from using our services and website.
              We reserve the right to update, modify, or replace any part of
              these terms without prior notice. It is your responsibility to
              check this page periodically for changes. Additionally, please
              review the specific terms associated with the products and
              solutions offered on our website. By accessing and using our
              website, including our products and solutions, you agree to comply
              with these terms. We offer a range of products and solutions on
              our website, and the usage of these is subject to specific terms
              outlined in conjunction with each product or solution. It is your
              responsibility to review and adhere to these terms. By continuing
              to use our website, you agree to these
              <a href="https://jupitice.com/terms-of-services.php" className="text-decoration-none">
                Terms of Service.
              </a>
              If you have any questions or concerns, please reach out to us for
              assistance.
            </p>
          </Typography>
          <Box sx={{ mt: 3, textAlign: "center" }}>
  
            <Button variant="contained" onClick={handleAccept}>
              Accept
            </Button>
          </Box>
        </Box>
      </Modal> */}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* <Zoom in={isModalOpen} timeout={{ enter: 300, exit: 200 }}> */}
        <Box className="custom-modal">
          <Typography id="modal-title" variant="h6" component="h2">
            <h2>
              Welcome to <span className="text-info fw-bold">Resolution</span>
            </h2>
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            <p>
              Before you proceed, we kindly request you to read and understand
              our{" "}
              <a href="#" className="text-decoration-none">
                Terms of Service
              </a>
              , including our{" "}
              <a href="#" className="text-decoration-none">
                Site Terms of Use,
              </a>
              <a href="#" className="text-decoration-none">
                Privacy Policy,
              </a>
              <a href="#" className="text-decoration-none">
                Cookie Policy,
              </a>{" "}
              and{" "}
              <a href="#" className="text-decoration-none">
                Mark Use Guidelines.
              </a>
              By using our website, you acknowledge that you have read,
              understood, and agree to be bound by these{" "}
              <a href="#" className="text-decoration-none">
                Terms of Service
              </a>
              . If you do not agree with any part of these terms, please refrain
              from using our services and website.
            </p>
          </Typography>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button variant="contained" onClick={handleAccept}>
              Accept
            </Button>
          </Box>
        </Box>
        {/* </Zoom> */}
      </Modal>

      {/* Cookies Consent Modal */}
      <Modal
        open={cookiesConsentOpen}
        onClose={handleCookiesConsentClose}
        aria-labelledby="cookies-modal-title"
        aria-describedby="cookies-modal-description"
      >
        {/* <Zoom in={isModalOpen} timeout={{ enter: 300, exit: 200 }}> */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
          className="custom-modal text-center"
        >
          <Typography
            id="cookies-modal-title"
            variant="h6"
            component="h2"
            className=""
          >
            <img src={Cookie} className="img-fluid rounded me-3" />
            {/* <RxCookie  className="me-3"/> */}
            Cookies Consent
          </Typography>
          <Typography
            id="cookies-modal-description"
            sx={{ mt: 2 }}
            className="text-start"
          >
            We use cookies to improve your experience. Please accept our cookies
            policy.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCookiesConsentCancel}
            sx={{ mt: 3 }}
            className="me-3"
          >
            Reject Cookies
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCookiesConsentClose}
            sx={{ mt: 3 }}
            className=""
          >
            Accept Cookies
          </Button>
        </Box>
        {/* </Zoom> */}
      </Modal>
    </div>
  );
};

export default App;
