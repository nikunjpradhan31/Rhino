import {Alert, Button, Form, Row, Col, Stack} from "react-bootstrap";
import {useContext} from "react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
    const {registerInfo,updateRegisterInfo,registerUser,registerError,isRegisterLoading} = useContext(AuthContext);
    return  <>
    <Form onSubmit={registerUser}>
        <Row style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%"
        }}>
            <Col xs={6}>
            <Stack gap={3}>
                <h2>Create An Account</h2>
                <Form.Control type="text" placeholder="Enter your username..." onChange={(e) => updateRegisterInfo({ ...registerInfo, username: e.target.value })}/>
                <Form.Control type="email" placeholder="Enter your email..."  onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })}/>
                <Form.Control type="password" placeholder="Enter your password..."  onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })}/>
                <Button variant="primary" type="submit">
                    {isRegisterLoading ? "Creating your account...": "Register"}
                </Button>
                {
                    registerError?.error && (<Alert variant="danger"><p>{registerError?.message}</p></Alert>)
                }
            </Stack>
            </Col>
        </Row>
    </Form>
    
    </> ;

}
 
export default Register;