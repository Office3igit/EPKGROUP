import React, { useState } from 'react'
import { Button, Container, Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AssetsList() {

  // ------------------------------------------------------------------------------------------------

  // Redirect to the edit page
  const navigate = useNavigate();

  const GoToEditPage = (id) => {
    navigate(`/admin/editassets/${id}`);
  };


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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const requestData = {
      role_id: userrole,
      emp_id: userempid
    };
    try {
      const response = await fetch('https://epkgroup.in/crm/api/public/api/assign_assetlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usertoken}`
        },
        body: JSON.stringify(requestData)
      });
      if (response.ok) {
        const responseData = await response.json();
        setTableData(responseData.data);
        console.log('----------0-0->', responseData.data)
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
        text: 'You are about to delete this Assets List. This action cannot be reversed.',
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
        const response = await fetch('https://epkgroup.in/crm/api/public/api/delete_assign_asset', {
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
          Swal.fire('Deleted!', 'Assets type has been deleted.', 'success');
        } else {
          throw new Error('Error deleting Assets type');
        }
      }
    } catch (error) {
      console.error('Error deleting Assets List:', error);
      Swal.fire('Error', 'An error occurred while deleting the Assets List. Please try again later.', 'error');
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
    const csvData = tableData.map(({ department, emp_name, asset_id, asset_name, asset_details, asset_value, issue_date, valid_till, return_on, remarks, status }, index) => ({
      '#': index + 1,
      department,
      emp_name,
      asset_id,
      asset_name,
      asset_details,
      asset_value,
      issue_date,
      valid_till,
      return_on: return_on || '-',
      remarks,
      status
    }));

    const headers = [
      { label: 'S.No', key: '#' },
      { label: 'Department', key: 'department' },
      { label: 'Employee Name', key: 'emp_name' },
      { label: 'Asset ID', key: 'asset_id' },
      { label: 'Asset Name', key: 'asset_name' },
      { label: 'Asset Details', key: 'asset_details' },
      { label: 'Asset Value', key: 'asset_value' },
      { label: 'Issue Date', key: 'issue_date' },
      { label: 'Valid Till', key: 'valid_till' },
      { label: 'Return On', key: 'return_on' },
      { label: 'Remarks', key: 'remarks' },
      { label: 'Status', key: 'status' },
    ];

    const csvReport = {
      data: csvData,
      headers: headers,
      filename: 'AssetsList.csv',
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

    const data = tableData.map(({ department, emp_name, asset_id, asset_name, asset_details, asset_value, issue_date, valid_till, return_on, remarks, status }, index) => [
      index + 1,
      department,
      emp_name,
      asset_id,
      asset_name,
      asset_details,
      asset_value,
      issue_date,
      valid_till,
      return_on,
      remarks,
      status
    ]);

    doc.autoTable({
      head: [['S.No', 'Department', 'Employee Name', 'Asset ID', 'Asset Name', 'Asset Details', 'Asset Value', 'Issue Date', 'Valid Till', 'Return On', 'Remarks', 'Status']],
      body: data,
      columnStyles: {
        0: { cellWidth: 30 }, // S.No
        1: { cellWidth: 70 }, // Department
        2: { cellWidth: 80 }, // Employee Name
        3: { cellWidth: 60 }, // Asset ID
        4: { cellWidth: 70 }, // Asset Name
        5: { cellWidth: 100 }, // Asset Details
        6: { cellWidth: 60 }, // Asset Value
        7: { cellWidth: 60 }, // Issue Date
        8: { cellWidth: 60 }, // Valid Till
        9: { cellWidth: 60 }, // Return On
        10: { cellWidth: 100 }, // Remarks
        11: { cellWidth: 60 }, // Status
      },

      // styles: { fontSize: 10 },
      // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
    });

    doc.save('Assetslist.pdf');

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

  // ------------------------------------------------------------------------------------------------

  {/* AGENTA AND REMARKS CONTENT */ }
  // const assetsStyle = {
  //   display: '-webkit-box',
  //   WebkitLineClamp: '3',
  //   WebkitBoxOrient: 'vertical',
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis',
  //   whiteSpace: 'normal',
  //   height: '5.2em',
  //   lineHeight: '1.5em',
  //   cursor: 'pointer',
  //   wordBreak: 'break-word'
  // };



  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleOpenModal = (content, title) => {
    setModalContent(content);
    setModalTitle(title);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent('');
    setModalTitle('');
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

      <Container style={{ padding: '10px 40px' }}>
        <h3 className="mb-5" style={{ fontWeight: 'bold', color: '#00275c' }}>Assets List</h3>

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

        <div ref={componentRef} style={{ width: '100%', overflowX: 'auto' }}>

          <table className="table" style={{ minWidth: '100%', width: 'max-content' }}>
            <thead className="thead-dark">
              <tr>
                <th style={{ width: '100px' }}>S.No</th>
                <th style={{ width: '100px' }}>Department</th>
                <th style={{ width: '150px' }}>Employee Name</th>
                <th style={{ width: '200px' }}>Asset ID</th>
                <th style={{ width: '100px' }}>Asset Type</th>
                <th style={{ width: '400px' }}>Asset Details</th>
                <th style={{ width: '120px' }}>Asset Value</th>
                <th style={{ width: '100px' }}>Issue Date</th>
                <th style={{ width: '100px' }}>Valid Till</th>
                <th style={{ width: '120px' }}>Return Date</th>
                <th style={{ width: '300px' }}>Remarks</th>
                <th style={{ width: '100px' }}>Status</th>
                {(userrole === "1" || userrole === "2") && (<th style={{ width: '100px' }} className='no-print'>Action</th>)}

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
                        <td>{row.department}</td>
                        <td>{row.emp_name}</td>
                        <td>{row.asset_id}</td>
                        <td>{row.asset_name}</td>
                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', wordBreak: 'break-word', cursor: 'pointer', }}  
                        onClick={() => handleOpenModal(row.asset_details, 'Assets')}>{row.asset_details}</td>
                        <td>{row.asset_value}</td>
                        <td>{row.issue_date}</td>
                        <td>{row.valid_till}</td>
                        <td>{row.return_on}</td>
                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', wordBreak: 'break-word', cursor: 'pointer', }} 
                        onClick={() => handleOpenModal(row.remarks, 'Remarks')}>{row.remarks}</td>
                        <td>{row.status}</td>
                        {(userrole === "1" || userrole === "2") && (
                          <td style={{ display: 'flex', gap: '10px' }} className='no-print'>
                            <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }} disabled={row.return_on !== null}
                            style={{background: row.return_on !== null ?'grey':'', borderColor: row.return_on !== null ?'grey':'', cursor: row.return_on !== null ?'no-drop':''}}>
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            <button className="btn-delete" onClick={() => handleDelete(row.id)}>
                              <FontAwesomeIcon icon={faTrashCan} />
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

        {/* ------------------------------------------------------------------------------------------------ */}

        {/* ASSETS AND REMARKS CONTENT */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
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
        {/* ------------------------------------------------------------------------------------------------ */}



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
    </>
  )
}

export default AssetsList