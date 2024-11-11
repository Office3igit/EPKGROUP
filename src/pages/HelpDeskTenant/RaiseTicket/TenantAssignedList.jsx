import React, { useState } from "react";
import {
  Button,
  Container,
  Modal,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
// import './css/addshiftslotstyle.css'
import Swal from "sweetalert2";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import "jspdf-autotable";
import ReactPaginate from "react-paginate";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEye,
  faFilter,
  faFolderOpen,
  faInfo,
  faPen,
  faTrashCan,
  faEyeSlash, 
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Select from "react-select";
import "./Tenant_raise_ticket.css";


function Tenant_assign_list() {
  // ------------------------------------------------------------------------------------------------

  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem("userData"));

  // const usertoken = userData?.token || '';
  // const userempid = userData?.userempid || '';
  // const userrole = userData?.userrole || '';

  var usertoken = userData?.token || "";
  var token = usertoken.slice(usertoken.indexOf("|") + 1);
  var token_user_id;
  var userimage;
  var userempid;
  var tenant_identification = false;
  var userrole;

  if (userData.sluge == "TENANT") {
    token_user_id = userData?.token_user_id || "";
    userimage = userData?.userimage || "";
    userempid = userData?.tenat_id || "";
    userrole = userData?.userrole || "";
    tenant_identification = true;
  } else {
    token_user_id = userData?.token_user_id || "";
    userimage = userData?.userimage || "";
    userempid = userData?.userempid || "";
    userrole = userData?.userrole || "";
  }

  // ------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------

  // Redirect to the edit page
  const navigate = useNavigate();

  const GoToEditPage = (id) => {
    navigate(`/admin/tenant_edit_ticket_list/${id}`);
  };

  // ------------------------------------------------------------------------------------------------

  // Table list view api

  const [refreshKey, setRefreshKey] = useState(0);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://epkgroup.in/crm/api/public/api/tenant_view_newraiseassign_list",
        {
          method: "POST", // Set the method to POST
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usertoken}`,
          },
          body: JSON.stringify({
            user_roleid: userrole,
            emp_id: userempid,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setTableData(responseData.data);
        console.log("setTableData", responseData.data);

        setLoading(false);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------

  // delete the table list

  const handleDelete = async (id) => {
    try {
      const { value: reason } = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to delete this Task List. This action cannot be reversed.",
        icon: "warning",
        input: "text",
        inputPlaceholder: "Enter reason for deletion",
        inputAttributes: {
          maxLength: 100, // Limit input to 100 characters
        },
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        preConfirm: (value) => {
          if (!value) {
            Swal.showValidationMessage("Reason is required for deletion.");
          }
          return value;
        },
      });

      if (reason) {
        const response = await fetch(
          "https://epkgroup.in/crm/api/public/api/delete_task",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${usertoken}`, // Assuming usertoken is defined somewhere
            },
            body: JSON.stringify({
              id: id,
              updated_by: userempid,
              reason: reason,
            }),
          }
        );

        if (response.ok || response.type === "opaqueredirect") {
          setTableData(tableData.filter((row) => row.id !== id));
          Swal.fire("Deleted!", "Task List has been deleted.", "success");
        } else {
          throw new Error("Error deleting Task List");
        }
      }
    } catch (error) {
      console.error("Error deleting Task List:", error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the Task List. Please try again later.",
        "error"
      );
    }
  };

  // ------------------------------------------------------------------------------------------------
  // FILTER STATE

  const [showFilterModal, setShowFilterModal] = useState(false);

  const [departmentDropdown, setDepartmentDropdown] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [IssuesType, setIssuesType] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");

  const applyFilter = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    console.log("from date", fromDate);

    formData.append("department_id", selectedDepartment);
    formData.append("issue_type", selectedEmployee);
    formData.append(
      "emp_id",
      userrole.includes("1") || userrole.includes("2")
        ? selectedEmployee
        : userempid
    );
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);
    formData.append("status", status);

    try {
      const response = await fetch(
        "http://epkgroup.in/crm/api/public/api/tenant_raiseticket_filter",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );

      const data = await response.json();

      const { status, message } = data;

      if (status === "success") {
        console.log("-----s", data.data);
        setTableData(data.data);
        setShowFilterModal(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${error.message}`,
      });
    }
  };

  const cancelFilter = () => {
    setSelectedDepartment("");
    setSelectedEmployee("");
    setFromDate("");
    setToDate("");
    setStatus("");
    setShowFilterModal(false);
    setRefreshKey();
  };

  // ---------------------------------------------------------------------------------------------------------

  // ========================================
  // pagination, search, print state

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleExportCSV = () => {
    const csvData = filteredleaveData.map((row, index) => ({
      SNo: index + 1,
      TaskID: row.ticket_id,
      RaisedDate: formatDate(row.created_date),
      Department: row.department_name,
      IssuesType: row.issue_name,
      EmpID: row.hrms_emp_id,
      EmpName: row.emp_name,
      Status: row.status_description,
      Attachment: row.attachment !== "-"
        ? `https://epkgroup.in/crm/api/storage/app/${row.attachment}`
        : "No Attachment",
    }));

    const headers = [
      { label: "S.No", key: "SNo" },
      { label: "Task ID", key: "TaskID" },
      { label: "Raised Date", key: "RaisedDate" },
      { label: "Department", key: "Department" },
      { label: "Issues Type", key: "IssuesType" },
      { label: "EMP ID", key: "EmpID" },
      { label: "Emp Name", key: "EmpName" },
      { label: "Status", key: "Status" },
      { label: "Attachment", key: "Attachment" },
    ].filter(Boolean); // Remove null values for tenant columns when not needed

    const csvReport = {
      data: csvData,
      headers: headers,
      filename: "Total_Assigned_List.csv",
    };

    // Export CSV using your CSV export library or custom function
    return (
      <CSVLink {...csvReport}>
        <i
          className="fas fa-file-csv"
          style={{ fontSize: "25px", color: "#0d6efd" }}
        ></i>
      </CSVLink>
    );
  };

  // Helper function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // csv end
  // ========================================

  const handleExportPDF = () => {
    const unit = "pt";
    const size = "A4"; // You can change to 'letter' or other sizes if needed
    const doc = new jsPDF("landscape", unit, size);

    // Define headers and map the data based on your table structure
    const headers = [
      [
        "S.No",
        "Task ID",
        "Raised Date",
        "Department",
        "Issues Type",
        "Emp ID",
        "Emp Name",
        "Status",
        "Attachment",
      ],
    ];

    const data = filteredleaveData.map((row, index) => [
      index + 1,
      row.ticket_id,
      formatDate(row.created_date),
      row.department_name,
      row.issue_name,
      row.hrms_emp_id, // Conditional Tenant ID
      row.emp_name, // Conditional Tenant Name
      row.status_description,
      row.attachment !== "-" ? "Attachment Available" : "No Attachment",
    ]);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 10 },
      columnStyles: {
        0: { halign: "center" },
        7: { halign: "center" }, // Center align status column
        8: { halign: "center" }, // Center align attachment column
      },
    });

    doc.save("Total_Ticket_List.pdf");
  };

  // PDF End
  // ========================================

  // ========================================
  // Fillter start

  const filteredData = tableData.filter((row) =>
    Object.values(row).some(
      (value) =>
        (typeof value === "string" || typeof value === "number") &&
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
    color: "white",
    fontSize: "16px",
    border: "1px solid #0d6efd",
    marginRight: "15px",
    borderRadius: "21px",
    padding: "5px 7px",
    boxShadow: "rgba(13, 110, 253, 0.5) 0px 0px 10px 1px",
  };

  const myStyles1 = {
    color: "#0d6efd",
    fontSize: "16px",
    border: "1px solid #0d6efd",
    marginRight: "15px",

    padding: "5px 7px",
    boxShadow: "rgba(13, 110, 253, 0.5) 0px 0px 10px 1px",
  };

  // ===============================================

  // -------------------------------------- Role Dropdown ----------------------------------------------------

  useEffect(() => {
    const fetchrole = async () => {
      try {
        const response = await axios.get(
          "https://epkgroup.in/crm/api/public/api/department_list",
          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );
        const data = response.data.data || [];
        setDepartmentDropdown(data);
        // console.log("setDepartmentDropdown", data)
      } catch (error) {
        console.error("Error fetching department options:", error);
      }
    };

    fetchrole();
  }, [usertoken]);

  const formattedDepartmentDropdown = departmentDropdown.map((department) => ({
    label: department.depart_name,
    value: department.id,
  }));

  const handleSelectDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption ? selectedOption.value : null);
  };

  const formattedSelectedDepartment = selectedDepartment
    ? selectedDepartment
    : null;

  // ---------------------------------------------------------------------------------------------------------

  // --------------------------------------- Employee Dropdown ------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = "http://epkgroup.in/crm/api/public/api/view_issuetypes";
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        });
        const data = response.data.data;
        setIssuesType(data);
        // console.log("setIssuesType", data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [usertoken]);

  const formattedIssuesType = IssuesType.map((employee) => ({
    label: employee.issue_type,
    value: employee.id,
  }));

  const handleSelectEmployeeChange = (selectedOption) => {
    setSelectedEmployee(selectedOption ? selectedOption.value : null);
  };

  const formattedSelectedEmployees = selectedEmployee ? selectedEmployee : null;

  // ------------------------------------------------------------------------------------------------

  console.log("filteredleaveData-------------->", filteredleaveData);

  const [tasks, setTasks] = useState(filteredleaveData);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusReason, setStatusReason] = useState("");

  const handleStatusChange = (selectedOption, task) => {
    setCurrentTask(task);
    setSelectedStatus(selectedOption);
    setShowStatusModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (!currentTask) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No task selected.",
      });
      return;
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === currentTask.id) {
        return { ...task, status: selectedStatus.value };
      }
      return task;
    });
    setTasks(updatedTasks);
    setShowStatusModal(false);
    setCurrentTask(null);
    setSelectedStatus(null);
    setStatusReason("");

    const ProjectData = {
      id: currentTask.id,
      status: selectedStatus.value,
      reason: statusReason,
      updated_by: userempid,
    };

    try {
      const response = await fetch(
        "https://epkgroup.in/crm/api/public/api/task_update_status",
        {
          method: "PUT",
          body: JSON.stringify(ProjectData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const { status, message } = data;

      if (status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
        });
        // handleVisitprojectlist();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${error.message}`,
      });
    }
  };

  const statusOptions = [
    { value: "Not Yet Start", label: "Not Yet Start" },
    { value: "In-Progress", label: "In-Progress" },
    { value: "Hold", label: "Hold" },
    { value: "Completed", label: "Completed" },
  ];
  // -------------------------------------------------------------------------------------------------

  const [reasonModalIsOpen, setReasonModalIsOpen] = useState(false);

  const openReasonModal = () => {
    console.log("Modal opening");
    setReasonModalIsOpen(true);
  };

  const closeReasonModal = () => {
    setReasonModalIsOpen(false);
  };

  // ---------------------------------------------------------------------------------------------

  const Description = {
    maxWidth: "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    wordBreak: "break-word",
    cursor: "pointer",
  };

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleOpenModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent("");
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
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f6f6f6",
          }}
        >
          <ScaleLoader color="rgb(20 166 249)" />
        </div>
      ) : (
        <Container fluid className="shift__container">
          <h3 className="mb-5" style={{ fontWeight: "bold", color: "#00275c" }}>
            Assigned List
          </h3>

          {/* ------------------------------------------------------------------------------------------------ */}
          {/* List table */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingBottom: "10px",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "17px",
            }}
          >
            <div className="filter-container">
              <Button onClick={() => setShowFilterModal(true)}>
                <FontAwesomeIcon icon={faFilter} /> Filter
              </Button>

              <Modal
                show={showFilterModal}
                onHide={cancelFilter}
                dialogClassName="custom-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Filter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    {(userrole.includes("1") || userrole.includes("2")) && (
                      <>
                        <Form.Group controlId="formRole">
                          <Form.Label style={{ fontWeight: "bold" }}>
                            Department
                          </Form.Label>
                          <Select
                            options={formattedDepartmentDropdown}
                            value={formattedDepartmentDropdown.find(
                              (option) => option.value === selectedDepartment
                            )}
                            onChange={handleSelectDepartmentChange}
                            isClearable
                          />
                        </Form.Group>
                        <Form.Group controlId="formEmployee">
                          <Form.Label style={{ fontWeight: "bold" }}>
                            Issues Type
                          </Form.Label>
                          <Select
                            options={formattedIssuesType}
                            value={formattedIssuesType.find(
                              (option) => option.value === selectedEmployee
                            )}
                            onChange={handleSelectEmployeeChange}
                            isClearable
                          />
                        </Form.Group>
                      </>
                    )}

                    <Form.Group controlId="fromDate">
                      <Form.Label>From Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={fromDate}
                        max="9999-12-31"
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="toDate">
                      <Form.Label>To Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={toDate}
                        max="9999-12-31"
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="status">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="1">Pending</option>
                        <option value="2">In-Progress</option>
                        <option value="3">Completed</option>
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={cancelFilter}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={applyFilter}>
                    Apply Filter
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={myStyles1}
              />

              <button style={myStyles}>{handleExportCSV()}</button>
              <button style={myStyles} onClick={handleExportPDF}>
                <i
                  className="fas fa-file-pdf"
                  style={{ fontSize: "25px", color: "#0d6efd" }}
                ></i>
              </button>
              <button style={myStyles} onClick={handlePrint}>
                <i
                  className="fas fa-print"
                  style={{ fontSize: "25px", color: "#0d6efd" }}
                ></i>
              </button>
            </div>
          </div>

          <div ref={componentRef} style={{ overflowX: "auto", width: "100%" }}>
            <table
              className="table"
              style={{ minWidth: "100%", width: "max-content" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>S.No</th>
                  <th>Ticket ID</th>
                  <th>Raised Date</th>
                  <th>Emp ID</th>
                  <th>Emp Name</th>
                  <th>Raised By</th>
                  <th>Department</th>
                  <th>Issues Type</th>
                  {/* {(userrole.includes('1') || userrole.includes('2')) && (<th>Department</th>)}
{(userrole.includes('1') || userrole.includes('2')) && (<th>Assigned To</th>)} */}
                  <th>Status</th>
                  <th>Attachment</th>
                  <th>Action</th>
                  {/* <th className='no-print'>Attachment</th>
<th>Task Status</th>
<th>Priority</th>
{(userrole.includes('1') || userrole.includes('2')) && (<th className='no-print'>Action</th>)} */}
                </tr>
              </thead>

              <tbody>
                {filteredleaveData.length === 0 ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center" }}>
                      No search data found
                    </td>
                  </tr>
                ) : (
                  filteredleaveData.map((row, index) => {
                    const serialNumber = currentPage * itemsPerPage + index + 1;
                    return (
                      <tr key={row.id}>
                        <td>{serialNumber}</td>
                        <td>{row.ticket_id}</td>
                        <td>
                          {(() => {
                            const date = new Date(row.created_date);
                            return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
                          })()}
                        </td>
                        <td>{row.created_by}</td>
                        <td>{row.emp_name}</td>
                        <td>{row.hrms_emp_id}</td>
                        {/* <td>{row.created_date}</td> */}
                        <td>{row.department_name}</td>
                        <td>{row.issue_name}</td>
                        {/* <td style={Description} onClick={() => handleOpenModal(row.description)}>{row.description}</td>
{(userrole.includes('1') || userrole.includes('2')) && (<td>{row.department}</td>)}
{(userrole.includes('1') || userrole.includes('2')) && (<td>{row.assign_to}</td>)} */}
                        <td>{row.status_description}</td>

                        <td className="no-print">
                          {row.attachment !== "-" ? (
                            <button
                              style={{ padding: "6px" }}
                              className="btn-view"
                              onClick={() => {
                                window.open(
                                  `https://epkgroup.in/crm/api/storage/app/${row.attachment}`,
                                  "_blank"
                                );
                              }}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                          ) : (
                            <button
                            style={{ padding: "6px" }}
                            className="btn-view"
                            onClick={() => alert('No attachment available for this ticket')}
                          >
                            <FontAwesomeIcon icon={faEyeSlash} />
                            </button>
                          )}
                        </td>

                        {/* {(userrole.includes("1") || userrole.includes("2")) && ( */}
                          <td
                          className="no-print"
                          >

                            <button
                              className="btn-edit"
                              style={{ marginRight: "10px" }}
                              onClick={() => {
                                GoToEditPage(row.id);
                              }}
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                          </td>
                        {/* )} */}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Modal
            show={showStatusModal}
            onHide={() => setShowStatusModal(false)}
            dialogClassName="custom-modal"
          >
            <Modal.Body>
              <Form onSubmit={handleModalSubmit}>
                <Form.Group controlId="userstatus">
                  <Form.Label style={{ fontWeight: "bold" }}>Status</Form.Label>
                  <Select
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="Select Status"
                  />
                </Form.Group>
                {selectedStatus && selectedStatus.value === "Hold" && (
                  <Form.Group controlId="statusReason">
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Reason
                    </Form.Label>
                    <FormControl
                      type="text"
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      placeholder="Enter reason for holding the task"
                    />
                  </Form.Group>
                )}
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowStatusModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>

          {/* ---------------------------------------------------------------------------------------- */}

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Description</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ wordBreak: "break-word" }}>
              {modalContent}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          {/* ---------------------------------------------------------------------------------------- */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <ReactPaginate
              previousLabel={<span aria-hidden="true">&laquo;</span>}
              nextLabel={<span aria-hidden="true">&raquo;</span>}
              breakLabel={<span>...</span>}
              breakClassName={"page-item disabled"}
              breakLinkClassName={"page-link"}
              pageCount={Math.ceil(filteredData.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              disabledClassName={"disabled"}
              activeLinkClassName={"bg-dark text-white"}
            />
          </div>

          {/* ------------------------------------------------------------------------------------------------ */}
        </Container>
      )}
    </>
  );
}

export default Tenant_assign_list;
