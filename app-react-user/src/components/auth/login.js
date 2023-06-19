import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser,setCurrentUserMsgInfo } from '../../redux/actions/authActions'
import { useNavigate } from 'react-router';
import Toastr from "../util/toastr"
// import { setCurrentUserMsgInfo } from "../../redux/actions/auth"

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showToastr, setShowToastr] = useState(false);
    const [toastrMsg, setToastrMsg] = useState('');
    const isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);
    const loginError = useSelector((state) => state.authReducer.loginError);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(loginError)
        if (isAuthenticated)
            navigate('/');
           
        if (loginError) {
            setToastrMsg(loginError)
            setShowToastr(true);
            dispatch(
                setCurrentUserMsgInfo(null)
            )
        }
    }, [isAuthenticated, loginError])

    const handleToastrClose = () => {
        setShowToastr(false);
        console.log('something');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({
            email: email,
            password: password
        }))
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">        
            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 m-auto">
                <form 
                    className="space-y-6" 
                    action="#"
                    onSubmit={handleSubmit}
                >
                    <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input 
                            type="email" 
                            name="email" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e)=>{
                                setEmail(e.target.value);
                            }}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="••••••••" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={password}
                            onChange={(e)=>{
                                setPassword(e.target.value);
                            }} 
                            required
                        />
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input 
                                    id="remember" 
                                    type="checkbox" 
                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" 
                                />
                            </div>
                            <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                        </div>
                        {/* <a href="#" className="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a> */}
                    </div>
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Not registered? <a href="/auth/register" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                    </div>
                </form>
            </div>
            
            <Toastr type='danger' text={toastrMsg} start={showToastr} handleClose={handleToastrClose}/>
        </div>
    )
}

export default LoginPage;