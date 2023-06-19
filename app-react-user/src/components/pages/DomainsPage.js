import React, { useEffect, useState } from 'react';

import API from "../../api/api";
import { useNavigate } from 'react-router';

import { HiOutlinePencilAlt, HiDocumentSearch, HiOutlineX, HiCheck, HiUsers, HiKey } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../../redux/actions/authActions';
import Toastr from '../util/toastr';

const DomainsPage = () => {
    
    const [tableData, setTableData] = useState([]);
    const [editRow, setEditRow] = useState(-1);
    
    const [pDName, setPDName] = useState('');
    const [pDomain, setPDomain] = useState('');
    const [pCustomerid, setPCustomerid] = useState('');
    const [pending, setPending] = useState(false);
    const navigate = useNavigate();
    const [showToastr, setShowToastr] = useState(false);
    const [toastrMsg, setToastrMsg] = useState('');
    const cusid = useSelector(state => state.authReducer.user.cusid);
    const userRole = useSelector(state => state.authReducer.user.role)
    const userId = useSelector(state => state.authReducer.user.id)
    const dispatch = useDispatch();

    const handleRowClicked = async (id, actkey) => {
        navigate(`/dash/${id}`);
    }

    const handleDomainEdit = (index) => {
        setEditRow(index);
        setPDName(tableData[index].name);
        setPDomain(tableData[index].domain);
        setPCustomerid(tableData[index].customerid)
    }

    const handleDomainEditOrAddCancled = () => {
        setEditRow(-1);
        setPending(false);
    }

    const handleNewDomainClicked = () => {
        setPending(true);
        setPDName("");
        setPDomain("");
        setPCustomerid("")
    }

    const handleToastrClose = () => {
        setShowToastr(false);
        console.log('something');
    }
    
    const handleDomainEditFinished = () => {
        API.updateDomain({
            id: tableData[editRow].id,
            name: pDName,
            domain: pDomain,
            customerid: pCustomerid
        })
            .then(res => setTableData(res.data))
            .catch(err => console.log(err))
        setEditRow(-1);
    }

    const handleUsersViewClicked = () => {
        navigate(`dusers/${cusid}`)
    }

    const handleAddItem = () => {
        setShowToastr(false);
        setPending(false);
        API.addDomain({
            name: pDName,
            domain: pDomain,
            customerid: pCustomerid
        })
            .then((res) => {
                if(res.data.is_success === false) {
                    setToastrMsg(res.data["message"])
                    setShowToastr(true);
                } else {
                    console.log(res.data);
                    setShowToastr(true);
                    setToastrMsg(res.data["message"])
                    setTableData(res.data["domains"]);
                }
            })
            .catch((err) => {
                console.log(err);
            })   
    }

    useEffect(() => {
        console.log(`cusid: ${cusid}, role: ${userRole}`)
        if(userRole == 0)
            navigate(`dactkeys/${cusid}`)
        else {
            API.getDomains()
                .then((res) => { 
                    setTableData(res.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [])

    return (
        <>
            <div className='m-32'>
                <div className='grid grid-cols-2 gap-4 p-2'>
                    <div className='text-white text-2xl'>Domain List</div>
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
                            // onClick={() => setPending(true)}
                            onClick={() => handleNewDomainClicked()}
                        >
                            New Domain
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
                                    Domain
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Customer ID
                                </th>
                                <th scope="col" className="px-6 py-3">

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableData.map((one, _i) => 
                                    <tr className="bg-white border-t dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={_i}>
                                        <th scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { 
                                                _i === editRow ?
                                                <input 
                                                    type="text" 
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    value={pDName}
                                                    onChange={(e) => setPDName(e.target.value)}
                                                    required 
                                                />
                                                    :
                                                one.name 
                                            }
                                        </th>
                                        <td className="px-6 py-3">
                                            {
                                                _i === editRow ?
                                                    <input 
                                                        type="text" 
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        value={pDomain}
                                                        onChange={(e) => setPDomain(e.target.value)}
                                                        required 
                                                    />
                                                        :
                                                    one.domain 
                                            }
                                        </td>
                                        <td className="px-6 py-3">
                                            {
                                                _i === editRow ?
                                                    <input
                                                        type="text" 
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        value={pCustomerid}
                                                        onChange={(e) => setPCustomerid(e.target.value)}
                                                        required 
                                                    />
                                                        :
                                                    one.customerid 
                                            }
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            { 
                                                _i !== editRow ?
                                                <>
                                                    <button 
                                                        type="button" 
                                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                        onClick={() => handleDomainEdit(_i)}
                                                    >
                                                        <HiOutlinePencilAlt></HiOutlinePencilAlt>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                        onClick={() => handleRowClicked(one.id, one.domain + one.customerid)}
                                                    >
                                                        <HiKey></HiKey>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                        onClick={() => handleUsersViewClicked(one.id)}
                                                    >
                                                        <HiUsers/>
                                                    </button>
                                                </>
                                                    :
                                                <>
                                                    <button 
                                                        type="button" 
                                                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                                        onClick={() => handleDomainEditOrAddCancled()}
                                                    >
                                                        <HiOutlineX/>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                        onClick={() => handleDomainEditFinished()}
                                                    >
                                                        <HiCheck/>
                                                    </button>
                                                </>
                                            }
                                        </td>
                                    </tr>
                                )
                            }
                            {
                                pending && 
                                <tr className="bg-white border-t dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <div>
                                            <input 
                                                type="text" 
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={pDName}
                                                onChange={(e) => setPDName(e.target.value)}
                                                required 
                                            />
                                        </div>
                                    </th>
                                    <td className="px-6 py-3">
                                        <div>
                                            <input 
                                                type="text" 
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={pDomain}
                                                onChange={(e) => setPDomain(e.target.value)}
                                                required 
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div>
                                            <input 
                                                type="text" 
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={pCustomerid}
                                                onChange={(e) => setPCustomerid(e.target.value)}
                                                required 
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button 
                                            type="button" 
                                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                            // onClick={() => setPending(false)}
                                            onClick={() => handleDomainEditOrAddCancled()}
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
            <Toastr type='danger' text={toastrMsg} start={showToastr} handleClose={handleToastrClose}/>
        </>
    )
}

export default DomainsPage;