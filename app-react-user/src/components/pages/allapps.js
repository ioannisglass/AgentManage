import React, { useEffect, useState } from 'react';
import { HiTrash } from 'react-icons/hi'
import API from "../../api/api";
import { useParams, useNavigate } from 'react-router';

const AllAppPage = () => {
    
    const [tableData, setTableData] = useState([]);
    const [pLabel, setLabel] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelApp = (app) => {
        navigate(`/remove/${id}/${app}`);
    }

    useEffect(() => {
        setLabel('Detail');
        API.getAllAppData(id)
            .then((res) => { 
                setTableData(res.data);
             })
             .catch((err) => {
                console.log(err);
             })
    }, [])

    return (
        <>
            <div className='m-32'>
                <div className='grid grid-cols-2 gap-4 p-2'>
                    <div className='text-white text-2xl'>{pLabel}</div>
                    <div className='text-white justify-self-end'>
                        <button 
                            type="button" 
                            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                            onClick={() => { navigate(-1) }}
                        >
                                Back
                        </button>
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Version
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableData.map((one, _i) => 
                                    <tr className="bg-white border-t dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={_i}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { one.name }
                                        </th>
                                        <td className="px-6 py-4">
                                            { one.ver }
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                        <button 
                                            type="button" 
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            onClick={() => handleDelApp(one.name)}
                                        >
                                            <HiTrash/>
                                        </button>
                                    </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default AllAppPage;