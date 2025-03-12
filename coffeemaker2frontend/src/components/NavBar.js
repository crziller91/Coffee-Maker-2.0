import React, { Component } from 'react'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default class NavBar extends Component {
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/">Coffee Maker 2</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/inventory">Inventory</Nav.Link>
              <Nav.Link href="/recipes">Recipes</Nav.Link>
              <Nav.Link href="/purchaserecipe">Purchase Recipe</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </div>
    )
  }
}
