import React from 'react';
import { Navbar, NavbarBrand, Container } from 'reactstrap';

export function Header({ children }) {
  return (
    <Navbar color="dark" dark>
      <Container>
        <NavbarBrand className="mr-auto">MarkdownEditor</NavbarBrand>
        {children}
      </Container>
    </Navbar>
  );
}
