import {createContext, useCallback, useEffect, useState} from "react";
import { baseUrl, postRequest } from "../utils/services";
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


    return ( <AuthContext.Provider 
    value={{user, registerInfo,updateRegisterInfo,registerUser,registerError,isRegisterLoading, logoutUser , loginInfo,updateLoginInfo, loginUser, LoginError, isLoginLoading }}>
        {children}
    </AuthContext.Provider>
    );
};