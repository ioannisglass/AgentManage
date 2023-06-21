import React, { useEffect, useState } from 'react';

import API from "../../api/api";
import { useNavigate } from 'react-router';

import { HiOutlinePencilAlt, HiDocumentSearch, HiOutlineX, HiCheck, HiUsers, HiKey } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../../redux/actions/authActions';
import Toastr from '../util/toastr';
// require('dotenv').config()

const FilesPage = () => {
    
    const [showToastr, setShowToastr] = useState(false);
    const [toastrMsg, setToastrMsg] = useState('');
    const cusid = useSelector(state => state.authReducer.user.cusid);
    const userRole = useSelector(state => state.authReducer.user.role)
    const userId = useSelector(state => state.authReducer.user.id)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleToastrClose = () => {
        setShowToastr(false);
    }

    const handleUpload = async (type) => {
        // type: 1 windows, 2 linux
        if (!selectedFile) {
           alert("Please first select a file");
           return;
        }
  
        const formData = new FormData();
        formData.append("file", selectedFile);
  
        try {
           // Replace this URL with your server-side endpoint for handling file uploads
            const response = await fetch("http://127.0.0.1:5000/api/uploader", {
            // const response = await fetch(process.env.REACT_APP_BASE_API_URL, {
                method: "POST",
                body: formData
            });
  
            if (response.ok) {
                alert("File upload is  successfully");
            } else {
                alert("Failed to upload the file due to errors");
            }
        } catch (error) {
            console.error("Error while uploading the file:", error);
            alert("Error occurred while uploading the file");
        }
     };

    useEffect(() => {
        console.log(`cusid: ${cusid}, role: ${userRole}`)
    }, [])

    return (
        <>
            <div className='m-32'>
                <div className='grid grid-cols-2 gap-4 p-2'>
                    <div className='text-white text-2xl'>Files List</div>
                    <div className='text-white justify-self-end'>
                        <button
                            type="button" 
                            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                            onClick={() => { navigate(-1) }}
                        >
                            Back
                        </button>
                        <button 
                            type="button" 
                            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                            onClick={() => { 
                                dispatch(logOutUser());
                             }}
                        >
                                Sign Out
                        </button>
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Platform
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    URL
                                </th>
                                <th scope="col" className="px-6 py-3">

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            <tr className="bg-white border-t dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Windows
                                </th>
                                <td className="px-6 py-3">
                                    {/* <a href="http://192.168.8.171:5000/uploads/WinAgent.zip" style={{textDecoration: 'underline', color: 'blueviolet'}} download>Windows Agent</a> */}
                                    <input type="file" onChange={handleFileChange} />
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <button 
                                        type="button" 
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={() => handleUpload(1)}
                                    >
                                        <HiOutlinePencilAlt></HiOutlinePencilAlt>
                                    </button>
                                </td>
                            </tr>
                            <tr className="bg-white border-t dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Linux
                                </th>
                                <td className="px-6 py-3">
                                    {/* <a href="http://192.168.8.171:5000/uploads/LinuxAgent.zip" style={{textDecoration: 'underline', color: 'blueviolet'}} download>Linux Agent</a> */}
                                    <input type="file" onChange={handleFileChange} />
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <button 
                                        type="button" 
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={() => handleUpload(2)}
                                    >
                                        <HiOutlinePencilAlt></HiOutlinePencilAlt>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Toastr type='danger' text={toastrMsg} start={showToastr} handleClose={handleToastrClose}/>
        </>
    )
}

export default FilesPage;