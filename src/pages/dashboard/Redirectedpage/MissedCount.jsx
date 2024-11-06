import React, { useState } from 'react'
import { Button, Container, Form, Modal } from 'react-bootstrap';
// import './css/addshiftslotstyle.css'
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';


function MissedCount() {

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';

    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [refreshKey, setRefreshKey] = useState(0);

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/missedcount_Details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);

                console.log("setTableData", responseData.data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------------------------------------------------------------
    const [missedcounuserid, setMissedcounuserid] = useState(null);


    useEffect(() => {
        if (missedcounuserid !== null) {
            fetchindividualuserData();
            console.log("------------------------------------->", missedcounuserid)
        }
    }, [missedcounuserid]);

    const fetchindividualuserData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://epkgroup.in/crm/api/public/api/get_missedcount_Details/${missedcounuserid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.status === 'success' && responseData.data.length > 0) {
                    console.log("fetchindividualuserData", responseData.data[0].role);

                    setSelectedDepartment(responseData.data[0].role);
                    setSelectedMember(responseData.data[0].id);
                    console.log("selectedMember----------------->", responseData.data[0].id)
                } else {
                    throw new Error('No data found');
                }
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    // ------------------------------------------------------------------------------------------------
    // current date
    const today = new Date().toISOString().split('T')[0];


    // ------------------------------------------------------------------------------------------------




    // ========================================
    // pagination, search, print state

    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const componentRef = React.useRef();

    // loading state
    const [loading, setLoading] = useState(true);

    // ========================================
    // print start

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // print end
    // ========================================


    // ========================================
    // CSV start


    const handleExportCSV = () => {
        const csvData = tableData.map(({ hrms_emp_id,employee_name, misseddate }, index) => ({
            '#': index + 1,
            hrms_emp_id,
            employee_name,
            misseddate,

        }));

        const headers = [
            { label: '#', key: '#' },
            { label: 'Emp-ID', key: 'hrms_emp_id' },
            { label: 'Employee name', key: 'employee_name' },
            { label: 'Date', key: 'misseddate' },


        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Missedcount.csv',
        };

        return <CSVLink {...csvReport}><i className="fas fa-file-csv" style={{ fontSize: '25px', color: '#0d6efd' }}></i></CSVLink>;
    };

    // csv end
    // ========================================


    // ========================================
    // PDF start

    const handleExportPDF = () => {
        const unit = 'pt';
        const size = 'A4'; // You can change to 'letter' or other sizes as needed
        const doc = new jsPDF('landscape', unit, size);

        const data = tableData.map(({ hrms_emp_id,employee_name, misseddate }, index) => [
            index + 1,
            hrms_emp_id,
            employee_name,
            misseddate,
        ]);

        doc.autoTable({
            head: [['#', 'Emp-ID','Employee Name', 'Date']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('Missedcount.pdf');

    };

    // PDF End
    // ========================================

    // ========================================
    // Fillter start

    const filteredData = tableData.filter((row) =>
        Object.values(row).some(
            (value) =>
                (typeof value === 'string' || typeof value === 'number') &&
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Fillter End
    // ========================================

    const filteredleaveData = filteredData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // ============================================

    const myStyles = {
        color: 'white',
        fontSize: '16px',
        border: '1px solid #0d6efd',
        marginRight: '15px',
        borderRadius: '21px',
        padding: '5px 7px',
        boxShadow: 'rgba(13, 110, 253, 0.5) 0px 0px 10px 1px'
    };

    const myStyles1 = {
        color: '#0d6efd',
        fontSize: '16px',
        border: '1px solid #0d6efd',
        marginRight: '15px',

        padding: '5px 7px',
        boxShadow: 'rgba(13, 110, 253, 0.5) 0px 0px 10px 1px'
    };

    // ===============================================




    // ---------------------------------- Fetch user roles ------------------------------------------------
    // Fetch user roles
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://epkgroup.in/crm/api/public/api/userrolelist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                console.log("Fetched department data:", data);
                setDepartments(data);
            } catch (error) {
                console.error('Error fetching user roles:', error);
            }
        };

        fetchDepartments();
    }, [usertoken]);

    console.log("selectedDepartment", selectedDepartment)



    // ---------------------------------------------------------------------------------------------------


    // -------------------------------  Fetch Supervisor roles -------------------------------------------
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');

    useEffect(() => {
        if (selectedDepartment) {
            const fetchMembers = async () => {
                try {
                    const response = await axios.get(`https://epkgroup.in/crm/api/public/api/employee_dropdown_list/${selectedDepartment}`, {
                        headers: {
                            'Authorization': `Bearer ${usertoken}`
                        }
                    });
                    const data = response.data.data;
                    console.log("Fetched supervisor list:", data);
                    setMembers(data);
                } catch (error) {
                    console.error('Error fetching members:', error);
                }
            };

            fetchMembers();
        }
    }, [selectedDepartment, usertoken]);

    console.log("members", members)
    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // Leave Request Category

    const [isCategory, setIsCategory] = useState([{ "id": "0", "leave_category_name": "Select Category Type" }]);


    useEffect(() => {
        const apiUrl = 'https://epkgroup.in/crm/api/public/api/leave_category_list';
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                console.log("response.data.data", response.data.data)
                setIsCategory([{ "id": "0", "leave_category_name": "Select Category Type" }, ...data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    // ----------------------------------------------------------------------------------------------------
    // Leave request Type

    const [isLeave, setIsLeave] = useState([{ "cid": "0", "leave_type_name": "Select Type" }]);

    useEffect(() => {
        const apiUrl = 'https://epkgroup.in/crm/api/public/api/leave_type_list';
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                setIsLeave([{ "cid": "0", "leave_type_name": "Select Type" }, ...data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    // ----------------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------


    const [person, setPerson] = useState('');

    const [category, setCategory] = useState('');
    const [type, setType] = useState('');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [permissionFromDate, setPermissionFromDate] = useState('');
    const [toTime, setToTime] = useState('');
    const [reason, setReason] = useState('');
    const [attachment, setAttachment] = useState(null);

    const [formErrors, setFormErrors] = useState({});
    // ----------------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------


    // leave / permission/ half day popup open

    const [isTimeOff, setIsTimeOff] = useState(false)


    const handlemissedleave = (id) => {
        setIsTimeOff(true);
        setMissedcounuserid(id)
        setType('1')
        setFromDate(today)
        setToDate(today)
        setFormErrors({});
    };

    const handlemissedabsent = (id) => {
        setIsTimeOff(true);
        setMissedcounuserid(id)
        setType('4')
        setFromDate(today)
        setToDate(today)
        setFormErrors({});
    };



    const handleCloseIsTimeOff = () => {

        setIsTimeOff(false);
    }

    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------

    const [shiftInfo, setShiftInfo] = useState(null);
    const [noactiveshift, setNoactiveshift] = useState('');
    const [error, setError] = useState(null);



    const checkShiftSlot = async () => {
        if (toDate) {
            try {
                const response = await fetch('https://epkgroup.in/crm/api/public/api/shift_slot_checking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}`
                    },
                    body: JSON.stringify({
                        emp_id: selectedMember,
                        request_type: type,
                        from_date: fromDate,
                        to_date: toDate,
                        date: permissionFromDate,
                        from_time: fromTime,
                        to_time: toTime
                    }),
                });

                const result = await response.json();
                if (response.ok) {
                    if (result.status === 'success') {
                        setShiftInfo(result.shift_id);
                        console.log('Shift Info:', result.shift_id);
                        setNoactiveshift(result.shift_name);
                    } else if (result.status === 'error') {
                        setNoactiveshift(result.message);
                        console.log('Error status:==============================>', result.message);
                    } else {
                        console.error('Error fetching shift slot:', result);
                        setError(result);
                    }
                } else {
                    console.error('HTTP error:', response.status, response.statusText);
                    setError({ status: response.status, statusText: response.statusText });
                }
            } catch (error) {
                console.error('API call failed:', error);
                setError(error);
            }
        }
    };

    useEffect(() => {
        checkShiftSlot();
    }, [toDate, missedcounuserid]);

    // ----------------------------------------------------------------------------------------------------


    const submitData = async () => {


        const formData = new FormData();

        // Appending form data
        formData.append('emp_id', selectedMember);
        formData.append('hr_id', userData.userempid);
        formData.append('slot_id', shiftInfo);
        formData.append('request_type', type);
        formData.append('request_category', category);
        formData.append('from_date', fromDate);
        formData.append('to_date', toDate);
        // formData.append('permission_date', permissionFromDate);
        // formData.append('permission_timefrom', fromTimeUpdated);
        // formData.append('permission_timeto', toTimeUpdated);
        formData.append('leave_reason', reason);
        formData.append('leave_document', attachment);

        console.log("formData----->", formData);

        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/add_menualentry', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            // Check if response is OK and has content
            if (response.ok) {
                const text = await response.text();
                const data = text ? JSON.parse(text) : {};

                if (data.status === 'success') {
                    // Clearing the form fields upon successful submission
                    setSelectedDepartment('');
                    setSelectedMember('');
                    setPerson('');
                    setCategory('');
                    setType('');
                    setFromDate('');
                    setToDate('');
                    setFromTime('');
                    setToTime('');
                    setReason('');
                    setAttachment(null); // Assuming setAttachment is used to clear file input
                    setRefreshKey(prevKey => prevKey + 1);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: `Attendance Added Successfully.`,
                    });
                    setIsTimeOff(false);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `Error in adding Attendance: ${data.message || 'Unknown error'}`,
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Server responded with status: ${response.status}`,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error in adding Attendance: ${error.message || 'Unknown error'}`,
            });
        }
    };

    const handleSubmitTimeoff = (e) => {
        e.preventDefault();

        const errors = {};

        if (noactiveshift !== 'General') {
            errors.noactiveshift = noactiveshift;
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});



        submitData();
    };

    return (
        <>

            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f6f6f6'
                }}>
                    <ScaleLoader color="rgb(20 166 249)" />
                </div>
            ) : (

                <Container fluid className='shift__container'>
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Missed Count - {today}</h3>



                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}

                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap:'wrap', gap:'17px' }}>
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={myStyles1}
                            />
                        </div>
                        <div>
                            <button style={myStyles}>{handleExportCSV()}</button>
                            <button style={myStyles} onClick={handleExportPDF}><i className="fas fa-file-pdf" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
                            <button style={myStyles} onClick={handlePrint}><i className="fas fa-print" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
                        </div>
                    </div>

                    <div ref={componentRef} style={{ overflowX: 'auto', width: '100%' }}>
                        <table className="table" style={{ minWidth: '100%', width: 'max-content' }}>
                            <thead className="thead-dark">
                                <tr>
                                    <th>S.No</th>
                                    <th>Emp-ID</th>
                                    <th>Employee Name</th>
                                    <th>Action</th>



                                </tr>
                            </thead>

                            <tbody>
                                {filteredleaveData.length === 0 ? (
                                    <tr>
                                        <td colSpan="11" style={{ textAlign: 'center' }}>No search data found</td>
                                    </tr>
                                ) : (
                                    filteredleaveData.map((row, index) => {
                                        const serialNumber = currentPage * itemsPerPage + index + 1;
                                        return (
                                            <tr key={row.id}>
                                                <td>{serialNumber}</td>
                                                <td>{row.hrms_emp_id}</td>
                                                <td>{row.employee_name}</td>
                                                <td style={{display:'flex', gap:'10px'}}>

                                                    <Button onClick={() => handlemissedleave(row.id)} >
                                                        Leave
                                                    </Button>
                                                    <Button onClick={() => handlemissedabsent(row.id)}>
                                                        Absent
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ---------------------------------------------------------------------------------------------------- */}

                    {/* Missed Count */}
                    <Modal show={isTimeOff} onHide={handleCloseIsTimeOff}>
                        <Modal.Header closeButton>
                            <Modal.Title>Missed Count</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Form onSubmit={handleSubmitTimeoff}>


                                <Form.Group controlId="department" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Department<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="department"
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        disabled
                                    >
                                        <option value="">Select a department</option>
                                        {departments.map((option) => (
                                            <option key={option.id} value={option.id}>{option.role_name}</option>
                                        ))}
                                    </Form.Control>
                                    {formErrors.selectedDepartment && <span className="text-danger">{formErrors.selectedDepartment}</span>}
                                </Form.Group>


                                <Form.Group controlId="empName" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Member<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="empName"
                                        value={selectedMember}
                                        onChange={(e) => setSelectedMember(e.target.value)}
                                        disabled
                                    >
                                        <option value="">Select a member</option>
                                        {members.map((option) => (
                                            <option key={option.emp_id} value={option.emp_id}>{option.emp_name}</option>
                                        ))}
                                    </Form.Control>
                                    {formErrors.selectedMember && <span className="text-danger">{formErrors.selectedMember}</span>}
                                </Form.Group>

                                <Form.Group controlId="selectCategory" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Type<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="selectCategory"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {isLeave.map((option) => (
                                            <option key={option.id} value={option.id}>{option.leave_type_name}</option>
                                        ))}
                                    </Form.Control>
                                    {formErrors.category && <span className="text-danger">{formErrors.category}</span>}
                                </Form.Group>


                                <Form.Group controlId="selectType" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Category<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="selectType"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        disabled
                                    >
                                        {isCategory.map((option) => (
                                            <option key={option.id} value={option.id}>{option.leave_category_name}</option>
                                        ))}
                                    </Form.Control>
                                    {formErrors.type && <span className="text-danger">{formErrors.type}</span>}
                                </Form.Group>

                                {/* {type == 2 || type == 3 ?
                                    <div className='mb-2'>
                                        <div style={{ marginRight: "10px", width: "100%" }}>
                                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Date<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="date"
                                                max="9999-12-31"
                                                value={permissionFromDate}
                                                onChange={(e) => setPermissionFromDate(e.target.value)}
                                                
                                            />
                                            {formErrors.permissionFromDate && <span className="text-danger">{formErrors.permissionFromDate}</span>}
                                        </div>


                                        <div className='mb-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Form.Group controlId="request_fromtime" style={{ width: '48%' }}>
                                                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>From Time<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                                <Form.Control
                                                    type="time"
                                                    name="request_fromtime"
                                                    value={fromTime}
                                                    onChange={(e) => setFromTime(e.target.value)}
                                                    

                                                />
                                                {formErrors.fromTime && <span className="text-danger">{formErrors.fromTime}</span>}
                                            </Form.Group>

                                            <Form.Group controlId="request_totime" style={{ width: '48%' }}>
                                                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>To Time<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                                <Form.Control
                                                    type="time"
                                                    name="request_totime"
                                                    value={toTime}
                                                    onChange={(e) => setToTime(e.target.value)}

                                                />
                                                {formErrors.toTime && <span className="text-danger">{formErrors.toTime}</span>}
                                                {formErrors.noactiveshift && <span className="text-danger">{formErrors.noactiveshift}</span>}
                                            </Form.Group>
                                        </div>
                                    </div> : null} */}


                                {type == 1 || type == 4 ?
                                    <div className='mb-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ marginRight: "10px", width: "50%" }}>
                                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>From Date<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="date"
                                                max="9999-12-31"
                                                value={fromDate}
                                                onChange={(e) => setFromDate(e.target.value)}
                                                disabled
                                            />
                                            {formErrors.fromDate && <span className="text-danger">{formErrors.fromDate}</span>}
                                        </div>

                                        <div style={{ marginRight: "10px", width: "50%" }}>
                                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>To Date<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="date"
                                                max="9999-12-31"
                                                value={toDate}
                                                onChange={(e) => setToDate(e.target.value)}
                                                disabled
                                            />
                                            {formErrors.toDate && <span className="text-danger">{formErrors.toDate}</span>}
                                            {formErrors.noactiveshift && <span className="text-danger">{formErrors.noactiveshift}</span>}
                                        </div>
                                    </div>
                                    : null}

                                <Form.Group controlId="reason" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Reason<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="reason"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    {formErrors.reason && <span className="text-danger">{formErrors.reason}</span>}
                                </Form.Group>

                                <Form.Group controlId="attachment" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Attachment:</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="attachment"
                                        onChange={(e) => setAttachment(e.target.files[0])}
                                    />
                                </Form.Group>

                                <div style={{ paddingTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="secondary" onClick={handleCloseIsTimeOff}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit" style={{ marginLeft: '10px' }}>
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    {/* ---------------------------------------------------------------------------------------------------- */}



                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <ReactPaginate
                            previousLabel={<span aria-hidden="true">&laquo;</span>}
                            nextLabel={<span aria-hidden="true">&raquo;</span>}
                            breakLabel={<span>...</span>}
                            breakClassName={'page-item disabled'}
                            breakLinkClassName={'page-link'}
                            pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            disabledClassName={'disabled'}
                            activeLinkClassName={'bg-dark text-white'}
                        />
                    </div>

                    {/* ------------------------------------------------------------------------------------------------ */}


                </Container>


            )}
        </>



    )
}

export default MissedCount