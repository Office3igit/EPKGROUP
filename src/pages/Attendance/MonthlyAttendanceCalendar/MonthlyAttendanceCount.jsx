import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Table } from "react-bootstrap";
import Swal from 'sweetalert2';

function MonthlyAttendanceCount(props) {

  const events = props.events

  // ------------------------------------------------------------------------------------------------
  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));

  const usertoken = userData?.token || '';
  const userempid = userData?.userempid || '';
  const userrole = userData?.userrole || '';
  const username = userData?.username || '';
  const useremail = userData?.useremail || '';
  // ------------------------------------------------------------------------------------------------


  // ------------------------------------------------------------------------------------------------
  // total counts list 
  const currentDate = new Date(props.formattedCenterDate);
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);


  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.start);
    return eventDate >= startDate && eventDate <= endDate;
  });

  // Initialize counts for titles, permission, and late
  const titleCounts = {
    Present: 0,
    Absent: 0,
    Leave: 0,
    "On Duty": 0,
    Overtime: 0,
  };

  let permissionCount = 0;
  let lateCount = 0;
  let halfDayCount = 0;
  let AbsentCount = 0;
  let LeaveCount = 0;


  filteredEvents.forEach((event) => {
    const { title, permission, late, HalfDay, Absent, Leave } = event;
    titleCounts[title]++;

    if (permission) {
      permissionCount++;
    }

    if (late) {
      lateCount++;
    }

    if (HalfDay) {
      halfDayCount++;
    }

    if (Absent) {
      AbsentCount++;
    }

    if (Leave) {
      LeaveCount++;
    }

  });

  // ------------------------------------------------------------------------------------------------

  // =================================== ATTENDANCE REQUEST START ===================================

  // ------------------------------------------------------------------------------------------------


  const [isAttendanceRequestOpen, setIsAttendanceRequestOpen] = useState(false);

  const handleApplyAttendance = () => {
    setIsAttendanceRequestOpen(true);
  };

  const handleCloseAttendance = () => {
    setIsAttendanceRequestOpen(false);
  };


  // ------------------------------------------------------------------------------------------------
  // type dropdown
  const [attendancerequestTypes, setAttendanceRequestTypes] = useState([]);
  const [selectedattendancetype, setSelectedattendancetype] = useState('');

  useEffect(() => {
    // Fetch request types
    fetch('https://epkgroup.in/crm/api/public/api/attendance_type_list', {
      headers: {
        'Authorization': `Bearer ${usertoken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        // console.log("Fetched request types:", data);
        setAttendanceRequestTypes(data.data);
      })
      .catch(error => console.error("Error fetching request types:", error));
  }, []);
  // ------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------
  // location dropdown
  const [attendanceLocations, setAttendanceLocations] = useState([]);

  useEffect(() => {
    // Fetch locations
    fetch('https://epkgroup.in/crm/api/public/api/attendance_location_list', {
      headers: {
        'Authorization': `Bearer ${usertoken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        // console.log("Fetched location types:", data);
        setAttendanceLocations(data.data);
      })
      .catch(error => console.error("Error fetching locations:", error));
  }, []);

  // ------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------
  // Attendance shift

  const [isShift, setIsShift] = useState([{ "id": "0", "shift_slot": "Select Shift" }]);
  const [selectedshift, setSelectedshift] = useState('');

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
  // Attendance request state manage

  const [formData, setFormData] = useState({
    emp_id: userempid,
    emp_name: username,
    emp_email: useremail,
    request_type: "",
    request_location: "",
    request_date: "",
    request_fromtime: "",
    request_totime: "",
    request_reason: "",
  });

  const [formErrors, setFormErrors] = useState({
    emp_id: userempid,
    emp_name: username,
    emp_email: useremail,
    request_type: "",
    request_location: "",
    request_shift: "",
    request_date: "",
    request_fromtime: "",
    request_totime: "",
    request_reason: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  // ----------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!selectedattendancetype) {
      errors.request_type = 'Request type required';
    }

    if (!formData.request_location) {
      errors.request_location = 'Request Location required';
    }

    // if (!selectedshift) {
    //   errors.request_shift = 'Request Shift required';
    // }

    if (!formData.request_date) {
      errors.request_date = 'Request Date required';
    }

    if (!formData.request_fromtime && selectedattendancetype !== '3') {
      errors.request_fromtime = 'Request fromTime required';
    }

    if (!formData.request_totime && selectedattendancetype !== '2') {
      errors.request_totime = 'Request toTime required';
    }

    if (!formData.request_reason) {
      errors.request_reason = 'Request Reason required';
    }



    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Clear form errors if there are no errors
    setFormErrors({});


    const request_fromtimeUpdated = formData.request_fromtime ? `${formData.request_fromtime}:00` : '00:00:00';
    const request_totimeUpdated = formData.request_totime ? `${formData.request_totime}:00` : '00:00:00';

    const formDataToSend = new FormData();

    formDataToSend.append('emp_id', formData.emp_id);
    formDataToSend.append('emp_name', formData.emp_name);
    formDataToSend.append('emp_email', formData.emp_email);
    formDataToSend.append('request_type', selectedattendancetype);
    formDataToSend.append('request_location', formData.request_location);
    formDataToSend.append('request_date', formData.request_date);
    formDataToSend.append('request_fromtime', request_fromtimeUpdated);
    formDataToSend.append('request_totime', request_totimeUpdated);
    formDataToSend.append('request_reason', formData.request_reason);
  //  formDataToSend.append('shift_slot', selectedshift);

    try {
      const response = await fetch('https://epkgroup.in/crm/api/public/api/add_employee_attendance_request', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${usertoken}`
        }
      });

      if (response.ok) {
        const data = await response.json(); // Parse JSON response

        if (data.status === "success") {
          setIsAttendanceRequestOpen(false);
          setFormData({
            ...formData,
            request_location: "",
            request_date: "",
            request_fromtime: "",
            request_totime: "",
            request_reason: ""
          });
          setSelectedattendancetype('');
          setSelectedshift('');

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message, // Display success message from API
          });
        } else {
          console.error("Failed to submit form");

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message,
          });
        }
      } else {
        console.error("Failed to submit form");

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to submit form',
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error submitting form. Please try again later.',
      });
    }
  };


  // ----------------------------------------------------------------------------------------------------

  // =================================== ATTENDANCE REQUEST END =======================================




  // ========================== LEAVE / HALD DAY /PERMISSION REQUEST START ===============================

  // ----------------------------------------------------------------------------------------------------
  const [IsTimeOffOpen, setIsTimeOffOpen] = useState(false);

  const openTimeOff = () => {
    setIsTimeOffOpen(true);
  };

  const closeTimeOff = () => {
    setIsTimeOffOpen(false);
  };

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
        const filteredData = data.filter(option => option.id !== 4);
        setIsCategory([{ "id": "0", "leave_category_name": "Select Category Type" }, ...filteredData]);
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
  // leave/ hald day / permission request state

  const [leaveFormData, setLeaveFormData] = useState({
    emp_id: userempid,
    emp_name: username,
    // emp_email: useremail,
    // request_type: "",
    // request_category: "",
    from_date: "",
    to_date: "",
    permission_date: "",
    permission_timefrom: "",
    permission_timeto: "",
    leave_reason: "",
    proof: "",
  });


  const [category, setCategory] = useState('');
  const [type, setType] = useState('');


  const handleLeaveInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveFormData({ ...leaveFormData, [name]: value });
  };


  const handleTimeOffProofChange = (e) => {
    const file = e.target.files[0];
    setLeaveFormData({ ...leaveFormData, proof: file });
  };


  // ----------------------------------------------------------------------------------------------------

  const [shiftInfo, setShiftInfo] = useState(null);
  const [shiftname, setShiftname] = useState('');
  const [noactiveshift, setNoactiveshift] = useState('');
  const [error, setError] = useState(null);

  const checkShiftSlot = async () => {
    if (leaveFormData.to_date || leaveFormData.permission_timeto) {
      try {
        const response = await fetch('https://epkgroup.in/crm/api/public/api/shift_slot_checking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
          },
          body: JSON.stringify({
            emp_id: userempid,
            request_type: type,
            from_date: leaveFormData.from_date,
            to_date: leaveFormData.to_date,
            date: leaveFormData.permission_date,
            from_time: leaveFormData.permission_timefrom,
            to_time: leaveFormData.permission_timeto
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        if (result.status === 'success') {
          setShiftInfo(result.shift_id);
          setShiftname(result.shift_name)
          setNoactiveshift('');
          console.log('Shift Info:', result.shift_id);
        } else if (result.status === 'error') {

          setNoactiveshift(result.message);
        } else {
          console.error('Unexpected response:', result);
          setError(result);
        }
      } catch (error) {
        console.error('API call failed:', error);
        setError(error);
      }
    }
  };


  useEffect(() => {
    checkShiftSlot();
  }, [leaveFormData.to_date, leaveFormData.permission_timeto]);

  // ----------------------------------------------------------------------------------------------------

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();


    const errors = {};

    if (!type) {
      errors.category = 'Request type required';
    }

    if (!category) {
      errors.type = 'Request category required';
    }

    if (!leaveFormData.from_date && (type === "1" || type === "4")) {
      errors.from_date = 'Request from date required';
    }

    if (!leaveFormData.to_date && (type === "1" || type === "4")) {
      errors.to_date = 'Request To Date required';
    }

    if (!leaveFormData.permission_date && (type === "2" || type === "3")) {
      errors.permission_date = 'Date required';
    }

    if (!leaveFormData.permission_timefrom && (type === "2" || type === "3")) {
      errors.permission_timefrom = 'Timefrom required';
    }

    if (!leaveFormData.permission_timeto && (type === "2" || type === "3")) {
      errors.permission_timeto = 'Timeto required';
    }

    if (!leaveFormData.leave_reason) {
      errors.leave_reason = 'Request reason required';
    }


    if (noactiveshift) {
      errors.noactiveshift = noactiveshift;
    }


    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    console.log("clicked1")

    // Clear form errors if there are no errors
    setFormErrors({});


    const formDataToSend = new FormData();
    formDataToSend.append('emp_id', formData.emp_id);
    formDataToSend.append('emp_name', formData.emp_name);

    // formDataToSend.append('emp_email', formData.emp_email);
    formDataToSend.append('request_type', type);
    formDataToSend.append('request_category', category);
    formDataToSend.append('from_date', leaveFormData.from_date);
    formDataToSend.append('to_date', leaveFormData.to_date);
    formDataToSend.append('permission_date', leaveFormData.permission_date);
    formDataToSend.append('permission_timefrom', leaveFormData.permission_timefrom);
    formDataToSend.append('permission_timeto', leaveFormData.permission_timeto);
    formDataToSend.append('shift_slot', shiftInfo);
    formDataToSend.append('leave_reason', leaveFormData.leave_reason);
    formDataToSend.append('attachement', leaveFormData.proof);


    try {

      const response = await fetch('https://epkgroup.in/crm/api/public/api/add_employee_leave_request', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${usertoken}`
        }
      });



      if (response.ok) {
        const data = await response.json();

        if (data.status === "success") {
          setIsTimeOffOpen(false);
          setLeaveFormData({
            from_date: "",
            to_date: "",
            permission_date: "",
            permission_timefrom: "",
            permission_timeto: "",
            leave_reason: "",
            proof: "",
          });
          setCategory('');
          setType('');
          setNoactiveshift('')
          
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message, // Display success message from API
          });
        } else if (data.status === "error") {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message,
          });
        }
        else {
          console.error("Failed to submit form");

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to submit form',
          });
        }
      } else {
        console.error("Failed to submit form");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to submit form',
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error submitting form. Please try again later.',
      });
    }
  };
  // ----------------------------------------------------------------------------------------------------

  // ========================== LEAVE / HALD DAY /PERMISSION REQUEST END ===============================


  // ==================================== OVER TIME START ===============================================

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

  // ----------------------------------------------------------------------------------------------------
  // Attendance Location

  const [isOvertimelocation, setIsOvertimelocation] = useState([{ "id": "0", "attendance_location_name": "Select location" }]);
  const [selectedOvertimelocation, setSelectedOvertimelocation] = useState('');


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
        setIsOvertimelocation([{ "id": "0", "attendance_location_name": "Select location" }, ...data]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  // ----------------------------------------------------------------------------------------------------
  // select shift alread there so use it in [Attendance request]
  // ----------------------------------------------------------------------------------------------------

  const [isOverTime, setIsOverTime] = useState(false);

  const handleopenOverTime = () => {
    setIsOverTime(true);
  };

  const handleCloseOverTime = () => {
    setIsOverTime(false);
  };

  // over time state

  const [formDataOT, setFormDataOT] = useState({
    emp_id: userempid,
    request_date: "",
    request_fromtime: "",
    request_totime: "",
    ot_reason: "",

  });

  const handleInputChangeOT = (e) => {
    const { name, value } = e.target;
    setFormDataOT({ ...formDataOT, [name]: value });
  };



  // ----------------------------------------------------------------------------------------------------
  // Add Overtime

  const handleSubmitOverTime = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!selectedoverTimetype) {
      errors.selectedoverTimetype = 'Request type required';
    }

    if (!selectedOvertimelocation) {
      errors.selectedOvertimelocation = 'Request Location required';
    }

    // if (!selectedshift) {
    //   errors.selectedshift = 'Request Location required';
    // }

    if (!formDataOT.request_date) {
      errors.request_date = 'Request date required';
    }
    if (!formDataOT.request_fromtime) {
      errors.request_fromtime = 'Request from time required';
    }
    if (!formDataOT.request_totime) {
      errors.request_totime = 'Request To time required';
    }
    if (!formDataOT.ot_reason) {
      errors.ot_reason = 'Request Reason required';
    }



    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Clear form errors if there are no errors
    setFormErrors({});

    const request_fromtimeUpdated = formDataOT.request_fromtime ? `${formDataOT.request_fromtime}:00` : '00:00:00';
    const request_totimeUpdated = formDataOT.request_totime ? `${formDataOT.request_totime}:00` : '00:00:00';

    const formDataToSend = new FormData();
    formDataToSend.append('emp_id', formDataOT.emp_id);
    formDataToSend.append('request_type', selectedoverTimetype);
    formDataToSend.append('request_location', selectedOvertimelocation);
    formDataToSend.append('request_date', formDataOT.request_date);
    formDataToSend.append('request_fromtime', request_fromtimeUpdated);
    formDataToSend.append('request_totime', request_totimeUpdated);
    formDataToSend.append('request_reason', formDataOT.ot_reason);
    //formDataToSend.append('shift_slot', selectedshift);

    try {
      const response = await fetch('https://epkgroup.in/crm/api/public/api/add_employee_ot_request', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${usertoken}`
        }
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {

        setFormDataOT({
          ...formData,
          request_date: "",
          request_fromtime: "",
          request_totime: "",
          ot_reason: "",
        });
        setSelectedoverTimetype('')
        setSelectedOvertimelocation('')
        setSelectedshift('')

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

  // ==================================== OVER TIME START ===============================================
console.log("props.username", props.username)
console.log("props.formattedCenterDate", props.formattedCenterDate)
  return (
    <>
      <div className="container" style={{ padding: '5px 38px' }}>
        {/* ------------------------------------------------------------------------------------------------ */}
        {/* Title */}
        <div>
          {(userrole === "1" || userrole === "2") ?
            <h2 style={{ color: '#00275C', marginLeft: '-14px' }}>{props.username || username} - {props.formattedCenterDate} Attendance <span>{props.calendertotal}</span></h2>
            :
            <>
              <h2 style={{ color: '#00275C', marginLeft: '-14px' }}>{username} - {props.formattedCenterDate} Attendance</h2><br />

            </>

          }
        </div>
        {/* ------------------------------------------------------------------------------------------------ */}

        {/* ------------------------------------------------------------------------------------------------ */}
        {/* Total Count */}
        <div className="top-container mb-3" style={{ marginLeft: '-14px', display: 'flex', justifyContent: 'space-between' }}>
          <h3>Total</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>


            {(userrole !== "1") && 
              <>
                <Button style={{ marginRight: '15px' }} onClick={openTimeOff}>
                  L / P / H
                </Button>

                <Button style={{ marginRight: '15px' }} onClick={handleApplyAttendance}>
                  Attendance
                </Button>

                <Button onClick={handleopenOverTime}>
                  Over Time
                </Button>
              </>
            }

          </div>
        </div>

        <div className="row" style={{ background: '#00275C', color: 'white' }}>


          <div className="col-sm" style={{ border: '1px solid #ddd' }}>
            {/* <h1>{present}</h1> */}
            <h1>{titleCounts.Present}</h1>
            <h4>Present</h4>
          </div>

          <div className="col-sm" style={{ border: '1px solid #ddd' }}>
            {/* <h1>{absent}</h1> */}
            <h1>{LeaveCount}</h1>
            <h4>Leave</h4>
          </div>


          <div className="col-sm" style={{ border: '1px solid #ddd' }}>
            {/* <h1>{absent}</h1> */}
            <h1>{AbsentCount}</h1>
            <h4>Absent</h4>
          </div>

          <div className="col-sm" style={{ border: '1px solid #ddd' }}>
            {/* <h1>{halfDays}</h1> */}
            {/* <h1>{halfDays}</h1> */}
            <h1>{halfDayCount}</h1>
            <h4>Half Days</h4>
          </div>

          <div className="col-sm" style={{ border: '1px solid #ddd' }}>
            {/* <h1>{late}</h1> */}
            <h1>{lateCount}</h1>
            <h4>Late</h4>
          </div>

          <div className="col-sm" style={{ border: '1px solid #ddd' }}>
            {/* <h1>{permission}</h1> */}
            <h1>{permissionCount}</h1>
            <h4>Permission</h4>
          </div>

          <div className="col-sm" style={{ border: '1px solid #ddd' }}>
            {/* <h1>{permission}</h1> */}
            <h1>{titleCounts.Overtime}</h1>
            <h4>Over Time</h4>
          </div>



        </div>
        {/* ------------------------------------------------------------------------------------------------ */}

        {/* ATTENDANCE REQUEST */}
        {/* ------------------------------------------------------------------------------------------------ */}
        <Modal show={isAttendanceRequestOpen} onHide={handleCloseAttendance}>
          <Modal.Header closeButton>
            <Modal.Title>Attendance Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="request_type">
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Request type:</Form.Label>
                <Form.Control
                  as="select"
                  name="request_type"
                  value={selectedattendancetype}
                  onChange={(e) => setSelectedattendancetype(e.target.value)}
                >
                  <option value="" disabled>Select Request Type</option>
                  {attendancerequestTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.attendance_type_name}</option>
                  ))}
                </Form.Control>
                {formErrors.request_type && <span className="text-danger">{formErrors.request_type}</span>}
              </Form.Group>

              <Form.Group controlId="request_location">
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Location:</Form.Label>
                <Form.Control
                  as="select"
                  name="request_location"
                  value={formData.request_location}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Select Location</option>
                  {attendanceLocations.map(location => (
                    <option key={location.id} value={location.id}>{location.attendance_location_name}</option>
                  ))}
                </Form.Control>
                {formErrors.request_location && <span className="text-danger">{formErrors.request_location}</span>}
              </Form.Group>

              {/* <Form.Group controlId="shift" className='mb-2'>
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Shift:</Form.Label>
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
                {formErrors.request_shift && <span className="text-danger">{formErrors.request_shift}</span>}
              </Form.Group> */}

              <Form.Group controlId="request_date">
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Date</Form.Label>
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
                  <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Time From</Form.Label>
                  <Form.Control
                    type="time"
                    name="request_fromtime"
                    value={formData.request_fromtime}
                    onChange={handleInputChange}
                    disabled={selectedattendancetype === '3'}
                  />
                  {formErrors.request_fromtime && <span className="text-danger">{formErrors.request_fromtime}</span>}

                </Form.Group>

                <Form.Group controlId="request_totime" style={{ width: '48%' }}>
                  <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Time To</Form.Label>
                  <Form.Control
                    type="time"
                    name="request_totime"
                    value={formData.request_totime}
                    onChange={handleInputChange}
                    disabled={selectedattendancetype === '2'}
                  />
                  {formErrors.request_totime && <span className="text-danger">{formErrors.request_totime}</span>}
                </Form.Group>
              </div>

              <Form.Group controlId="request_reason">
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Reason:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="request_reason"
                  value={formData.request_reason}
                  onChange={handleInputChange}
                />
                {formErrors.request_reason && <span className="text-danger">{formErrors.request_reason}</span>}
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
        {/* ------------------------------------------------------------------------------------------------ */}


        {/* LEAVE / PERMISSION/ HALF DAY REQUEST */}
        {/* ------------------------------------------------------------------------------------------------ */}
        <Modal show={IsTimeOffOpen} onHide={closeTimeOff}>
          <Modal.Header closeButton>
            <Modal.Title>Leave Request</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleLeaveSubmit}>

              <Form.Group controlId="selectCategory" className='mb-2'>
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Type:</Form.Label>
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
                {formErrors.type && <span className="text-danger">{formErrors.type}</span>}
              </Form.Group>


              <Form.Group controlId="selectType" className='mb-2'>
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Category:</Form.Label>
                <Form.Control
                  as="select"
                  name="selectType"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setLeaveFormData({});
                    setNoactiveshift()
                  }}
                >
                  {isCategory.map((option) => (
                    <option key={option.id} value={option.id}>{option.leave_category_name}</option>
                  ))}
                </Form.Control>
                {formErrors.category && <span className="text-danger">{formErrors.category}</span>}
              </Form.Group>


              {type === "1" && ( // If request type is leave
                <Form.Group controlId="dateRange" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ marginRight: "10px", width: "50%" }}>
                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="from_date"
                      max="9999-12-31"
                      value={leaveFormData.from_date}
                      onChange={handleLeaveInputChange}
                    />
                    {formErrors.from_date && <span className="text-danger">{formErrors.from_date}</span>}
                  </div>
                  <div style={{ width: "50%" }}>
                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="to_date"
                      max="9999-12-31"
                      value={leaveFormData.to_date}
                      onChange={handleLeaveInputChange}
                    />
                    {formErrors.to_date && <span className="text-danger">{formErrors.to_date}</span>}
                    {formErrors.noactiveshift && <span className="text-danger">{formErrors.noactiveshift}</span>}
                  </div>
                </Form.Group>
              )}
              {type === "4" && ( // If request type is absent
                <Form.Group controlId="dateRange" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ marginRight: "10px", width: "50%" }}>
                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="from_date"
                      max="9999-12-31"
                      value={leaveFormData.from_date}
                      onChange={handleLeaveInputChange}
                    />
                    {formErrors.from_date && <span className="text-danger">{formErrors.from_date}</span>}
                  </div>
                  <div style={{ width: "50%" }}>
                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="to_date"
                      max="9999-12-31"
                      value={leaveFormData.to_date}
                      onChange={handleLeaveInputChange}
                    />
                    {formErrors.to_date && <span className="text-danger">{formErrors.to_date}</span>}
                    {formErrors.noactiveshift && <span className="text-danger">{formErrors.noactiveshift}</span>}
                  </div>
                </Form.Group>
              )}
              {type === "2" && ( // If request type is half day
                <>
                  <Form.Group controlId="permissionDate">
                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>HalfDay Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="permission_date"
                      max="9999-12-31"
                      value={leaveFormData.permission_date}
                      onChange={handleLeaveInputChange}
                    />
                    {formErrors.permission_date && <span className="text-danger">{formErrors.permission_date}</span>}
                    {formErrors.noactiveshift && <span className="text-danger">{formErrors.noactiveshift}</span>}
                  </Form.Group>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Form.Group controlId="permissionTimeFrom" style={{ width: '48%' }}>
                      <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>HalfDay Time From</Form.Label>
                      <Form.Control
                        type="time"
                        name="permission_timefrom"
                        value={leaveFormData.permission_timefrom}
                        onChange={handleLeaveInputChange}
                      />
                      {formErrors.permission_timefrom && <span className="text-danger">{formErrors.permission_timefrom}</span>}
                    </Form.Group>
                    <Form.Group controlId="permissionTimeTo" style={{ width: '48%' }}>
                      <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>HalfDay Time To</Form.Label>
                      <Form.Control
                        type="time"
                        name="permission_timeto"
                        value={leaveFormData.permission_timeto}
                        onChange={handleLeaveInputChange}
                      />
                      {formErrors.permission_timeto && <span className="text-danger">{formErrors.permission_timeto}</span>}
                    </Form.Group>
                  </div>
                </>
              )}
              {type === "3" && ( // If request type is permission
                <>
                  <Form.Group controlId="permissionDate">
                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Permission Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="permission_date"
                      max="9999-12-31"
                      value={leaveFormData.permission_date}
                      onChange={handleLeaveInputChange}
                    />
                    {formErrors.permission_date && <span className="text-danger">{formErrors.permission_date}</span>}
                    {formErrors.noactiveshift && <span className="text-danger">{formErrors.noactiveshift}</span>}
                  </Form.Group>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Form.Group controlId="permissionTimeFrom" style={{ width: '48%' }}>
                      <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Permission Time From</Form.Label>
                      <Form.Control
                        type="time"
                        name="permission_timefrom"
                        value={leaveFormData.permission_timefrom}
                        onChange={handleLeaveInputChange}
                      />
                      {formErrors.permission_timefrom && <span className="text-danger">{formErrors.permission_timefrom}</span>}
                    </Form.Group>
                    <Form.Group controlId="permissionTimeTo" style={{ width: '48%' }}>
                      <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Permission Time To</Form.Label>
                      <Form.Control
                        type="time"
                        name="permission_timeto"
                        value={leaveFormData.permission_timeto}
                        onChange={handleLeaveInputChange}
                      />
                      {formErrors.permission_timeto && <span className="text-danger">{formErrors.permission_timeto}</span>}

                    </Form.Group>
                  </div>
                </>
              )}

              <Form.Group controlId="comment">
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Reason:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="leave_reason"
                  value={leaveFormData.leave_reason}
                  onChange={handleLeaveInputChange}
                />
                {formErrors.leave_reason && <span className="text-danger">{formErrors.leave_reason}</span>}
              </Form.Group>

              <Form.Group controlId="attachment">
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Attachment:</Form.Label>
                <Form.Control
                  type="file"
                  name="proof"
                  // value={leaveFormData.proof}
                  onChange={handleTimeOffProofChange}
                />
              </Form.Group>
              <div style={{ paddingTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={closeTimeOff}>Cancel</Button>
                <Button variant="primary" type="submit" style={{ marginLeft: '10px' }}>Submit</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        {/* ------------------------------------------------------------------------------------------------ */}


        {/* OverTime */}
        {/* ------------------------------------------------------------------------------------------------ */}
        <Modal show={isOverTime} onHide={handleCloseOverTime}>
          <Modal.Header closeButton>
            <Modal.Title>OverTime Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitOverTime}>

              <Form.Group controlId="overtimetype" className='mb-2'>
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Type:</Form.Label>
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


              <Form.Group controlId="overtimelocation" className='mb-2'>
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Location:</Form.Label>
                <Form.Control
                  as="select"
                  name="overtimelocation"
                  value={selectedOvertimelocation}
                  onChange={(e) => setSelectedOvertimelocation(e.target.value)}
                >
                  {isOvertimelocation.map((option) => (
                    <option key={option.id} value={option.id}>{option.attendance_location_name}</option>
                  ))}
                </Form.Control>
                {formErrors.selectedOvertimelocation && <span className="text-danger">{formErrors.selectedOvertimelocation}</span>}
              </Form.Group>


              {/* <Form.Group controlId="shift" className='mb-2'>
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Shift:</Form.Label>
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
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Date</Form.Label>
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
                  <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Time From</Form.Label>
                  <Form.Control
                    type="time"
                    name="request_fromtime"
                    value={formDataOT.request_fromtime}
                    onChange={handleInputChangeOT}

                  />
                  {formErrors.request_fromtime && <span className="text-danger">{formErrors.request_fromtime}</span>}
                </Form.Group>

                <Form.Group controlId="request_totime" style={{ width: '48%' }}>
                  <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Time To</Form.Label>
                  <Form.Control
                    type="time"
                    name="request_totime"
                    value={formDataOT.request_totime}
                    onChange={handleInputChangeOT}

                  />
                  {formErrors.request_totime && <span className="text-danger">{formErrors.request_totime}</span>}
                </Form.Group>
              </div>

              <Form.Group controlId="ot_reason" className='mb-2'>
                <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Reason:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="ot_reason"
                  value={formDataOT.ot_reason}
                  onChange={handleInputChangeOT}
                />
                {formErrors.ot_reason && <span className="text-danger">{formErrors.ot_reason}</span>}
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
        {/* ------------------------------------------------------------------------------------------------ */}
      </div>

    </>
  )
}

export default MonthlyAttendanceCount