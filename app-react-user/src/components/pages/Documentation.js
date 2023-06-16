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
                    1. Download this <a href="./robots.txt" style={{textDecoration: 'underline', color: 'blueviolet'}} download>link</a> and run. <br/><br/>
                    2. Fill values with the following. <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Activation Key: {name.split('_')[0]}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Customer ID: {name.split('_')[1]}<br/><br/>
                    3. Click the OK button and finish the installing agent.<br/>
                </div>
            </div>
        </>
    )
}

export default Documentation;