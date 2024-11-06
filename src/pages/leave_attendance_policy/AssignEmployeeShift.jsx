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
import Multiselect from 'multiselect-react-dropdown';
import { MultiSelect } from 'react-multi-select-component';
import { faChevronRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';


function Attendancelocation() {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editemployeeshift/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // Add Shift Slot submit

    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [shiftSlot, setShiftSlot] = useState('');
    const [shiftSlots, setShiftSlots] = useState([]);
    const [selectedWeekOff, setSelectedWeekOff] = useState([]);
    const [status, setStatus] = useState('');
    const [formErrors, setFormErrors] = useState({});




    const formattedWeekOffOptions = [
        { value: '1', label: 'Sunday' },
        { value: '2', label: 'Monday' },
        { value: '3', label: 'Tuesday' },
        { value: '4', label: 'Wednesday' },
        { value: '5', label: 'Thursday' },
        { value: '6', label: 'Friday' },
        { value: '7', label: 'Saturday' },
    ];

    const formattedWeekOffDropdown = formattedWeekOffOptions.map(option => ({
        label: option.label,
        value: option.value
    }));

    const handleSelectWeekOffChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => String(option.value));
        setSelectedWeekOff(selectedValues);
    };
    // --------------------------------------------------------------------------------------------------------


    // -------------------------------------- Role Dropdown ----------------------------------------------------

    useEffect(() => {
        const fetchrole = async () => {
            try {
                const response = await axios.get('https://epkgroup.in/crm/api/public/api/userrolelist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setDepartmentDropdown(data);
                // console.log("setDepartmentDropdown", data)
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchrole();
    }, []);

    const formattedDepartmentDropdown = departmentDropdown.map(department => ({
        label: department.role_name,
        value: department.id
    }));

    const handleSelectDepartmentChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedDepartment(selectedIds);
    };

    const formattedSelectedDepartment = selectedDepartment ? selectedDepartment.join(',') : null;


    // ---------------------------------------------------------------------------------------------------------


    // --------------------------------------- Employee Dropdown ------------------------------------------------

    useEffect(() => {
        const apiUrl = `https://epkgroup.in/crm/api/public/api/employee_dropdown_list/${formattedSelectedDepartment}`;
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
                // console.log("setEmployeesDropdown", data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [formattedSelectedDepartment]);


    const formattedEmployeesDropdown = employeesDropdown.map(employee => ({
        label: employee.emp_name,
        value: employee.emp_id
    }));

    const handleSelectEmployeeChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedEmployee(selectedIds);
    };

    const formattedSelectedEmployees = selectedEmployee ? selectedEmployee.join(',') : null;


    // ------------------------------------------------------------------------------------------------

    useEffect(() => {
        const fetchShiftSlots = async () => {
            try {
                const response = await axios.get('https://epkgroup.in/crm/api/public/api/shiftslotlist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setShiftSlots(data);
                // console.log('setShiftSlots', data)
            } catch (error) {
                console.error('Error fetching shift slots:', error);
            }
        };

        fetchShiftSlots();
    }, []);

    // ------------------------------------------------------------------------------------------------


    // const selectedValues = weekOff.map(option => option.value);


    const [refreshKey, setRefreshKey] = useState(0);

    // console.log("selectedWeekOff.join(', ')", selectedWeekOff.join(', '))

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};

        if (!selectedDepartment) {
            errors.selectedDepartment = 'Department is required.';
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
        if (!shiftSlot) {
            errors.shiftSlot = 'Shift-Slot is required.';
        }

        if (!selectedWeekOff.length) {
            errors.selectedWeekOff = 'WeekOff is required.';
        }
        if (!status) {
            errors.status = 'Status is required.';
        }



        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const requestData = {


            department_id: selectedDepartment.join(', '),
            emp_id: selectedEmployee.join(', '),
            start_date: startDate,
            end_date: endDate,
            shift_slotid: shiftSlot,
            week_off: selectedWeekOff.join(','),
            // week_off: Array.isArray(selectedWeekOff) ? selectedWeekOff.join(',') : '',
            shift_status: status,
            created_by: userempid
        };



        axios.post('https://epkgroup.in/crm/api/public/api/employeeshiftinsert', requestData, {
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

                    setStartDate('');
                    setEndDate('');
                    setStatus('');
                    setSelectedDepartment('');
                    setSelectedEmployee('');
                    setSelectedWeekOff('');
                    setShiftSlot('');

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
                    text: 'There was an error creating the Employee Shift. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };

    const handleCancel = () => {

        setStartDate('');
        setEndDate('');
        setStatus('');
        setSelectedDepartment('');
        setSelectedEmployee('');
        setSelectedWeekOff([]);
        setShiftSlot('');
        setFormErrors({});
    };





    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/view_employeeshift', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data || []);
                console.log("setTableData ->->->->->->", responseData.data)
                setLoading(false);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // ------------------------------------------------------------------------------------------------

    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Employee shift. This action cannot be reversed.',
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
                const response = await fetch('https://epkgroup.in/crm/api/public/api/delete_employeeshift', {
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
                    Swal.fire('Deleted!', 'Employee shift has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting shift slot');
                }
            }
        } catch (error) {
            console.error('Error deleting shift slot:', error);
            Swal.fire('Error', 'An error occurred while deleting the Employee shift. Please try again later.', 'error');
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
        const getWeekOffDays = (weekOffString) => {
            if (!weekOffString) {
                return ''; // Return an empty string or handle it as per your requirement
            }
            const selectedDays = weekOffString.split(',').map(dayNum => formattedWeekOffOptions.find(opt => opt.value === dayNum)?.label);
            return selectedDays.join(', ');
        };


        const csvData = tableData.map(({ hrms_emp_id,department_name, first_name, start_date, end_date, shift_slot, week_off, status }, index) => ({
            '#': index + 1,
            hrms_emp_id,
            department_name,
            first_name,
            start_date,
            end_date,
            shift_slot,
            'Week Off': getWeekOffDays(week_off), // Ensure key matches headers configuration
            status,
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Emp-ID', key: 'hrms_emp_id'},
            { label: 'Role', key: 'department_name' },
            { label: 'Employee Name', key: 'first_name' },
            { label: 'Start Date', key: 'start_date' },
            { label: 'End Date', key: 'end_date' },
            { label: 'Shift Slot', key: 'shift_slot' },
            { label: 'Week Off', key: 'Week Off' }, // Match the key with the CSV data object property
            { label: 'Status', key: 'status' },
        ];


        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'AsssignEmployeeShift.csv',
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
        const getWeekOffDays = (weekOffString) => {
            if (!weekOffString) {
                return ''; // Return an empty string or handle it as per your requirement
            }
            const selectedDays = weekOffString.split(',').map(dayNum => formattedWeekOffOptions.find(opt => opt.value === dayNum)?.label);
            return selectedDays.join(', ');
        };


        const data = tableData.map(({ hrms_emp_id,department_name, first_name, start_date, end_date, shift_slot, week_off, status }, index) => [
            index + 1,
            hrms_emp_id,
            department_name,
            first_name,
            start_date,
            end_date,
            shift_slot,
            getWeekOffDays(week_off),
            status,
        ]);

        doc.autoTable({
            head: [['S.No', 'Emp-ID','Role', 'Employee Name', 'Start Date', 'End Date', 'Shift Slot', 'Week Off', 'Status']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('AsssignEmployeeShift.pdf');

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

            {/* {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f6f6f6'
                }}>
                    <ScaleLoader color="rgb(20 166 249)" />
                </div>
            ) : ( */}

            <Container fluid className='shift__container'>
                <h3 className='mb-5'>Add Employee Shift</h3>

                {/* ------------------------------------------------------------------------------------------------ */}
                {/* shift slot add form */}
                <div className='mb-5' style={{ background: '#ffffff', padding: '60px 10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="formRole">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Role Name <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
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
                                <Form.Group controlId="formEmployee">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Employee Name <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <MultiSelect
                                        options={formattedEmployeesDropdown}
                                        value={formattedEmployeesDropdown.filter(option => selectedEmployee.includes(option.value))}
                                        onChange={handleSelectEmployeeChange}
                                        labelledBy="Select"
                                    />
                                    {formErrors.selectedEmployee && <span className="text-danger">{formErrors.selectedEmployee}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formStartDate">
                                    <Form.Label>Start Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control type="date" value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)} 
                                    max={endDate || "9999-12-31"}
                                     />
                                    {formErrors.startDate && <span className="text-danger">{formErrors.startDate}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formEndDate">
                                    <Form.Label>End Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control type="date" 
                                    value={endDate} onChange={(e) => setEndDate(e.target.value)} 
                                    max="9999-12-31"
                                    min={startDate || "0001-01-01"}  // Set min to start date if selected

                                     />
                                    {formErrors.endDate && <span className="text-danger">{formErrors.endDate}</span>}
                                </Form.Group>
                            </Col>
                        </Row>


                        <Row>
                            <Col>
                                <Form.Group controlId="formShiftSlot">
                                    <Form.Label>Shift Slot <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control as="select" value={shiftSlot} onChange={(e) => setShiftSlot(e.target.value)}>
                                        <option value="" disabled>Select Shift Slot</option>
                                        {shiftSlots.map(slot => (
                                            <option key={slot.id} value={slot.id}>{slot.shift_slot}</option>
                                        ))}
                                    </Form.Control>
                                    {formErrors.shiftSlot && <span className="text-danger">{formErrors.shiftSlot}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formWeekOff">
                                    <Form.Label>Week Off <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <MultiSelect
                                        options={formattedWeekOffDropdown} // Ensure each option has both label and value
                                        value={formattedWeekOffDropdown.filter(option => selectedWeekOff.includes(String(option.value)))}
                                        onChange={handleSelectWeekOffChange}
                                        labelledBy="formWeekOff"
                                        disableSearch
                                        displayValue="label" // Specify to display labels
                                    />
                                    {formErrors.selectedWeekOff && <span className="text-danger">{formErrors.selectedWeekOff}</span>}
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formStatus">
                                    <Form.Label>Status <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Form.Control>
                                    {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
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
                <h3 className='mb-5'> Employee Shift List</h3>
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
                                <th scope="col">Role</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Shift Slot</th>
                                <th scope="col">Week Off</th>
                                <th scope="col">Status</th>
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


                                        // Function to convert week_off string into readable format
                                        const getWeekOffDays = (weekOffString) => {
                                            const selectedDays = weekOffString.split(',').map(dayNum => formattedWeekOffOptions.find(opt => opt.value === dayNum)?.label);
                                            return selectedDays.join(', ');
                                        };




                                        return (
                                            <tr key={row.id}>
                                                <th scope="row">{serialNumber}</th>
                                                <td>{row.hrms_emp_id}</td>
                                                <td>{row.first_name}</td>
                                                <td>{row.department_name}</td>
                                              
                                                <td>{row.start_date}</td>
                                                <td>{row.end_date}</td>
                                                <td>{row.shift_slot}</td>
                                                <td>{getWeekOffDays(row.week_off)}</td>
                                                <td>{row.status}</td>
                                                <td className="no-print" style={{ display: 'flex', gap: '10px' }}>
                                                    <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>
                                                    {/* onClick={() => handleDelete(row.id)} */}
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


            {/* )} */}
        </>



    )
}

export default Attendancelocation