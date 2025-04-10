import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import '../pages/AboutUs.css'
import aboutVideo from '../assets/videos/AboutVideo1.mp4'

function AboutUs() {
    return (
        <>

            <Container fluid className='aboutUsContainer' id='aboutUsContainer'>

                <Row className='justify-content-center pt-5 pb-5  '>
                    <Col md={11} className=' text-center '>
                        <h2 className='mt-4 mb-5 sectionHeading '>
                            About Us
                        </h2>
                    </Col>


                    <Col md={6} className=' text-center mb-3 '>
                        <div className='aboutUsText'>

                            <p className='mt-3'>
                            Welcome to Resolution Expert Alliance, a distinguished and innovative Organization specializing in  Alternative Dispute Resolution (ADR) and Online  Dispute Resolution (ODR).  With a rich history of excellence and a forward-looking approach, we have established ourselves as leaders in the field, dedicated to reshaping the landscape of conflict resolution. Our organization operates at the intersection of law, technology, and collaboration, offering clients a comprehensive suite of services that prioritize efficiency, cost-effectiveness, and sustainable solutions.”
                            </p>


                        </div>
                    </Col>

                    <Col md={5} className='  mb-3 d-flex  align-items-center justify-content-center'>
                        <div className='aboutUsVideo'>

                            <div className="video-container">
                                <video autoPlay muted loop id="video-background">
                                    <source src={aboutVideo} type="video/mp4" />
                                </video>
                            </div>


                        </div>
                    </Col>
                </Row>
            </Container>



        </>
    )
}

export default AboutUs