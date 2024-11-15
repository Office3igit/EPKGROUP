import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Pagination } from 'react-bootstrap';
import JoditEditor from 'jodit-react';
import Jobcard from './Jobcard';
import axios from 'axios';
import Swal from 'sweetalert2';

const Jobopening = () => {

  // ------------------------------------------------------------------------------------------------

  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));

  const usertoken = userData?.token || '';
  const userempid = userData?.userempid || '';
  const userrole = userData?.userrole || '';

  // ------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------
  // submit and cancel 

  const [designation, setDesignation] = useState('');
  const [vacancies, setVacancies] = useState('');
  const [description, setDescription] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    const errors = {};

    if (!designation) {
      errors.designation = 'Designation is required.';
    }
    if (!vacancies) {
      errors.vacancies = 'Vacancies is required.';
    }
    if (!description) {
      errors.description = 'Description is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const formData = new FormData();
    formData.append('designation', designation);
    formData.append('no_of_vacancies', vacancies);
    formData.append('description', description);
    formData.append('created_by', userempid);


    axios.post('https://epkgroup.in/crm/api/public/api/add_jobopening', formData, {
      headers: {
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
          setDesignation('');
          setVacancies('');
          setDescription('');

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
          text: 'There was an error creating the shift slot. Please try again later.',
        });
        console.error('There was an error with the API:', error);
      });
  };

  const handleCancel = () => {
    setDesignation('');
    setVacancies('');
    setDescription('');
    setFormErrors({});
  };


  // ------------------------------------------------------------------------------------------------
  // list all job

  const [jobopeninglist, setJobopeninglist] = useState([]);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://epkgroup.in/crm/api/public/api/jobopening_list', {
        headers: {
          'Authorization': `Bearer ${usertoken}`
        }
      });
      if (response.ok) {
        const responseData = await response.json();
        setJobopeninglist(responseData.data);
        console.log("setJobopeninglist", responseData.data)
        // setLoading(false);
      } else {
        throw new Error('Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const card_container = {
    display: 'grid',
    gap: '20px',
    padding: '10px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
  };


  // ------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------
  // list job pagination

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(6);

  // Pagination logic
  const totalPages = Math.ceil(jobopeninglist.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = jobopeninglist.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (page) => setCurrentPage(page);

  const paginationBasic = () => {
    let active = currentPage;
    let items = [];
    let visiblePages = 5; // You can adjust how many pages you want to show here
    let startPage = active - 2 > 1 ? active - 2 : 1;
    let endPage = startPage + visiblePages - 1 > totalPages ? totalPages : startPage + visiblePages - 1;

    if (active - 2 <= 1) {
      endPage = startPage + visiblePages - 1 > totalPages ? totalPages : startPage + visiblePages - 1;
    }

    if (totalPages > visiblePages && active + 2 > totalPages) {
      startPage = totalPages - (visiblePages - 1);
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item key={number} active={number === active} onClick={() => paginate(number)}>
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination>
        <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
        {startPage > 1 && <Pagination.Ellipsis disabled />}
        {items}
        {endPage < totalPages && <Pagination.Ellipsis disabled />}
        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    );
  };

  // ------------------------------------------------------------------------------------------------

  return (
    <Container style={{ padding: '10px 50px' }}>
      <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Job Openings</h3>
      {/* ------------------------------------------------------------------------------------------------ */}
      {/* add job */}
      {(userrole === "1" || userrole === "2") && (
        <div style={{ paddingBottom: '80px' }}>

          <h5 className='mb-2'>Add Job</h5>
          <Form onSubmit={handleSubmit}
            style={{
              background: '#ffffff',
              padding: '60px 40px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)',
              margin: '2px'
            }}>
            <Row className="mb-3">
              <Col sm={6}>
                <Form.Group controlId="formDesignation">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Enter Designation"
                  />
                  {formErrors.designation && <span className="text-danger">{formErrors.designation}</span>}
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="formVacancies">
                  <Form.Label>No. of Vacancies</Form.Label>
                  <Form.Control
                    type="number"
                    value={vacancies}
                    onChange={(e) => setVacancies(e.target.value)}
                    placeholder="Enter number of vacancies"
                  />
                  {formErrors.vacancies && <span className="text-danger">{formErrors.vacancies}</span>}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <JoditEditor
                value={description}
                onChange={(newContent) => setDescription(newContent)}
              />
              {formErrors.description && <span className="text-danger">{formErrors.description}</span>}
            </Form.Group>

            <Form.Group>
              <Button type="submit" variant="primary">Submit</Button>
              <Button variant="secondary" onClick={handleCancel} style={{ marginLeft: '10px' }}>Cancel</Button>
            </Form.Group>
          </Form>

        </div>
      )}

      {/* ------------------------------------------------------------------------------------------------ */}
      {/* jobs */}
      <div className='container'>
        <h5 className='mb-2'>Jobs</h5>
        <div className='row mb-4' style={card_container}>

          {currentEntries.map((job) => (
            <div className='col-12 col-md-6 col-lg-4 mb-3'>
              <Jobcard
                id={job.id}
                designation={job.designation}
                no_of_vacancies={job.no_of_vacancies}
                description={job.description}

              />
            </div>
          ))}


        </div>


        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {paginationBasic()}
        </div>
      </div>
      {/* ------------------------------------------------------------------------------------------------ */}


    </Container>
  );
};

export default Jobopening;
