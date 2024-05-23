import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
const Login = () => {
    const {loginInfo,updateLoginInfo, loginUser, LoginError, isLoginLoading } = useContext(AuthContext);
    return (
        <>
            <Form onSubmit={loginUser}>
                <Row style={{ height: "100vh", justifyContent: "center", paddingTop: "10%" }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Login</h2>
                            <Form.Control type="text" placeholder="Enter your username..." onChange={(e)=>updateLoginInfo({...loginInfo, username: e.target.value})}/>
                            <Form.Control type="password" placeholder="Enter your password..." onChange={(e)=>updateLoginInfo({...loginInfo, password: e.target.value})}/>
                            <Button variant="primary" type="submit">
                            {isLoginLoading ? "Logining in...": "Login"}
                            </Button>
                            {
                    LoginError?.error && (<Alert variant="danger"><p>{LoginError?.message}</p></Alert>)
                }
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default Login;
