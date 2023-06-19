import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import API from "../../api/api";

import Toastr from "../util/toastr"

const RegisterPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [showToastr, setShowToastr] = useState(false);
    const [toastrMsg, setToastrMsg] = useState('');
    const isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated)
            navigate('/');
    }, [isAuthenticated])

    const handleToastrClose = () => {
        setShowToastr(false);
        console.log('something');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(password === cPassword) {
            API.registerUser({
                name: name,
                email: email,
                password: password
            })
                .then(res => {
                    if (res.data.is_success == false)
                    {
                        setShowToastr(true);
                        setToastrMsg(res.data.message);
                    } else {
                        setShowToastr(true);
                        setToastrMsg("Successfully registered.");
                        navigate('/auth/login');
                    }
                })
                .catch(err => { 
                    setToastrMsg('error occured')
                    setShowToastr(true);
                })
        } else {setShowToastr(true);
            setToastrMsg("Password not matched.");
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">        
            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 m-auto">
                <form 
                    className="space-y-6" 
                    action="#"
                    onSubmit={handleSubmit}
                >
                    <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign up to our platform</h5>
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
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                        <input 
                            type="text" 
                            name="name" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                            placeholder="name"
                            value={name}
                            onChange={(e)=>{
                                setName(e.target.value);
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
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm your password</label>
                        <input 
                            type="password" 
                            name="password1" 
                            placeholder="••••••••" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={cPassword}
                            onChange={(e)=>{
                                setCPassword(e.target.value);
                            }} 
                            required
                        />
                    </div>
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register your account</button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Already registered? <a href="/auth/login" className="text-blue-700 hover:underline dark:text-blue-500">Login account</a>
                    </div>
                </form>
            </div>

            <Toastr type='danger' text={toastrMsg} start={showToastr} handleClose={handleToastrClose}/>
        </div>
    )
}

export default RegisterPage;