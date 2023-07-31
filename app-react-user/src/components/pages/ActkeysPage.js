import React, { useEffect, useState } from 'react';

import API from "../../api/api";
import { useParams, useNavigate } from 'react-router';

import { HiCheck, HiOutlineX, HiDocumentSearch, HiArrowRight, HiRefresh, HiTrash } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser, setCurrentUserActKeyInfo } from '../../redux/actions/authActions';

const ActkeysPage = () => {
    const [tableData, setTableData] = useState([]);
    const [pending, setPending] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [showModal, setShowModal] = useState(false);

    const [pActKey, setActKey] = useState('');
    const [pAgents, setAgents] = useState(0);
    const [pDate, setDate] = useState('');
    const [pTitle, setPTitle] = useState('');
    const [pStatus, setStatus] = useState(2);
    const [idToConfirm, setIdToConfirm] = useState(-1);
 
    const customerid = useSelector(state => state.authReducer.user.customerid);
    const userRole = useSelector(state => state.authReducer.user.role)
    
    useEffect(() => {
        API.getActkeys(id)
            .then((res) => { 
                setTableData(res.data);
             })
             .catch((err) => {
                console.log(err);
             })
    }, [])

    const handleRefresh = (index) => {
        API.updateActkeyStatus({
            id: tableData[index].id,
            status : tableData[index].status === 2 ? 1 : 2
        })
        .then(res => setTableData(res.data))
    }
    const confirmDelete = () => {
        setShowModal(false);

        API.deleteActkey(idToConfirm)
        .then(res => setTableData(res.data))
    }
    const handleDelete = (index) => {
        setShowModal(true);
        setIdToConfirm(tableData[index].id)
    }

    const handleNewActkeyClicked = () => {
        setPending(true);
        setPTitle("");
    }

    const handleRowClicked = (id, actkey) => {
        dispatch(setCurrentUserActKeyInfo(actkey));
        navigate(`/detail/${id}`);
    }

    const handleAllAppClicked = (id) => {
        navigate(`/allapp/${id}`);
    }

    const handleAddItem = () => {
        setPending(false);
        API.addActKeyData({
            title: pTitle
        })
            .then((res) => {
                setTableData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })   
    }

    return (
        <>
            <div className='m-32'>
                <div className='grid grid-cols-2 gap-4 p-2'>
                    <div className='text-white text-2xl'>Activation Keys</div>
                    {/* <div className='text-white text-2xl'>Customer ID: {customerid}</div> */}
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
                        {
                            userRole === 1 &&
                            <button 
                                type="button" 
                                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                onClick={() => { navigate(-1) }}
                            >
                                Back
                            </button>
                        }
                        <button 
                            type="button" 
                            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                            onClick={() => handleNewActkeyClicked()}
                        >
                            New Activation
                        </button>
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Activation Key
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Agents
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Last Checked
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
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
                                            { one.title }
                                        </th>
                                        <td className="px-6 py-4">
                                            { one.actkey }
                                        </td>
                                        <td className="px-6 py-4">
                                            { one.agents }
                                        </td>
                                        <td className="px-6 py-4">
                                            { one.created }
                                        </td>
                                        <td className="px-6 py-4">
                                            { one.updated_at }
                                        </td>
                                        <td className="px-6 py-4">
                                            { one.status === 0 && <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Deleted</span> }
                                            { one.status === 1 && <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-900 dark:text-gray-300">Disabled</span> }
                                            { one.status === 2 && <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Enabled</span> }
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                type="button" 
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                onClick={() => handleRefresh(_i)}
                                            >
                                                <HiRefresh/>
                                            </button>
                                            <button 
                                                type="button" 
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                onClick={() => handleDelete(_i)}
                                            >
                                                <HiTrash/>
                                            </button>
                                            <button 
                                                type="button" 
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                onClick={() => handleAllAppClicked(one.id)}
                                            >
                                                <HiDocumentSearch/>
                                            </button>
                                            <button 
                                                type="button" 
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                onClick={() => handleRowClicked(one.id, one.actkey)}
                                            >
                                                <HiArrowRight/>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }
                            {
                                pending &&  
                                <tr className="bg-white border-t dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">
                                        <div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <input 
                                                type="text" 
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={pTitle}
                                                onChange={(e) => setPTitle(e.target.value)}
                                                required 
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <select
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                defaultValue={pStatus}
                                                onChange={(e) => setStatus(e.target.value)}
                                            >
                                                <option value={2}>Enabled</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            type="button" 
                                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                            onClick={() => setPending(false)}
                                        >
                                            <HiOutlineX/>
                                        </button>
                                        <button 
                                            type="button" 
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            onClick={() => handleAddItem()}
                                        >
                                            <HiCheck/>
                                        </button>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal ? (
                <>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div
                            className="fixed inset-0 w-full h-full bg-black opacity-40"
                            onClick={() => setShowModal(false)}
                        ></div>
                        <div className="flex items-center min-h-screen px-4 py-8">
                            <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                                <div className="mt-3 sm:grid">
                                    <div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-red-100 rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6 text-red-600"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-2 text-center sm:ml-4 sm:text-left">
                                        <div className="items-center gap-2 mt-3 sm:flex">
                                            <button
                                                className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                                onClick={() =>
                                                    confirmDelete()
                                                }
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                                onClick={() =>
                                                    setShowModal(false)
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
            
        </>
    )
}

export default ActkeysPage;