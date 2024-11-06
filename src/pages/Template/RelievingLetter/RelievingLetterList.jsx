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
import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function RelievingLetterList() {

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
        navigate(`/admin/editrelievingletter/${id}`);
    };

    const GoToViewPage = (id, layout_id) => {
        navigate(`/admin/relievingletterview/${id}/${layout_id}`);
    };

    const [loading, setLoading] = useState(true);
    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchTableData();
    }, []);

    const fetchTableData = async () => {
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/relieving_list', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                console.log(responseData.data)
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
    //    HANDLE DETELE THE TABLE LIST

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Relieving Letter List. This action cannot be reversed.',
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
                    Swal.fire('Deleted!', 'Relieving Letter List has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting shift slot');
                }
            }
        } catch (error) {
            console.error('Error deleting Relieving Letter List:', error);
            Swal.fire('Error', 'An error occurred while deleting the Relieving Letter List. Please try again later.', 'error');
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
        const csvData = tableData.map(({ date, hrms_emp_id, employee_names, department_name,role_name, }, index) => ({
            '#': index + 1,
            date,
            hrms_emp_id,
            employee_names,
            department_name,
            role_name
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Date', key: 'date' },
            { label: 'Emp-ID', key: 'hrms_emp_id' },
            { label: 'Employee Name', key: 'employee_names' },
            { label: 'Department', key: 'department_name' },
            { label: 'Role', key: 'role_name' },
            
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'RelievingList.csv',
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

        const data = tableData.map(({ date, hrms_emp_id,employee_names, department_name,role_name }, index) => [
            index + 1,
            date,
            hrms_emp_id,
            employee_names,
            department_name,
            role_name
        ]);

        doc.autoTable({
            head: [['S.No', 'Date', 'Emp-ID','Employee Name', 'Department','Role']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
            // columnStyles: {
            //     0: { cellWidth: 30, halign: 'center' }, // S.No
            //     1: { cellWidth: 80 }, // Name
            //     2: { cellWidth: 80 }, // Team
            //     3: { cellWidth: 100 }, // Members
            //     4: { cellWidth: 60 }, // Date
            //     5: { cellWidth: 60 }, // Start Time
            //     6: { cellWidth: 60 }, // End Time
            //     7: { cellWidth: 100 }, // Reason
            //     8: { cellWidth: 100 }, // Reason
            //     9: { cellWidth: 100 } // Reason
            // }
        });

        doc.save('RelievingList.pdf');

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

                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Relieving Letter List</h3>

                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between' }}>
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
                                    <th>S.No</th>
                                    <th>Date</th>
                                    <th>Emp-ID</th>
                                    <th>Employee Name</th>
                                    <th>Department</th>
                                    <th>Role</th>
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


                                        filteredEvents.map((row, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{row.date}</td>
                                                <td>{row.hrms_emp_id}</td>
                                                <td>{row.employee_names}</td>
                                                <td>{row.department_name}</td>
                                                <td>{row.role_name}</td>

                                                <td className='no-print'>
                                                    <span style={{ display: 'flex', gap: '5px' }}>
                                                        <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                            <FontAwesomeIcon icon={faPen} /> Edit
                                                        </button>
                                                        <button className="btn-view" onClick={() => { GoToViewPage(row.id, row.layout_id) }}>
                                                            <FontAwesomeIcon icon={faEye} /> View
                                                        </button>
                                                    </span>
                                                </td>


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



                </div >
            )}


        </>


    );
}