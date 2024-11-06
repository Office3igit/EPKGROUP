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


function MonthlyList() {

    // ------------------------------------------------------------------------------------------------
    const navigate = useNavigate();
    const handlevisitindividual = (id) => {

        navigate(`/admin/individualmonthlylist/${id}?date=${currentDate}`);
    };

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ------------------------------------------------------------------------------------------------
    // Month and Year Filter
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const formattedDate = `${year}-${month}`;
        setCurrentDate(formattedDate);
    }, []);

    console.log("currentDate", currentDate)
    // ------------------------------------------------------------------------------------------------

    // Table list view api
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [currentDate]);

    const fetchData = async () => {
        setLoading(true); // Ensure loading is set before fetching
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/get_allmonthlyAttendanceList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                },
                body: JSON.stringify({
                    roleid: userrole,
                    loginempid: userempid,
                    yearmonth: currentDate,
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                console.log("setTableData--->", responseData)

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
        // Prepare the headers dynamically
        const headers = [
            { label: 'S.No', key: 'serialNumber' },
            { label: 'Emp-ID', key: 'empid' },
            { label: 'Employee Name', key: 'name' },
            { label: 'Department', key: 'department' },
            { label: 'Role', key: 'role' },
            ...allKeys.map(day => ({ label: day, key: day }))
        ];

        // Prepare the data for each row
        const csvData = filteredleaveData.map((row, index) => {
            const serialNumber = currentPage * itemsPerPage + index + 1;
            const rowData = {
                serialNumber,
                name: row.Name,
                empid: row.hrms_emp_id,
                department: row.DepartmentName,
                role: row.RoleName,
                ...allKeys.reduce((acc, day) => ({ ...acc, [day]: row[day] || '' }), {})
            };
            return rowData;
        });

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'MonthlyList.csv',
        };

        return <CSVLink {...csvReport}><i className="fas fa-file-csv" style={{ fontSize: '25px', color: '#0d6efd' }}></i></CSVLink>;
    };

    // csv end
    // ========================================


    // ========================================
    // PDF start

    const handleExportPDF = () => {
        const unit = 'pt';
        const size = 'A4'; // Can be changed to 'letter' or other sizes as needed
        const doc = new jsPDF('landscape', unit, size);

        // Add the title to the PDF
        const title = `Monthly List - ${currentDate}`;
        const titleX = 40; // X coordinate for the title
        const titleY = 40; // Y coordinate for the title
        doc.setFontSize(20); // Set font size for the title
        doc.text(title, titleX, titleY);

        // Prepare the table headers
        const head = [['S.No', 'Emp-ID','Employee Name','Department','Role', ...allKeys]];

        // Prepare the table data
        const body = filteredleaveData.map((row, rowIndex) => {
            const serialNumber = currentPage * itemsPerPage + rowIndex + 1;
            return [serialNumber, row.hrms_emp_id,row.Name,row.DepartmentName,row.RoleName, ...allKeys.map(day => row[day] || '')];
        });

        // Define colors based on the values
        const getColorForValue = (value) => {
            switch (value) {
                // case 'P': return '#404040';
                case 'LA': return '#FB5A00';
                // case 'PR': return '#9BB500';
                // case 'HL': return '#6B057B';
                case 'L': return '#0d6efd';
                // case 'A': return '#C20076';
                // case 'H': return '#028A00';
                // case 'W': return '#5E20C8';
                default: return null; // No color for undefined or unexpected values
            }
        };

        doc.autoTable({
            startY: titleY + 30,
            head,
            body,
            // theme: 'grid',
            didParseCell: (data) => {
                const columnIndex = data.column.index;
                const rowIndex = data.row.index;
                if (rowIndex >= 0 && columnIndex >= 2) { // Ensure it's not the header row and it's a day column
                    const cellValue = data.cell.raw; // Get the cell value
                    const color = getColorForValue(cellValue); // Get the color for the cell value
                    if (color) {
                        data.cell.styles.fillColor = color; // Set the fill color
                        data.cell.styles.textColor = '#FFFFFF'; // Set the text color to white
                        data.cell.styles.fontStyle = 'bold'; // Set the font style to bold
                    }
                }
            },
            didDrawPage: (data) => {
                const pageWidth = doc.internal.pageSize.width;
                const legendY = doc.internal.pageSize.height - 30;
                const legendXStart = 40;
                const legendWidth = (pageWidth - 2 * legendXStart) / legendItems.length;
                let currentX = legendXStart;

                doc.setFontSize(10);
                legendItems.forEach((item, index) => {
                    doc.setFillColor(item.color);
                    doc.rect(currentX, legendY, legendWidth, 20, 'F'); // Draw the colored rectangle for the legend
                    doc.setTextColor(255, 255, 255); // Set text color to white
                    doc.text(item.label, currentX + 5, legendY + 15); // Position the text inside the rectangle
                    currentX += legendWidth;
                });
            },
        });

        doc.save('MonthlyList.pdf');
    };

    const legendItems = [
        // { label: 'Present - P', color: '#404040' },
        { label: 'Late - LA', color: '#FB5A00' },
        // { label: 'Permission - PR', color: '#9BB500' },
        // { label: 'Half Day - HL', color: '#6B057B' },
        { label: 'Leave - L', color: '#0d6efd' },
        // { label: 'Absent - A', color: '#C20076' },
        // { label: 'Holiday - H', color: '#028A00' },
        // { label: 'Week Off - W', color: '#5E20C8' },
    ];


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

    // ---------------------------------------------------------------------------------------------------
    // Header and body dates iterate
    const allKeys = filteredleaveData.reduce((keys, record) => {
        Object.keys(record).forEach(key => {
            if (!keys.includes(key) && key !== "Name" && key !== "hrms_emp_id" && key !== "DepartmentName" && key !== "RoleName" && key !== "id" && key !== "emp_status") {
                keys.push(key);
            }
        });
        return keys;
    }, []).sort((a, b) => a - b);

    // ---------------------------------------------------------------------------------------------------


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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Monthly List</h3>



                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}

                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap: 'wrap', gap: '17px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {['1', '2'].includes(userrole) &&
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={myStyles1}
                                />
                            }
                            <input
                                type="month"
                                style={myStyles1}
                                value={currentDate}
                                onChange={(e) => setCurrentDate(e.target.value)}
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
                                    <th>Emp-ID</th>
                                    <th>Employee Name</th>
                                    <th>Department </th>
                                    <th>Role </th>
                                    {allKeys.map((day, index) => (
                                        <th key={index}>{day}</th>
                                    ))}




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
                                            <tr key={row.id}
                                                onClick={() => handlevisitindividual(row.id)}
                                                style={{ cursor: 'pointer' }}>
                                                <td style={{
                                                    height: '60px',
                                                    verticalAlign: 'middle',
                                                    padding: '10px 15px',
                                                    borderRadius: '5px'
                                                }}>
                                                    {serialNumber}
                                                </td>
                                                <td style={{
                                                    height: '60px',
                                                    verticalAlign: 'middle',
                                                    padding: '10px 15px',
                                                    borderRadius: '5px'
                                                }}>
                                                    {row.hrms_emp_id}
                                                </td>
                                                <td style={{
                                                    height: '60px',
                                                    verticalAlign: 'middle',
                                                    padding: '10px 15px',
                                                    borderRadius: '5px'
                                                }}>
                                                    {row.Name}
                                                </td>
                                                <td style={{
                                                    height: '60px',
                                                    verticalAlign: 'middle',
                                                    padding: '10px 15px',
                                                    borderRadius: '5px'
                                                }}>
                                                    {row.DepartmentName}
                                                </td>
                                                <td style={{
                                                    height: '60px',
                                                    verticalAlign: 'middle',
                                                    padding: '10px 15px',
                                                    borderRadius: '5px'
                                                }}>
                                                    {row.RoleName}
                                                </td>
                                                {allKeys.map((day, index) => (
                                                    <td key={index}
                                                        style={{
                                                            textAlign: 'center',
                                                            height: '60px',
                                                            lineHeight: '50px',
                                                            verticalAlign: 'middle'
                                                        }}

                                                    >
                                                        <span
                                                            style={{
                                                                background:
                                                                    // row[day] === 'P' ? '#404040' :
                                                                    row[day] === 'LA' ? '#FB5A00' :
                                                                        // row[day] === 'PR' ? '#9BB500' :
                                                                        // row[day] === 'HL' ? '#6B057B' :
                                                                        row[day] === 'L' ? '#0d6efd' :
                                                                            // row[day] === 'A' ? '#C20076' :
                                                                            // row[day] === 'H' ? '#028A00' :
                                                                            // row[day] === 'W' ? '#5E20C8' :

                                                                            'inherit',
                                                                fontWeight: 'bold',
                                                                color: row[day] === '-' ? '404040' :
                                                                    row[day] === 'P' ? '#404040' :
                                                                        row[day] === 'H' ? '#028A00' :
                                                                            row[day] === 'PR' ? '#9BB500' :
                                                                                row[day] === 'A' ? '#C20076' :
                                                                                    row[day] === 'HL' ? '#6B057B' :
                                                                                        row[day] === 'OT' ? '#1a9eb5' :
                                                                                            row[day] === 'W' ? '#5E20C8' :

                                                                                                'white',
                                                                height: '60px',
                                                                verticalAlign: 'middle',
                                                                padding: '10px 15px',
                                                                borderRadius: '5px'
                                                            }}
                                                        > {row[day]}</span>
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1.5%',
                            flexWrap: 'wrap'
                        }}
                        className='mt-5 mb-2'>
                        <h6 style={{ color: '#404040', fontWeight: 'bold', borderRadius: '13px' }}>Present - P</h6>
                        <h6 style={{ color: '#FB5A00', fontWeight: 'bold', borderRadius: '13px' }}>Late - LA</h6>
                        <h6 style={{ color: '#9BB500', fontWeight: 'bold', borderRadius: '13px' }}>Permission - PR</h6>
                        <h6 style={{ color: '#6B057B', fontWeight: 'bold', borderRadius: '13px' }}>Half Day - HL</h6>
                        <h6 style={{ color: '#0d6efd', fontWeight: 'bold', borderRadius: '13px' }}>Leave - L</h6>
                        <h6 style={{ color: '#C20076', fontWeight: 'bold', borderRadius: '13px' }}>Absent - A</h6>
                        <h6 style={{ color: '#028A00', fontWeight: 'bold', borderRadius: '13px' }}>Holiday - H</h6>
                        <h6 style={{ color: '#5E20C8', fontWeight: 'bold', borderRadius: '13px' }}>Week Off - W</h6>
                        <h6 style={{ color: '#1a9eb5', fontWeight: 'bold', borderRadius: '13px' }}>Over Time - OT</h6>
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

export default MonthlyList