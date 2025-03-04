// import React from "react";
// import { Navbar, Container, Nav, Form, FormControl } from "react-bootstrap";
// import { FaBell, FaCog, FaUser } from "react-icons/fa";
// import "../App.css"; 

// function CustomNavbar() {
//   return (
//     <Navbar expand="lg" className="custom-navbar">
//       <Container fluid>
//         {/* Left Side: Logo */}
//         <Navbar.Brand href="#home" className="navbar-logo">
//           4kast.ai<span className="red-dot"></span>
//         </Navbar.Brand>

//         {/* Center: Search Bar */}
//         <Form className="search-bar">
//           <FormControl
//             type="search"
//             placeholder="Search anything here..."
//             className="search-input"
//           />
//         </Form>

//         {/* Right Side: Icons */}
//         <Nav className="navbar-icons">
//           <FaBell className="icon" />
//           <FaCog className="icon" />
//           <div className="user-profile">
//             <FaUser className="user-icon" />
//             <span className="navbar-user">Hi, John</span>
//           </div>
//         </Nav>
//       </Container>
//     </Navbar>
//   );
// }

// export default CustomNavbar;

import React from "react";
import { Navbar, Container, Nav, Form, FormControl } from "react-bootstrap";
import { FaBell, FaCog, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../App.css"; 

function CustomNavbar() {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        {/* Left Side: Logo */}
        <Navbar.Brand href="#home" className="navbar-logo">
          4kast.ai<span className="red-dot"></span>
        </Navbar.Brand>

        {/* Center: Search Bar */}
        <Form className="search-bar">
          <FormControl
            type="search"
            placeholder="Search anything here..."
            className="search-input"
          />
        </Form>

        {/* Right Side: Icons */}
        <Nav className="navbar-icons">
          <Link to="/notifications" className="icon-link"><FaBell className="icon" /></Link>
          <Link to="/settings" className="icon-link"><FaCog className="icon" /></Link>
          <Link to="/profile" className="icon-link">
            <div className="user-profile">
              <FaUser className="user-icon" />
              <span className="navbar-user">Hi, John</span>
            </div>
          </Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
