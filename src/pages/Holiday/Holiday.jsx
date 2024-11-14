import React, { useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
// import { UserContext } from './Context';
// import { useContext } from 'react';
import { Modal, Button, Form, Table } from "react-bootstrap";
import Swal from 'sweetalert2';


const Holiday = () => {
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const componentRef = React.useRef();
  const [loading, setLoading] = useState(true);


  const [holidayData, setHolidayData] = useState([]);
  const userData = JSON.parse(localStorage.getItem('userData'));


  const userrole = userData?.userrole || '';
  const userempid = userData.userempid || '';
  const usertoken = userData?.token || '';


  const [holidayStatus, setHolidayStatus] = useState('');
  const [holidayEditStatus, setHolidayEditStatus] = useState('');


  const today = new Date();
  const currentYear = today.getFullYear(); // Get the current year
  const minDate = `${currentYear}-01-01`;



  {/* --------------------------------------------------------------------------------------------------------------- */ }
  // fetch Holiday Data

  const fetchHolidayData = async () => {
    try {
      const response = await axios.get(`https://epkgroup.in/crm/api/public/api/viewholidaylist`, {
        headers: {
          'Authorization': `Bearer ${usertoken}`
        }
      });

      const { data } = response.data;
      // data.sort((a, b) => a.id - b.id);
      setHolidayData(data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  useEffect(() => {
    fetchHolidayData();
  }, []);

  {/* --------------------------------------------------------------------------------------------------------------- */ }


  {/* --------------------------------------------------------------------------------------------------------------- */ }

  // print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  {/* --------------------------------------------------------------------------------------------------------------- */ }


  {/* --------------------------------------------------------------------------------------------------------------- */ }
  // Excel
  const handleExportCSV = () => {
    const csvData = holidayData.map(({ h_name, h_date, h_day }, index) => ({
      'S.No': index + 1,
      'Public Holidays': h_name,
      'Date': h_date,
      'Day': h_day
    }));

    const headers = [
      { label: 'S.No', key: 'S.No' },
      { label: 'Date', key: 'Date' },
      { label: 'Holidays', key: 'Public Holidays' },
      { label: 'Day', key: 'Day' },
    ];

    const csvReport = {
      data: csvData,
      headers: headers,
      filename: 'holidaylist.csv',
    };

    // Use CSVLink for CSV export
    return <CSVLink {...csvReport}><i className="fas fa-file-csv" style={{ fontSize: '25px', color: '#0d6efd' }}></i></CSVLink>;
  };
  {/* --------------------------------------------------------------------------------------------------------------- */ }

  {/* --------------------------------------------------------------------------------------------------------------- */ }
  // PDF
  const handleExportPDF = () => {
    const unit = 'pt';
    const size = 'A4';

    const doc = new jsPDF('landscape', unit, size);

    const data = holidayData.map(({ h_name, h_date, h_day }, index) => [
      index + 1,
      h_name,
      h_date,
      h_day,
    ]);

    doc.autoTable({
      head: [['S.No', 'Holidays', 'Date', 'Day']],
      body: data,
    });

    doc.save('holidaylist.pdf');
  };

  {/* --------------------------------------------------------------------------------------------------------------- */ }


  {/* --------------------------------------------------------------------------------------------------------------- */ }
  // search filter
  const filteredData = holidayData.filter((row) =>
    Object.values(row).some(
      (value) =>
        (typeof value === 'string' || typeof value === 'number') &&
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  {/* --------------------------------------------------------------------------------------------------------------- */ }

  {/* --------------------------------------------------------------------------------------------------------------- */ }
  // pagination start

  const filteredHolidayData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  // pagination end
  {/* --------------------------------------------------------------------------------------------------------------- */ }

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

  {/* --------------------------------------------------------------------------------------------------------------- */ }

  // add holiday 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    updated_hr_id: userempid,
    h_name: "",
    h_date: "",
    h_day: "",
    h_status: "",
  });
  // const today = new Date().toISOString().split('T')[0];

  const handleAddHoliday = () => {
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormErrors({});
    setFormData({
      h_name: "",
      h_date: "",
      h_day: "",
    })
    setHolidayStatus('')
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "h_status") {
      setHolidayStatus(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();



    // Validate form fields
    const errors = {};

    if (!formData.h_name) {
      errors.h_name = 'Holiday Name is required.';
    }
    if (!formData.h_date) {
      errors.h_date = 'Holiday Date is required.';
    }
    if (!formData.h_day) {
      errors.h_day = 'Holiday Day is required.';
    }

    console.log("formData.h_status:", holidayStatus)
    if (!holidayStatus) {
      errors.holidayStatus = 'Holiday Status is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const formDataToSend = new FormData();

    formDataToSend.append('h_name', formData.h_name);
    formDataToSend.append('h_date', formData.h_date);
    formDataToSend.append('h_day', formData.h_day);
    formDataToSend.append('h_type', holidayStatus);
    formDataToSend.append('created_by', formData.updated_hr_id);

    try {
      const response = await fetch('https://epkgroup.in/crm/api/public/api/add_holiday', {
        method: 'POST',
        body: formDataToSend,

        headers: {
          'Authorization': `Bearer ${usertoken}`
        }

      });

      const data = await response.json();


      if (data.status == 'success') {
        setIsModalOpen(false);
        setFormData({ ...formData, h_name: "", h_date: "", h_day: "" });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Holiday Added successfully',
        });
        fetchHolidayData();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Holiday Already Added',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add Holiday',
      });
    }


  };

  {/* --------------------------------------------------------------------------------------------------------------- */ }

  {/* --------------------------------------------------------------------------------------------------------------- */ }
  // Holiday Edit

  const [editviewData, setEditviewData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditOpenModal = (id, h_date, h_name, h_day, userempid, h_type) => {
    setIsEditModalOpen(true);


    const formattedDate = formatDateForDisplay(h_date);
    const vieweditData = {
      id,
      h_date: formattedDate,
      h_name,
      h_day,
      userempid,
      status: h_type,
    };
    setEditviewData(vieweditData);
  };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);

  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditviewData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const formatDateForDisplay = (dateString) => {
    const dateParts = dateString.split('-');
    const year = dateParts[2];
    const month = dateParts[1];
    const day = dateParts[0];
    return `${year}-${month}-${day}`;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();


    // Validate form fields
    const errors = {};

    if (!editviewData.h_name) {
      errors.h_name = 'Holiday Name is required.';
    }
    if (!editviewData.h_date) {
      errors.h_date = 'Holiday Date is required.';
    }
    if (!editviewData.h_day) {
      errors.h_day = 'Holiday Day is required.';
    }

    if (!editviewData.status) {
      errors.holidayStatus = 'Holiday Status is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const requestData = {
      id: editviewData.id,
      h_name: editviewData.h_name,
      h_date: editviewData.h_date,
      h_day: editviewData.h_day,
      h_type: editviewData.status,
      updated_by: editviewData.userempid,
    };

    try {
      const response = await fetch('https://epkgroup.in/crm/api/public/api/edit_holiday', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usertoken}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setIsEditModalOpen(false);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Holiday updated successfully',
        });
        fetchHolidayData();
      } else if (data.status === 'error' && data.message === 'Holiday Already Added') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Holiday already added',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update holiday',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update holiday',
      });
    }

  };

  {/* --------------------------------------------------------------------------------------------------------------- */ }

  // Holiday Delete
  const handleDelete = async (id) => {

    try {
      const { value: reason } = await Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this Holiday. This action cannot be reversed.',
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
        const response = await fetch('https://epkgroup.in/crm/api/public/api/delete_holiday', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
          },
          body: JSON.stringify({

            updated_by: userempid,
            id: id,
            reason: reason,
          }),
        });

        if (response.ok || response.type === 'opaqueredirect') {
          setHolidayData((prevData) => prevData.filter(row => row.id !== id));
          Swal.fire('Deleted!', 'Holiday has been deleted.', 'success');
        } else {
          throw new Error('Error deleting shift slot');
        }
      }
    } catch (error) {
      console.error('Error deleting Holiday:', error);
      Swal.fire('Error', 'An error occurred while deleting the Holiday. Please try again later.', 'error');
    }
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
          <ScaleLoader color="rgb(20 166 249)" />
        </div>
      ) : (


        <div style={{ display: 'grid', maxWidth: '1035px', margin: '0 auto' }}>
          <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Holiday List</h3>


          {/* --------------------------------------------------------------------------------------------------------------- */}
          {/* Add Holiday btn */}
          {(userrole === "1" || userrole === "2") && (
            <>
              <div>
                <button
                  className="btn btn-info btn-sm mr-2 w-30 w-md-100"
                  style={{
                    backgroundColor: '#0d6efd',
                    borderColor: '#0d6efd',
                    color: 'white',
                    fontSize: '18px'
                  }}
                  onClick={handleAddHoliday}
                >
                  + Add Holiday
                </button>
              </div>

              <br></br>
            </>
          )}

          {/* --------------------------------------------------------------------------------------------------------------- */}
          {/* Add Holiday */}
          <Modal show={isModalOpen} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add Holiday</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="h_name" >
                  <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Holiday Name :</Form.Label>
                  <Form.Control
                    as="input"
                    name="h_name"
                    value={formData.h_name}
                    onChange={handleInputChange}
                  />
                  {formErrors.h_name && <span className="text-danger">{formErrors.h_name}</span>}
                </Form.Group>
                <Form.Group controlId="h_date">
                  <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="h_date"
                    value={formData.h_date || ''}
                    min={minDate}
                    max="9999-12-31"
                    onChange={handleInputChange}
                  />
                  {formErrors.h_date && <span className="text-danger">{formErrors.h_date}</span>}
                </Form.Group>
                <Form.Group controlId="h_day">
                  <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Day:</Form.Label>
                  <Form.Control
                    as="input"
                    name="h_day"
                    value={formData.h_day}
                    onChange={handleInputChange}
                  />
                  {formErrors.h_day && <span className="text-danger">{formErrors.h_day}</span>}
                </Form.Group>
                <Form.Group controlId="h_status" className='mb-2'>
                  <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Status:</Form.Label>
                  <Form.Control
                    as="select"
                    name="h_status"
                    value={holidayStatus} onChange={(e) => setHolidayStatus(e.target.value)}
                  >
                    <option value="" disabled>Select Status</option>
                    {/* Add options for status */}
                    <option value="Public Holiday">Public Holiday</option>
                    <option value="Declared Holiday">Declared Holiday</option>
                  </Form.Control>
                  {formErrors.holidayStatus && <span className="text-danger">{formErrors.holidayStatus}</span>}
                </Form.Group>
                <div style={{ paddingTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" style={{ marginLeft: '10px' }}>
                    Submit
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>

          {/* --------------------------------------------------------------------------------------------------------------- */}
          {/* Edit Holiday */}
          <Modal show={isEditModalOpen} onHide={handleEditCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Holiday</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleEditSubmit}>

                <Form.Group controlId="h_name">
                  <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Holiday Name :</Form.Label>
                  <Form.Control
                    as="input"
                    name="h_name"
                    value={editviewData.h_name || ''}
                    onChange={handleEditInputChange}
                  />
                  {formErrors.h_name && <span className="text-danger">{formErrors.h_name}</span>}
                </Form.Group>

                <Form.Group controlId="h_date">
                  <Form.Label style={{ fontWeight: 'bold', color: '#4b5c72' }}>Date:</Form.Label>
                  <Form.Control
                    type="date"
                    name="h_date"
                    value={editviewData.h_date || ''}
                    min={minDate}
                    max="9999-12-31"
                    onChange={handleEditInputChange}
                  />
                  {formErrors.h_date && <span className="text-danger">{formErrors.h_date}</span>}
                </Form.Group>

                <Form.Group controlId="h_day">
                  <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Day:</Form.Label>
                  <Form.Control
                    as="input"
                    name="h_day"
                    value={editviewData.h_day || ''}
                    onChange={handleEditInputChange}
                  />
                  {formErrors.h_day && <span className="text-danger">{formErrors.h_day}</span>}
                </Form.Group>

                <Form.Group controlId="h_status" className='mb-2'>
                  <Form.Label style={{ fontWeight: "bold", color: '#4b5c72' }}>Select Status:</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={editviewData.status || ''} // Ensured this matches the state's property name
                    onChange={handleEditInputChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Public Holiday">Public Holiday</option>
                    <option value="Declared Holiday">Declared Holiday</option>
                  </Form.Control>
                  {formErrors.holidayStatus && <span className="text-danger">{formErrors.holidayStatus}</span>}
                </Form.Group>

                <div style={{ paddingTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="secondary" onClick={handleEditCloseModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" style={{ marginLeft: '10px' }}>
                    Submit
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>

          {/* --------------------------------------------------------------------------------------------------------------- */}


          {/* --------------------------------------------------------------------------------------------------------------- */}
          {/* Table search and download */}
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap: 'wrap', gap: '17px' }}>
            {/* Search */}
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

            {/* Download Options */}
            <div>
              <button style={myStyles}>{handleExportCSV()}</button>
              <button style={myStyles} onClick={handleExportPDF}><i className="fas fa-file-pdf" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
              <button style={myStyles} onClick={handlePrint}><i className="fas fa-print" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
            </div>
          </div>

          {/* Table */}
          <div ref={componentRef} style={{ overflowX: 'auto', width: '100%' }}>
            <table className="table">
              <thead className="thead-dark">
                <tr>

                  <th scope="col">S.no</th>
                  <th scope="col">Holidays</th>
                  <th scope="col">Date</th>
                  <th scope="col">Day</th>

                  {(userrole === "1" || userrole === "2") && (
                    <th scope="col" className="no-print">Action</th>
                  )}



                </tr>
              </thead>
              <tbody>

                {
                  filteredHolidayData.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center' }}>No search data found</td>
                    </tr>
                  ) : (

                    filteredHolidayData.map((row, index) => {
                      const serialNumber = currentPage * itemsPerPage + index + 1;
                      const isDeclaredHoliday = row.h_type === 'Declared Holiday';
                      return (
                        <tr key={row.id} style={isDeclaredHoliday ? { color: '#a3f0a3' } : {}}>
                          <th scope="row" style={isDeclaredHoliday ? { color: '#0A62F1', fontWeight: 'bold' } : {}}>{serialNumber}</th>
                          <td style={isDeclaredHoliday ? { color: '#0A62F1', fontWeight: 'bold' } : {}}>{row.h_name}</td>
                          <td style={isDeclaredHoliday ? { color: '#0A62F1', fontWeight: 'bold' } : {}}>{row.h_date}</td>
                          <td style={isDeclaredHoliday ? { color: '#0A62F1', fontWeight: 'bold' } : {}}>{row.h_day}</td>
                          {(userrole === "1" || userrole === "2") && (
                            <td className="no-print">
                              <button
                                className="btn btn-info btn-sm mr-2 btn-edit"
                                onClick={() => handleEditOpenModal(row.id, row.h_date, row.h_name, row.h_day, userempid, row.h_type)}
                                style={{ marginRight: '5%' }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm btn-delete"
                                onClick={() => handleDelete(row.id)}

                              >
                                Delete
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

          {/* --------------------------------------------------------------------------------------------------------------- */}


        </div>

      )}
    </>
  );
}


export default Holiday;
