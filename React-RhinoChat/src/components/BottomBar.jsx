import React from 'react';
import { Container, Navbar, Stack } from 'react-bootstrap';

const BottomBar = () => {
    return (
        <Navbar style={{ background: "#060550", color: "white", marginTop: "5vh", paddingBottom: "1rem" }}>
            <Container className="d-flex justify-content-center">
                <Stack direction="vertical" className="text-center text-warning">
                    <span>Created by Nikunj Pradhan and Alexander Djidjev.</span>
                    <span>RhinoChat &copy; {new Date().getFullYear()} All rights reserved.</span>
                </Stack>
            </Container>
        </Navbar>
    );
};

export default BottomBar;
