// src/components/Navbar.js
import React, { useEffect } from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import myLogo from '../assets/images/Resolution_Digital_Logo_Final.png'
import newLogo from '../assets/images/ResolutionLogo_Y.png'


import '../pages/Navbar.css'

const CustomNavbar = ({ isLoggedIn, onLogout }) => {


  const navigate = useNavigate();
  const location = useLocation();


  // const [showExperties, setShowExperties] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);

  const hideOtherComponants = () => {
    // setShowExperties(false);
    setExpanded(false)

  }


  const handleLinkClick = () => {
    setExpanded(false)
  };

  const handleLogout = () => {
    // Perform logout logic (for demonstration purposes, simply set isLoggedIn to false)
    onLogout();
    // Redirect to the Home page on logout
    navigate('/');
    setExpanded(false)
  };
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);

      // Check if scroll position is greater than a certain threshold
      setIsScrolled(position > 100);
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]); // Only re-run the effect if scrollPosition changes


  useEffect(() => {
    // Check if the current route is the login page
    setIsLoginPage(location.pathname === '/login');
  }, [location.pathname]);


  // These 3 Functions are created for handeling scrolling behaviour of sections 

  const handleScrollExperties = (event) => {
    event.preventDefault();

    const targetId = 'ourexperties';
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const offset = 70; // Adjust this value based on your requirements
      const offsetTop = targetElement.offsetTop - offset;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  }

  const handleScrollAboutUs = (event) => {
    event.preventDefault();

    const targetIdAboutUs = 'aboutUs';
    const targetElementAboutUs = document.getElementById(targetIdAboutUs);

    if (targetElementAboutUs) {
      const offset = 120; // Adjust this value based on your requirements
      const offsetTop = targetElementAboutUs.offsetTop - offset;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  }
  const handleScrollContactUs = (event) => {
    event.preventDefault();

    const targetIdContactUs = 'contactUs';
    const targetElementContactUs = document.getElementById(targetIdContactUs);

    if (targetElementContactUs) {
      const offset = 90; // Adjust this value based on your requirements
      const offsetTop = targetElementContactUs.offsetTop - offset;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  }



  return (
    <Navbar
      variant="dark"
      fixed='top'
      expand="lg"
      className={`navbar ${isScrolled ? 'body-tertiary' : 'transparent-bg'} ${isLoginPage ? 'login-bg' : ''}`}
      expanded={expanded}
      style={{ marginTop: '0px' }}
    >
      <Container fluid style={{ width: '95vw' }}>
        <Navbar.Brand href="#HeroSection">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div >
              {/* {
                <img style={{ height: '70px', width: 'auto' }} src={myLogo} className="App-logo  me-3" alt="logo" />
              } */}

              {isScrolled ? (
                <img style={{ height: '70px', width: 'auto' }} src={newLogo} className="App-logo me-3" alt="logo" />
              ) : (
                <img style={{ height: '70px', width: 'auto' }} src={myLogo} className="App-logo me-3" alt="logo" />
              )}

            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <b style={{ fontSize: '2rem', marginBottom: '-0.5rem' }}>Resolution</b>
              <b style={{ fontSize: '1.25rem', marginBottom: '-0.2rem' }}>Experts Alliance</b>
            </div>
          </div>


        </Navbar.Brand>
        <Navbar.Toggle onClick={() => setExpanded(!expanded)} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto " style={{ display: 'flex', alignItems: 'center' }}>

            {/* <Link className='linkTag'
              onClick={handleLinkClick}
              activeClass="active"
              to="ourexperties"
              spy={true}
              smooth={true}
              offset={20}
              duration={500}

            >
              Demo
            </Link> */}
            <a className='customNavLink me-3' href='#homePage'>Home</a>
            <a className='customNavLink  me-3' href='#ourexperties' onClick={handleScrollExperties}>Our Expertise</a>
            <a className='customNavLink me-3' href='#aboutUs' onClick={handleScrollAboutUs}>About Us</a>
            <a className='customNavLink me-3' href='#contactUs' onClick={handleScrollContactUs} >Contact Us</a>

            {/* <Nav.Link className='customNavLink border' as={Link} to="/" >
              Home
            </Nav.Link>

            <Nav.Link className='customNavLink' as={Link} to="/">
              Our Experties
            </Nav.Link>

            <Nav.Link className='customNavLink' as={Link} to="/">
              About Us
            </Nav.Link>

            <Nav.Link className='customNavLink' as={Link} to="/">
              Contact Us
            </Nav.Link> */}








            {isLoggedIn ? (
              <Button variant="primary" className='btn-primaty btn ms-3' onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button as={Link} to="/login" variant="primary" className='btn' onClick={hideOtherComponants}>
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
