import {createContext, useCallback, useContext, useEffect, useState} from "react";
import { baseUrl, postRequest,putRequest } from "../utils/services";
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

export const AuthContextProvider = ({children}) =>{
const [user,setUser] = useState(null);
const [registerError, setRegisterError] = useState(null);
const [isRegisterLoading, setIsRegisterLoading] = useState(false);
const [registerInfo, setRegisterInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",

});

const [LoginError, setLoginError] = useState(null);
const [isLoginLoading, setIsLoginLoading] = useState(false);
const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",

});

const navigate = useNavigate();

useEffect(()=>{
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
},[]);

const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
}, []);

// const registerUser = useCallback(async(e)=>{
//     e.preventDefault();
//     setIsRegisterLoading(true);
//     setRegisterError(null);
//    const response =  await postRequest(`${baseUrl}/users/register`,JSON.stringify(registerInfo));

//    setIsRegisterLoading(false);

//    if(response.error){
//     return setRegisterError(response);
//    }

//    localStorage.setItem("User", JSON.stringify(response));
//    setUser(response);
// }, [registerInfo]);
const registerUser = useCallback(async (e) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    setRegisterError(null);

    const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));

    setIsRegisterLoading(false);

    if (response.error) {
        return setRegisterError(response);
    }

    if (response.verificationRequired) {
        // Handle the case where email verification is required
        alert('Registration successful. Please check your email to verify your account.');
        navigate('/login'); 
        return;
    }

    localStorage.setItem("User", JSON.stringify(response));
    setUser(response);
}, [registerInfo]);

const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
},[]);


const loginUser = useCallback(async(e)=>{
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError(null);
   const response =  await postRequest(`${baseUrl}/users/login`,JSON.stringify(loginInfo));

   setIsLoginLoading(false);

   if(response.error){
    return setLoginError(response);
   }

   localStorage.setItem("User", JSON.stringify(response));
   setUser(response);
}, [loginInfo]);

const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
}, []);

const [newusername, setnewusername] = useState("");
const [IsUserChangeLoading, setUserChangeLoading] = useState(false);
const [UserChangeError, setUserChangeError] = useState(null);
const changeUserName = useCallback(async (e) => {
        e.preventDefault();
        setUserChangeLoading(true);
        setUserChangeError(null);

        const response = await putRequest(`${baseUrl}/users/changeUser/${user._id}/${newusername}`);

        setUserChangeLoading(false);

        if (response.error) {
            setUserChangeError(response);
            window.alert(`Error: ${response.message}`); 
            return;        }

        setUser(response);
        localStorage.setItem("User", JSON.stringify(response));
        setnewusername("");
}, [newusername, user]);

const [newPassword, setNewPassword] = useState("");
const [newConfirmPassword, setNewConfirmPassword] = useState("");
const [IsPassChangeLoading, setPassChangeLoading] = useState(false);
const [PassChangeError, setPassChangeError] = useState(null);

const changePassWord = useCallback(async (e) => {
        e.preventDefault();
        setPassChangeLoading(true);
        setPassChangeError(null);

        const response = await putRequest(`${baseUrl}/users/changePass/${user._id}/${newPassword}/${newConfirmPassword}`);

        setPassChangeLoading(false);

        if (response.error) {
            setPassChangeError(response);
            window.alert(`Error: ${response.message}`); 
            return;        }

        setUser(response);
        localStorage.setItem("User", JSON.stringify(response));
        setNewPassword("");
        setNewConfirmPassword("");

}, [newPassword,newConfirmPassword, user]);

const [DeleteAccountConfirm, setDeleteAccountConfirm] = useState("");
const [IsDeleteLoading, setIsDeleteLoading] = useState(false);
const [DeleteError, setDeleteError] = useState(null);
console.log(DeleteAccountConfirm);
const deleteAccount = useCallback(async (e) => {
        e.preventDefault();
        setIsDeleteLoading(true);
        setDeleteError(null);

        const response = await putRequest(`${baseUrl}/users/delete/${user._id}/${DeleteAccountConfirm}`);

        setIsDeleteLoading(false);

        if (response.error) {
            setDeleteError(response);
            window.alert(`Error: ${response.message}`); 
            return;        }
        setDeleteAccountConfirm("");
        localStorage.removeItem("User");
        setUser(null);

}, [DeleteAccountConfirm, user]);



    return ( <AuthContext.Provider 
    value={{user, registerInfo,updateRegisterInfo,registerUser,registerError,isRegisterLoading, logoutUser , loginInfo,updateLoginInfo, loginUser, LoginError, isLoginLoading,setnewusername,changeUserName,setNewConfirmPassword,setNewPassword,changePassWord ,setDeleteAccountConfirm, deleteAccount}}>
        {children}
    </AuthContext.Provider>
    );
};