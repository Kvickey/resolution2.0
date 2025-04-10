import React from 'react';
import OwlCarousel from 'react-owl-carousel';

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.carousel.min.css';
import { Card, CardFooter, CardImg, Container, Row, Col } from 'react-bootstrap';

import '../pages/IndustriesOwl.css';

import corporate from '../assets/images/Corporate.png';
import Employment from '../assets/images/Employment.png';
import Governance from '../assets/images/Governance.png';
import Healthcare1 from '../assets/images/Healthcare1.jpeg';
import Litigation from '../assets/images/Litigation.png';
import realestate from '../assets/images/Real Estate.png';
import Technology from '../assets/images/Technology.png';

function IndustriesOwl() {
  return (
    <>
      <Container fluid className='mainContainer'>
        <Row>
          <Col md={12} className='text-center mt-4 mb-1'>
            <h3 className='mt-3 sectionHeading'>
              Industries We Serve
            </h3>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col md={9} style={{ textAlign: 'center', fontWeight: '600', color: 'white' }}>
            <p>
              Following are the various sectors or areas of business where a company provides its services or solutions. It is a way for a company to communicate the specific fields or sectors in which they have expertise and offer their offerings.
            </p>
          </Col>
        </Row>
        <Row className='justify-content-center mt-3'>
          <Col>
            <OwlCarousel
              className='owl-theme'
              loop
              margin={10}
              autoplay
              items={4}
              responsive={{
                0: {
                  items: 1,
                },
                700: {
                  items: 3,
                },
                1000: {
                  items: 4,
                },
              }}
            >
              <div className='item d-flex justify-content-center'>
                <Card className='custom_Card'>
                  <CardImg className='cardImage p-5' src={corporate} />
                  <CardFooter className='cardFooter text-center fw-bold'>
                    Corporate & Business
                  </CardFooter>
                </Card>
              </div>
              <div className='item d-flex justify-content-center'>
                <Card className='custom_Card'>
                  <CardImg className='cardImage p-5' src={Governance} />
                  <CardFooter className='cardFooter text-center fw-bold'>
                    Regulatory & Governance
                  </CardFooter>
                </Card>
              </div>
              <div className='item d-flex justify-content-center'>
                <Card className='custom_Card'>
                  <CardImg className='cardImage p-5' src={Employment} />
                  <CardFooter className='cardFooter text-center fw-bold'>
                    Employment & Labor
                  </CardFooter>
                </Card>
              </div>
              <div className='item d-flex justify-content-center'>
                <Card className='custom_Card'>
                  <CardImg className='cardImage p-5' src={realestate} />
                  <CardFooter className='cardFooter text-center fw-bold'>
                    Real Estate
                  </CardFooter>
                </Card>
              </div>
              <div className='item d-flex justify-content-center'>
                <Card className='custom_Card'>
                  <CardImg className='cardImage p-5' src={Healthcare1} />
                  <CardFooter className='cardFooter text-center fw-bold'>
                    Healthcare
                  </CardFooter>
                </Card>
              </div>
              <div className='item d-flex justify-content-center'>
                <Card className='custom_Card'>
                  <CardImg className='cardImage p-5' src={Litigation} />
                  <CardFooter className='cardFooter text-center fw-bold'>
                    Litigation
                  </CardFooter>
                </Card>
              </div>
              <div className='item d-flex justify-content-center'>
                <Card className='custom_Card'>
                  <CardImg className='cardImage p-5' src={Technology} />
                  <CardFooter className='cardFooter text-center fw-bold'>
                    Technology
                  </CardFooter>
                </Card>
              </div>
            </OwlCarousel>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default IndustriesOwl;
