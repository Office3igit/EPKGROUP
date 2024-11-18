import React, { useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'jspdf-autotable';
import { ScaleLoader } from 'react-spinners';
import { MultiSelect } from 'react-multi-select-component';
import { faStarOfLife } from '@fortawesome/free-solid-svg-icons';

function EditIssueType() {
    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    // ------------------------------------------------------------------------------------------------

    // Component States
    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [roleDropDown, setRoleDropDown] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedIssueType, setSelectedIssueType] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(true)

    // --------------------------------------------------------------------------------------------------------


    // -------------------------------------- Role Dropdown ----------------------------------------------------

    useEffect(() => {
        const fetchrole = async () => {
            try {
                const response = await axios.get('http://epkgroup.in/crm/api/public/api/department_list', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setDepartmentDropdown(data);
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchrole();
    }, [usertoken]);

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitaddshiftslot = () => {
        navigate(`/admin/addissue`);
    };

    const formattedDepartmentDropdown = departmentDropdown.map(department => ({
        label: department.depart_name,
        value: department.id
    }));
    const formattedRoleDropdown = roleDropDown.map(role => ({
        label: role.role_name,
        value: role.id
    }));
    const formattedEmployeesDropdown = employeesDropdown.map(employee => ({
        label: employee.supervisor_name,
        value: employee.id
    }));
    
    const handleSelectDepartmentChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedDepartment(selectedIds);
    };
    const handleSelectRoleChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedRole(selectedIds);
    };
    const handleSelectEmployeeChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedEmployee(selectedIds);
    };
    
    const formattedSelectedDepartment = Array.isArray(selectedDepartment) 
    ? selectedDepartment.join(',')
    : null;
    const formattedSelectedRole = Array.isArray(selectedRole) 
    ? selectedRole.join(',')
    : null;
    const formattedSelectedEmployees = Array.isArray(selectedEmployee) 
    ? selectedEmployee.join(',')
    : null;
    useEffect(() => {
      const apiUrl = `https://epkgroup.in/crm/api/public/api/multipledepartmentbasedrole_list/${formattedSelectedDepartment || selectedDepartment }`;
      const fetchData = async () => {
          try {
              const response = await axios.get(apiUrl,
                  {
                      headers: {
                          'Authorization': `Bearer ${usertoken}`
                      }
                  });
              const data = response.data.data;
              setRoleDropDown(data);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      fetchData();
  }, [formattedSelectedDepartment,usertoken,selectedDepartment]);

    // ---------------------------------------------------------------------------------------------------------

    // --------------------------------------- Employee Dropdown ------------------------------------------------
    useEffect(() => {
        const apiUrl = `https://epkgroup.in/crm/api/public/api/multiplesupervisorrole_list/${formattedSelectedRole||selectedRole}`;
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl,
                    {
                        headers: {
                            'Authorization': `Bearer ${usertoken}`
                        }
                    });
                const data = response.data.data;
                setEmployeesDropdown(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [formattedSelectedRole,usertoken,selectedRole]);

        const handleSubmit = (e) => {
            console.log("edeeeee",e);
            
        e.preventDefault();
        // Validate input fields
        const errors = {};
        if (!selectedRole) {
            errors.selectedRole = 'Role is required.';
        }
        if (!selectedEmployee) {
            errors.selectedEmployee = 'Employee is required.';
        }
        if (!selectedDepartment) {
            errors.selectedDepartment = 'Department is required.';
        }
        if (!selectedIssueType) {
            errors.selectedIssueType = 'Issue Type is required.';
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        const requestData = {
            id:id,
            dep_id: selectedDepartment.join(', '),
            teams:selectedRole.join(','),
            assign_members: formattedSelectedEmployees,
            issue_type:selectedIssueType,
            status: '1',
            updated_by: userempid
        };
        axios.put(`http://epkgroup.in/crm/api/public/api/update_newissuetype`, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Issue Type has been updated successfully!',
                    });
                    handleVisitaddshiftslot()
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating the Issue Type. Please try again later.',
                });

                console.error('There was an error with the API:', error);
            });
    };

    const handleCancel = () => {
        handleVisitaddshiftslot();
        setSelectedRole('');
        setSelectedDepartment('');
        setSelectedEmployee('');
        setSelectedIssueType('');
        setFormErrors({});
    };

    const [issueType, setIssueType] = useState();
    const handleInputChange = (setter) => (e) => {
        let value = e.target.value;
        if (value.startsWith(' ')) {
            value = value.trimStart();
        }
        setter(value);
    };
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get(`http://epkgroup.in/crm/api/public/api/editview_newissuetype/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    console.log("viewdata",res.data.data);
                    setData(res.data.data);
                    setSelectedDepartment(res.data.data.dep_id)
                    setSelectedRole(res.data.data.teams)
                    setSelectedEmployee(res.data.data.assign_members)
                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    // ===============================================
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
                <h3 className='mb-5'>Edit Issue</h3>
                {/* ------------------------------------------------------------------------------------------------ */}
                <div className='mb-5' style={{ background: '#ffffff', padding: '40px 40px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="formRole">
                                <Form.Label style={{ fontWeight: 'bold' }}>Department <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <MultiSelect
                                    options={formattedDepartmentDropdown}
                                    onChange={handleSelectDepartmentChange}
                                    value={formattedDepartmentDropdown.filter(option => selectedDepartment.includes(option.value))}
                                    labelledBy="Select"
                                />
                                {formErrors.selectedDepartment && <span className="text-danger">{formErrors.selectedDepartment}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formTicketTitle">
                                    <Form.Label  style={{ fontWeight: 'bold'  }}>Issue Type <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="text"
                                        // value={data.description}
                                        onChange={(e) => setSelectedIssueType(e.target.value)}
                                        value={selectedIssueType?selectedIssueType:data.issue_type}
                                        // value={selectedIssueType}
                                    />
                                    {formErrors.selectedIssueType && <span className="text-danger">{formErrors.selectedIssueType}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row> 
                            <Col>
                                <Form.Group controlId="formRole">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Role Name <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <MultiSelect
                                        options={formattedRoleDropdown}
                                        onChange={handleSelectRoleChange}
                                        value={formattedRoleDropdown.filter(option => selectedRole.includes(option.value))}
                                        labelledBy="Select"
                                    />
                                    {formErrors.selectedRole && <span className="text-danger">{formErrors.selectedRole}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formEmployee">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Select Member <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <MultiSelect
                                        options={formattedEmployeesDropdown}
                                        onChange={handleSelectEmployeeChange}
                                        value={formattedEmployeesDropdown.filter(option => selectedEmployee.includes(option.value))  }
                                        labelledBy="Select"
                                    />
                                    {formErrors.selectedEmployee && <span className="text-danger">{formErrors.selectedEmployee}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <div className='mt-3 submit__cancel'>
                                <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSubmit}>
                                    Update
                                </Button>
                                <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                    Cancel
                                </Button>
                            </div>
                        </Row>
                    </Form>
                </div>
                {/* ------------------------------------------------------------------------------------------------ */}
            </Container>
             )} 
        </>
    )
}
export default EditIssueType