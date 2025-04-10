import React from 'react'
import '../pages/OurMission.css'
import { Card, Col, Container, Row } from 'react-bootstrap'
import ourmissionImg from '../assets/images/Our Mission1.png'

function OurMission() {
    return (
        <>
            <div className='container-fluid missionContainer'>
                <Row className='justify-content-center'>

                    <Col md={12} className='text-center'>
                        <h3 className='mt-5 sectionHeading '>
                            Our Mission
                        </h3>
                    </Col>
                </Row>

                <Row className='justify-content-center ourMissionRow mt-5'>
                    <Col md={6} className=' text-center'>
                        <img src={ourmissionImg} className="ourMissionImage" alt="Our Mission" />
                    </Col>

                    <Col md={5} className=' text-center'>
                        <div className='missionText'>
                            <Card className='missionTextCard'>
                                <Card.Body>
                                    <p>
                                        At Resolution Experts Alliance, Our mission is to revolutionize the way disputes are resolved, empowering indivusals, businesses and organizations to navigate complex legal 
                                        challenges with confidence and clearity.
                                    </p>
                                    <p>
                                        We believe that in a rapidly evolving world, traditional litigation can often fall
                                        short of meeting the dynamic needs of modern society. Our commitment is to provide a
                                        bridge to amicable resolutions, transparency  and innovations.
                                    </p>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default OurMission