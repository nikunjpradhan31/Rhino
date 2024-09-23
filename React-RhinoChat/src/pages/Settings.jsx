import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext } from "react";
const Settings = () => {
    return (
        <>
            <Form>
                <Row style={{ height: "100vh", justifyContent: "center", paddingTop: "10%" }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>User Settings</h2>
                            <Button variant="primary" type="submit">
                            </Button>
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default Settings;