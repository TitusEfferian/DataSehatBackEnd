import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap';

class AppNavbar extends Component {
    state = {
        isOpen: false
    }
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return(
            <div>
            <Navbar color="dark" dark expand="sm">
                <Container>
                    <NavbarBrand href="/">DataSehat</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}></NavbarToggler>
                    <Collapse isOpen={this.state.isOpen}>
                        <Nav className="ml-auto">
                            <NavItem>
                                <NavLink>DataSehat</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </div>
        )
    }
}
export default AppNavbar;