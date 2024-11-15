import React, { useEffect, useState } from 'react';
import '../css/Hrsupportstyles.css';
import Ontime from '../../../assets/admin/assets/img/Dashboard/leave.png';
import employee from '../../../assets/admin/assets/img/Dashboard/employee.png';
import permission from "../../../assets/admin/assets/img/Dashboard/absent.png";
import slow from "../../../assets/admin/assets/img/Dashboard/late.png";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarOfLife } from '@fortawesome/free-solid-svg-icons';


export default function ApprovalRequest() {
    // ----------------------------------------------------------------------------------------------------
    // Redirect to the Request page

    const navigate = useNavigate();

    const handleVisitattendancetable = () => {
        navigate('/admin/attendancerequest');
    };

    const handleVisitleavetable = () => {
        navigate('/admin/leaverequest');
    };

    const handleVisitpermissiontable = () => {
        navigate('/admin/permissionrequest');
    };

    const handleVisithalfdaytable = () => {
        navigate('/admin/halfdayrequest');
    };

    const handleVisitOTtable = () => {
        navigate('/admin/overtimerequest');
    };

    const dataBoxStyle = {
        cursor: 'pointer',
    };

    // ----------------------------------------------------------------------------------------------------


    // ----------------------------------------------------------------------------------------------------
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userrole = userData?.userrole || '';
    const userempid = userData?.userempid || '';

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


    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------

    // leave / permission/ half day popup open

    const [isTimeOff, setIsTimeOff] = useState(false)

    const openIsTimeOff = () => {
        setIsTimeOff(true);
    };

    const handleCloseIsTimeOff = () => {

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
        setAttachment(null);
        setFormErrors({});
        setIsTimeOff(false);
    }


    // ----------------------------------------------------------------------------------------------------\


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
    // Attendance type

    const [isAttendancetype, setIsAttendancetype] = useState([{ "id": "0", "attendance_type_name": "Select Type" }]);
    const [selectedattendancetype, setSelectedattendancetype] = useState('');


    useEffect(() => {
        const apiUrl = 'https://epkgroup.in/crm/api/public/api/attendance_type_list';
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                console.log("---------------->", data)
                setIsAttendancetype([{ "id": "0", "attendance_type_name": "Select Type" }, ...data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // Attendance Location

    const [isAttendancelocation, setIsAttendancelocation] = useState([{ "id": "0", "attendance_location_name": "Select location" }]);
    const [selectedattendancelocation, setSelectedattendancelocation] = useState('');


    useEffect(() => {
        const apiUrl = 'https://epkgroup.in/crm/api/public/api/attendance_location_list';
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                console.log("---------------->", data)
                setIsAttendancelocation([{ "id": "0", "attendance_location_name": "Select location" }, ...data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // Attendance shift

    const [isShift, setIsShift] = useState([{ "id": "0", "shift_slot": "Select Shift" }]);
    // const [selectedshift, setSelectedshift] = useState('');


    useEffect(() => {
        const apiUrl = 'https://epkgroup.in/crm/api/public/api/shiftslotlist';
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                console.log("---------------->", data)
                setIsShift([{ "id": "0", "shift_slot": "Select Shift" }, ...data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // Overtime type

    const [isOverTimetype, setIsOverTimetype] = useState([{ "id": "0", "ot_type_name": "Select Type" }]);
    const [selectedoverTimetype, setSelectedoverTimetype] = useState('');


    useEffect(() => {
        const apiUrl = 'https://epkgroup.in/crm/api/public/api/overtime_type_list';
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                console.log("---------------->", data)
                setIsOverTimetype([{ "id": "0", "ot_type_name": "Select Type" }, ...data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    // ----------------------------------------------------------------------------------------------------



    // Add leave/permission/offday submit

    const submitData = async () => {


        const formData = new FormData();

        const fromTimeUpdated = `${fromTime}:00`;
        const toTimeUpdated = `${toTime}:00`;

        // Appending form data
        formData.append('emp_id', selectedMember);
        formData.append('hr_id', userData.userempid);
        formData.append('slot_id', shiftInfo);
        formData.append('request_type', type);
        formData.append('request_category', category);


        formData.append('from_date', fromDate);
        formData.append('to_date', toDate);
        formData.append('permission_date', permissionFromDate);
        formData.append('permission_timefrom', fromTimeUpdated);
        formData.append('permission_timeto', toTimeUpdated);
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
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: `${data.message}`,
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
    const [formErrors, setFormErrors] = useState({});
    const handleSubmitTimeoff = (e) => {
        e.preventDefault();

        const errors = {};



        if (!selectedMember) {
            errors.selectedMember = 'Member is required.';
        }
        if (!selectedDepartment) {
            errors.selectedDepartment = 'Department is required.';
        }

        if (!category) {
            errors.category = 'Type is required.';
        }

        if (!type) {
            errors.type = 'Category is required.';
        }
        if (!fromDate && (type === '1' || type === '4')) {
            errors.fromDate = 'From Date is required.';
        }
        if (!toDate && (type === '1' || type === '4')) {
            errors.toDate = 'To Date is required.';
        }
        if (!permissionFromDate && (type === '2' || type === '3')) {
            errors.permissionFromDate = 'Permission Date is required.';
        }
        if (!fromTime && (type === '2' || type === '3')) {
            errors.fromTime = 'From Time is required.';
        }
        if (!toTime && (type === '2' || type === '3')) {
            errors.toTime = 'To Time  is required.';
        }

        if (!reason) {
            errors.reason = 'Reason is required.';
        }

        if (noactiveshift !== 'General') {
            errors.noactiveshift = noactiveshift;
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        // Validating the required fields
        // if (!type || !category ||
        //     (!fromDate && type === '1') ||
        //     (!toDate && type === '1') ||
        //     (!permissionFromDate && (type === '2' || type === '3')) ||
        //     (!fromTime && (type === '2' || type === '3')) ||
        //     (!toTime && (type === '2' || type === '3')) || !reason) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: `Fill all details`,
        //     });
        //     return;
        // }

        submitData();
    };

    // ----------------------------------------------------------------------------------------------------



    // ----------------------------------------------------------------------------------------------------

    // Add Attendance
    const [formData, setFormData] = useState({
        emp_id: userempid,
        request_date: "",
        request_fromtime: "",
        request_totime: "",
        attendance_reason: "",

    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const [isAttendance, setIsAttendance] = useState(false);

    const handleopenAttendance = () => {
        setIsAttendance(true);
    };

    const handleCloseAttendance = () => {

        setSelectedDepartment('');
        setSelectedMember('');
        setSelectedattendancetype('');
        setSelectedattendancelocation('');
        // setSelectedshift('');
        setFormData({
            ...formData,
            request_date: "",
            request_fromtime: "",
            request_totime: "",
            attendance_reason: ""
        });

        setFormErrors({});

        setIsAttendance(false);
    };

    // Add Attendance submit

    const handleSubmitAttendance = async (e) => {
        e.preventDefault();

        const errors = {};



        if (!selectedMember) {
            errors.selectedMember = 'Member is required.';
        }
        if (!selectedDepartment) {
            errors.selectedDepartment = 'Department is required.';
        }

        if (!selectedattendancetype) {
            errors.selectedattendancetype = 'Type is required.';
        }

        if (!selectedattendancelocation) {
            errors.selectedattendancelocation = 'Location is required.';
        }
        // if (!selectedshift) {
        //     errors.selectedshift = 'Shift is required.';
        // }
        if (!formData.request_date) {
            errors.request_date = 'Date is required.';
        }

        if (!formData.request_fromtime && selectedattendancetype != 3) {
            errors.request_fromtime = 'From Time  is required.';
        }

        if (!formData.request_totime && selectedattendancetype != 2) {
            errors.request_totime = 'To Time  is required.';
        }


        if (!formData.attendance_reason) {
            errors.attendance_reason = 'Reason is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});


        // Validate required fields
        // if (!selectedMember || !formData.request_date || !formData.request_fromtime) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: 'Please fill in all the required fields.',
        //     });
        //     return;
        // }

        // Set default value "00:00:00" for request_totime if not selected
        const request_fromtimeUpdated = formData.request_fromtime ? `${formData.request_fromtime}:00` : '00:00:00';
        const request_totimeUpdated = formData.request_totime ? `${formData.request_totime}:00` : '00:00:00';

        const formDataToSend = new FormData();
        formDataToSend.append('emp_id', selectedMember);
        formDataToSend.append('hr_id', userData.userempid);
        formDataToSend.append('request_date', formData.request_date);
        formDataToSend.append('request_fromtime', request_fromtimeUpdated);
        formDataToSend.append('request_totime', request_totimeUpdated);
        formDataToSend.append('request_type', selectedattendancetype);
        formDataToSend.append('request_location', selectedattendancelocation);
        // formDataToSend.append('shiftslot_id', selectedshift);
        formDataToSend.append('request_reason', formData.attendance_reason);

        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/add_attendancemenualentry', {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            const result = await response.json();

            if (response.ok && result.status === "success") {
                setIsTimeOff(false);

                setSelectedDepartment('');
                setSelectedMember('');
                setSelectedattendancetype('');
                setSelectedattendancelocation('');
                //setSelectedshift('');
                setFormData({
                    ...formData,
                    request_date: "",
                    request_fromtime: "",
                    request_totime: "",
                    attendance_reason: ""
                });

                setFormErrors({});

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: result.message || 'Form submitted successfully',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message || 'Failed to submit form',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error submitting form. Please try again later.',
            });
        }
    };


    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------

    // Add Overtime

    const [formDataOT, setFormDataOT] = useState({
        emp_id: userempid,
        request_date: "",
        request_fromtime: "",
        request_totime: "",
        attendance_reason: "",

    });

    const handleInputChangeOT = (e) => {
        const { name, value } = e.target;
        setFormDataOT({ ...formDataOT, [name]: value });
    };


    const [isOverTime, setIsOverTime] = useState(false);

    const handleopenOverTime = () => {
        setIsOverTime(true);
    };

    const handleCloseOverTime = () => {
        setIsOverTime(false);
        setSelectedDepartment('');
        setSelectedMember('');
        setSelectedoverTimetype('')
        setSelectedattendancelocation('')
        //   setSelectedshift('')
        setFormDataOT({
            ...formDataOT,
            request_date: "",
            request_fromtime: "",
            request_totime: "",
            attendance_reason: "",
        });
    };

    // Add Attendance submit

    const handleSubmitOverTime = async (e) => {
        e.preventDefault();

        const errors = {};



        if (!selectedMember) {
            errors.selectedMember = 'Member is required.';
        }
        if (!selectedDepartment) {
            errors.selectedDepartment = 'Department is required.';
        }

        if (!selectedoverTimetype) {
            errors.selectedoverTimetype = 'Type is required.';
        }

        if (!selectedattendancelocation) {
            errors.selectedattendancelocation = 'Location is required.';
        }
        // if (!selectedshift) {
        //     errors.selectedshift = 'Shift is required.';
        // }
        if (!formDataOT.request_date) {
            errors.request_date = 'Date is required.';
        }

        if (!formDataOT.request_fromtime) {
            errors.request_fromtime = 'From Time  is required.';
        }

        if (!formDataOT.request_totime) {
            errors.request_totime = 'To Time  is required.';
        }


        if (!formDataOT.attendance_reason) {
            errors.attendance_reason = 'Reason is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        // Validate required fields
        // if (!selectedMember || !formData.request_date || !formData.request_fromtime) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: 'Please fill in all the required fields.',
        //     });
        //     return;
        // }

        // Set default value "00:00:00" for request_totime if not selected
        const request_fromtimeUpdated = formDataOT.request_fromtime ? `${formDataOT.request_fromtime}:00` : '00:00:00';
        const request_totimeUpdated = formDataOT.request_totime ? `${formDataOT.request_totime}:00` : '00:00:00';

        const formDataToSend = new FormData();
        formDataToSend.append('emp_id', selectedMember);
        formDataToSend.append('hr_id', userData.userempid);
        formDataToSend.append('request_date', formDataOT.request_date);
        formDataToSend.append('request_fromtime', request_fromtimeUpdated);
        formDataToSend.append('request_totime', request_totimeUpdated);
        formDataToSend.append('reqhours_type', selectedoverTimetype);
        formDataToSend.append('request_location', selectedattendancelocation);
        //formDataToSend.append('shiftslot_id', selectedshift);
        formDataToSend.append('request_reason', formDataOT.attendance_reason);

        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/add_otmenualentry', {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            const result = await response.json();

            if (response.ok && result.status === "success") {
                setIsTimeOff(false);
                setFormData({
                    ...formData,
                    request_date: "",
                    request_fromtime: "",
                    request_totime: ""
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: result.message || 'Form submitted successfully',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message || 'Failed to submit form',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error submitting form. Please try again later.',
            });
        }
    };


    // ----------------------------------------------------------------------------------------------------

    const [shiftInfo, setShiftInfo] = useState(null);
    const [noactiveshift, setNoactiveshift] = useState('');
    const [error, setError] = useState(null);



    const checkShiftSlot = async () => {
        if (toDate || toTime) {
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
    }, [toDate, toTime]);

    // ----------------------------------------------------------------------------------------------------



    return (
        <div>


            <div className="approval-container">
                <h3 className="approval-title">Approval List</h3>
                <>
                    {(userrole === "1" || userrole === "2") && (
                        <div className="button-group">
                            <Button onClick={openIsTimeOff}>
                                Add Leave / Permission / Half Day
                            </Button>
                            <Button onClick={handleopenAttendance}>
                                Add Attendance
                            </Button>
                            <Button onClick={handleopenOverTime}>
                                Add Overtime
                            </Button>
                        </div>
                    )}
                </>
            </div>



            {/* ---------------------------------------------------------------------------------------------------- */}

            {/* Add Leave / Permission / halfDay */}
            <Modal show={isTimeOff} onHide={handleCloseIsTimeOff}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Leave / Permission / halfDay</Modal.Title>
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
                            >
                                <option value="">Select a member</option>
                                {members.map((option) => (
                                    <option key={option.emp_id} value={option.emp_id}>{option.emp_name}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedMember && <span className="text-danger">{formErrors.selectedMember}</span>}
                        </Form.Group>

                        <Form.Group controlId="selectType" className='mb-2'>
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Category<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="select"
                                name="selectType"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                {isCategory.map((option) => (
                                    <option key={option.id} value={option.id}>{option.leave_category_name}</option>
                                ))}
                            </Form.Control>
                            {formErrors.type && <span className="text-danger">{formErrors.type}</span>}
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




                        {type == 2 || type == 3 ?
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
                            </div> : null}


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


            {/* ---------------------------------------------------------------------------------------------------- */}

            {/* Attendance */}
            <Modal show={isAttendance} onHide={handleCloseAttendance}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Attendance</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitAttendance}>


                        <Form.Group controlId="department" className='mb-2'>
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Department<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="select"
                                name="department"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
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
                            >
                                <option value="">Select a member</option>
                                {members.map((option) => (
                                    <option key={option.emp_id} value={option.emp_id}>{option.emp_name}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedMember && <span className="text-danger">{formErrors.selectedMember}</span>}
                        </Form.Group>


                        <Form.Group controlId="attendancetype" className='mb-2'>
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Type<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="select"
                                name="attendancetype"
                                value={selectedattendancetype}
                                onChange={(e) => setSelectedattendancetype(e.target.value)}
                            >
                                {isAttendancetype.map((option) => (
                                    <option key={option.id} value={option.id}>{option.attendance_type_name}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedattendancetype && <span className="text-danger">{formErrors.selectedattendancetype}</span>}
                        </Form.Group>


                        <Form.Group controlId="attendancelocation" className='mb-2'>
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Location<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="select"
                                name="attendancelocation"
                                value={selectedattendancelocation}
                                onChange={(e) => setSelectedattendancelocation(e.target.value)}
                            >
                                {isAttendancelocation.map((option) => (
                                    <option key={option.id} value={option.id}>{option.attendance_location_name}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedattendancelocation && <span className="text-danger">{formErrors.selectedattendancelocation}</span>}
                        </Form.Group>


                        {/* <Form.Group controlId="shift" className='mb-2'>
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Shift<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="select"
                                name="shift"
                                value={selectedshift}
                                onChange={(e) => setSelectedshift(e.target.value)}
                            >
                                {isShift.map((option) => (
                                    <option key={option.id} value={option.id}>{option.shift_slot}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedshift && <span className="text-danger">{formErrors.selectedshift}</span>}
                        </Form.Group> */}




                        <Form.Group controlId="request_date">
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Date<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="date"
                                name="request_date"
                                max="9999-12-31"
                                value={formData.request_date}
                                onChange={handleInputChange}
                            />
                            {formErrors.request_date && <span className="text-danger">{formErrors.request_date}</span>}
                        </Form.Group>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Group controlId="request_fromtime" style={{ width: '48%' }}>
                                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>From Time </Form.Label>
                                <Form.Control
                                    type="time"
                                    name="request_fromtime"
                                    value={formData.request_fromtime}
                                    onChange={handleInputChange}
                                    disabled={selectedattendancetype == '3'}
                                />
                                {formErrors.request_fromtime && <span className="text-danger">{formErrors.request_fromtime}</span>}
                            </Form.Group>

                            <Form.Group controlId="request_totime" style={{ width: '48%' }}>
                                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>To Time </Form.Label>
                                <Form.Control
                                    type="time"
                                    name="request_totime"
                                    value={formData.request_totime}
                                    onChange={handleInputChange}
                                    disabled={selectedattendancetype == '2'}
                                />
                                {formErrors.request_totime && <span className="text-danger">{formErrors.request_totime}</span>}
                            </Form.Group>
                        </div>

                        <Form.Group controlId="attendance_reason" className='mb-2'>
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Reason<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="attendance_reason"
                                value={formData.attendance_reason}
                                onChange={handleInputChange}
                            />
                            {formErrors.attendance_reason && <span className="text-danger">{formErrors.attendance_reason}</span>}
                        </Form.Group>


                        <div style={{ paddingTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="secondary" onClick={handleCloseAttendance}>
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

            {/* ---------------------------------------------------------------------------------------------------- */}

            {/* OverTime */}
            <Modal show={isOverTime} onHide={handleCloseOverTime}>
                <Modal.Header closeButton>
                    <Modal.Title>Add OverTime</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitOverTime}>


                        <Form.Group controlId="department" className='mb-2'>
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Department<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="select"
                                name="department"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
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
                            >
                                <option value="">Select a member</option>
                                {members.map((option) => (
                                    <option key={option.emp_id} value={option.emp_id}>{option.emp_name}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedMember && <span className="text-danger">{formErrors.selectedMember}</span>}
                        </Form.Group>


                        <Form.Group controlId="overtimetype" className='mb-2'>
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Type<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="select"
                                name="overtimetype"
                                value={selectedoverTimetype}
                                onChange={(e) => setSelectedoverTimetype(e.target.value)}
                            >
                                {isOverTimetype.map((option) => (
                                    <option key={option.id} value={option.id}>{option.ot_type_name}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedoverTimetype && <span className="text-danger">{formErrors.selectedoverTimetype}</span>}
                        </Form.Group>


                        <Form.Group controlId="attendancelocation" className='mb-2'>
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Location<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="select"
                                name="attendancelocation"
                                value={selectedattendancelocation}
                                onChange={(e) => setSelectedattendancelocation(e.target.value)}
                            >
                                {isAttendancelocation.map((option) => (
                                    <option key={option.id} value={option.id}>{option.attendance_location_name}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedattendancelocation && <span className="text-danger">{formErrors.selectedattendancelocation}</span>}
                        </Form.Group>


                        {/* <Form.Group controlId="shift" className='mb-2'>
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Shift<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="select"
                                name="shift"
                                value={selectedshift}
                                onChange={(e) => setSelectedshift(e.target.value)}
                            >
                                {isShift.map((option) => (
                                    <option key={option.id} value={option.id}>{option.shift_slot}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedshift && <span className="text-danger">{formErrors.selectedshift}</span>}
                        </Form.Group> */}




                        <Form.Group controlId="request_date">
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Date<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="date"
                                name="request_date"
                                max="9999-12-31"
                                value={formDataOT.request_date}
                                onChange={handleInputChangeOT}
                            />
                            {formErrors.request_date && <span className="text-danger">{formErrors.request_date}</span>}
                        </Form.Group>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Group controlId="request_fromtime" style={{ width: '48%' }}>
                                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>From Time<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control
                                    type="time"
                                    name="request_fromtime"
                                    value={formDataOT.request_fromtime}
                                    onChange={handleInputChangeOT}

                                />
                                {formErrors.request_fromtime && <span className="text-danger">{formErrors.request_fromtime}</span>}
                            </Form.Group>

                            <Form.Group controlId="request_totime" style={{ width: '48%' }}>
                                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>To Time<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control
                                    type="time"
                                    name="request_totime"
                                    value={formDataOT.request_totime}
                                    onChange={handleInputChangeOT}

                                />
                                {formErrors.request_totime && <span className="text-danger">{formErrors.request_totime}</span>}
                            </Form.Group>
                        </div>

                        <Form.Group controlId="attendance_reason" className='mb-2'>
                            <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Reason<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="attendance_reason"
                                value={formDataOT.attendance_reason}
                                onChange={handleInputChangeOT}
                            />
                            {formErrors.attendance_reason && <span className="text-danger">{formErrors.attendance_reason}</span>}
                        </Form.Group>


                        <div style={{ paddingTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="secondary" onClick={handleCloseOverTime}>
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


            {/* ---------------------------------------------------------------------------------------------------- */}
            <div className='Hrsupport-dashboard mb-5'>

                {/* Attendance Request */}
                <div className='data-box' onClick={handleVisitattendancetable} style={dataBoxStyle}>
                    <div className='box-content'>
                        <span>
                            <span className='img-alignment'>
                                <img src={Ontime} alt='employee' className='dash-img' />
                            </span>
                            <h4 className='dash-title'>Attendance Request</h4>
                            <h4 className='dash-values'></h4>
                        </span>
                    </div>
                </div>

                {/* Leave Request */}
                <div className='data-box' onClick={handleVisitleavetable} style={dataBoxStyle}>
                    <div className='box-content'>
                        <span>
                            <span className='img-alignment'>
                                <img src={employee} alt='Ontime' className='dash-img' />
                            </span>
                            <h4 className='dash-title'>Leave Request</h4>
                            <h4 className='dash-values'></h4>
                        </span>
                    </div>
                </div>

                {/* Permission Request */}
                <div className='data-box' onClick={handleVisitpermissiontable} style={dataBoxStyle}>
                    <div className='box-content'>
                        <span>
                            <span className='img-alignment'>
                                <img src={permission} alt='permission' className='dash-img' />
                            </span>
                            <h4 className='dash-title'>Permission Request</h4>
                            <h4 className='dash-values'></h4>
                        </span>
                    </div>
                </div>

                {/* Half Day Request */}
                <div className='data-box' onClick={handleVisithalfdaytable} style={dataBoxStyle}>
                    <div className='box-content'>
                        <span>
                            <span className='img-alignment'>
                                <img src={slow} alt='permission' className='dash-img' />
                            </span>
                            <h4 className='dash-title'>Half Day Request</h4>
                            <h4 className='dash-values'></h4>
                        </span>
                    </div>
                </div>

                {/* OT Request */}
                <div className='data-box' onClick={handleVisitOTtable} style={dataBoxStyle}>
                    <div className='box-content'>
                        <span>
                            <span className='img-alignment'>
                                <img src={slow} alt='permission' className='dash-img' />
                            </span>
                            <h4 className='dash-title'>OT Request</h4>
                            <h4 className='dash-values'></h4>
                        </span>
                    </div>
                </div>

            </div>

            {/* ---------------------------------------------------------------------------------------------------- */}

        </div>
    );
}