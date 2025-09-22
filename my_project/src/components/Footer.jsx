import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-4 mt-5">
      <div className="container text-center">
        <p>© 2025 SU.ED Fitness Center. สงวนลิขสิทธิ์</p>
        <p>
          <a href="/terms" className="text-light me-3">Terms</a>
          <a href="/privacy" className="text-light">Privacy</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
