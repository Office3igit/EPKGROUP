import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { CSVLink } from 'react-csv';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function EventList() {

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';


    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------
    // Navigat to editevent
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editevent/${id}`);
    };

    const [loading, setLoading] = useState(true);
    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------
    // DATA FETCH FROM API LIST THE TABLE DATA

    const [tableData, setTableData] = useState([]);

    const fetchTableData = async () => {

        const apiUrl = `https://epkgroup.in/crm/api/public/api/view_event_list`;
        try {
            const response = await axios.post(apiUrl,
                {
                    emp_id: userData.userempid,
                    user_roleid: userData.userrole,


                },
                {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
            const data = response.data.data;
            setTableData(data);
            console.log("setTableData", data)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchTableData();
    }, []);
    // ------------------------------------------------------------------------------------------------



    // ------------------------------------------------------------------------------------------------
    //    HANDLE DETELE THE TABLE LIST

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Event List. This action cannot be reversed.',
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
                const response = await fetch('https://epkgroup.in/crm/api/public/api/delete_event', {
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
                    Swal.fire('Deleted!', 'Event List has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting shift slot');
                }
            }
        } catch (error) {
            console.error('Error deleting Event List:', error);
            Swal.fire('Error', 'An error occurred while deleting the Event List. Please try again later.', 'error');
        }
    };

    // ------------------------------------------------------------------------------------------------

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const componentRef = React.useRef();

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
        const csvData = tableData.map(({ e_title, teamname, membername, e_date, e_start_time, e_end_time, e_agenda, approved_approval, rejected_approval }, index) => ({
            '#': index + 1,
            e_title,
            teamname,
            membername,
            e_date,
            e_start_time,
            e_end_time,
            e_agenda,
            approved_approval: approved_approval || '-',
            rejected_approval: rejected_approval || '-'
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Name', key: 'e_title' },
            { label: 'Team', key: 'teamname' },
            { label: 'Members', key: 'membername' },
            { label: 'Date', key: 'e_date' },
            { label: 'Start Time', key: 'e_start_time' },
            { label: 'End Time', key: 'e_end_time' },
            { label: 'Reason', key: 'e_agenda' },
            { label: 'Approved List', key: 'approved_approval' },
            { label: 'Rejected List', key: 'rejected_approval' },



        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Eventlist.csv',
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

        const data = tableData.map(({ e_title, teamname, membername, e_date, e_start_time, e_end_time, e_agenda, approved_approval, rejected_approval }, index) => [
            index + 1,
            e_title,
            teamname,
            membername,
            e_date,
            e_start_time,
            e_end_time,
            e_agenda,
            approved_approval || '-',
            rejected_approval || '-'
        ]);

        doc.autoTable({
            head: [['S.No', 'Title', 'Teams', 'Members', 'Date', 'Start Time', 'End Time', 'Agenda', 'Approved List', 'Rejected List']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
            columnStyles: {
                0: { cellWidth: 30, halign: 'center' }, // S.No
                1: { cellWidth: 80 }, // Name
                2: { cellWidth: 80 }, // Team
                3: { cellWidth: 100 }, // Members
                4: { cellWidth: 60 }, // Date
                5: { cellWidth: 60 }, // Start Time
                6: { cellWidth: 60 }, // End Time
                7: { cellWidth: 100 }, // Reason
                8: { cellWidth: 100 }, // Reason
                9: { cellWidth: 100 } // Reason
            }
        });

        doc.save('Eventlist.pdf');

    };

    // PDF End
    // ========================================

    const filteredData = tableData.filter((row) =>
        Object.values(row).some(
            (value) =>
                (typeof value === 'string' || typeof value === 'number') &&
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const pageCount = Math.ceil(tableData.length / itemsPerPage);

    const filteredEvents = filteredData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );


    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // ========================================

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


    // ------------------------------------------------------------------------------------------------
    // APPROVAL AND REJECTED EVENT BY USERS

    const [eventId, setEventID] = useState('');
    const [approvalType, setApprovalType] = useState('');
    const [reason, setReason] = useState('');

    const handleActionAcceptandReject = async () => {
        try {
            const formData = new FormData();

            formData.append('event_id', eventId);
            formData.append('eventemp_id', userData.userempid);
            formData.append('event_status', approvalType);
            formData.append('event_reason', reason);

            const response = await fetch('https://epkgroup.in/crm/api/public/api/approval_event', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            const responseData = await response.json();

            if (responseData.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: responseData.message || 'Reason submitted Successfully.',
                });
                toggleModal();
                fetchTableData();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: responseData.message || "Can't add Reason, try again",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error in Submission',
            });
        }
    };

    const [reasonShow, setReasonShow] = useState(false);

    const handleReasonClose = () => {
        setReasonShow(false);
        setFormErrors({});
    }

    const toggleModal = () => {
        setReasonShow(!reasonShow);
    };

    const handleReasonShow = (item, status) => {
        setReasonShow(!reasonShow);
        setApprovalType(status);
        setEventID(item.id)
    }

    const [formErrors, setFormErrors] = useState({});
    const HandleReasonSubmit = () => {
        const errors = {};

        if (!reason) {
            errors.reason = 'Reason is required.';
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        toggleModal();
        handleActionAcceptandReject()
    }

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------
    // APPROVAL AND REJECTED EVENT SEEN BY ADMIN

    const [modalData, setModalData] = useState([]);
    const [modalReasonHeading, setModalReasonHeading] = useState([]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = async (item, status) => {
        setShow(true);
        try {

            const response = await axios.get(`https://epkgroup.in/crm/api/public/api/event_status_list/${item.id}/${status}`, {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            setModalData(response.data.data);
            console.log(" setModalData response.data.data-->", response.data.data)
            setModalReasonHeading(status)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // ------------------------------------------------------------------------------------------------



    // const Agenta = {
    //     display: '-webkit-box',
    //     WebkitLineClamp: '3',
    //     WebkitBoxOrient: 'vertical',
    //     overflow: 'hidden',
    //     textOverflow: 'ellipsis',
    //     whiteSpace: 'normal',
    //     height: '5.2em',
    //     lineHeight: '1.5em',
    //     cursor: 'pointer',
    //     wordBreak: 'break-word'
    // };

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleOpenModal = (content) => {
        setModalContent(content);
        setShowModal(true);
        setFormErrors({});
    };

    const handleCloseModal = () => {
        setShowModal(false);

        setFormErrors({});
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

            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f6f6f6'
                }}>
                    <ScaleLoader color="#36d7b7" />
                </div>
            ) : (

                <div style={{ maxWidth: '100%', overflowX: 'auto', paddingTop: '7vh', padding: '10px 40px' }}>

                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Event List</h3>

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


                    <div ref={componentRef} style={{ width: '100%', overflowX: 'auto' }}>
                        <table className="table" style={{ minWidth: '100%', width: 'max-content' }}>
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '100px' }}>S.No</th>
                                    <th style={{ width: '150px' }}>Title</th>
                                    <th style={{ width: '150px' }}>Teams</th>
                                    <th style={{ width: '250px' }}>Members</th>
                                    <th style={{ width: '150px' }}>Date</th>
                                    <th style={{ width: '150px' }}>Start Time</th>
                                    <th style={{ width: '150px' }}>End Time</th>
                                    <th style={{ width: '300px' }}>Agenda</th>
                                    {(userrole === "1" || userrole === "2") && (<th style={{ width: '150px' }}>Approved List</th>)}
                                    {(userrole === "1" || userrole === "2") && (<th style={{ width: '150px' }}>Rejected List</th>)}
                                    {!(userrole === "1" || userrole === "2") && (<th style={{ width: '150px' }}>Reason</th>)}
                                    <th style={{ width: '250px' }} className='no-print'>Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {

                                    filteredEvents.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center' }}>No search data found</td>
                                        </tr>
                                    ) : (


                                        filteredEvents.map((event, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{event.e_title}</td>
                                                <td>{event.teamname}</td>
                                                <td>{event.membername}</td>
                                                <td>{event.e_date}</td>
                                                <td>{event.e_start_time}</td>
                                                <td>{event.e_end_time}</td>

                                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', wordBreak: 'break-word', cursor: 'pointer', }}
                                                    onClick={() => handleOpenModal(event.e_agenda)}>{event.e_agenda}</td>

                                                {(userrole === "1" || userrole === "2") && (<td onClick={() => handleShow(event, 'Approved')} style={{ cursor: 'pointer' }} >{event.approved_approval || '-'}</td>)}
                                                {(userrole === "1" || userrole === "2") && (<td onClick={() => handleShow(event, 'Rejected')} style={{ cursor: 'pointer' }} >{event.rejected_approval || '-'}</td>)}
                                                {!(userrole === "1" || userrole === "2") && (<td>{event.empreason}</td>)}

                                                {(userrole === "1" || userrole === "2") ? (
                                                    <td className='no-print'>
                                                        <button className="btn-edit"
                                                            style={{ marginRight: '10px' }}
                                                            onClick={() => { GoToEditPage(event.id) }}>Edit <FontAwesomeIcon icon={faPen} /></button>
                                                        <button className="btn-delete"
                                                            onClick={() => handleDelete(event.id)}>Delete <FontAwesomeIcon icon={faTrashCan} /></button>
                                                    </td>
                                                ) :
                                                    event.emp_status == null ? (
                                                        <td>
                                                            <button className="btn btn-info btn-sm mr-2"
                                                                style={{ width: '40%', backgroundColor: '#0d6efd', borderColor: '#0d6efd', color: 'white', marginRight: '10px' }}
                                                                onClick={() => { handleReasonShow(event, 'Approved') }}>Approve</button>
                                                            <button className="btn btn-danger btn-sm" style={{ width: '40%' }}
                                                                onClick={() => { handleReasonShow(event, 'Rejected') }}>Reject</button>
                                                        </td>) : (
                                                        <td>{event.emp_status}</td>
                                                    )
                                                }

                                            </tr>
                                        ))

                                        // =====================

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
                            pageCount={pageCount}
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
                    {/* APPROVAL AND REJECTED EVENT SEEN BY ADMIN */}
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{modalReasonHeading} Reasons</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th style={{ width: '30%' }}>Name</th>
                                        <th style={{ width: '70%' }}>Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData.map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.membername}</td>
                                            <td>{data.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    {/* ------------------------------------------------------------------------------------------------ */}

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* APPROVAL AND REJECTED EVENT BY USERS */}
                    <Modal show={reasonShow} onHide={handleReasonClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Selected Type: {approvalType}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group controlId="reasonTextArea">
                                <Form.Label>Reason</Form.Label>
                                <Form.Control as="textarea" rows={4} onChange={(e) => setReason(e.target.value)} value={reason} />
                                {formErrors.reason && <span className="text-danger">{formErrors.reason}</span>}
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={HandleReasonSubmit}>
                                Submit
                            </Button>
                            <Button variant="secondary" onClick={handleReasonClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    {/* ------------------------------------------------------------------------------------------------ */}

                    {/* ---------------------------------------------------------------------------------------- */}
                    {/* AGENTA CONTENT */}
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Agenta</Modal.Title>
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


                </div >
            )}


        </>


    );
}