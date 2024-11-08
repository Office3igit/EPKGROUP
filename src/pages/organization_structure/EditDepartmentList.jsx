import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';

function EditDepartmentList() {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add shiftslot page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitsupervisorlist = () => {
        navigate(`/admin/department`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------

    // Edit Shift Slot Save




    const [supervisorOptions, setSupervisorOptions] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [status, setStatus] = useState('');

    const [department, setDepartment] = useState('');

    const handleRoleChange = (e) => {
        setDepartment(e.target.value);
    };


    useEffect(() => {
        // Fetch department and supervisor options from API
        axios.get('https://epkgroup.in/crm/api/public/api/department_list', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { data } = response.data;

                // setDepartmentOptions(data);
                setSupervisorOptions(data);
            })
            .catch(error => {
                console.error('Error fetching department and supervisor options:', error);
            });
    }, []);

    // const handleDepartmentChange = (e) => {
    //     setSelectedDepartment(e.target.value);

    // };

    const handleSupervisorChange = (e) => {
        setSelectedSupervisor(e.target.value);
    };

    const handleSave = (e) => {
        e.preventDefault();

        const requestData = {
            id: id,
            depart_name: department,
            sup_id: selectedSupervisor,
            status: status,
            updated_by: userempid
        };

        axios.put('https://epkgroup.in/crm/api/public/api/update_department', requestData, {
            headers: {
                'Content-Type': 'application/json',
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
                    // Assuming handleVisitsupervisorlist is a function defined elsewhere
                    handleVisitsupervisorlist();
                } else if (status === 'error') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: message,
                    });
                } else {
                    throw new Error('Unexpected response status');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating the Department list. Please try again later.',
                });

                console.error('There was an error with the API:', error);
            });
    };


    const handleCancel = () => {
        handleVisitsupervisorlist()
    };

    // ------------------------------------------------------------------------------------------------
    // edit shift

    // const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://epkgroup.in/crm/api/public/api/editview_department/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    // setData(res.data.data);
                    console.log("setData----------->", res.data.data)

                    setDepartment(res.data.data.depart_name);
                    setSelectedSupervisor(res.data.data.sup_id);
                    setStatus(res.data.data.status);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    // ------------------------------------------------------------------------------------------------

    // useEffect(() => {
    //     // Filter supervisor options based on the initially selected department
    //     if (selectedDepartment) {
    //         const filteredSupervisors = departmentOptions.filter(option => option.id !== parseInt(selectedDepartment));
    //         setSupervisorOptions(filteredSupervisors);
    //     } else {
    //         setSupervisorOptions(departmentOptions); // Show all supervisors when no department is selected
    //     }
    // }, [selectedDepartment, departmentOptions]);



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
                    <h3 className='mb-5'>Edit Department List</h3>

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* Supervisor list slot add form */}
                    <div className='mb-5' style={{ background: '#ffffff', padding: '60px 10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>
                        <Row className='mb-2 '>
                            <Col>
                                <Form.Group controlId="formRole" className='mb-3'>
                                    <Form.Label style={{ fontWeight: 'bold' }}>Department Name</Form.Label>
                                    <Form.Control type="text" value={department} onChange={handleRoleChange} placeholder="Enter Department Name" disabled />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formSupervisorName">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Supervisor Name</Form.Label>
                                    <Form.Control as="select" onChange={handleSupervisorChange} value={selectedSupervisor}>
                                        <option value="" disabled>Select Supervisor</option>
                                        {supervisorOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.depart_name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mb-2 '>
                            <Col>
                                <Form.Group controlId="formStatus">
                                    <Form.Label style={{ fontWeight: 'bold' }}> Status</Form.Label>
                                    <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="" disabled>Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="In-Active">In-Active</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <div className='submit__cancel'>
                                <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSave}>
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                    Cancel
                                </Button>
                            </div>
                        </Row>
                    </div>
                    {/* ------------------------------------------------------------------------------------------------ */}


                </Container>
            )}
        </>
    )
}

export default EditDepartmentList