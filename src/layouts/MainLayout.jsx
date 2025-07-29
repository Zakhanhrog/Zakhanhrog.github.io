import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const MainLayout = () => {
  return (
    <>
      <Navbar bg="dark" variant="light" expand="lg" sticky="top">
        <Container fluid className="px-4">
          <Navbar.Brand as={NavLink} to="/">
            Quản Lý Bán Hàng
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/products">
                Sản phẩm
              </Nav.Link>
              <Nav.Link as={NavLink} to="/categories">
                Danh mục
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="px-4 py-5">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;