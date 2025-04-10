import React, { useEffect, useState } from "react";
import "../pages/Pages.css";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import OurExpertise from "./OurExpertise";
import AboutUs from "../pages/About";
import OurMission from "../pages/OurMission";
// import IndustriesOwl from "../pages/IndustriesOwl";
import OurDiffer from "../pages/OurDiffer";
import ContactUs from "../pages/ContactUs";
import video from "../assets/videos/9.mp4";
import image from "../assets/images/Hero_Illustration.png";
import { Element } from "react-scroll";
import CustomNavbar from "./Navbar";



function Display() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Open the modal when the component first mounts
    setIsModalOpen(true);

    const videoElement = document.getElementById("video-background");

    if (videoElement) {
      videoElement.playbackRate = 0.4; // Adjust the playback rate as needed (e.g., 0.5 for half speed)
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // You might want to save the user's consent status in local storage or state
    localStorage.setItem('consentGiven', 'true');
  };

  return (
    <>
      <CustomNavbar />
      <div className="container-fluid hero-section" id="homePage">
        {/* Video Background */}
        <div className="embed-responsive embed-responsive-16by9 video-container">
          <video autoPlay muted loop id="video-background">
            <source src={video} type="video/mp4" />
          </video>
        </div>
        {/* Content Overlay */}

        <Row className="justify-content-center">
          <Col md={12}>
            <div class="round-shape-one"></div>
            <div class="round-shape-two"></div>
            <div class="round-shape-three"></div>
            <div class="round-shape-four"></div>
            <div class="triangle"></div>
            <div class="triangle1"></div>
            <div className="hero-content w-100">
              {/* Your content goes here */}

              {/* <div className=' animatedText  '>
                <h1 className='mb-3'>Legal Access Any Time Any Where</h1>
                <Button variant="dark shadow">Call to Action</Button>
              </div> */}
              {/* <div className=' animatedText1 '>
                <h1 className='mb-3'>Legal Access Any Time Any Where</h1>
                 <Button variant="dark shadow">Call to Action</Button>
              </div> */}

              {/* Sliding Text ANimation Code Starts  */}

              {/* <div class="animated-title ">
                <div class="text-top">
                  <div>
                    <span>Legal Access</span>
                    <span>Any Time</span>
                  </div>
                </div>
                <div class="text-bottom">
                  <div>Anywhere</div>

                </div>
                <div style={{ position: 'relative', top: '240px' }}>

                  <Button variant="dark shadow">Call to Action</Button>
                </div>
              </div> */}

              {/* Sliding Text ANimation Code Ends here  */}

              {/* Fade In Down  Animation start here  */}

              <div className="fadeinDown">
                <div className='Access'>
                  <h2 style={{ color: '#ffffff' }}>Legal Access Any  <span style={{ color: '#eaa637' }}>Time Any Where</span></h2>
                </div>
                <Row className='justify-content-center'>
                  <Col md={8}>
                    <p className='animated animatedFadeInUp fadeInUp'>
                      Our organization operates at the intersection of law, technology and collaboration, offering clients
                      a comprehensive suit of services that prioritize effeciency, cost-effectiveness and sustainable
                      solutions.
                    </p>
                    <button variant="dark shadow" className='btn1'>
                      <div>
                        <span>Call to Action</span>
                      </div>
                    </button>
                  </Col>
                </Row>
              </div>


              {/* Fade in DOwn animation end here  */}

              {/* SVG Text Animation Starts */}
              {/* <div className="svganimate">
                <svg viewBox="0 0 1320 300">
                  <text x="5  0%" y="50%" dy=".35em" text-anchor="middle">
                    Legal Access Any Time Anywhere
                  </text>
                </svg>
              </div> */}

              {/* SVG Text Animation Ends */}

              {/* TEXT REVEALING ANIMATION Start */}
              {/* <div className="revealingTextAnimation">
                <div className='inlineText'>Legal Access</div>
                <div > 
                  <span>Any Time Any Where</span>
                </div>
              </div> */}

              {/* TEXT REVEALING ANIMATION End */}
            </div>
          </Col>
        </Row>
      </div>

      <section id="ourexperties">
        <OurExpertise />
      </section>

      <section id="aboutUs">
        <AboutUs />
      </section>

      <section id="ourMission">
        <OurMission />
      </section>

      {/* <section id="industriesOwl">
        <IndustriesOwl />
      </section> */}

      <section id="ourDiffer">
        <OurDiffer />
      </section>

      <section id="contactUs">
        <ContactUs />
      </section>

      {/* <Animatedtext /> */}
      <div className="container-fluid bottomNavbar">
        <div className="row">
          <div className="col-md-3 my-2 text-white text-center"> @ 2024 Resolution Experts</div>
          <div className="col-md-3"></div>
          <div className="col-md-6 ">
            <ul className="d-flex customList justify-content-end my-2 text-white">
              <li className="me-4">
                <a class="nav-link" href="#">
                  Terms Of Services
                </a>
              </li>
              <li className="me-4">
                <a class="nav-link" href="#">
                  Privacy Policy
                </a>
              </li>
              <li className="me-4">
                <a class="nav-link" href="#">
                  Cookies Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* {isModalOpen && (
        <Modal show={true} onHide={handleCloseModal} centered >
          <Modal.Header closeButton>
            <Modal.Title className="consent">Consent Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please accept our terms and conditions to continue using the site.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseModal}>
              Accept
            </Button>
          </Modal.Footer>
        </Modal>
      )} */}
    </>
  );
}

export default Display;