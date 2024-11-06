import React, { useState } from 'react'
import { Container } from 'react-bootstrap';
// import './css/addshiftslotstyle.css'
import { useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';




function MonthlyAttendance() {

    // ------------------------------------------------------------------------------------------------
    const navigate = useNavigate();
    const handlevisitcalendar = (id, first_name) => {

        navigate(`/admin/monthlyattendancecalendar/${id}/?name=${first_name}`);
    };

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';


    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [refreshKey, setRefreshKey] = useState(0);


    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [refreshKey]); // Ensure refreshKey is defined in parent and changes to trigger re-fetch

    const fetchData = async () => {
        setLoading(true); // Ensure loading is set before fetching
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/get_monthlyAttendanceList', {
                method: 'POST', // Set the method to POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                },
                body: JSON.stringify({
                    roleid: userrole,
                    loginempid: userempid,

                })
            });

            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                console.log("setTableData-monthly", responseData.data)

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
        const csvData = tableData.map(({ hrms_emp_id,first_name, department_name, role_name, days_present, days_leave, days_absent, days_halfday, days_late, days_permission, ot_count }, index) => ({
            '#': index + 1,
            hrms_emp_id,
            first_name,
            department_name,
            role_name,
            days_present,
            days_leave,
            days_absent,
            days_halfday,
            days_late,
            days_permission,
            ot_count,

        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Emp-ID', key: 'hrms_emp_id' },
            { label: 'Employee Name', key: 'first_name' },
            { label: 'Department', key: 'department_name' },
            { label: 'Role', key: 'role_name' },
            { label: 'P', key: 'days_present' },
            { label: 'L', key: 'days_leave' },
            { label: 'A', key: 'days_absent' },
            { label: 'HL', key: 'days_halfday' },
            { label: 'LA', key: 'days_late' },
            { label: 'PR', key: 'days_permission' },
            { label: 'OT', key: 'ot_count' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'MonthlyAttendance.csv',
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

        const data = tableData.map(({ hrms_emp_id,first_name, department_name,role_name,days_present, days_leave, days_absent, days_halfday, days_late, days_permission, ot_count }, index) => [
            index + 1,
            hrms_emp_id,
            first_name,
            department_name,
            role_name,
            days_present,
            days_leave,
            days_absent,
            days_halfday,
            days_late,
            days_permission,
            ot_count,

        ]);

        doc.autoTable({
            head: [['S.No', 'Emp-ID','Employee Name', 'Department', 'Role', 'P', 'L', 'A', 'HL', 'LA', 'PR', 'OT']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('MonthlyAttendance.pdf');

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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Monthly Attendance</h3>



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
                                    <th style={{ width: '8%' }}>S.No</th>
                                    <th>Emp-ID</th>
                                    <th>Employee Name</th>
                                    <th>Department </th>
                                    <th>Role </th>
                                    <th>P</th>
                                    <th>L</th>
                                    <th>A</th>
                                    <th>HL</th>
                                    <th>LA</th>
                                    <th>PR</th>
                                    <th>OT</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredleaveData.length === 0 ? (
                                    <tr>
                                        <td colSpan="11" style={{ textAlign: 'center' }}>No search data found</td>
                                    </tr>
                                ) : (
                                    filteredleaveData.map((row, index) => {
                                        const serialNumber = currentPage * itemsPerPage + index + 1;
                                        return (
                                            <tr key={row.id} title="Click to know more" style={{cursor:'pointer'}}>
                                                <td>{serialNumber}</td>
                                                <td>{row.hrms_emp_id}</td>
                                                <td onClick={() => handlevisitcalendar(row.id, row.first_name)}>{row.first_name}</td>
                                                <td>{row.department_name}</td>
                                                <td>{row.role_name}</td>
                                                <td>{row.days_present}</td>
                                                <td>{row.days_leave}</td>
                                                <td>{row.days_absent}</td>
                                                <td>{row.days_halfday}</td>
                                                <td>{row.days_late}</td>
                                                <td>{row.days_permission}</td>
                                                <td>{row.ot_count}</td>


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

export default MonthlyAttendance