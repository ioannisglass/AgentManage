import React from "react";
import { useParams } from 'react-router';

const Documentation = () => {

    const { name } = useParams();
    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">        
                <div>
                </div>
                <div className='text-white text-2xl p-20 '>
                    1. Download the <a href="./robots.txt" style={{textDecoration: 'underline', color: 'blueviolet'}} download>link</a> and extract all. <br/><br/>
                    2. Run Command Prompt and go to the extracted directory. <br/><br/>
                    3. Run the command:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;WinAgentInstaller.exe {name.split('_')[1]} {name.split('_')[0]}<br/><br/>
                </div>
            </div>
        </>
    )
}

export default Documentation;