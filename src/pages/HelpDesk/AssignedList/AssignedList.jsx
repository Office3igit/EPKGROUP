import React, { useState } from 'react'
import { Button, Container, Modal,Form } from 'react-bootstrap';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faPen } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';

function AssignedList() {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [status, setStatus] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [isDate,setIsDate] = useState(false)
    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [IssuesType, setIssuesType] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    
    const GoToEditPage = (id) => {
        navigate(`/admin/editassignedlist/${id}`);
    };
    useEffect(() => {
        const fetchData = async () => {
            const apiUrl = 'https://epkgroup.in/crm/api/public/api/view_issuetypes';
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                setIssuesType(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [usertoken]);
    
    useEffect(() => {
        fetchDataAssign();
    }, []);

    useEffect(() => {
        const fetchrole = async () => {
            try {
                const response = await axios.get('https://epkgroup.in/crm/api/public/api/department_list', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                // Filter out the department with id 1
                const filteredData = data.filter(department => department.id !== 1);
                setDepartmentDropdown(filteredData);
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchrole();
    }, [usertoken]);

        // Helper function to reformat the date
const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-'); // Split the date string
    return `${day}-${month}-${year}`; // Return in dd-mm-yyyy format
};

const applyFilter = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('department_id', selectedDepartment);
    formData.append('issue_type', selectedEmployee);
    if(!userrole === "1" || !userrole === "2") {
    formData.append('emp_id', userempid);
    }
    formData.append('from_date', fromDate);
    formData.append('to_date', toDate);
    formData.append('status', status);

    try {
        const response = await fetch('https://epkgroup.in/crm/api/public/api/raiseticket_filter', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        });

        const data = await response.json();

        const { status, message } = data;

        if (status === 'success') {
            setTableData(data.data);
            setShowFilterModal(false);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,

            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error: ${error.message}`,
        });
    }
};


    const fetchDataAssign = async () => {
        const requestData = (userrole === "1" || userrole === "2") ? 
        { user_roleid: userrole, assign_empid: userempid } : {assign_empid: userempid} ;
    
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/view_newraiseassign_list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                },
                body: JSON.stringify(requestData)
            });
            if (response.ok) {
                const responseData = await response.json();

            // Transform the created_date for all items
            const transformedData = responseData.data.map(item => ({
                ...item,
                created_date: formatDate(item.created_date) // Reformat the date
            }));

            setTableData(transformedData);
            setLoading(false);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Ticket List. This action cannot be reversed.',
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
                const response = await fetch('https://epkgroup.in/crm/api/public/api/delete_raiseticket', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                    body: JSON.stringify({
                        id: id,
                        updated_by: userempid,
                        reason: reason,
                    }),
                });

                if (response.ok || response.type === 'opaqueredirect') {

                    setTableData(tableData.filter(row => row.id !== id));
                    Swal.fire('Deleted!', 'Ticket List has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting Ticket List');
                }
            }
        } catch (error) {
            console.error('Error deleting Ticket List:', error);
            Swal.fire('Error', 'An error occurred while deleting the Ticket List. Please try again later.', 'error');
        }
    };

    // ------------------------------------------------------------------------------------------------


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
        const csvData = tableData.map(({ emp_name, ticket_id,created_by,department_name,status_description, created_date, hrms_emp_id, issue_name }, index) => ({
            '#': index + 1,
            emp_name,
            ticket_id, 
            created_by,
            department_name,
            created_date,
            status_description,
            hrms_emp_id,
            issue_name,
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Ticket ID', key: 'ticket_id' },
            { label: 'Created Date', key: 'created_date' },
            { label: 'Created By', key: 'created_by' },
            { label: 'Department Name', key: 'department_name' },
            { label: 'Employee Name', key: 'emp_name' },
            { label: 'Employee ID', key: 'hrms_emp_id' },
            { label: 'Issue Name', key: 'issue_name' },
            { label: 'Status', key: 'status_description' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'AssignTicketRaiseList.csv',
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

        const data = tableData.map(({ emp_name, ticket_id, created_date,status_description,created_by,department_name, hrms_emp_id, issue_name }, index) => [
            index + 1,
            emp_name,
            ticket_id,
            created_date,
            created_by,
            department_name,
            hrms_emp_id,
            issue_name,
            status_description,
        ]);

        doc.autoTable({
            head: [['S.No', 'Employee Name', 'Ticket ID', 'Created Date', 'Created By', 'Department Name', 'Employee ID', 'Issue Name','Status']],
            body: data, 
        });

        doc.save('AssignTicketRaiseList.pdf');

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

    
    const formattedDepartmentDropdown = departmentDropdown.map(department => ({
        label: department.depart_name,
        value: department.id
    }));
    const handleSelectDepartmentChange = (selectedOption) => {
        setSelectedDepartment(selectedOption ? selectedOption.value : '');
    };
    
    const formattedIssuesType = IssuesType.map(employee => ({
        label: employee.issue_type,
        value: employee.id
    }));
    const handleSelectEmployeeChange = (selectedOption) => {
        setSelectedEmployee(selectedOption ? selectedOption.value : '');
    };

    const cancelFilter = () => {
        setSelectedDepartment('');
        setSelectedEmployee('');
        setFromDate('');
        setToDate('');
        setStatus('');
        setShowFilterModal(false);
        setRefreshKey()
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

            <Container style={{ padding: '10px 40px' }}>
                <h3 className="mb-5" style={{ fontWeight: 'bold', color: '#00275c' }}>Assigned List</h3>

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
                        <Button variant="primary" onClick={() => setShowFilterModal(true)} >
                        <FontAwesomeIcon icon="fa-solid fa-filter" /> Filter
                        </Button>
                        <Modal show={showFilterModal} onHide={cancelFilter} dialogClassName="custom-modal">
                                <Modal.Header closeButton>
                                    <Modal.Title>Filter</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        {/* {(userrole === "1" || userrole === "2") && ( */}
                                            <>
                                                <Form.Group controlId="formRole">
                                                    <Form.Label style={{ fontWeight: 'bold' }}>Department</Form.Label>
                                                    <Select
                                                        options={formattedDepartmentDropdown}
                                                        value={formattedDepartmentDropdown.find(option => option.value === selectedDepartment)}
                                                        onChange={handleSelectDepartmentChange}
                                                        isClearable
                                                    />
                                                </Form.Group>
                                                <Form.Group controlId="formEmployee">
                                                    <Form.Label style={{ fontWeight: 'bold' }}>Issues Type</Form.Label>
                                                    <Select
                                                        options={formattedIssuesType}
                                                        value={formattedIssuesType.find(option => option.value === selectedEmployee)}
                                                        onChange={handleSelectEmployeeChange}
                                                        isClearable
                                                    />
                                                </Form.Group>
                                            </>
                                        {/* )}*/}
                                        <Form.Group controlId="fromDate">
                                            <Form.Label>From Date</Form.Label>
                                            <Form.Control type="date" value={fromDate} max="9999-12-31" onChange={(e) => {setFromDate(e.target.value); setIsDate(true)}} />
                                        </Form.Group>
                                        {isDate &&
                                        <Form.Group controlId="toDate">
                                            <Form.Label>To Date</Form.Label>
                                            <Form.Control type="date" value={toDate} max="9999-12-31" onChange={(e) => setToDate(e.target.value)} />
                                        </Form.Group>}
                                        <Form.Group controlId="status">
                                            <Form.Label>Status</Form.Label>
                                            <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                                <option value="">Select Status</option>
                                                <option value="1">Pending</option>
                                                <option value="2">In-Progress</option>
                                                <option value="3">Completed</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={cancelFilter}>Cancel</Button>
                                    <Button variant="primary" onClick={applyFilter}>Apply Filter</Button>
                                </Modal.Footer>
                            </Modal>
                    </div>
                    <div>
                        <button style={myStyles}>{handleExportCSV()}</button>
                        <button style={myStyles} onClick={handleExportPDF}><i className="fas fa-file-pdf" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
                        <button style={myStyles} onClick={handlePrint}><i className="fas fa-print" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
                    </div>
                </div>
                <div ref={componentRef} style={{ width: '100%', overflowX: 'auto' }}>
                    <table className="table" style={{ minWidth: '100%', width: 'max-content' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ width: '80px' }}>S.No</th>
                                <th style={{ width: '150px' }}>Ticket ID</th>
                                <th style={{ width: '150px' }}>Raised Date</th>
                                <th style={{ width: '150px' }}>Raised By</th>
                                <th style={{ width: '150px' }}>Department</th>
                                <th style={{ width: '100px' }}>Issue Type</th>
                                <th style={{ width: '150px' }}>Employee ID</th>
                                <th style={{ width: '150px' }}>Employee Name</th>
                                <th style={{ width: '200px' }}>Status</th>
                                <th style={{ width: '200px' }}>Attachment</th>
                                <th style={{ width: '100px' }} className='no-print'>Action</th>
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
                                                <td>{row.ticket_id}</td>
                                                <td>{row.created_date}</td>
                                                {(userrole === '1' || userrole === '2') ? 
                                                <td>{row.created_by}</td> :   <td>{row.emp_name}</td>}
                                                <td>{row.department_name}</td>
                                                <td>{row.issue_name}</td>
                                                {(userrole === '1' || userrole === '2') ? <td>{row.employee_ids}</td> : <td>{row.hrms_emp_id}</td>}
                                                <td>{row.membername}</td>
                                                <td>{row.status_description}</td>
                                                <td className='no-print'>
                                                    {row.attachment !== '-' ?
                                                        <button className="btn-view" onClick={() => { window.open(`https://epkgroup.in/crm/api/storage/app/${row.attachment}`, '_blank') }}>
                                                            <FontAwesomeIcon icon="fa-solid fa-eye" />
                                                        </button>
                                                        :  
                                                            <FontAwesomeIcon 
                                                            onClick={() => alert('No attachment available for this ticket')} className="btn-file" icon={faFile} />
                                                            }
                                                </td>
                                                <td className='no-print'>
                                                    <button className="btn-edit" onClick={() => { GoToEditPage(row.id, row.ticket_id) }}>
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

export default AssignedList