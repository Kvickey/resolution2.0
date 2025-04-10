import React from 'react'
import '../Componants/HeroSection.css'
import { Button, Row, Col } from 'react-bootstrap';
import OurExpertise from './OurExpertise';
import AboutUs from '../Componants/AboutUs'
import OurMission from '../Componants/OurMission'
import IndustriesOwl from '../Componants/IndustriesOwl'
import OurDiffer from '../Componants/OurDiffer'
import ContactUs from './ContactUs';
// import whiteCloud from './Componants/img/cloud-white.png'
// import blackCloud from './Componants/img/cloud-black.png'

import { Element } from 'react-scroll';
import VideoBack from './Videoback';


function HeroSection() {
    return (
        <>
            <div className='container-fluid  ' id='HeroSection'>

                <div className='row justify-content-center'>

                    <div className='col-md-12  BG_Hero_Section   text-center'>
                        <div class="round-shape-one"></div>
                        <div class="round-shape-two"></div>
                        <div class="round-shape-three"></div>
                        <div class="round-shape-four"></div>
                        <div class="triangle"></div>
                        <div class="triangle1"></div>

                        <div className='heading_Hero '>
                            <div className='row justify-content-center'>
                                <div className='col-md-10 '>
                                    <h3>Legal Access Any Time Any Where</h3>
                                </div>
                                <div className='col-md-7'>

                                    {/* <p>
                                        Our mission at Resolution Experts Alliance is to modernize dispute resolution, offering
                                        a bridge to amicable resolution based on fairness, transparancy and innovation.
                                    </p> */}
                                    <Button variant="dark shadow">Call to Action</Button>

                                </div>
                            </div>


                            {/* <div class="cloud-white">
                                <img className='cloud' src={whiteCloud} alt="" />
                            </div> */}
                            {/* <div class="cloud-white cloud"><img src={blackCloud} alt=""/></div> */}
                        </div>




                    </div>
                </div>

            </div>
            <VideoBack />
            <Element name="ourexperties">

                <OurExpertise id="OurExpertise" />

            </Element>


            <AboutUs />
            <OurMission />
            <IndustriesOwl />
            <OurDiffer />
            <ContactUs />
        </>
    )
}

export default HeroSection