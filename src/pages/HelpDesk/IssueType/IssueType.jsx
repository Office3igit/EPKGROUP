import React, { useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { MultiSelect } from 'react-multi-select-component';
import { faStarOfLife } from '@fortawesome/free-solid-svg-icons';

function IssueType() {
    // ------------------------------------------------------------------------------------------------
    // Redirect to the edit page
    const navigate = useNavigate();
    const GoToEditPage = (id) => {
        navigate(`/admin/editissuetype/${id}`);
    }; 
    // ------------------------------------------------------------------------------------------------
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
    const [refreshKey, setRefreshKey] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);    
     // pagination, search, print state
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const componentRef = React.useRef(); 

    // --------------------------------------------------------------------------------------------------------


    // -------------------------------------- Role Dropdown ----------------------------------------------------

    useEffect(() => {
        const fetchrole = async () => {
            try {
                const response = await axios.get('https://epkgroup.in/crm/api/public/api/department_list', {
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
    const formattedSelectedDepartment = selectedDepartment ? selectedDepartment.join(',') : null;
    const formattedSelectedRole = selectedRole ? selectedRole.join(',') : null;
    const formattedSelectedEmployees = selectedEmployee ? selectedEmployee.join(',') : null;
        useEffect(() => {
      const apiUrl = `https://epkgroup.in/crm/api/public/api/multipledepartmentbasedrole_list/${formattedSelectedDepartment}`;
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
  }, [formattedSelectedDepartment,usertoken]);

    // ---------------------------------------------------------------------------------------------------------

    // --------------------------------------- Employee Dropdown ------------------------------------------------
    useEffect(() => {
        const apiUrl = `https://epkgroup.in/crm/api/public/api/multiplesupervisorrole_list/${formattedSelectedRole}`;
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
    }, [formattedSelectedRole,usertoken]);

    const handleSubmit = (e) => {
        e.preventDefault();

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
            dep_id: selectedDepartment.join(', '),
            assign_members: formattedSelectedEmployees,
            issue_type:selectedIssueType,
            teams:selectedRole.join(','),
            status: '1',
            created_by: userempid
        };

        axios.post('https://epkgroup.in/crm/api/public/api/add_newissue_type', requestData, {
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
                    setSelectedDepartment('');
                    setSelectedEmployee('');
                    setSelectedRole('');
                    setSelectedIssueType('');
                    // Increment the refreshKey to trigger re-render
                    setRefreshKey(prevKey => prevKey + 1);
                } else {
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
                    text: 'There was an error creating the Issue Type. Please try again later.',
                });
                console.error('There was an error with the API:', error);
            });
    };

    const handleCancel = () => {
        setSelectedRole('');
        setSelectedDepartment('');
        setSelectedEmployee('');
        setSelectedIssueType('');
        setSelectedIssueType('')
        setFormErrors({});
    };

    // Table list view api
    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/view_issuetypes', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data || []);
                setLoading(false);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // print start
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // print end
    // ========================================

    // ========================================
    // CSV start
    const handleExportCSV = () => {
        const csvData = tableData.map(({ department_name,teams_name, issue_type, membername,created_name, status }, index) => ({
            '#': index + 1,
            department_name,
            teams_name,
            issue_type,
            membername,
            created_name,
            status,
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Department_Name', key: 'department_name'},
            { label: 'Role', key: 'teams_name' },
            { label: 'Issue Type', key: 'issue_type' },
            { label: 'Member_Name', key: 'membername' },
            { label: 'Created_Name', key: 'created_name' },
            { label: 'Status', key: 'status' },
        ];
        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'AddIssue.csv',
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
        const data = tableData.map(({ department_name,teams_name, issue_type, membername,created_name,status }, index) => [
            index + 1,
            department_name,
            teams_name,
            issue_type,
            membername,
            created_name,
            status,
        ]);

        doc.autoTable({
            head: [['S.No', 'Department_Name','Role', 'Issue Type', 'Member_Name','Created_Name', 'Status']],
            body: data,
        });
        doc.save('AddIssue.pdf');
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
                <h3 className='mb-5'>Add Issue</h3>
                {/* ------------------------------------------------------------------------------------------------ */}
                <div className='mb-5' style={{ background: '#ffffff', padding: '40px 40px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="formRole">
                                <Form.Label style={{ fontWeight: 'bold' }}>Department <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <MultiSelect
                                    options={formattedDepartmentDropdown}
                                    value={formattedDepartmentDropdown.filter(option => selectedDepartment.includes(option.value))}
                                    onChange={handleSelectDepartmentChange}
                                    labelledBy="Select"
                                />
                                {formErrors.selectedDepartment && <span className="text-danger">{formErrors.selectedDepartment}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formRole">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Role Name <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <MultiSelect
                                        options={formattedRoleDropdown}
                                        value={formattedRoleDropdown.filter(option => selectedRole.includes(option.value))}
                                        onChange={handleSelectRoleChange}
                                        labelledBy="Select"
                                    />
                                    {formErrors.selectedRole && <span className="text-danger">{formErrors.selectedRole}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row> 
                            <Col>
                                <Form.Group controlId="formEmployee">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Select Member <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <MultiSelect
                                        options={formattedEmployeesDropdown}
                                        value={formattedEmployeesDropdown.filter(option => selectedEmployee.includes(option.value))}
                                        onChange={handleSelectEmployeeChange}
                                        labelledBy="Select"
                                    />
                                    {formErrors.selectedEmployee && <span className="text-danger">{formErrors.selectedEmployee}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formTicketTitle">
                                    <Form.Label  style={{ fontWeight: 'bold'  }}>Issue Type <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedIssueType}
                                        onChange={(e) => setSelectedIssueType(e.target.value)}
                                    />
                                    {formErrors.selectedIssueType && <span className="text-danger">{formErrors.selectedIssueType}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <div className='mt-3 submit__cancel'>
                                <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSubmit}>
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                    Cancel
                                </Button>
                            </div>
                        </Row>
                    </Form>
                </div>
                {/* ------------------------------------------------------------------------------------------------ */}

                {/* ------------------------------------------------------------------------------------------------ */}
                {/* List table */}
                <h3 className='mb-5'>Issue Type List</h3>
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
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">S.No</th>
                                <th scope="col">Department</th>
                                <th scope="col">Issue Type</th>
                                <th scope="col">Role</th>
                                <th scope="col">Member</th>
                                <th scope="col">Created By</th>
                                <th scope="col" className="no-print">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredleaveData.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center' }}>No search data found</td>
                                    </tr>
                                ) : (
                                    filteredleaveData.map((row, index) => {
                                        const serialNumber = currentPage * itemsPerPage + index + 1;
                                        return (
                                            <tr key={row.id}>
                                                <th scope="row">{serialNumber}</th>
                                                <td>{row.department_name}</td>
                                                <td>{row.issue_type}</td>
                                                <td>{row.teams_name}</td>
                                                <td>{row.membername}</td>
                                                <td>{row.created_name}</td>
                                                <td className="no-print">
                                                    <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                        </tbody>
                    </table>
                </div>
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
export default IssueType