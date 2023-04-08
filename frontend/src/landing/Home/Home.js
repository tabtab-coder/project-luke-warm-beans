import React from 'react';
import './Home.css';

import {
  useLocation
} from "react-router-dom";

import './Home.css';



function Home(props) {
  let query = LOC.useQuery();
  const dev = query.get("dev");

  if (dev) {
    return <p>secret page xd</p>;
  } else {
    // return <p className="home-colour">Home</p>;
    return (
      <div className="HomePage">
        <div className="firstSection">
          <div className="firstSectionText">
            <p className="HomePageSmallText">What is U-impactify</p>
            <p className="HomePageText">An online learning platform for social entrepreneurs and intrapreneurs</p>
            <a href="/SignUp">
              <button className="firstSectionButton">GET STARTED</button>
            </a>
            <p className="HomePageRequestDemoText">Request an instant demo</p>
          </div>
          <div className="HomePageCircle">
            <div className="HomePageIMac"></div>
          </div>
        </div>

        <div className="secondSection">
          <div className="HomePageAbout"></div>
          <div>
            <a href="/about">
              <button>Learn More About What U-Impactify Does</button>
            </a>
          </div>
          
        </div>

        <div className="thirdSection">
          <div className="HomePageServe"></div>
          <div className="HomePageTestimonials"></div>
          <div>
            <a href="/SignUp">
              <button>GET STARTED</button>
            </a>
            <p className="HomePageRequestDemoText">Request an instant demo</p>
          </div>
        </div>

        <div className="footer"> 
          <div className="footerImg">
            <img id="footerLogo" src={require('../../images/logo.svg')} alt="Logo"/>
          </div>
          
          <div className="footerText">
            <div className="footerColumn">
              <p>Product</p>
              <p>Help Centre</p>
              <p>Platform</p>
              <p>Accessibility</p>
              <p>Terms of Use</p>
              <p>Privacy Policy</p>
            </div>

            <div className="footerColumn">
              <p>Use Cases</p>
              <p>Non-Profits</p>
              <p>Governments</p>
              <p>Social Enterprises</p>
              <p>Charities</p>
            </div>

            <div className="footerColumn">
              <p>About</p>
              <p>About Us</p>
              <p>Contact Us</p>
              <p>Blog</p>
              <p>FAQ</p>
            </div>

            <div className="footerColumn">
              <p>Follow Us</p>
              <a href="/">Facebook</a>
              <br></br>
              <a href="/">Instagram</a>
              <br></br>
              <a href="/">LinkedIn</a>
              <p>Language&nbsp;&nbsp;🌏</p>
              <select defaultValue={0} className="languageSelect">
                <option value="0">English (CA)</option>
                <option value="1">English (US)</option>
                <option value="2">اَلْعَرَبِيَّةُ‎</option>
                <option value="3">Türkçe</option>
                <option value="4">Español</option>
                <option value="4">français</option>
              </select>
            </div>
          </div>
        </div>
           
     </div>
    );
  }
}

export const LOC = {
  useQuery() {
    return new URLSearchParams(useLocation().search);
  }
}

export default Home;
