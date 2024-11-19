import { faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const RaiseTicket = () => {
    // ----------------------------------------------------------------------------------------------------
    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    // ----------------------------------------------------------------------------------------------------
    const navigate = useNavigate();
    const handleVisitTicketlist = () => {
        navigate(`/admin/ticketslist`);
    };
    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    const [department, setDepartment] = useState('');
    const [ticketID, setTicketID] = useState('');
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [formErrors, setFormErrors] = useState({});

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
            errors.issueType = 'Issue Type Name is required.';
        }
        if (!description) {
            errors.description = 'Description is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const formData = new FormData();
        formData.append('emp_id', userempid);
        formData.append('ticket_id', ticketID);
        formData.append('issue_type', issueType);
        formData.append('description', description);
        formData.append('attachment', attachment); // Assuming attachment is a File object
        formData.append('status', '1');
        formData.append('created_by', userempid);
        
        axios.post('https://epkgroup.in/crm/api/public/api/addemployee_newraise_ticket', formData, {
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
                    text: 'There was an error creating the Raise Ticket type. Please try again later.',
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
        setFormErrors({});

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
                const response = await axios.get('https://epkgroup.in/crm/api/public/api/department_list', {
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

    // ------------------------------------------------------------------------------------------------
    // TICKET ID FETCH FROM API
    useEffect(() => {
        const fetchAssetId = async () => {
            try {
                const response = await axios.get('https://epkgroup.in/crm/api/public/api/newticket_id', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                });
                if (response.data.status === 'success') {
                    setTicketID(response.data.data);
                } else {
                    throw new Error('Failed to fetch asset ID');
                }
            } catch (err) {
                console.log(err.message);

            }
        };

        fetchAssetId();
    }, []);
    // ------------------------------------------------------------------------------------------------

    // -------------------------------------- Issue Type ---------------------------------------------------
    const [issueTypeDropdown, setIssueTypeDropdown] = useState([]);

    // Fetch department dropdown options
    useEffect(() => {
        if (!department) return;
        const fetchIssue= async () => {
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

        fetchIssue();
    }, [department,usertoken]);

    // ---------------------------------------------------------------------------------------------------
    return (
        <div className='RaiseTicket__container' style={{ padding: '10px 40px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Raise Ticket</h3>
            <div className='form__area' style={{ background: '#ffffff', padding: '40px 40px', boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', margin: '2px' }}>
                <Form onSubmit={handleSubmit}>
                    <div style={{fontWeight: 600,marginBottom:"10px"}}>Ticket ID : {ticketID}</div>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formDepartment">
                                <Form.Label>Department <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control as="select" value={department} onChange={(e) => {setDepartment(e.target.value)}}>
                                    <option value="">Select Department</option>
                                    {departmentDropdown.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.depart_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.department && <span className="text-danger">{formErrors.department}</span>}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formIssueType">
                                <Form.Label>Issue Type <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control as="select" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                                    <option value="">Select Issue Type</option>
                                    {issueTypeDropdown.length > 0 ? (
                                    issueTypeDropdown.map(issue => (
                                        <option key={issue.id} value={issue.id}>
                                        {issue.issue_name}
                                        </option>
                                    ))
                                    ) : (
                                    <option disabled>No issue found</option> // Message when no issues are found
                                    )}
                                </Form.Control>
                                {formErrors.issueType && <span className="text-danger">{formErrors.issueType}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className='mb-3'>
                        <Col>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
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
                    </Row>
                       <div style={{display:'flex',flexDirection:"row", columnGap:"10px"}}>
                            <Button variant="primary" type="submit">
                                    Submit
                            </Button>
                            <Button variant="secondary" onClick={handleCancel}>
                                    Cancel
                            </Button>
                       </div>
                </Form>
            </div>
        </div>
    );
};

export default RaiseTicket;
