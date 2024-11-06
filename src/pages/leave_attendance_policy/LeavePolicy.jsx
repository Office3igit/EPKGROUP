import React, { useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import './css/addshiftslotstyle.css'
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { MultiSelect } from 'react-multi-select-component';
import { faChevronRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';

function LeavePolicy() {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editleavepolicy/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // Add Shift Slot submit


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [leaveType, setLeaveType] = useState('');
    const [leaveTypes, setLeaveTypes] = useState([]);

    const [rolesDropdown, setRolesDropdown] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const [totalLeaveCount, setTotalLeaveCount] = useState(0);
    const [monthlyLeaveCount, setMonthlyLeaveCount] = useState(0);
    const [formErrors, setFormErrors] = useState({});

    // ------------------------------------- Leave type dropdown ----------------------------------------------  

    useEffect(() => {
        // Fetch Leave Types from API
        axios.get('https://epkgroup.in/crm/api/public/api/leave_type_list', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                // Extract the Leave Types array from the response
                console.log('Leave Types data:', response.data);
                const leaveTypesData = response.data.data;
                setLeaveTypes(leaveTypesData);
                console.log('leaveTypesData------------------->:', leaveTypesData);
            })
            .catch(error => {
                console.error('Error fetching Leave Types:', error);
            });
    }, []);


    // ---------------------------------------------------------------------------------------------------------



    // -------------------------------------- Role Dropdown ----------------------------------------------------

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('https://epkgroup.in/crm/api/public/api/userrolelist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setRolesDropdown(data);
                console.log("setRolesDropdown", data)
            } catch (error) {
                console.error('Error fetching role options:', error);
            }
        };

        fetchRoles();
    }, []);

    const formattedRolesDropdown = rolesDropdown.map(role => ({
        label: role.role_name,
        value: role.id
    }));

    const handleSelectRoleChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedRole(selectedIds);
    };

    const formattedSelectedRole = selectedRole ? selectedRole.join(',') : null;

    // ---------------------------------------------------------------------------------------------------------


    // --------------------------------------- Employee Dropdown ------------------------------------------------

    useEffect(() => {
        const apiUrl = `https://epkgroup.in/crm/api/public/api/employee_dropdown_list/${formattedSelectedRole}`;
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
                console.log("setEmployeesDropdown", data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [formattedSelectedRole]);


    const formattedEmployeesDropdown = employeesDropdown.map(employee => ({
        label: employee.emp_name,
        value: employee.emp_id
    }));

    const handleSelectEmployeeChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedEmployee(selectedIds);
    };

    const formattedSelectedEmployee = selectedEmployee ? selectedEmployee.join(',') : null;


    // -------------------------------------- handleSubmit -------------------------------------------------------

    const [refreshKey, setRefreshKey] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};
        if (!selectedRole) {
            errors.selectedRole = 'Role is required.';
        }

        if (!selectedEmployee) {
            errors.selectedEmployee = 'Employee is required.';
        }
        if (!startDate) {
            errors.startDate = 'Start Date is required.';
        }

        if (!endDate) {
            errors.endDate = 'End Date is required.';
        }
        if (!leaveType) {
            errors.leaveType = 'Leave Type is required.';
        }
        if (!totalLeaveCount) {
            errors.totalLeaveCount = 'Total Leave Count is required.';
        }
        if (!monthlyLeaveCount) {
            errors.monthlyLeaveCount = 'Monthly Leave Count is required.';
        }


        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const requestData = {
            start_date: startDate,
            end_date: endDate,
            role_type: selectedRole.join(', '),
            emp_id: selectedEmployee.join(', '),
            leave_type: leaveType,
            leave_count: totalLeaveCount,
            monthly_count: monthlyLeaveCount,
            created_by: userempid
        };

        axios.post('https://epkgroup.in/crm/api/public/api/addleave_policy', requestData, {
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
                    setSelectedRole('');
                    setSelectedEmployee('');
                    setStartDate('');
                    setEndDate('');
                    setLeaveType('');
                    setTotalLeaveCount('');
                    setMonthlyLeaveCount('');

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
                // Access error details and fallback to generic message if not available
                const errorMessage = error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : 'An unexpected error occurred';

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                });

                console.error('There was an error with the API:', error);
            });
    };


    const handleCancel = () => {
        setSelectedRole('');
        setSelectedEmployee('');
        setStartDate('');
        setEndDate('');
        setLeaveType('');
        setTotalLeaveCount('');
        setMonthlyLeaveCount('');
        setFormErrors({});
    };

    // -----------------------------------------------------------------------------------------------------------

    // ---------------------------------------- Table list view ---------------------------------------------------

    const [tableData, setTableData] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/view_leavepolicy', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                setData(responseData.data);
                console.log(responseData.data)
                setLoading(false);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // ---------------------------------------- Delete the table list -------------------------------------------
    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Leave Policy. This action cannot be reversed.',
                icon: 'warning',
                input: 'text',
                inputPlaceholder: 'Enter reason for deletion',
                inputAttributes: {
                    maxLength: 100, // Limit input to 100 characters
                },
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (value) => {
                    if (!value) {
                        Swal.showValidationMessage('Reason is required for deletion.');
                    }
                    return value;
                }
            });

            if (reason) {
                const response = await fetch('https://epkgroup.in/crm/api/public/api/delete_leavepolicy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                    body: JSON.stringify({
                        id: id,
                        updated_by: '1',
                        reason: reason,
                    }),
                });

                if (response.ok || response.type === 'opaqueredirect') {

                    setTableData(tableData.filter(row => row.id !== id));
                    Swal.fire('Deleted!', 'Leave Policy has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting Leave Policy');
                }
            }
        } catch (error) {
            console.error('Error deleting Leave Policy:', error);
            Swal.fire('Error', 'An error occurred while deleting the Leave Policy. Please try again later.', 'error');
        }
    };

    // -------------------------------------------------------------------------------------------------------------


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
        const csvData = tableData.map(({ hrms_emp_id,first_name, role_name, category_name, start_date, end_date, leave_count, monthly_count }, index) => ({
            '#': index + 1,
            hrms_emp_id,
            first_name,
            role_name,
            category_name,
            start_date,
            end_date,
            leave_count,
            monthly_count
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Emp-ID', key: 'hrms_emp_id' },
            { label: 'Employee name', key: 'first_name' },
            { label: 'Role name', key: 'role_name' },
            { label: 'Category name', key: 'category_name' },
            { label: 'Start date', key: 'start_date' },
            { label: 'End date', key: 'end_date' },
            { label: 'Yearly count', key: 'leave_count' },
            { label: 'Monthly count', key: 'monthly_count' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Leavepolicy.csv',
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

        const data = tableData.map(({ hrms_emp_id,first_name, role_name, category_name, start_date, end_date, leave_count, monthly_count }, index) => [
            index + 1,
            hrms_emp_id,
            first_name,
            role_name,
            category_name,
            start_date,
            end_date,
            leave_count,
            monthly_count
        ]);

        doc.autoTable({
            head: [['S.No', 'Emp-ID','Employee Name', 'Role Name', 'Category Name', 'Start Date', 'End Date', 'Yearly Count', 'Monthly Count']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('Leavepolicy.pdf');

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
                    <h3 className='mb-5'>Add Leave Policy</h3>

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* shift slot add form */}
                    <div className='mb-5' style={{ background: '#ffffff', padding: '60px 10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>

                        <Row>
                            <Col>
                                <Form.Group controlId="formStartDate">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Start Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={startDate}
                                        max={endDate || "9999-12-31"}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    {formErrors.startDate && <span className="text-danger">{formErrors.startDate}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formEndDate">
                                    <Form.Label style={{ fontWeight: 'bold' }}>End Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={endDate}
                                        min={startDate || "0001-01-01"}  // Set min to start date if selected
                                        max="9999-12-31"  // You can change this if needed
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />                                    {formErrors.endDate && <span className="text-danger">{formErrors.endDate}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formLeaveType">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Leave Type <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control as="select" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                                        <option value="" disabled>Select Leave Type</option>
                                        {leaveTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.leave_type_name}</option>
                                        ))}
                                    </Form.Control>
                                    {formErrors.leaveType && <span className="text-danger">{formErrors.leaveType}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formRole">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Role <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>


                                    <MultiSelect
                                        options={formattedRolesDropdown}
                                        value={formattedRolesDropdown.filter(option => selectedRole.includes(option.value))}
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
                                    <Form.Label style={{ fontWeight: 'bold' }}>Select Employee <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>


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
                                <Form.Group controlId="formTotalLeaveCount">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Total Leave Count <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control type="number" value={totalLeaveCount} onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                            const value = e.target.value;
                                            setTotalLeaveCount(value);

                                            // Validate against the monthly leave count
                                            if (monthlyLeaveCount && (monthlyLeaveCount * 12) > value) {
                                                alert(`You are unable to give ${(monthlyLeaveCount)} leaves because you only entered ${value} as the total leave count.`);
                                                setTotalLeaveCount('');
                                                setMonthlyLeaveCount('');
                                            }
                                        }}
                                    />
                                    {formErrors.totalLeaveCount && <span className="text-danger">{formErrors.totalLeaveCount}</span>}
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formMonthlyLeaveCount">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Monthly Leave Count <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control type="number" value={monthlyLeaveCount} onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                        onChange={(e) => {
                                            if(totalLeaveCount){
                                            const value = e.target.value;
                                            setMonthlyLeaveCount(value);

                                            // Validate against the total leave count
                                            if (totalLeaveCount && (value * 12) > totalLeaveCount) {
                                                alert(`You are unable to give ${(value)} leaves because you only entered ${totalLeaveCount} as the total leave count.`);
                                                setMonthlyLeaveCount('')
                                            }
                                        }else{

                                            alert('You should enter the total leave count first');
                                        }
                                        
                                        }}
                                    />
                                    {formErrors.monthlyLeaveCount && <span className="text-danger">{formErrors.monthlyLeaveCount}</span>}
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
                    </div>
                    {/* ------------------------------------------------------------------------------------------------ */}


                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}
                    <h3 className='mb-5'>Leave Policy List</h3>
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
                                    <th scope="col">Emp-ID</th>
                                    <th scope="col">Employee Name</th>
                                    <th scope="col">Role Name</th>
                                    <th scope="col">Category Name</th>
                                    <th scope="col">Start Date</th>
                                    <th scope="col">End Date</th>
                                    <th scope="col">Yearly Count</th>
                                    <th scope="col">Monthly Count</th>
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
                                                    <td>{row.hrms_emp_id}</td>
                                                    <td>{row.first_name}</td>
                                                    <td>{row.role_name}</td>
                                                    <td>{row.category_name}</td>
                                                    <td>{row.start_date}</td>
                                                    <td>{row.end_date}</td>
                                                    <td>{row.leave_count}</td>
                                                    <td>{row.monthly_count}</td>

                                                    <td className="no-print" style={{ display: 'flex', gap: '10px' }}>
                                                        <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                            <FontAwesomeIcon icon={faPen} />
                                                        </button>
                                                        <button className="btn-delete" onClick={() => handleDelete(row.id)}>
                                                            <FontAwesomeIcon icon={faTrashCan} />
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

export default LeavePolicy