import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import '../pages/OurDiffer.css'

function OurDiffer() {
    return (
        <>
            <Container fluid className='OurDifferContainer mt-5'>
                <Row className=' justify-content-center'>
                    <Col md={12} className=' text-center'>
                        <h3 className='mt-5 sectionHeading '>
                            Our Differentiators
                        </h3>
                    </Col >
                </Row>
                <Row className='justify-content-center Differ_Services mt-5'>
                    <Col md={5} className='d-flex justify-content-center '>
                        <Card className='border differ_Card mb-5'>
                            <Card.Body className='text-center align-content-center'>
                                <h5 className=''> Unparelled Expertise</h5>
                                <p className=''>
                                    Our organization boasts a team of accomplished legal professionals who are recognized as renowned leaders in the field of Alternative Dispute Resolution (ADR) and Online Dispute Resolution (ODR), with years of experience and a proven track record.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={5} className=' d-flex justify-content-center '>
                        <Card className='border differ_Card mb-5'>
                            <Card.Body className='text-center align-content-center'>
                                <h5 className=''> Tailored Strategies </h5>
                                <p className=''>
                                Recognizing that no two disputes are alike, we create bespoke resolution strategies that are tailored to your unique circumstances. Our personalized approach means that your case receives the individual attention it deserves, resulting in solutions that align with your goals.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>


                    <Col md={5} className='d-flex justify-content-center '>
                        <Card className='border differ_Card mb-5'>
                            <Card.Body className='text-center align-content-center'>
                                <h5 className=''> Innovative Approach </h5>
                                <p className=''>
                                We are at the forefront of innovative dispute resolution techniques, seamlessly blending traditional legal practices with cutting-edge technology. Our forward-looking approach ensures that you benefit from the latest advancements in ADR and ODR, setting the stage for efficient and effective resolutions.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

               
                    <Col md={5} className='d-flex justify-content-center '>
                        <Card className='border differ_Card mb-5'>
                            <Card.Body className='text-center align-content-center'>
                                <h5 className=''>Efficiency & Cost-Effectiveness </h5>
                                <p className=''>
                                Litigation can be time-consuming and financially burdensome. By choosing Resolution Experts Alliance, you opt for a streamlined process that saves you both time and money. Our ADR and ODR methods prioritize swift resolutions, allowing you to move forward without the protracted delays and expenses often associated with traditional courtroom battles.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={5} className='d-flex justify-content-center '>
                        <Card className='border differ_Card mb-5'>
                            <Card.Body className='text-center align-content-center'>
                                <h5 className=''> Preservations of Relationships </h5>
                                <p className=''>
                                Our emphasis on collaborative resolution means that we prioritize relationships, even in the midst of disputes. We understand that maintaining working relationships can be crucial, especially in a business context, and our methods reflect this understanding.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={5} className=' d-flex justify-content-center '>
                        <Card className='border differ_Card mb-5'>
                            <Card.Body className='text-center align-content-center'>
                                <h5 className=''> Confidentiality and Privacy </h5>
                                <p className=''>
                                At Resolution Experts Alliance, your privacy and confidentiality are of paramount importance. Our stringent standards ensure that sensitive information remains protected throughout the resolution process, fostering an environment of trust and security.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={5} className='d-flex justify-content-center '>
                        <Card className='border differ_Card mb-5'>
                            <Card.Body className='text-center align-content-center'>
                                <h5 className=''> Tech-Forward Solutions </h5>
                                <p className=''>
                                Our integration of state-of-the-art technology in the form of online platforms for ODR underscores our commitment to modern solutions. By harnessing the power of technology, we bring convenience, accessibility, and efficiency to the resolution process.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={5} className=' d-flex justify-content-center '>
                        <Card className='border differ_Card mb-5'>
                            <Card.Body className='text-center align-content-center'>
                                <h5 className=''> Educational Empowerment  </h5>
                                <p className=''>
                                Beyond resolution, we empower our clients through education. Our training programs and workshops equip you with valuable conflict resolution skills that can be applied to various aspects of your personal and professional life.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={5} className=' d-flex justify-content-center '>
                        <Card className='border differ_Card mb-5'>
                            <Card.Body className='text-center align-content-center'>
                                <h5 className=''> Holistic Approach </h5>
                                <p className=''>
                                We recognize that disputes often encompass emotional, practical, and legal dimensions. Our holistic approach takes all these facets into account, leading to well-rounded solutions that address the full spectrum of considerations.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={5} className=' d-flex justify-content-center '>
                        <Card className='border differ_Card mb-5'>
                            <Card.Body className='text-center align-content-center'>
                                <h5 className=''> Proven Success  </h5>
                                <p className=''>
                                Our history of successfully resolving disputes across a wide range of industries speaks to our effectiveness and dedication. When you choose Resolution Experts Alliance, you are aligning yourself with a legacy of positive outcomes and satisfied clients.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default OurDiffer