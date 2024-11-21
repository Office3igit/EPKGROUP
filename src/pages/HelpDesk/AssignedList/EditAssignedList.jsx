import { faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import ReactPaginate from 'react-paginate';
import { useNavigate, useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { useReactToPrint } from 'react-to-print';
import { MultiSelect } from "react-multi-select-component";
import Swal from 'sweetalert2';

const EditAssignedList = () => {
    // ------------------------------------------------------------------------------------------------
    // Redirect to the add Assetslist page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitAssignedListlist = () => {
        navigate(`/admin/assignedlist`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const username = userData?.username || '';
    const userrole = userData?.userrole || '';
    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------

    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [departmentDropdownFromResponce, setDepartmentDropdownFromResponce] =
      useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [issueType, setIssueType] = useState('');
    const [issues_type, setIssuesType] = useState("");
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState('');
    const [status, setStatus] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tableData, setTableData] = useState([]);
    const [attachment, setAttachment] = useState(null);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const componentRef = React.useRef(); 
    
  useEffect(() => {
    const fetchDepartmentList = async () => {
      try {
        const response = await axios.get(
          "https://epkgroup.in/crm/api/public/api/department_list",
          {
            headers: { Authorization: `Bearer ${usertoken}` },
          }
        );
        const data = response.data.data || [];
        const formattedDepartments = data.map((department) => ({
          label: department.depart_name, // Assuming 'name' is the department name
          value: department.id, // Assuming 'id' is the department ID
        }));
        setDepartmentDropdown(formattedDepartments);
      } catch (error) {
        console.error("Error fetching department options:", error);
      }
    };

    fetchDepartmentList();
  }, [usertoken]);


      // --------------------------------------- Getting Issues Type ------------------------------------------------
  useEffect(() => {
    const apiUrl = `https://epkgroup.in/crm/api/public/api/editview_newissuetype/${issues_type}`;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          apiUrl,

          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );
        const data = response.data.data;
        setIssueType(data.issue_type);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [issues_type]);

    useEffect(() => {
        const fetchAssetId = async () => {
            try {
                const response = await axios.get(`https://epkgroup.in/crm/api/public/api/editnewview_raiselist/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                });   
                if (response.data.status === 'success') {
                    const DepartmentNameArray = response.data.data.assign_deps
                    ? response.data.data.assign_deps.split(",").map((dep) => dep.trim())
                    : [];
                  setDepartmentDropdownFromResponce(DepartmentNameArray);
                    setIssuesType(response.data.data.issue_type);
                    setDescription(response.data.data.description);
                    setStartDate(response.data.data.start_date);
                    setEndDate(response.data.data.estimate_date);
                    setStatus(response.data.data.status);  
                    if(response.data.data.attachment != '-'){
                        setAttachment(`https://epkgroup.in/crm/api/storage/app/${response.data.data.attachment}`);
                      }
                    setLoading(false)
                } else {
                    throw new Error('Failed to fetch asset ID');
                }
            } catch (err) {
                console.log(err.message);

            }
        };

        fetchAssetId();
    }, []);
    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------
    // HANDLE SUBMIT 

    const handleSave = (e) => {
        e.preventDefault();
        const errors = {};
        if (status == '') {
            errors.status = 'Status is required.';
        }
        if (comments == '') {
            errors.comments = 'Comments is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});


        const formData = {
            id: id,
            start_date: startDate,
            estimate_date: endDate,
            comments: comments,
            status: status,
            updated_by: userempid
        }

        axios.post('https://epkgroup.in/crm/api/public/api/update_newraiseticket', formData, {
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
                    handleVisitAssignedListlist()
                } else if (status === 'error') {
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
                    text: 'There was an error creating the updating assigned issue. Please try again later.',
                });

                console.error('There was an error with the API:', error);
            });
    };

      // ========================================
    // CSV start
    const handleExportCSV = () => {
        const csvData = tableData.map(({ teams_name, issue_type, membername,created_name, status },username, index) => ({
            '#': index + 1,
            username,
            teams_name,
            issue_type,
            membername,
            created_name,
            status,
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Employee Name', key: 'username'},
            { label: 'Start Date', key: 'startdate' },
            { label: 'Estimated Date', key: 'estimated_date' },
            { label: 'Status', key: 'status' },
            { label: 'Comments', key: 'comments' },
        ];
        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'EditedAssignedList.csv',
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
        const data = tableData.map(({ teams_name, issue_type, membername,created_name,status },username, index) => [
            index + 1,
            username,
            teams_name,
            issue_type,
            membername,
            created_name,
            status,
        ]);

        doc.autoTable({
            head: [['S.No', 'Employee Name','Start Date', 'Estimated Date', 'Status', 'Comments']],
            body: data,
        });
        doc.save('EditedAssignedList.pdf');
    };

    const handleCancel = () => {
        handleVisitAssignedListlist()
        setFormErrors({});
    };

    // ------------------------------------------------------------------------------------------------
       const filteredData = tableData.filter((row) =>
            Object.values(row).some(
                (value) =>
                    (typeof value === 'string' || typeof value === 'number') &&
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

    const filteredleaveData = filteredData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Table list view api
    useEffect(() => {
        fetchData();
    }, [refreshKey]);

        // Helper function to reformat the date
const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-'); // Split the date string
    return `${day}-${month}-${year}`; // Return in dd-mm-yyyy format
};

    const fetchData = async () => {
        try {
            const response = await fetch(`https://epkgroup.in/crm/api/public/api/status_command_list/${id}`, {
                method: 'GET',
                headers: {
                    
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            
            if (response.ok) {
                const responseData = await response.json();

            // Transform the created_date for all items
            const transformedData = responseData.data.map(item => ({
                ...item,
                start_date: formatDate(item.start_date), 
                estimate_date:formatDate(item.estimate_date)
            }));

            setTableData(transformedData);
            setLoading(false);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // print start
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // print end
    // ========================================



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
  useEffect(() => {
    if (
      departmentDropdown.length > 0 &&
      departmentDropdownFromResponce.length > 0
    ) {
      // Filter only if departmentDropdownFromResponce includes option.value
      const initialSelection = departmentDropdown.filter(
        (option) =>
          departmentDropdownFromResponce.includes(option.value.toString()) // Ensuring type match
      );
      setSelectedDepartment(initialSelection);
    }
  }, [departmentDropdown, departmentDropdownFromResponce]);
    
  // Handle department selection
  const handleSelectDepartmentChange = (selected) => {
    setSelectedDepartment(selected);
  };
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
             <div className='RaiseTicket__container' style={{ padding: '10px 40px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Assigned Ticket</h3>
            <div className='form__area' style={{ background: '#ffffff', padding: '60px 40px', boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', margin: '2px' }}>
                <Form onSubmit={handleSave}>
                    {/* <div style={{fontWeight: 600,marginBottom:"10px"}}>Ticket ID : {ticketID}</div> */}

                    <Row className="mb-3">
                    <Form.Group controlId="formRole">
                        <Form.Label style={{ fontWeight: "bold" }}>
                        Department Name
                        </Form.Label>
                        <MultiSelect
                        options={departmentDropdown}
                        value={selectedDepartment}
                        onChange={handleSelectDepartmentChange}
                        labelledBy="Select"
                        readOnly
                        disabled
                        />
                        {formErrors.selectedDepartment && (
                        <span className="text-danger">
                            {formErrors.selectedDepartment}
                        </span>
                        )}
                    </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group controlId="formIssueType">
                            <Form.Label>Issue Type</Form.Label>
                            <Form.Control as="textarea" disabled value={issueType} >
                            </Form.Control>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                    <Row style={{display:"flex",alignItems:"center"}}>
                        <Col md={10}>
                        <Form.Group controlId="attachment">
                            <Form.Label>Attachment</Form.Label>
                            <Form.Control
                            type="file"
                            accept="image/*"
                            className="form-control"
                            readOnly
                            disabled
                            />
                            {/* Conditional rendering for attachment preview or 'No Attachment' */} 
                        </Form.Group>
                        </Col>

                        <Col md={2}>
                        {attachment ? (
                            <div style={{marginTop:'30px'}}>
                                <Button
                                variant="primary"
                                href={attachment}
                                target="_blank"
                                style={{display:"flex",alignItems:"center", height: "43px", fontSize: "13px",justifyContent:"center"}}
                                >
                                View Attachment
                                </Button>
                            </div>
                            ) : (
                            <span
                                style={{
                                display:"flex",
                                marginTop: "15px",
                                fontStyle: "italic",
                                color: "#888",
                                }}
                            >
                                No Attachment
                            </span>
                            )}
                        </Col>
                    </Row>
                    <Row  className='mb-3' >            
                            <Col>
                                <Form.Group controlId="formStartDate">
                                    <Form.Label>Start Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control type="date" value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)} 
                                    max={endDate || "9999-12-31"}
                                     />
                                    {formErrors.startDate && <span className="text-danger">{formErrors.startDate}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formEndDate">
                                    <Form.Label>End Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control type="date" 
                                    value={endDate} 
                                    onChange={(e) => setEndDate(e.target.value)} 
                                    max="9999-12-31"
                                    min={startDate || "0001-01-01"}  // Set min to start date if selected
                                     />
                                    {formErrors.endDate && <span className="text-danger">{formErrors.endDate}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                    <Row className='mb-3'>
                        <Col>
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label> <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>     
                                <Form.Control
                                    as="select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="" disabled>Select Status</option>
                                    <option value="1" disabled>Pending</option>
                                    <option value="2">In-Progress</option>
                                    <option value="3">Completed</option>
                                </Form.Control>
                                {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Comments</Form.Label> <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                            <Form.Control
                                as="textarea"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            />
                            
                            {formErrors.comments && <span className="text-danger">{formErrors.comments}</span>}
                        </Form.Group>
                    </Row>
                    <Row>
                        <Col md={1}>
                            <Button variant="primary" type="submit">
                                Update
                            </Button>
                        </Col>
                        <Col md={1} style={{marginLeft:"10px"}}>
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap:'wrap', gap:'17px',marginTop:"50px" }}>
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
                                <th scope="col">Employee Name</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">Estimated Date</th>
                                <th scope="col">Status</th>
                                <th scope="col">Comments</th>
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
                                                <td>{row.emp_name}</td>
                                                <td>{row.start_date}</td>
                                                <td>{row.estimate_date}</td>
                                                <td>{row.status_description}</td>
                                                <td>{row.commands}</td>
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
             </div>
     )}
     </>
    );
};

export default EditAssignedList;
