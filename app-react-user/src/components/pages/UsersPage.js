import React, { useEffect, useState } from 'react';

import API from "../../api/api";
import { useParams, useNavigate } from 'react-router';

import { HiOutlinePencilAlt, HiDocumentSearch, HiOutlineX, HiCheck } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../../redux/actions/authActions';

const UsersPage = () => {
    
    const [tableData, setTableData] = useState([]);
    const [editRow, setEditRow] = useState(-1);
    const [tName, setTName] = useState('');
    const { id } = useParams();                     // selected row id of Domain table
    const navigate = useNavigate();
    const cusid = useSelector(state => state.authReducer.user.cusid);
    const userRole = useSelector(state => state.authReducer.user.role)
    const userId = useSelector(state => state.authReducer.user.id)
    const dispatch = useDispatch();

    const handleRowClicked = async (id, actkey) => {
        // navigate(`/dash/${id}`);
    }

    const handleUserEdit = (index) => {
        setEditRow(index);
        setTName(tableData[index].name);
    }

    const handleUserEditCancled = () => {
        setEditRow(-1);
    }

    const handleUserEditFinished = () => {
        API.updateUserData({
            name: tName,
            id: tableData[editRow].id,              // selected user row id
            did: id                                 // selected domain row id
        })
            .then(res => setTableData(res.data))
            .catch(err => console.log(err))
        setEditRow(-1);
    }

    useEffect(() => {
        console.log(id);
        API.getUserList(id)
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
                    <div className='text-white text-2xl'>User List</div>
                    {/* <div className='text-white text-2xl'> */}
                        {/* Customer ID: { customer_info } */}
                    {/* </div> */}
                    <div className='text-white justify-self-end'>
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
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableData.map((one, _i) => 
                                    <tr className="bg-white border-t dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={_i}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { 
                                                _i === editRow ?
                                                <input 
                                                    type="text" 
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    value={tName}
                                                    onChange={(e) => setTName(e.target.value)}
                                                    required 
                                                />
                                                    :
                                                one.name 
                                            }
                                        </th>
                                        <td className="px-6 py-4">
                                            { one.email }
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            { 
                                                _i !== editRow ?
                                                <>
                                                    <button 
                                                        type="button" 
                                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                        onClick={() => handleUserEdit(_i)}
                                                    >
                                                        <HiOutlinePencilAlt></HiOutlinePencilAlt>
                                                    </button>
                                                </>
                                                    :
                                                <>
                                                    <button 
                                                        type="button" 
                                                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                                        onClick={() => handleUserEditCancled()}
                                                    >
                                                        <HiOutlineX/>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                        onClick={() => handleUserEditFinished()}
                                                    >
                                                        <HiCheck/>
                                                    </button>
                                                </>
                                            }
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

export default UsersPage;