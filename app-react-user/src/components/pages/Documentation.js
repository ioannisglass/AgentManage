import React from "react";
import { useParams } from 'react-router';
// require('dotenv').config()
const Documentation = () => {

    const { name } = useParams();
    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">        
                <div>
                </div>
                <div className='text-white text-2xl p-20 '>
                    1. Download and extract all.<br/>
                    {/* &nbsp;&nbsp;&nbsp;&nbsp;<a href={`${process.env.REACT_APP_BASE_API_URL}/uploads/WinAgent.zip`} style={{textDecoration: 'underline', color: 'blueviolet'}} download>Windows Agent</a><br/><br/> */}
                    &nbsp;&nbsp;&nbsp;&nbsp;<a href='http://127.0.0.1:5000/uploads/WinAgent.zip' style={{textDecoration: 'underline', color: 'blueviolet'}} download>Windows Agent</a><br/><br/>
                    2. Run Command Prompt and go to the extracted directory. <br/><br/>
                    3. Run the command:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;WinAgentInstaller.exe {name.split('_')[1]} {name.split('_')[0]}<br/><br/>
                </div>
            </div>
        </>
    )
}

export default Documentation;