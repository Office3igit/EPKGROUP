import React, { useState } from 'react'
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
// import './css/addshiftslotstyle.css'
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';


function EmployeeConfirmation() {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editshiftslot/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // Add Shift Slot submit

    const [shift, setShift] = useState('');
    const [status, setStatus] = useState('');
    const [formErrors, setFormErrors] = useState({});


    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);



    const fetchData = async () => {
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/employee_confirmation_list', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                console.log("responseData.data", responseData.data)
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
        const csvData = tableData.map(({ employee_id, emp_name, department_name, role_name, doj, confirmation_date, con_status, conf_reason }, index) => ({
            '#': index + 1,
            employee_id,
            emp_name,
            department_name,
            role_name,
            doj,
            confirmation_date,
            con_status,
            conf_reason,

        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Employee ID', key: 'employee_id' },
            { label: 'Employee Name', key: 'emp_name' },
            { label: 'Department', key: 'department_name' },
            { label: 'Role', key: 'role_name' },
            { label: 'doj', key: 'doj' },
            { label: 'Confirmation', key: 'confirmation_date' },
            { label: 'Status', key: 'con_status' },
            { label: 'Reason', key: 'conf_reason' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'EmployeeConfirmation.csv',
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

        const data = tableData.map(({ employee_id, emp_name, department_name,role_name, doj, confirmation_date, con_status, conf_reason }, index) => [
            index + 1,
            employee_id,
            emp_name,
            department_name,
            role_name,
            doj,
            confirmation_date,
            con_status,
            conf_reason,
        ]);

        doc.autoTable({
            head: [['S.No', 'Employee ID', 'Employee Name', 'Department', 'Role', 'doj', 'Confirmation', 'Status', 'Reason']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('EmployeeConfirmation.pdf');

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


    const [showModal, setShowModal] = useState(false);

    const handleClosemoodboard = () => {
        setShowModal(false)
        setFormErrors({});
    };
    const [selectedId, setSelectedId] = useState(null);

    const handleUpdateClick = (id, con_status, reason, employee_category_id) => {
        setSelectedId(id);
        setEmployeeCategory(employee_category_id);


        setEmpStatus(con_status)
        if (reason !== '-') {
            setReason(reason)
        } else {
            setReason('')
        }
        setShowModal(true);
    };


    const doj = filteredleaveData.find(item => item.id === selectedId)?.doj;



    const [empStatus, setEmpStatus] = useState('pending');
    const [employeeCategory, setEmployeeCategory] = useState('');
    console.log("employeeCategory:", employeeCategory)
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [reason, setReason] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axios.get(`https://epkgroup.in/crm/api/public/api/employee_categorylist`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                // setCategories(response.data.data);
                // Filter out the category with the employee_category 'Probation'
                const filteredCategories = response.data.data.filter(category => category.employee_category !== 'Probation');
                setCategories(filteredCategories);

            } catch (error) {
                console.error('Oops! There was an error fetching categories:', error);
            }
        }
        fetchCategories();
    }, [usertoken]);



    const [refreshKey, setRefreshKey] = useState(0);

    const handleSaveChanges = async () => {
        const errors = {};

        if (!reason) {
            errors.reason = 'Reason is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});


        const requestData = {
            id: selectedId,
            confirmation_status: empStatus,
            no_of_days: numberOfDays,
            confirmed_date: numberOfDays > 0 ? doj : '',
            employee_category: employeeCategory,
            reason: reason,
            updated_by: userempid
        };

        try {
            const response = await axios.put('https://epkgroup.in/crm/api/public/api/employee_confirmation_update', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            const { status, message } = response.data;
            if (status === 'success') {
                Swal.fire('Success', message, 'success');
                setRefreshKey(prevKey => prevKey + 1);
                setShowModal(false)
                setEmpStatus('')
                setNumberOfDays('')
                setReason('')
                setEmployeeCategory('')
            } else {
                Swal.fire('Operation Failed', message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Oops! There was an error processing your request.', 'error');
            console.error('API Error:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    // ---------------------------------------------------------------------------------------------

    const conf_reason = {
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        wordBreak: 'break-word',
        cursor: 'pointer',
    };

    const [showModalreason, setShowModalreason] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleOpenModal = (content) => {
        setModalContent(content);
        setShowModalreason(true);
    };

    const handleCloseModal = () => {
        setShowModalreason(false);
        setModalContent('');
    };

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
                <h3 className='mb-5'>Employee Confirmation</h3>



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

                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col" style={{ width: '3%' }}>S.No</th>
                                <th scope="col" style={{ width: '11.11%' }}>Emp-ID</th>
                                <th scope="col" style={{ width: '15%' }}>Employee Name</th>
                                <th scope="col" style={{ width: '15%' }}>Department</th>
                                <th scope="col" style={{ width: '15%' }}>Role</th>
                                <th scope="col" style={{ width: '11.11%' }}>DOJ</th>
                                <th scope="col" style={{ width: '11.11%' }}>Confirmation</th>
                                <th scope="col" style={{ width: '11.11%' }}>Status</th>
                                <th scope="col" style={{ width: '15%' }}>Reason</th>
                                <th scope="col" style={{ width: '3' }} className='no-print'>Action</th>
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
                                                <td>{row.employee_id}</td>
                                                <td>{row.emp_name}</td>
                                                <td>{row.department_name}</td>
                                                <td>{row.role_name}</td>
                                                <td>{row.doj}</td>
                                                <td>{row.confirmation_date || "-"}</td>
                                                <td>{row.con_status}</td>
                                                <td style={conf_reason} onClick={() => handleOpenModal(row.conf_reason)}>{row.conf_reason}</td>
                                                <td className='no-print'>{row.con_status ?

                                                    <button className="btn-edit" onClick={() => { handleUpdateClick(row.id, row.con_status, row.conf_reason, row.employee_category_id) }}>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>

                                                    : '-'}</td>




                                                {/* <td style={{ display: 'flex', gap: '10px' }}>
                                                        <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                            <FontAwesomeIcon icon={faPen} />
                                                        </button>
                                                        <button className="btn-delete" onClick={() => handleDelete(row.id)}>
                                                            <FontAwesomeIcon icon={faTrashCan} />
                                                        </button>
                                                    </td> */}
                                            </tr>
                                        );
                                    })

                                )}
                        </tbody>
                    </table>

                </div>


                {/* ---------------------------------------------------------------------------------------- */}

                <Modal show={showModalreason} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reason</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ wordBreak: 'break-word' }}>
                        {modalContent}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* ---------------------------------------------------------------------------------------- */}


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



                <Modal show={showModal} onHide={handleClosemoodboard}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Employee Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>

                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Control as="select" value={empStatus} onChange={e => setEmpStatus(e.target.value)}>
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Extended">Extended</option>
                                    <option value="Withdrawn">Withdrawn</option>
                                </Form.Control>
                            </Form.Group>
                            {(empStatus === "Confirmed") && (
                                <Form.Group>
                                    <Form.Label>Employee Category</Form.Label>
                                    <Form.Control as="select" value={employeeCategory} onChange={e => setEmployeeCategory(e.target.value)}>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.employee_category}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            )}
                            {(empStatus === "Extended") && (
                                <Form.Group>
                                    <Form.Label>Number of Days</Form.Label>
                                    <Form.Control type="number" value={numberOfDays} onChange={e => setNumberOfDays(e.target.value)} />
                                </Form.Group>
                            )}
                            <Form.Group>
                                <Form.Label>Reason</Form.Label>
                                <Form.Control as="textarea" rows={3} value={reason} onChange={e => setReason(e.target.value)} />
                                {formErrors.reason && <span className="text-danger">{formErrors.reason}</span>}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClosemoodboard()}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => handleSaveChanges()}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* ------------------------------------------------------------------------------------------------ */}


            </Container>


            {/* )} */}
        </>



    )
}

export default EmployeeConfirmation