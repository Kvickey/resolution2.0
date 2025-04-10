import React, { useEffect } from 'react';
import '../pages/OurExpertise.css'
import icon from '../assets/images/Mediator.png'
import arbtitratorIcon from '../assets/images/Arbitrator.png'
import mediatorIcon from '../assets/images/Mediator.png'
import negotiatorIcon from '../assets/images/Negotiation.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSomeIcon } from '@fortawesome/free-solid-svg-icons';
import { Card, Col, Container, Row, Button } from 'react-bootstrap'
import 'font-awesome/css/font-awesome.min.css';

function OurExpertise() {
    useEffect(() => {
        // Scroll to the element with ID "ourExperties" when the component mounts
        const element = document.getElementById('ourExperties');
        // if (element) {
        //     element.scrollIntoView({ behavior: 'smooth' });
        // }
    }, []);
    return (
        <>
            <Container fluid className='expertiseContainer' >
                <Row className=' justify-content-center'>
                    <Col md={12} className=' text-center'>
                        <h3 className='mt-5 sectionHeading '>
                            Our Experties
                        </h3>
                    </Col>
                </Row>

                <Row className='justify-content-center expertiseCards mt-4'>
                    <Col md={5} className='text-center justify-content-center'>
                        <div className='myCard'>
                            <Card className='text-center myCardHover'>
                                <Card.Header className='CardHeader'>
                                    <Row className=''>
                                        <Col className='' md={3}>
                                            <img src={mediatorIcon} style={{ height: '30px', width: 'auto' }} />
                                        </Col>
                                        <Col className='' md={6}>
                                            <h5 className='mt-2'>
                                                <b>
                                                    Mediation
                                                </b>
                                            </h5>

                                        </Col>
                                    </Row>

                                </Card.Header>
                                {/* <Card.Img variant="top" src="" /> */}
                                <Card.Body>

                                    <Card.Text>
                                        <p style={{  textAlign: 'justify' }}>
                                        Our seasoned mediators create an inclusive environment where parties can openly communicate and collaboratively seek resolutions. We guide discussions with empathy and finesse, fostering an atmosphere of trust and understanding.
                                        </p>
                                    </Card.Text>
                                    {/* <Button variant="primary">Read More ..</Button> */}
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    <Col md={5} className='  text-center justify-content-center'>
                        <div className='myCard'>
                            <Card className='text-center myCardHover'>
                                {/* <Card.Img variant="top" src="" /> */}
                                <Card.Header className='CardHeader'>
                                    <Row className=''>
                                        <Col className='' md={3}>
                                            <img src={arbtitratorIcon} alt='Image Not Found' style={{ height: '30px', width: 'auto' }} />
                                        </Col>
                                        <Col className='' md={6}>
                                            <h5 className='mt-2'>
                                                <b>
                                                    Arbitration
                                                </b>
                                            </h5>

                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                    {/* <Card.Title className='cardTitle'>Arbritration</Card.Title> */}
                                    <Card.Text >
                                        <p style={{ textAlign: 'justify' }}>
                                        Our arbitrators, renowned for their integrity and impartiality, deliver swift and binding decisions that meet the highest standards of legality. This method offers parties a private and streamlined alternative to courtroom proceedings.
                                        </p>
                                    </Card.Text>
                                    {/* <Button variant="primary">Read More ..</Button> */}
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>




                    <Col md={5} className='  text-center justify-content-center'>
                        <div className='myCard '>
                            <Card className='text-center myCardHover'>
                                <Card.Header className='CardHeader'>
                                    <Row className=''>
                                        <Col className='' md={2}>
                                            <i style={{ fontSize: '28px' }} class="fa fa-university pt-1" aria-hidden="true"></i>

                                            {/* <img src={icon} style={{ height: '40px', width: 'auto' }} /> */}
                                        </Col>
                                        <Col className='' md={8}>
                                            <h5 className='mt-2'>
                                                <b>
                                                    Institutional Arbritrations
                                                </b>
                                            </h5>

                                        </Col>
                                    </Row>
                                </Card.Header>
                                {/* <Card.Img variant="top" src="" /> */}
                                <Card.Body>

                                    <Card.Text >
                                        <p style={{ textAlign: 'justify' }}>
                                        Refers to the administration of arbitration by an institution in accordance with its rules and procedures. Under institutional arbitration in India, the parties are free to choose their arbitrators from a panel of arbitrators established by the institution.
                                        </p>
                                    </Card.Text>
                                    {/* <Button variant="primary">Read More ..</Button> */}
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>




                    <Col md={5} className='  text-center justify-content-center'>
                        <div className='myCard '>
                            <Card className='text-center myCardHover'>
                                <Card.Header className='CardHeader'>
                                    <Row className=''>
                                        <Col className='' md={2}>

                                            <i class="fas fa-globe pt-2" style={{ fontSize: '28px' }}></i>
                                            {/* <img src={icon} style={{ height: '40px', width: 'auto' }} /> */}
                                        </Col>
                                        <Col className='' md={9}>
                                            <h5 className='mt-2'>
                                                <b>
                                                    Online Dispute Resolution
                                                </b>
                                            </h5>

                                        </Col>
                                    </Row>
                                </Card.Header>

                                <Card.Body>

                                    <Card.Text >
                                        <p style={{ textAlign: 'justify' }}>
                                        Embracing the digital era, our firm pioneers cutting-edge ODR solutions. Our secure online platform offers parties the convenience of resolving disputes remotely, promoting accessibility and reducing barriers to justice.
                                        </p>
                                    </Card.Text>
                                    {/* <Button variant="primary">Read More ..</Button> */}
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    <Col md={5} className='  text-center justify-content-center'>
                        <div className='myCard '>

                            <Card className='text-center myCardHover'>
                                <Card.Header className='CardHeader'>
                                    <Row className=''>
                                        <Col className='' md={2}>
                                            <img src={negotiatorIcon} style={{ height: '40px', width: 'auto' }} />
                                        </Col>
                                        <Col className='' md={8}>
                                            <h5 className='mt-2'>
                                                <b>
                                                    Negotiation Support
                                                </b>
                                            </h5>

                                        </Col>
                                    </Row>
                                </Card.Header>
                                {/* <Card.Img variant="top" src="" /> */}
                                <Card.Body>

                                    <Card.Text >
                                        <p style={{ textAlign: 'justify' }}>
                                        Our skilled negotiators craft strategies that balance assertiveness with compromise, ensuring our clients are well represented at the negotiation table. We advocate for favorable outcomes while prioritizing relationship preservation.
                                        </p>
                                    </Card.Text>
                                    {/* <Button variant="primary">Read More ..</Button> */}
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    <Col md={5} className='  text-center justify-content-center'>
                        <div className='myCard '>
                            <Card className='text-center myCardHover'>
                                <Card.Header className='CardHeader'>
                                    <Row className=''>
                                        <Col className=' ' md={2}>
                                            <i class="fas fa-chalkboard-teacher" style={{ fontSize: '28px' }}></i>

                                            {/* <img src={icon} style={{ height: '40px', width: 'auto' }} /> */}
                                        </Col>
                                        <Col className='' md={8}>
                                            <h5 className='mt-2'>
                                                <b>
                                                    Training and Workshops
                                                </b>
                                            </h5>

                                        </Col>
                                    </Row>
                                </Card.Header>
                                {/* <Card.Img variant="top" src="" /> */}
                                <Card.Body>

                                    <Card.Text >
                                        <p style={{ textAlign: 'justify' }}>
                                        We offer educational programs that empower clients to proactively manage disputes. Our workshops equip individuals and organizations with essential conflict resolution skills, fostering a culture of collaboration and understanding.

                                        </p>
                                    </Card.Text>
                                    {/* <Button variant="primary">Read More ..</Button> */}
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default OurExpertise