import React from 'react';
import '../components/header.css';
import './home.css';
import doctorImage from '../assets/doctor.png'; // Ensure you add an image asset
import wellnessImage from '../assets/wellness.png';
import secureImage from '../assets/secure.png';

const Home = ({ user }) => {
  return (
    <div className="home-container">
      <main className="hero-section">
        <div className="hero-text animated fadeInUp">
          <h1>Efficient Medical Treatment Backed by AI</h1>
          <p className="hero-subtext">
            Pixel Neurons bridges patients and medical professionals with cutting-edge AI to deliver personal, precise, and proactive healthcare.
          </p>
          {user ? (
            <p className="login-message">
              👋 Hello, <strong>{user.username}</strong>! Ready to check your health insights?
            </p>
          ) : (
            <p className="login-message">
              🚀 Sign in now to begin your journey toward smarter, safer care.
            </p>
          )}
          <button className="cta-button">Explore Services</button>
        </div>
        <div className="hero-image animated fadeInRight">
          <img src={doctorImage} alt="AI doctor" />
        </div>
      </main>

      <section className="features" id="services">
        <h2>🌟 Our Core Services</h2>
        <div className="feature-grid">
          <div className="feature-card animated zoomIn">
            <img src={wellnessImage} alt="Virtual Consultation" />
            <h3>24/7 Virtual Consultation</h3>
            <p>Connect with certified doctors anytime, anywhere, from your mobile or computer.</p>
          </div>
          <div className="feature-card animated zoomIn">
            <img src={secureImage} alt="Health Monitoring" />
            <h3>Smart Health Monitoring</h3>
            <p>Track vitals and chronic issues with integrated wearable tech and mobile alerts.</p>
          </div>
          <div className="feature-card animated zoomIn">
            <img src={secureImage} alt="Prescription Management" />
            <h3>Instant Prescription Access</h3>
            <p>Digital prescriptions delivered to your phone or nearest pharmacy in minutes.</p>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <h2>💡 Why Pixel Neurons?</h2>
        <p>
          Our AI-first platform transforms healthcare delivery with faster diagnosis, tailored treatment, and seamless communication.
        </p>
        <ul className="about-highlights">
          <li>✔️ 100+ Certified Doctors</li>
          <li>✔️ HIPAA-Compliant Records</li>
          <li>✔️ Personalized AI-Health Reports</li>
          <li>✔️ Cloud-Based Secure Access</li>
        </ul>
      </section>

      <section className="animated-section testimonials" id="testimonials">
        <h2>🗣️ Patient Stories</h2>
        <div className="testimonial-cards">
          <div className="testimonial">
            <p>"I spoke to a doctor at midnight. It was quick and life-saving."</p>
            <h4>- Anjali R., Mumbai</h4>
          </div>
          <div className="testimonial">
            <p>"Real-time health tracking helped me keep my diabetes in check."</p>
            <h4>- Rohit M., Pune</h4>
          </div>
          <div className="testimonial">
            <p>"Simple, clean, and incredibly helpful during the pandemic!"</p>
            <h4>- Dr. Neha S., Bangalore</h4>
          </div>
        </div>
      </section>

      <section className="cta animated fadeInUp">
        <h2>🧠 Ready to Prioritize Your Health?</h2>
        <p>Join thousands taking charge of their wellness with Pixel Neurons.</p>
        <button className="cta-button-large">Get Started Now</button>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Pixel Neurons Healthcare. Crafted with ❤️ and AI.</p>
      </footer>
    </div>
  );
};

export default Home;
