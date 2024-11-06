import React, { useState } from 'react'
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
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


function AddDailyAccounts() {
    // this is office3i
    // ------------------------------------------------------------------------------------------------
    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editdailyaccounts/${id}`);
    };

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // Add Goods & Services submit

    const [date, setDate] = useState('');
    const [department, setDepartment] = useState('');
    const [userName, setUserName] = useState('');
    const [debit, setDebit] = useState('');
    const [credit, setCredit] = useState('');
    const [balanceCash, setBalanceCash] = useState('');
    const [expenses, setExpenses] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [formErrors, setFormErrors] = useState({});

    const [overallbalanceCash, setOverallBalanceCash] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};
        // Validate input fields

        if (!date) {
            errors.date = 'Date is required.';
        }

        if (!department) {
            errors.department = 'Department is required.';
        }

        if (!userName) {
            errors.userName = 'Name is required.';
        }

        if (!debit && !credit) {
            errors.debit = 'Either Debit or Credit is required';
            errors.credit = 'Either Debit or Credit is required';
        }

        if (debit > overallbalanceCash) {
            errors.debit = 'Insufficient balance.';
            if (balanceCash !== 0) {
                errors.debit = 'Insufficient balance.';
            }
        }

        if (!expenses) {
            errors.expenses = 'Nature of Expenses is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const requestData = {
            a_date: date,
            department: department,
            name: userName,
            natureof_expenses: expenses,
            debit: debit || '0',
            credit: credit || '0',
            balance_cash: balanceCash,
            created_by: userempid
        };

        axios.post('https://epkgroup.in/crm/api/public/api/add_dailyaccounts', requestData, {
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

                    setDate('');
                    setDepartment('');
                    setDebit('');
                    setCredit('');
                    setUserName('');
                    setExpenses('');
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
                    text: 'There was an error creating the Goods & Services. Please try again later.',
                });

                console.error('There was an error with the API:', error);
            });
    };

    const handleCancel = () => {
        setDate('');
        setDepartment('');
        setDebit('');
        setCredit('');
        setUserName('');
        setExpenses('');
        setFormErrors({})
    };

    const handleKeyPress = (event) => {
        const invalidChars = ['e', 'E', '.', '-'];
        if (invalidChars.includes(event.key)) {
            event.preventDefault();
        }
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/view_dailyaccounts', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                // console.log(responseData.data)
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
                text: 'You are about to delete this Goods & Services . This action cannot be reversed.',
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
                const response = await fetch('https://epkgroup.in/crm/api/public/api/delete_goodservice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                    body: JSON.stringify({
                        id: id,
                        reason: reason,
                        updated_by: userempid
                    }),
                });

                if (response.ok || response.type === 'opaqueredirect') {

                    setTableData(tableData.filter(row => row.id !== id));
                    Swal.fire('Deleted!', 'Goods & Services  has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting Goods & Services');
                }
            }
        } catch (error) {
            console.error('Error deleting Goods & Services:', error);
            Swal.fire('Error', 'An error occurred while deleting the Goods & Services. Please try again later.', 'error');
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
        const csvData = tableData.map(({ a_date, department, name, natureof_expenses, debit, credit, balance_cash }, index) => ({
            '#': index + 1,
            a_date,
            department,
            name,
            natureof_expenses,
            debit,
            credit,
            balance_cash,
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Date', key: 'a_date' },
            { label: 'Department', key: 'department' },
            { label: 'Name', key: 'name' },
            { label: 'Nature Of Expenses', key: 'natureof_expenses' },
            { label: 'Debit', key: 'debit' },
            { label: 'Credit', key: 'credit' },
            { label: 'Balance Cash', key: 'balance_cash' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'DailyAccountsList.csv',
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

        const data = tableData.map(({ a_date, department, name, natureof_expenses, debit, credit, balance_cash }, index) => [
            index + 1,
            a_date,
            department,
            name,
            natureof_expenses,
            debit,
            credit,
            balance_cash,
        ]);

        doc.autoTable({
            head: [['S.No', 'Date', 'Department', 'Name', 'Nature Of Expenses', 'Debit', 'Credit', 'Balance Cash']],
            body: data,
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 20 }, // S.No column
                1: { cellWidth: 80 }, // Date column
                2: { cellWidth: 100 }, // Department column
                3: { cellWidth: 80 }, // Name column
                4: { cellWidth: 300 }, // Nature Of Expenses column
                5: { cellWidth: 50 }, // Debit column
                6: { cellWidth: 50 }, // Credit column
                7: { cellWidth: 70 }, // Balance Cash column
            }
        });

        doc.save('DailyAccountsList.pdf');
    };

    // PDF End
    // ==================================================================================

    // Balance Cash fetch
    useEffect(() => {
        const fetchAssetId = async () => {
            try {
                const response = await axios.get('https://epkgroup.in/crm/api/public/api/balance_cash', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                });
                if (response.data.status === 'success') {

                    const data = Number(response.data.data.balance_cash);
                    const credits = Number(credit); // Ensure credit is a number too
                    const debits = Number(debit);

                    setBalanceCash(data)
                    setOverallBalanceCash(data)


                    let newBalanceCash;

                    if (credits) {
                        newBalanceCash = data + credits;
                        setBalanceCash(newBalanceCash);
                    } else if (debits) {
                        newBalanceCash = data - debits;
                        setBalanceCash(newBalanceCash);
                    }
                } else {
                    throw new Error('Failed to fetch asset ID');
                }
            } catch (err) {
                console.log(err.message);

            }
        };

        fetchAssetId();
    }, [credit, debit]);




    // ==================================================================================
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
    const Projecttype = {
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        wordBreak: 'break-word',
        cursor: 'pointer',
    };

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleOpenModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent('');
    };
    // ============================================================================


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
                    {/* <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Goods & Services</h3> */}

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* Emp Level Category  add form */}
                    <h5 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Daily Accounts</h5>
                    <Form>
                        <Row className='mb-5 shift__row'>
                            <Row >
                                <Col>
                                    <Form.Group controlId="date">
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={date}
                                            min={getCurrentDate()}
                                            max="9999-12-31"

                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                        {formErrors.date && <span className="text-danger">{formErrors.date}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="department">
                                        <Form.Label>Department</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                        />
                                        {formErrors.department && <span className="text-danger">{formErrors.department}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="userName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                        {formErrors.userName && <span className="text-danger">{formErrors.userName}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row >
                                <Col>
                                    <Form.Group controlId="debit">
                                        <Form.Label>Debit</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={debit}
                                            onChange={(e) => setDebit(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            disabled={credit}
                                        />
                                        {formErrors.debit && <span className="text-danger">{formErrors.debit}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="credit">
                                        <Form.Label>Credit</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={credit}
                                            onChange={(e) => setCredit(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            disabled={debit}
                                        />
                                        {formErrors.credit && <span className="text-danger">{formErrors.credit}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="balanceCash">
                                        <Form.Label>Balance Cash</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={balanceCash}
                                            onChange={(e) => setBalanceCash(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            disabled
                                        />
                                        {formErrors.balanceCash && <span className="text-danger">{formErrors.balanceCash}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row >
                                <Col>
                                    <Form.Group controlId="expenses">
                                        <Form.Label>Nature Of Expenses</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            value={expenses}
                                            onChange={(e) => setExpenses(e.target.value)}
                                        />
                                        {formErrors.expenses && <span className="text-danger">{formErrors.expenses}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                    <Button variant="secondary" type="button" onClick={handleCancel} className="ml-2">
                                        Cancel
                                    </Button>
                                </Col>

                            </Row>
                        </Row>
                    </Form>

                    {/* ------------------------------------------------------------------------------------------------ */}


                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}
                    <h5 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>Daily Accounts List</h5>
                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap: 'wrap', gap: '17px' }}>
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
                                    <th scope="col">Date</th>
                                    <th scope="col">Department</th>
                                    <th scope="col">Name</th>
                                    <th style={{ width: '200px' }} scope="col">Nature Of Expenses</th>
                                    <th scope="col">Debit</th>
                                    <th scope="col">Credit</th>
                                    <th scope="col">Balance Cash</th>
                                    {/* <th scope="col" className='no-print'>Action</th> */}
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
                                                    <td>{row.a_date}</td>
                                                    <td>{row.department}</td>
                                                    <td>{row.name}</td>
                                                    <td style={Projecttype} onClick={() => handleOpenModal(row.natureof_expenses)}>{row.natureof_expenses}</td>
                                                    <td>{row.debit}</td>
                                                    <td>{row.credit}</td>
                                                    <td>{row.balance_cash}</td>
                                                    {/* <td style={{ display: 'flex', gap: '10px' }} className='no-print'>
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

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Nature Of Expenses</Modal.Title>
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

export default AddDailyAccounts