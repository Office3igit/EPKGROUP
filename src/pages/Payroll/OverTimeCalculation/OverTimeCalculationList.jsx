import React, { useState } from 'react'
import { Button, Form, Container, Modal } from 'react-bootstrap';
// import './css/addshiftslotstyle.css'
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


function OverTimeCalculationList() {

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------
    // Table list view api

    const [refreshKey, setRefreshKey] = useState(0);


    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        setLoading(true); // Ensure loading is set before fetching
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/get_overtimelist', {
                method: 'POST', // Set the method to POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                },
                body: JSON.stringify({
                    role_id: userrole,
                    e_id: userempid,

                })
            });

            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                console.log("setTableData", responseData.data)

                setLoading(false);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------

    // Overtime calculation list popup

    const [overtimeModel, setOvertimeModel] = useState(false);
    // const handleCloseovertime = () => setOvertimeModel(false);
    const handleCloseovertime = () => {
        setOvertimeModel(false);
        setFormErrors({});
    };
    const handleShowovertime = () => setOvertimeModel(true);
    const [currentId, setCurrentId] = useState(null);

    // edit over time

    const handleovertimeedit = async (id) => {
        setCurrentId(id);
        handleShowovertime();
        axios.get(`https://epkgroup.in/crm/api/public/api/view_overtime/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                console.log("res.data.data", res.data.data);
                if (res.status === 200) {
                    // const DepartmentNameArray = res.data.data.emp_role ? res.data.data.emp_role.split(',').map(dept => dept.trim()) : [];
                    // const employeeArray = res.data.data.emp_id ? res.data.data.emp_id.split(',').map(member => member.trim()) : [];

                    // Since req_location and reqhrs_type seem to be numeric, don't split them
                    const Location = res.data.data.req_location ? [res.data.data.req_location] : [];
                    const OTType = res.data.data.reqhrs_type ? [res.data.data.reqhrs_type] : [];

                    setSelectedDepartment(res.data.data.emp_role);
                    setSelectedMember(res.data.data.emp_id);

                    setSelectedoverTimetype(OTType);
                    setSelectedOvertimelocation(Location);
                    setDate(res.data.data.ot_date);
                    setFromTime(res.data.data.ot_fromtime);
                    setToTime(res.data.data.ot_totime);
                    setOTRate(res.data.data.overtime_rate);
                    setOTAmount(res.data.data.ot_amount);

                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };



    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    const [formErrors, setFormErrors] = useState({});
    const handleSave = (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        if (!OT_Rate) {
            errors.OT_Rate = 'OT Rate is required';
        }
        if (!OT_Amount) {
            errors.OT_Amount = 'OT Amount is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const requestData = {
            id: currentId,
            overtime_perday: OT_Rate,
            ot_amount: OT_Amount,
            updated_by: userempid
        };

        axios.post('https://epkgroup.in/crm/api/public/api/update_overtime', requestData, {
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
                        text: response.data.message,  // Access the message from response.data
                    });
                    handleCloseovertime();
                    // Increment the refreshKey to trigger re-render
                    setRefreshKey(prevKey => prevKey + 1);
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating the shift slot. Please try again later.',
                });

                console.error('There was an error with the API:', error);
            });
    };


    // ------------------------------------------------------------------------------------------------
    // over time state

    const [date, setDate] = useState("");
    const [fromtime, setFromTime] = useState("");
    const [totime, setToTime] = useState("");
    const [OT_Rate, setOTRate] = useState("");

    console.log("OT_Rate-------->", OT_Rate)
    const [OT_Amount, setOTAmount] = useState("");

    const handleInputChangeOT = (setter) => (e) => {
        setter(e.target.value);
    };

    // ---------------------------------- Fetch departments ------------------------------------------------
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


    // -------------------------------  Fetch Members -------------------------------------------
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


    // -------------------------------- Overtime type --------------------------------------------------


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

    // -------------------------------- Attendance Location--------------------------------------------------


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
        const csvData = tableData.map(({ employee_name, emp_department, ot_hours_name, ot_location_name, shift_name, ot_date, ot_fromtime, ot_totime, overtime_rate, ot_amount, created_name, updated_name }, index) => ({
            '#': index + 1,
            employee_name,
            emp_department,
            ot_hours_name,
            ot_location_name,
            shift_name,
            ot_date,
            ot_fromtime,
            ot_totime,
            overtime_rate,
            ot_amount,
            created_name,
            updated_name


        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Name', key: 'employee_name' },
            { label: 'Department', key: 'emp_department' },
            { label: 'Type', key: 'ot_hours_name' },
            { label: 'Location', key: 'ot_location_name' },
            { label: 'Shift Slot', key: 'shift_name' },
            { label: 'Date', key: 'ot_date' },
            { label: 'From Time', key: 'ot_fromtime' },
            { label: 'To Time', key: 'ot_totime' },
            { label: 'OT Rate', key: 'overtime_rate' },
            { label: 'OT Amount', key: 'ot_amount' },
            { label: 'Created By', key: 'created_name' },
            { label: 'Updated By', key: 'updated_name' },

        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'overtimecalculation.csv',
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

        const data = tableData.map(({ employee_name, emp_department, ot_hours_name, ot_location_name, shift_name, ot_date, ot_fromtime, ot_totime, overtime_rate, ot_amount, created_name, updated_name }, index) => [
            index + 1,
            employee_name,
            emp_department,
            ot_hours_name,
            ot_location_name,
            shift_name,
            ot_date,
            ot_fromtime,
            ot_totime,
            overtime_rate,
            ot_amount,
            created_name,
            updated_name

        ]);

        doc.autoTable({
            head: [['S.No', 'Name', 'Department', 'Type', 'Location', 'Shift Slot', 'Date', 'From Time', 'To Time', 'OT Rate', 'OT Amount', 'Created By', 'Updated By']],
            body: data,
            styles: { overflow: 'linebreak' }, // For the body cells
            headStyles: { overflow: 'visible' },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 

        });

        doc.save('overtimecalculation.pdf');

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

                <Container fluid className='shift__container'>
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Over Time Calculation List</h3>



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

                        </div>
                        <div>
                            <button style={myStyles}>{handleExportCSV()}</button>
                            <button style={myStyles} onClick={handleExportPDF}><i className="fas fa-file-pdf" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
                            <button style={myStyles} onClick={handlePrint}><i className="fas fa-print" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
                        </div>
                    </div>

                    <div ref={componentRef} style={{ overflowX: 'auto', width: '100%' }}>
                        <table className="table" style={{ minWidth: '100%', width: 'max-content' }}>
                            <thead className="thead-dark">
                                <tr>
                                    <th>S.No</th>
                                    <th>Name</th>
                                    <th>Department  </th>
                                    <th>Type</th>
                                    <th>Location</th>
                                    <th>Shift Slot</th>
                                    <th>Date</th>
                                    <th>From Time</th>
                                    <th>To Time</th>
                                    <th>OT Rate</th>
                                    <th>OT Amount</th>
                                    <th>Created By</th>
                                    <th>Updated By</th>
                                    {(userrole === "1" || userrole === "2") && (<th className='no-print'>Action</th>)}


                                </tr>
                            </thead>

                            <tbody>
                                {filteredleaveData.length === 0 ? (
                                    <tr>
                                        <td colSpan="14" style={{ textAlign: 'center' }}>No search data found</td>
                                    </tr>
                                ) : (
                                    filteredleaveData.map((row, index) => {
                                        const serialNumber = currentPage * itemsPerPage + index + 1;
                                        return (
                                            <tr key={row.id}>
                                                <td>{serialNumber}</td>
                                                <td>{row.employee_name}</td>
                                                <td>{row.emp_department}</td>
                                                <td>{row.ot_hours_name}</td>
                                                <td>{row.ot_location_name}</td>
                                                <td>{row.shift_name}</td>
                                                <td>{row.ot_date}</td>
                                                <td>{row.ot_fromtime}</td>
                                                <td>{row.ot_totime}</td>
                                                <td>{row.overtime_rate}</td>
                                                <td>{row.ot_amount !== '' ? row.ot_amount : '-'}</td>
                                                <td>{row.created_name}</td>
                                                <td>{row.updated_name}</td>

                                                {(userrole === "1" || userrole === "2") && (
                                                    <td style={{ display: 'flex', gap: '10px' }} className='no-print'>
                                                        <button className="btn-edit" onClick={() => { handleovertimeedit(row.id) }}>
                                                            <FontAwesomeIcon icon={faPen} />
                                                        </button>

                                                    </td>
                                                )}

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
                    {/* Edit Over Time Calculation List */}

                    <Modal show={overtimeModel} onHide={handleCloseovertime}>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Over Time Calculation List</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="department" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Department:</Form.Label>
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
                                </Form.Group>

                                <Form.Group controlId="empName" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Member:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="empName"
                                        value={selectedMember}
                                        onChange={(e) => setSelectedMember(e.target.value)}
                                        disabled

                                    >
                                        <option value="">Select a member</option>
                                        {members.map((option) => (
                                            <option key={option.emp_id} value={option.emp_id}>{option.emp_name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="overtimetype" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Type:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="overtimetype"
                                        value={selectedoverTimetype}
                                        onChange={(e) => setSelectedoverTimetype(e.target.value)}
                                        disabled
                                    >
                                        {isOverTimetype.map((option) => (
                                            <option key={option.id} value={option.id}>{option.ot_type_name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="overtimelocation" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Location:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="overtimelocation"
                                        value={selectedOvertimelocation}
                                        onChange={(e) => setSelectedOvertimelocation(e.target.value)}
                                        disabled
                                    >
                                        {isOvertimelocation.map((option) => (
                                            <option key={option.id} value={option.id}>{option.attendance_location_name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="date" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={date}
                                        disabled
                                        onChange={handleInputChangeOT(setDate)}
                                    />
                                </Form.Group>

                                <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mb-2'>
                                    <Form.Group controlId="fromtime" style={{ width: '48%' }}>
                                        <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>From Time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="fromtime"
                                            value={fromtime}
                                            disabled
                                            onChange={handleInputChangeOT(setFromTime)}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="totime" style={{ width: '48%' }}>
                                        <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>To Time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="totime"
                                            value={totime}
                                            disabled
                                            onChange={handleInputChangeOT(setToTime)}
                                        />
                                    </Form.Group>
                                </div>

                                <Form.Group controlId="OT_Rate" className='mb-2'>
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>OT Rate</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="OT_Rate"
                                        value={OT_Rate}
                                        onKeyDown={(e) => {
                                            // Prevent entering 'e', 'E', '+', '-', and '.'
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={handleInputChangeOT(setOTRate)}
                                    />
                                    {formErrors.OT_Rate && <span className="text-danger">{formErrors.OT_Rate}</span>}
                                </Form.Group>

                                <Form.Group controlId="OT_Amount">
                                    <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>OT Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="OT_Amount"
                                        value={OT_Amount}
                                        onKeyDown={(e) => {
                                            // Prevent entering 'e', 'E', '+', '-', and '.'
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={handleInputChangeOT(setOTAmount)}
                                    />
                                    {formErrors.OT_Amount && <span className="text-danger">{formErrors.OT_Amount}</span>}
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={handleSave}>Save</Button>
                            <Button variant="secondary" onClick={handleCloseovertime}>Cancel</Button>
                        </Modal.Footer>
                    </Modal>

                </Container>


            )}
        </>



    )
}

export default OverTimeCalculationList