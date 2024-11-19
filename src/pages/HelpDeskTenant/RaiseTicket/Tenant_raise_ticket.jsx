import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Tenant_raise_ticket.css';

const Tenant_raise_ticket = () => {

    // ----------------------------------------------------------------------------------------------------
    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    var usertoken = userData?.token || '';
    var token = usertoken.slice(usertoken.indexOf('|') + 1);
    var token_user_id;
    var userimage;
    var userempid;
    var tenant_identification = false;
    
    if (userData?.sluge == "TENANT") {
  
      token_user_id = userData?.token_user_id || '';
      userimage = userData?.userimage || '';
      userempid = userData?.tenat_id || '';
      tenant_identification = true;
  
    } else {
  
      token_user_id = userData?.token_user_id || '';
      userimage = userData?.userimage || '';
      userempid = userData?.userempid || '';
    }
  
    // ----------------------------------------------------------------------------------------------------

    const navigate = useNavigate();
    const handleVisitTicketlist = () => {
        navigate(`/admin/tenant_ticket_list`);
    };
    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // const [department, setDepartment] = useState('');
    // const [employeeName, setEmployeeName] = useState('');
    const [department, setDepartment] = useState('');
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [formErrors, setFormErrors] = useState({});


    // const [employeeName, setEmployeeName] = useState('');
    // const [ticketID, setTicketID] = useState('');
    // const [ticketTitle, setTicketTitle] = useState('');
    // const [assignDepartment, setAssignDepartment] = useState('');
    // const [assignEmployee, setAssignEmployee] = useState('');
    // const [status, setStatus] = useState('');

    const handleAttachmentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('File selected:', file); // Debug: Check file object
            setAttachment(file);
        } else {
            console.log('No file selected');
        }
    };

    // ------------------------------------------------------------------------------------------------
    // HANDLE SUBMIT

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};
        if (!department) {
            errors.department = 'Department Name is required.';
        }

        if (!issueType) {
            errors.issueType = 'Issues Name is required.';
        }

        if (!description) {
            errors.description = 'Issues Name is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const formData = new FormData();
        
        formData.append('tenant_id', userempid);
        formData.append('issue_type', issueType);
        formData.append('description', description);
        formData.append('attachment', attachment);
        formData.append('status', 1);
        formData.append('created_by', userempid);

        axios.post('https://epkgroup.in/crm/api/public/api/addtenant_newraise_ticket', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { status, message } = response.data;

                if (status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: message,
                    });
                    handleVisitTicketlist()
                } else if (status === 'error') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Operation Failed',
                        text: message,
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error creating the leave policy type. Please try again later.',
                });

                console.error('There was an error with the API:', error);
            });
    };

    const fileInputRef = useRef(null);

    const handleCancel = () => {
        setDepartment('');
        setIssueType('');
        setDescription('');
        setAttachment(null);
         // Reset file input
         if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    useEffect(() => {
        console.log('Attachment state changed:', attachment);
    }, [attachment]);
    
    // ----------------------------------------------------------------------------------------------



    // -------------------------------------- Department ---------------------------------------------------
    const [departmentDropdown, setDepartmentDropdown] = useState([]);

    // Fetch department dropdown options
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                
                let api_endpoint = tenant_identification 
                ? 'https://epkgroup.in/crm/api/public/api/department_for_tenant' 
                : 'https://epkgroup.in/crm/api/public/api/department_list';
    
            const response = await axios.get(api_endpoint, {
                headers: {
                    Authorization: `Bearer ${usertoken}`
                }
            });
                const data = response.data.data || [];
                setDepartmentDropdown(data);
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchDepartments();
    }, [usertoken]);

    // ---------------------------------------------------------------------------------------------------

    // ------------------------------------  Employee  ---------------------------------------------------

    const [employeesDropdown, setEmployeesDropdown] = useState([]);

    // Fetch employee dropdown options based on selected department
    useEffect(() => {
        if (department) {
            const apiUrl = `https://epkgroup.in/crm/api/public/api/employee_dropdown_list/${department}`;
            const fetchEmployees = async () => {
                try {
                    const response = await axios.get(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${usertoken}`
                        }
                    });
                    const data = response.data.data || [];
                    setEmployeesDropdown(data);
                } catch (error) {
                    console.error('Error fetching employee options:', error);
                }
            };
            fetchEmployees();
        }
    }, [department, usertoken]);
    // -------------------------------------- Assign Department ---------------------------------------------------
    const [assignDepartmentDropdown, setAssignDepartmentDropdown] = useState([]);

    // Fetch department dropdown options
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://epkgroup.in/crm/api/public/api/userrolelist', {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setAssignDepartmentDropdown(data);
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchDepartments();
    }, [usertoken]);

    // ---------------------------------------------------------------------------------------------------

    // ------------------------------------ Assign Employee  ---------------------------------------------------

    const [assignEmployeesDropdown, setAssignEmployeesDropdown] = useState([]);

    // Fetch employee dropdown options based on selected department
    // ---------------------------------------------------------------------------------------------------

    // -------------------------------------- Issue Type ---------------------------------------------------
    const [issueTypeDropdown, setIssueTypeDropdown] = useState([]);

    // Fetch department dropdown options
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`https://epkgroup.in/crm/api/public/api/issuetype_dropdown/${department}`, {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setIssueTypeDropdown(data);
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchDepartments();
    }, [department, usertoken]);

    // ---------------------------------------------------------------------------------------------------

    return (

        <div className='RaiseTicket__container' style={{ padding: '10px 40px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Raise Ticket</h3>
            <div className='form__area' style={{ background: '#ffffff', padding: '60px 40px', boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', margin: '2px' }}>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formDepartment">
                                <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                                <Form.Control as="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                                    <option value="" disabled>Select Department</option>
                                    {departmentDropdown.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.depart_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.department && <span className="text-danger">{formErrors.department}</span>}
                            </Form.Group>
                        </Col>
                        {/* <Col md={6}>
                            <Form.Group controlId="formDepartment">
                                <Form.Label>Issues Type</Form.Label>
                                <Form.Control as="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                                    <option value="">Select Issues Type</option>
                                    {departmentDropdown.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.role_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.department && <span className="text-danger">{formErrors.department}</span>}
                            </Form.Group>
                        </Col> */}
                           <Col md={6}>
                            <Form.Group controlId="formIssueType">
                                <Form.Label>Issue Type <span className="text-danger">*</span></Form.Label>
                                <Form.Control as="select" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                                    <option value="" disabled>Select Issue Type</option>
                                    {issueTypeDropdown.map(issue => (
                                        <option key={issue.id} value={issue.id}>{issue.issue_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.issueType && <span className="text-danger">{formErrors.issueType}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    {/* <Row className='mb-3'>
                        <Col>
                            <Form.Group controlId="formTicketID">
                                <Form.Label>Ticket ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={ticketID}
                                    onChange={(e) => setTicketID(e.target.value)}
                                    disabled
                                />
                                {formErrors.ticketID && <span className="text-danger">{formErrors.ticketID}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formTicketTitle">
                                <Form.Label>Ticket Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={ticketTitle}
                                    onChange={(e) => setTicketTitle(e.target.value)}
                                />
                                {formErrors.ticketTitle && <span className="text-danger">{formErrors.ticketTitle}</span>}
                            </Form.Group>
                        </Col>
                    </Row> */}
                    <Row className='mb-3'>
                        {/* <Col>
                            <Form.Group controlId="formIssueType">
                                <Form.Label>Issue Type</Form.Label>
                                <Form.Control as="select" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                                    <option value="">Select Issue Type</option>
                                    {issueTypeDropdown.map(issue => (
                                        <option key={issue.id} value={issue.id}>{issue.ot_type_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.issueType && <span className="text-danger">{formErrors.issueType}</span>}
                            </Form.Group>
                        </Col> */}
                        <Col md={12}>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {formErrors.description && <span className="text-danger">{formErrors.description}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className='mb-3'>
                        <Col>
                            <Form.Group controlId="formAttachment">
                                <Form.Label>Attachment</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="attachment"
                                    onChange={handleAttachmentChange}
                                    ref={fileInputRef} 
                                />
                            </Form.Group>
                        </Col>
                        {/* <Col md={6}>
                            <Form.Group controlId="formDepartment">
                                <Form.Label>Assigned Department</Form.Label>
                                <Form.Control as="select" value={assignDepartment} onChange={(e) => setAssignDepartment(e.target.value)}>
                                    <option value="">Select Department</option>
                                    {assignDepartmentDropdown.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.role_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.assignDepartment && <span className="text-danger">{formErrors.assignDepartment}</span>}
                            </Form.Group>
                        </Col> */}
                    </Row>
                    {/* <Row className='mb-5'>
                        <Col md={6}>
                            <Form.Group controlId="formEmployeeName">
                                <Form.Label>Assigned Employee Name</Form.Label>
                                <Form.Control as="select" value={assignEmployee} onChange={(e) => setAssignEmployee(e.target.value)} disabled={!assignDepartment}>
                                    <option value="">Select Employee</option>
                                    {assignEmployeesDropdown.map(emp => (
                                        <option key={emp.emp_id} value={emp.emp_id}>{emp.emp_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.assignEmployee && <span className="text-danger">{formErrors.assignEmployee}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Solved">Solved</option>
                                </Form.Control>
                                {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                            </Form.Group>
                        </Col>
                    </Row> */}
                    <Row>
                        <Col md={1}>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Col>
                        <Col md={1}>
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default Tenant_raise_ticket;
