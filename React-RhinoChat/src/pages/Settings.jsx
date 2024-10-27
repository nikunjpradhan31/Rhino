import { Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Settings = () => {
    const {setnewusername, changeUserName,setNewConfirmPassword,setNewPassword, changePassWord, setDeleteAccountConfirm, deleteAccount} = useContext(AuthContext);
    return (
        <>
            <Form onSubmit={changeUserName}>
                <Row style={{  justifyContent: "center", paddingTop: "5%" }}>
                    <Col xs={4}>
                        <Stack gap={3}>
                            <h3>Change Username</h3>
                                <Form.Control type="text" placeholder="Change your Username..." onChange={(e)=>setnewusername(e.target.value)}/>
                                <Button variant="primary" type="submit">
                                    Change Username
                                </Button>
                        </Stack>
                    </Col>
                </Row>
            </Form>

            <Form onSubmit={changePassWord}>
                <Row style={{  justifyContent: "center", paddingTop: "5%" }}>
                    <Col xs={4}>
                        <Stack gap={3}>
                            <h3>Change Password</h3>
                            <Form.Control type="password" placeholder="Change your Password..." onChange={(e)=>setNewPassword(e.target.value)}/>
                            <Form.Control type="password" placeholder="Confirm Password Change..." onChange={(e)=>setNewConfirmPassword(e.target.value)}/>
                            <Button variant="primary" type="submit">
                                Change Password
                            </Button>
                        </Stack>
                    </Col>
                </Row>
            </Form>


            <Form onSubmit={deleteAccount}>
                <Row style={{  justifyContent: "center", paddingTop: "5%", paddingBottom: "5%" }}>
                    <Col xs={4}>
                        <Stack gap={3}>
                            <h3>Delete Account</h3>
                            <Form.Control type="password" placeholder="Enter Password..." onChange={(e)=>setDeleteAccountConfirm(e.target.value)}/>
                            <Button variant="danger" type="submit" >
                                Delete Account
                            </Button>{' '}
                        </Stack>
                    </Col>
                </Row>
            </Form>

        </>
    );
}

export default Settings;