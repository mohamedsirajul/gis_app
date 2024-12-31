// Footer.js

import React from "react";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>
        &copy; 2024 Terralens Innovations Private Limited. All rights reserved.
      </p>
    </footer>
  );
};

// Style for footer (optional)
const footerStyle = {
  backgroundColor: "#333",
  color: "#fff",
  textAlign: "center",
  padding: "1rem",
  position: "fixed",
  left: "0",
  bottom: "0",
  width: "100%",
};

export default Footer;
