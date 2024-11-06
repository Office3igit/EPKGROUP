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
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen } from '@fortawesome/free-solid-svg-icons';
import { faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function DailyAttendance() {

    // const navigate = useNavigate();
    // const GoToEditPage = (id) => {
    //     navigate(`/admin/edirdailyattendance/${id}`);
    // };
    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';




    // ------------------------------------------------------------------------------------------------
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // Get the current date and format it as YYYY-MM-DD
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setCurrentDate(formattedDate);
    }, []);
    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [refreshKey, setRefreshKey] = useState(0);
    const [formErrors, setFormErrors] = useState({});


    const [tableData, setTableData] = useState([]);

    const [person, setPerson] = useState('');

    const [category, setCategory] = useState('');
    const [type, setType] = useState('');

    const [fromDate, setFromDate] = useState('');
    // const [fromDate, setFromDate] = useState(() => {
    //     const today = new Date();
    //     const day = String(today.getDate()).padStart(2, '0');    // Get day and pad with leading zero if needed
    //     const month = String(today.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so add 1) and pad with zero
    //     const year = today.getFullYear();                        // Get full four-digit year
    //     return `${day}-${month}-${year}`;                        // Format: dd-mm-YYYY
    // });

    // console.log(fromDate);

    // // Function to format only the date part from datetime string
    // const formatDate = (dateTimeString) => {
    //     const datePart = dateTimeString.split(' ')[0];  // Extract the date portion (YYYY-MM-DD)
    //     const [year, month, day] = datePart.split('-'); // Split the date into year, month, and day
    //     return `${day}-${month}-${year}`;              // Format as dd-mm-YYYY
    // };


    // const today = new Date().toISOString().split('T')[0];

    //const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Initialize with today's date

    // const [toDate, setToDate] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');

    const [isTimeOff, setIsTimeOff] = useState(false)

    useEffect(() => {
        if (currentDate) {
            fetchData();
        }
    }, [refreshKey, currentDate]); // Ensure refreshKey is defined in parent and changes to trigger re-fetch

    const fetchData = async () => {
        setLoading(true); // Ensure loading is set before fetching
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/get_dailyAttendanceList', {
                method: 'POST', // Set the method to POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                },
                body: JSON.stringify({
                    roleid: userrole,
                    loginempid: userempid,
                    dailydate: currentDate,
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                //  console.log("setTableData", responseData.data)

                setLoading(false);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    // ----------------------------------------------------------------------------------------------------

    const handlemissedleave = (id) => {
        setIsTimeOff(true);
        setMissedcounuserid(id)
        // setType('1')
        setFromDate(fromDate)
        // setToDate(today)
        setFormErrors({});
    };
    const handleCloseIsTimeOff = () => {
        setCategory('');
        setType('');
        setIsTimeOff(false);
    }

    // ------------------------------------------------------------------------------------------------
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
            const response = await fetch(`https://epkgroup.in/crm/api/public/api/attendance_edit_listview/${missedcounuserid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.status === 'success') {
                    console.log("fetchindividualuserData", responseData.data.emp_role);

                    setSelectedDepartment(responseData.data.emp_role);
                    setSelectedMember(responseData.data.emp_id);
                    // setFromDate(responseData.data.checkin_time);
                    setFromDate(responseData.data.checkin_date);
                    setFromTime(responseData.data.checkin_time);
                    setToTime(responseData.data.checkout_time);
                    console.log("selectedMember----------------->", responseData.data.emp_id)
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
                // console.log("Fetched department data:", data);
                setDepartments(data);
            } catch (error) {
                console.error('Error fetching user roles:', error);
            }
        };

        fetchDepartments();
    }, [usertoken]);

    //console.log("selectedDepartment", selectedDepartment)

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
                    // console.log("Fetched supervisor list:", data);
                    setMembers(data);
                } catch (error) {
                    console.error('Error fetching members:', error);
                }
            };

            fetchMembers();
        }
    }, [selectedDepartment, usertoken]);

    // console.log("members", members)


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
                //console.log("response.data.data", response.data.data)
                setIsCategory([{ "id": "", "leave_category_name": "Select Category" }, { "id": "0", "leave_category_name": "Attendance" }, ...data]);
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

    // const [shiftInfo, setShiftInfo] = useState(null);
    // const [noactiveshift, setNoactiveshift] = useState('');
    // const [error, setError] = useState(null);


    // ------------------------------------------------------------------------------------------------
    const submitData = async () => {
        const errors = {};
        let fromTimeUpdated, toTimeUpdated, categorydata;

        // Check if 'type' is provided
        if (!type) {
            errors.type = 'Category is required';
        }

        // Check if 'category' is required based on 'type'
        if (['1', '2', '3', '4'].includes(type) && !category) {
            errors.category = 'Type is required';
        }

        // Check if 'fromTime' and 'toTime' are required based on 'type'
        if (type !== '1' && type !== '4') {
            if (!fromTime) {
                errors.fromTime = 'Check-In Time is required';
            }
            if (!toTime) {
                errors.toTime = 'Check-Out Time is required';
            }

            fromTimeUpdated = `${fromTime}`;
            toTimeUpdated = `${toTime}`;
        } else {
            fromTimeUpdated = '';
            toTimeUpdated = '';
        }

        // Check if there are any validation errors
        if (Object.keys(errors).length > 0) {
            // Collect all error messages to display in Swal alert
            const errorMessages = Object.values(errors).join('\n');

            // Show error alert with all validation messages
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: errorMessages,
            });
            return; // Stop further execution if there are validation errors
        }

        // If no validation errors, proceed with processing the form
        if (type === '0') {
            categorydata = '0';
        } else {
            categorydata = category;
        }

        const payload = {
            id: String(missedcounuserid),
            category: String(categorydata),
            type: String(type),
            check_intime: String(fromTimeUpdated),
            check_outtime: String(toTimeUpdated),
            updated_by: String(userempid)
        };

        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/dailyattendance_update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();

                if (data.status === 'success') {
                    // Clear the form fields upon successful submission
                    setCategory('');
                    setType('');
                    setFromTime('');
                    setToTime('');
                    setRefreshKey(prevKey => prevKey + 1);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: `Attendance Updated Successfully.`,
                    });
                    setIsTimeOff(false);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `${data.message || 'Unknown error'}`,
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
                text: `${error.message || 'Unknown error'}`,
            });
        }
    };


    // const [noactiveshift, setNoactiveshift] = useState('');
    const handleSubmitTimeoff = (e) => {
        e.preventDefault();

        const errors = {};

        // if (noactiveshift !== 'General') {
        //     errors.noactiveshift = noactiveshift;
        // }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});



        submitData();
    };


    // ========================================
    // pagination, search, print state

    const itemsPerPage = 10;
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
        const csvData = tableData.map(({ hrms_emp_id, first_name, department_name, role_name, checkin_date, checkin_time, checkout_time, emp_present, emp_late, emp_permission, emp_onduty, checkout_total_hours }, index) => ({
            '#': index + 1,
            hrms_emp_id,
            first_name,
            department_name,
            role_name,
            checkin_date,
            checkin_time,
            checkout_time,
            emp_present,
            emp_late,
            emp_permission,
            emp_onduty,
            checkout_total_hours,
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Emp-ID', key: 'hrms_emp_id' },
            { label: 'Employee Name', key: 'first_name' },
            { label: 'Department', key: 'department_name' },
            { label: 'Role', key: 'role_name' },
            { label: 'Date', key: 'checkin_date' },
            { label: 'In Time', key: 'checkin_time' },
            { label: 'Out Time', key: 'checkout_time' },
            { label: 'P/A/L/HL', key: 'emp_present' },
            { label: 'LA', key: 'emp_late' },
            { label: 'PR', key: 'emp_permission' },
            { label: 'OT', key: 'emp_onduty' },
            { label: 'Total Hours', key: 'checkout_total_hours' },

        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'DailyAttendance.csv',
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

        const data = tableData.map(({ hrms_emp_id,first_name, department_name,role_name,checkin_date, checkin_time, checkout_time, emp_present, emp_late, emp_permission, emp_onduty, checkout_total_hours }, index) => [
            index + 1,
            hrms_emp_id,
            first_name,
            department_name,
            role_name,
            checkin_date,
            checkin_time,
            checkout_time,
            emp_present,
            emp_late,
            emp_permission,
            emp_onduty,
            checkout_total_hours,

        ]);

        doc.autoTable({
            head: [['S.No', 'Emp-ID','Employee Name', 'Department', 'Role', 'Date', 'In Time', 'Out Time', 'P/A/L/HL', 'LA', 'PR', 'OT', 'Total Hours']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('DailyAttendance.pdf');

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





    return (
        <>

            <style>
                {`
@media print {
.no-print {
display: none !important;
}
}
`}
            </style>

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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Daily Attendance</h3>



                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}

                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap: 'wrap', gap: '17px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {['1', '2'].includes(userrole) &&
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={myStyles1}
                                />
                            }
                            <input
                                type="date"
                                style={myStyles1}
                                value={currentDate}
                                onChange={(e) => setCurrentDate(e.target.value)}
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
                                    <th>Department </th>
                                    <th>Role </th>
                                    <th>Date</th>
                                    <th>In time</th>
                                    <th>Out Time</th>
                                    <th>P/A/L/HL</th>
                                    <th>LA</th>
                                    <th>PR</th>
                                    <th>OT</th>
                                    <th>Total Hours</th>
                                    {(userrole.includes('1')) && (<th className='no-print'>Action</th>)}

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
                                                <td>{row.first_name}</td>
                                                <td>{row.department_name}</td>
                                                <td>{row.role_name}</td>
                                                <td>{row.checkin_date}</td>
                                                <td>{row.checkin_time}</td>
                                                <td>{row.checkout_time}</td>
                                                <td>{row.emp_present}</td>
                                                <td>{row.emp_late}</td>
                                                <td>{row.emp_permission}</td>
                                                <td>{row.emp_onduty}</td>
                                                <td>{row.checkout_total_hours}</td>
                                                <td className='no-print'>
                                                    {(userrole.includes('1')) && (
                                                        <>
                                                            <span style={{ display: 'flex', gap: '5px' }}>
                                                                <button
                                                                    className="btn-edit"
                                                                    onClick={() => { handlemissedleave(row.attendance_id) }}
                                                                    disabled={row.checkin_date === null} // Disable button if checkin_date is null
                                                                    style={{
                                                                        cursor: row.checkin_date === null ? 'not-allowed' : 'pointer',
                                                                        opacity: row.checkin_date === null ? 0.5 : 1
                                                                    }} // Apply styles to visually indicate disabled state
                                                                >
                                                                    <FontAwesomeIcon icon={faPen} /> Edit
                                                                </button>
                                                            </span>
                                                        </>
                                                    )}
                                                </td>




                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>


                    {/* Missed Count */}
                    <Modal show={isTimeOff} onHide={handleCloseIsTimeOff}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Daily Attendance</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Form onSubmit={handleSubmitTimeoff}>
                                <Form.Group controlId="department" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}> Role<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="department"
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        disabled
                                    >
                                        <option value="">Select a role</option>
                                        {departments.map((option) => (
                                            <option key={option.id} value={option.id}>{option.role_name}</option>
                                        ))}
                                    </Form.Control>

                                </Form.Group>


                                <Form.Group controlId="empName" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}> Employee Name<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="empName"
                                        value={selectedMember}
                                        onChange={(e) => setSelectedMember(e.target.value)}
                                        disabled
                                    >
                                        <option value="">Select a employee</option>
                                        {members.map((option) => (
                                            <option key={option.emp_id} value={option.emp_id}>{option.emp_name}</option>
                                        ))}
                                    </Form.Control>

                                </Form.Group>


                                <Form.Group controlId="empName" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}> Date<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        max="9999-12-31"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group controlId="selectType" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>
                                        Select Category
                                        <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="selectType"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        {/* Add default value for Attendance Check-in */}


                                        {/* Map through existing categories */}
                                        {isCategory.map((option) => (
                                            <option key={option.id} value={option.id}>{option.leave_category_name}</option>
                                        ))}
                                    </Form.Control>

                                    {/* Display error message if there's a form error */}
                                    {formErrors.type && <span className="text-danger">{formErrors.type}</span>}
                                </Form.Group>
                                {type != 0 ?
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

                                    : null}

                                {type == 2 || type == 3 || type == 0 ?
                                    <div className='mb-2'>


                                        <div className='mb-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Form.Group controlId="request_fromtime" style={{ width: '48%' }}>
                                                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Check-In Time<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                                <Form.Control
                                                    type="time"
                                                    name="check_intime"
                                                    value={fromTime}
                                                    onChange={(e) => setFromTime(e.target.value)}


                                                />
                                                {formErrors.fromTime && <span className="text-danger">{formErrors.fromTime}</span>}
                                            </Form.Group>

                                            <Form.Group controlId="request_totime" style={{ width: '48%' }}>
                                                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Check-Out Time<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                                <Form.Control
                                                    type="time"
                                                    name="check_outtime"
                                                    value={toTime}
                                                    onChange={(e) => setToTime(e.target.value)}

                                                />
                                                {formErrors.toTime && <span className="text-danger">{formErrors.toTime}</span>}
                                                {formErrors.noactiveshift && <span className="text-danger">{formErrors.noactiveshift}</span>}

                                            </Form.Group>
                                        </div>
                                    </div> : null}


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

export default DailyAttendance