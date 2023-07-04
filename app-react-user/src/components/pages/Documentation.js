import React from "react";
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../../redux/actions/authActions';
// require('dotenv').config()
const Documentation = () => {

    const { name } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">        
                <div style={{marginLeft: 700}}>
                    <button 
                        type="button" 
                        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        onClick={() => {
                            dispatch(logOutUser());
                        }}
                    >
                        Sign Out
                    </button>
                    <button 
                        type="button" 
                        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        onClick={() => { navigate(-1) }}
                    >
                        Back
                    </button>
                </div>
                <div className='text-white text-2xl p-20 '>
                    1. Download and extract all.<br/>
                    {/* &nbsp;&nbsp;&nbsp;&nbsp;<a href={`${process.env.REACT_APP_BASE_API_URL}/uploads/WinAgent.zip`} style={{textDecoration: 'underline', color: 'blueviolet'}} download>Windows Agent</a><br/><br/> */}
                    &nbsp;&nbsp;&nbsp;&nbsp;<a href='https://api.vulnagent.com/uploads/WinAgent.zip' style={{textDecoration: 'underline', color: 'blueviolet'}} download>Windows Agent</a><br/><br/>
                    {/* &nbsp;&nbsp;&nbsp;&nbsp;<a href='http://192.168.8.171:5000/uploads/WinAgent.zip' style={{textDecoration: 'underline', color: 'blueviolet'}} download>Windows Agent</a><br/><br/> */}
                    2. Run Command Prompt as Administrator and go to the extracted directory. <br/><br/>
                    3. Run the command:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Start.exe {name.split('_')[1]} {name.split('_')[0]}<br/><br/>
                </div>
            </div>
        </>
    )
}

export default Documentation;