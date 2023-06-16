import React, { useEffect, useState } from 'react';

import API from "../../api/api";
import { useParams, useNavigate } from 'react-router';

import { HiCheck, HiOutlineX, HiDocumentSearch, HiArrowRight, HiRefresh } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../../redux/actions/authActions';

const IndexPage = () => {
    const [tableData, setTableData] = useState([]);
    const [pending, setPending] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [pActKey, setActKey] = useState('');
    const [pAgents, setAgents] = useState(0);
    const [pDate, setDate] = useState('');
    const [pTitle, setTitle] = useState('');
    const [pStatus, setStatus] = useState(2);

    const cusid = useSelector(state => state.authReducer.user.cusid);
    
    useEffect(() => {
        console.log(id);
        API.getTableData(id)
            .then((res) => { 
                setTableData(res.data);
             })
             .catch((err) => {
                console.log(err);
             })
    }, [])

    const handleRefresh = (index) => {
        API.updateStatus({
            id: tableData[index].id,
            status : tableData[index].status === 2 ? 0 : tableData[index].status + 1
        })
            .then(res => setTableData(res.data))
    }

    const handleRowClicked = (id) => {
        navigate(`/detail/${id}`);
    }

    const handleAllAppClicked = (id) => {
        navigate(`/allapp/${id}`);
    }

    const handleAddItem = () => {
        console.log('adding item...')
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
                <div className='grid grid-cols-3 gap-4 p-2'>
                    <div className='text-white text-2xl'>Activation Keys</div>
                    <div className='text-white text-2xl'>Customer ID: {cusid}</div>
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
                            onClick={() => setPending(true)}
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
                                    Activation Key
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Agents
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Title
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
                                            { one.actkey }
                                        </th>
                                        <td className="px-6 py-4">
                                            { one.agents }
                                        </td>
                                        <td className="px-6 py-4">
                                            { one.created }
                                        </td>
                                        <td className="px-6 py-4">
                                            { one.title }
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
                                                onClick={() => handleAllAppClicked(one.id)}
                                            >
                                                <HiDocumentSearch/>
                                            </button>
                                            <button 
                                                type="button" 
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                onClick={() => handleRowClicked(one.id)}
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
                                            <input 
                                                type="text" 
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={pTitle}
                                                onChange={(e) => setTitle(e.target.value)}
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
        </>
    )
}

export default IndexPage;