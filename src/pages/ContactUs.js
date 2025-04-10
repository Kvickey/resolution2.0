import React from 'react'
// import '../pages/ContactUs.css'
import "../pages/ContactUs.css"
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
// import contactUs_BG from '../img/bgHero8.jpg' 
function ContactUs() {
    return (
        <>
            <Container fluid className='container-fluid contactUsContainer' id='contactUsContainer'>

                <Row className='justify-content-center'>


                    <Col md={12} className='border contactUsBG justify-content-center '>
                        <h2 className='mt-4 sectionHeading text-center'>
                            Contact Us
                        </h2>
                        <Row className='justify-content-center text-center'>
                            <Col md={8} className='justify-content-center'>
                                <p>
                                    We appriciate your Interest in contaction us. Please don't hesitate to reach out
                                    if you hava any questions, feedback or requests. Our team is here to assist you.
                                    Your Communication is important to us, and will do our best to respond promptly
                                    and address your needs. Thank you for getting in touch with us !

                                </p>
                                <br />
                            </Col>
                        </Row>

                        <Row className='justify-content-center d-flex align-items-center'>

                            <Col md={5} className='p-4 '>
                                <p>
                                    <b>Mumbai Office :</b>   <br />
                                    H-2, Ranjeet Studio, Dadasaheb Phalke Road, <br /> Dadar-East, Mumbai - 400014
                                </p>
                                {/* <p>
                                    <b> Pune Office : </b>
                                    <br />
                                    Unit No. 4, DLF Tower-A, Fergusson Collage Road, Rage Path, <br /> Model Colony,
                                    Shivajinagar, Pune, Maharashtra. 411 016
                                </p> */}

                                <p>
                                    <b> Phone : </b>
                                    <br />
                                    {/* +91 70 45 34 89 49 */}
                                </p>

                                <p>
                                    <b> Email : </b>
                                    <br />
                                    info@resolutionexperts.in
                                </p>

                                <p>
                                    <b> Website : </b>
                                    <br />
                                    www.resolutionexperts.in <br />
                                </p>
                                <br />
                                {/* <p>
                                    <b> Connect with us : </b>
                                    <br />
                                    Social Media Links Here...
                                </p> */}
                            </Col>

                            <Col md={5} className=''>
                                <div className='p-5 contactUsForm' >
                                    <Form>

                                        <Form.Group className="mb-3" controlId="contactName">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter Your Name" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="contactMail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control type="email" placeholder="Enter email" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="contactMsg">
                                            <Form.Label>Message</Form.Label>
                                            <Form.Control as="textarea" rows={3} placeholder="Enter message here" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="contactMsg">

                                            <Button type='submit'variant='primary border fw-bold' > Submit

                                            </Button>


                                        </Form.Group>


                                    </Form>

                                </div>
                            </Col>

                        </Row>

                    </Col>


                </Row>

            </Container>


        </>
    )
}

export default ContactUs