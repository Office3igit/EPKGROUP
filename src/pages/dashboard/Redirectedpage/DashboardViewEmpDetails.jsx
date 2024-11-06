import React, { useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';


export default function DashboardViewEmpDetails() {

    // -----------------------------------------------------------------------------------------------------------

    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    // -----------------------------------------------------------------------------------------------------------


    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const componentRef = React.useRef();
    const [loading, setLoading] = useState(true);

    // -----------------------------------------------------------------------------------------------------------

    const [attendanceData, setAttendanceData] = useState([]);
    const { aId } = useParams();
    let statusvalue;

    if (aId === 'P') {
        statusvalue = 'Present';
    }
    else if (aId === 'A') {
        statusvalue = 'Absent';
    }
    else if (aId === 'L') {
        statusvalue = 'Leave';
    }
    else if (aId === 'HL') {
        statusvalue = 'Half Day';
    }
    else if (aId === 'PR') {
        statusvalue = 'Permission';
    }
    else if (aId === 'LA') {
        statusvalue = 'Late';
    }
    else if (aId === 'ON') {
        statusvalue = 'On Duty';
    }
    else if (aId === 'ME') {
        statusvalue = 'Manual Entry';
    }

    // -----------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------------


    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get(`https://epkgroup.in/crm/api/public/api/viewemp_Details/${aId}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });

                const { data } = response.data;

                data.sort((a, b) => a.id - b.id);

                setAttendanceData(data);
                console.log("API Response", data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchData();
    }, []);

    // -----------------------------------------------------------------------------------------------------------


    // -----------------------------------------------------------------------------------------------------------
    // download options
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    // -----------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------------

    const handleExportCSV = () => {
        const csvData = attendanceData.map(({ hrms_emp_id,first_name, checkin_time, checkout_time, emp_present, emp_late,
            emp_permission,
            //  emp_onduty, 
            checkout_total_hours }, index) => {
            // Check if checkin_time is null
            const inTimeParts = checkin_time ? checkin_time.split(' ') : ['', '']; // If null, set date and time to empty strings
            const date = inTimeParts[0]; // Extracting the date
            const time = inTimeParts[1]; // Extracting the time

            const outTimeParts = checkout_time ? checkout_time.split(' ') : ['', '00:00:00'];
            const outTime = outTimeParts[1] && outTimeParts[1] !== '' ? outTimeParts[1] : '00:00:00';

            //console.log("test late -->", emp_late)

            return {
                'S.No': index + 1,
                Name: first_name,
                EmpID:hrms_emp_id,
                Date: date, // Date column
                'In Time': time, // In Time column
                'Out Time': outTime,
                'P/A/L/HL': emp_present,
                'LA': emp_late,
                'PR': emp_permission,
                // OnDuty: emp_onduty,
                //'Total Hours': checkout_total_hours,
            };
        });

        const headers = [
            { label: 'S.No', key: 'S.No' },
            { label: 'Emp-ID', key: 'EmpID' },
            { label: 'Name', key: 'Name' },
            { label: 'Date', key: 'Date' },
            { label: 'In Time', key: 'In Time' },
            { label: 'Out Time', key: 'Out Time' },
            { label: 'P/A/L/HL', key: 'P/A/L/HL' },
            { label: 'LA', key: 'LA' },
            { label: 'PR', key: 'PR' },
            // { label: 'OnDuty', key: 'OnDuty' },
            // { label: 'Total Hours', key: 'Total Hours' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: `${statusvalue}.csv`,
        };

        // Use CSVLink for CSV export
        return <CSVLink {...csvReport}><i className="fas fa-file-csv" style={{ fontSize: '25px', color: '#0d6efd' }}></i></CSVLink>;
    };

    // -----------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------------


    const handleExportPDF = () => {
        const unit = 'pt';
        const size = 'A4';

        const doc = new jsPDF('landscape', unit, size);

        const data = attendanceData.map(({ hrms_emp_id,first_name, checkin_time, checkout_time, emp_present, emp_late, emp_permission, emp_onduty, checkout_total_hours }, index) => {
            // Check if checkin_time is null
            const inTimeParts = checkin_time ? checkin_time.split(' ') : ['', '']; // If null, set date and time to empty strings
            const date = inTimeParts[0]; // Extracting the date
            const time = inTimeParts[1]; // Extracting the time


            const outTimeParts = checkout_time ? checkout_time.split(' ') : ['', '00:00:00'];
            const outTime = outTimeParts[1] && outTimeParts[1] !== '' ? outTimeParts[1] : '00:00:00';

            return [
                index + 1,
                hrms_emp_id,
                first_name,
                date, // Date column
                time, // In Time column
                outTime,
                emp_present,
                emp_late,
                emp_permission,
                // emp_onduty,
                checkout_total_hours,
            ];
        });


        const columnStyles = {
            0: { halign: 'center' }, // S.No
            1: { halign: 'left' },
            2: { halign: 'center' }, // In Time
            3: { halign: 'center' }, // Out Time
            4: { halign: 'center' }, // P / A / HL
            5: { halign: 'center' }, // LA
            6: { halign: 'center' }, // Permission
            // 7: { halign: 'center' }, // OnDuty
            //  8: { halign: 'center' }  // Total Hours
        };


        doc.autoTable({
            head: [['S.No', 'Emp-ID', 'Name', 'Date', 'In Time', 'Out Time', 'P/A/L/HL', 'LA', 'PR',
                // 'OnDuty', 
                // 'Total Hours'
            ]],
            body: data,
            headStyles: { fontStyle: 'bold', halign: 'center' }, // Styles for thead
            bodyStyles: { halign: 'center' }, // Styles for tbody
            columnStyles: columnStyles,
        });

        doc.save(`${statusvalue}.pdf`);
    };

    // -----------------------------------------------------------------------------------------------------------

    // download options end

    // -----------------------------------------------------------------------------------------------------------

    // search filter
    const filteredData = attendanceData.filter((row) =>
        Object.values(row).some(
            (value) =>
                (typeof value === 'string' || typeof value === 'number') &&
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // pagination start

    const filteredAttendanceData = filteredData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // pagination end
    // -----------------------------------------------------------------------------------------------------------


    // search filter end


    // internal styles start

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

    // internal styles end

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
                    <ScaleLoader color="#36d7b7" />
                </div>
            ) : (


                <div style={{ display: 'grid', maxWidth: '1035px', margin: '0 auto', paddingTop: '7vh' }}>

                    <h3 className="mb-5" style={{ fontWeight: 'bold', color: '#00275c' }}>Daily Attendance List - {statusvalue}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap:'wrap', gap:'17px' }}>
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(0);
                                }
                                }
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
                                    <th scope="col" style={{ textAlign: 'center' }}>S.No</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>Emp-ID</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>Employee Name</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>Date</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>In Time</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>Out Time</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>P/A/L/HL</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>LA</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>PR</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>OT</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {

                                    filteredAttendanceData.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center' }}>No search data found</td>
                                        </tr>
                                    ) : (

                                        // =======================

                                        filteredAttendanceData.map((row, index) => {
                                            const serialNumber = currentPage * itemsPerPage + index + 1;
                                            // Add a null check for checkin_time
                                            const inTimeParts = row.checkin_time ? row.checkin_time.split(' ') : ['', ''];
                                            const date = inTimeParts[0]; // Extracting the date
                                            const time = inTimeParts[1]; // Extracting the time

                                            // Handle checkout_time with defaulting to "00:00" if not present or invalid
                                            const outTimeParts = row.checkout_time ? row.checkout_time.split(' ') : ['', '00:00:00'];
                                            // Ensure the time part is valid, otherwise default to "00:00"
                                            const outTime = outTimeParts[1] && outTimeParts[1] !== '' ? outTimeParts[1] : '00:00:00';
                                            return (
                                                <tr key={row.id}>
                                                    <td style={{ textAlign: 'center' }}>{serialNumber}</td>
                                                    <td>{row.hrms_emp_id}</td>
                                                    <td>{row.first_name}</td>

                                                    <td style={{ textAlign: 'center' }}>{date}</td> {/* Date column */}
                                                    <td style={{ textAlign: 'center' }}>{time}</td> {/* In Time column */}
                                                    {/* <td style={{ textAlign: 'center' }}>{row.date}</td>
                                                    <td style={{ textAlign: 'center' }}>{row.checkin_time}</td> */}
                                                    <td style={{ textAlign: 'center' }}>{outTime}</td>
                                                    <td style={{ textAlign: 'center' }}>{row.emp_present}</td>
                                                    <td style={{ textAlign: 'center' }}>{row.emp_late}</td>
                                                    <td style={{ textAlign: 'center' }}>{row.emp_permission}</td>
                                                    <td style={{ textAlign: 'center' }}>{row.emp_onduty}</td>
                                                    {/* <td style={{ textAlign: 'center' }}>{row.emp_onduty}</td> */}
                                                    {/* <td style={{ textAlign: 'center' }}>{row.checkout_total_hours}</td> */}
                                                </tr>
                                            );
                                        })

                                        // =======================


                                    )}
                            </tbody>
                        </table>
                    </div>


                    {/* Pagination */}
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
                </div>

            )}
        </>
    );
}
