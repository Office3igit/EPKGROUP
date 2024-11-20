import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./Tenant_raise_ticket.css";
import Commands from './TenantCommands';

const TenantEditTicketList = () => {
  // ------------------------------------------------------------------------------------------------
  // Redirect to the add shiftslot page

  const { id } = useParams();
  const navigate = useNavigate();
  const handleVisittasklist = () => {
    navigate(`/admin/tenant_ticket_list`);
  };
  // loading state
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------

  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem("userData"));

  // const usertoken = userData?.token || "";
  // const userempid = userData?.userempid || "";
  var usertoken = userData?.token || '';
  var token = usertoken.slice(usertoken.indexOf('|') + 1);
  var token_user_id;
  var userimage;
  var userempid;
  var tenant_identification = false;
  var userrole;

  if (userData?.sluge == "TENANT") {

    token_user_id = userData?.token_user_id || '';
    userimage = userData?.userimage || '';
    userempid = userData?.tenat_id || '';
    tenant_identification = true;

  } else {

    token_user_id = userData?.token_user_id || '';
    userimage = userData?.userimage || '';
    userempid = userData?.userempid || '';
  }


  // ------------------------------------------------------------------------------------------------

  const [current_id, setCurrentId] = useState("");
  const [issuesType, setIssuesType] = useState("");
  const [departmentDropdown, setDepartmentDropdown] = useState([]);
  const [departmentDropdownFromResponce, setDepartmentDropdownFromResponce] =
    useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [status, setStatus] = useState("");
  const [commands, setCommands] = useState("");
  const [issues_type, setIssesType] = useState("");

  

  const [formErrors, setFormErrors] = useState({});


  const handleSave = (e) => {
    e.preventDefault();

    // Validate input fields
    const errors = {};

    if (!startDate) {
      errors.startDate = "Start date is required.";
    }

    if (!endDate) {
      errors.endDate = "End date is required.";
    }

    if (!commands) {
      errors.commands = "Commands is required.";
    }

    if(!userempid){
      alert('User emp_id is required');
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const formData = new FormData();

    formData.append("id", current_id);
    formData.append("start_date", startDate);
    formData.append("estimate_date", endDate);
    formData.append("comments", commands);
    formData.append("status", status);
    formData.append("updated_by", userempid);
    
    axios
      .post("https://epkgroup.in/crm/api/public/api/tenant_update_newraiseticket",formData,
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      )
      .then((response) => {
        const { status, message } = response.data;
        if (status === "success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: message,
          });
          handleVisittasklist();
        } else {
          Swal.fire({
            icon: "error",
            title: "Operation Failed",
            text: message,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error creating the shift slot. Please try again later.",
        });
        console.error("There was an error with the API:", error);
      });
  };
  // ------------------------------------------------------------------------------------------------

  const handleCancel = () => {
    handleVisittasklist();
  };

  // ------------------------------------------------------------------------------------------------
  // edit project list

  const [data, setData] = useState([]);

  const formattedSelectedDepartment = selectedDepartment
    ? selectedDepartment.join(",")
    : null;

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
        setIssuesType(data.issue_type);
        // setEmployeesDropdown(data);
        // console.log("setEmployeesDropdown", data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [issues_type]);

  // -------------------------------- Department Lists -------------------------------------------------

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
        console.log("depdata", data);
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

  // -------------------------------- Edit Raise Ticket Lists -------------------------------------------------
  useEffect(() => {
    const fetchSelectedDepartments = async () => {
      try {
        const response = await axios.get(
          `https://epkgroup.in/crm/api/public/api/tenant_editnewview_raiselist/${id}`,
          {
            headers: { Authorization: `Bearer ${usertoken}` },
          }
        );
        if (response.status === 200) {
          console.log('############this is comes responce',response);
          const DepartmentNameArray = response.data.data.assign_deps
            ? response.data.data.assign_deps.split(",").map((dep) => dep.trim())
            : [];
          setDepartmentDropdownFromResponce(DepartmentNameArray);
          setCurrentId(response.data.data.id);
          setDescription(response.data.data.description);
          if(response.data.data.attachment != '-'){
            setAttachment(`https://epkgroup.in/crm/api/storage/app/${response.data.data.attachment}`);
          }
          setStartDate(response.data.data.start_date);
          setEndDate(response.data.data.start_date);
          setStatus(response.data.data.status);
          setIssesType(response.data.data.issue_type);
        }
      } catch (error) {
        console.error("Error fetching selected departments:", error);
      }
    };

    fetchSelectedDepartments();
  }, [usertoken, id]);


  useEffect(() => {
    if (
      departmentDropdown.length > 0 &&
      departmentDropdownFromResponce.length > 0
    ) {
      console.log("dd", departmentDropdownFromResponce);
      // Filter only if departmentDropdownFromResponce includes option.value
      const initialSelection = departmentDropdown.filter(
        (option) =>
          departmentDropdownFromResponce.includes(option.value.toString()) // Ensuring type match
      );

      console.log("Initial selection:", initialSelection);
      setSelectedDepartment(initialSelection);
    }
  }, [departmentDropdown, departmentDropdownFromResponce]);

  // Handle department selection
  const handleSelectDepartmentChange = (selected) => {
    setSelectedDepartment(selected);
  };

  return (
    <div
      className="Addproject__container mt-5"
      style={{ padding: "0px 70px 30px" }}
    >
      <h3 className="mb-5" style={{ fontWeight: "bold", color: "#00275c" }}>
        Edit Ticket
      </h3>
      <div
        style={{
          boxShadow: "rgba(0, 0, 0, 0.49) 0px 0px 10px 1px",
          padding: "35px 50px",
        }}
        className='form__area'
      >
        <Form onSubmit={handleSave}>
          <Row>
            <Col>
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
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="formEmployee">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Issues Type
                </Form.Label>
                {/* <MultiSelect
                                    options={formattedEmployeesDropdown}
                                    value={formattedEmployeesDropdown.filter(option => selectedEmployee.includes(String(option.value)))}
                                    onChange={handleSelectEmployeeChange}
                                    labelledBy="Select"
                                /> */}
                <Form.Control
                  type="text"
                  value={issuesType}
                  readOnly
                  disabled
                />

                {formErrors.selectedEmployee && (
                  <span className="text-danger">
                    {formErrors.selectedEmployee}
                  </span>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled
                />
                {formErrors.description && (
                  <span className="text-danger">{formErrors.description}</span>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={10}>
              <Form.Group controlId="attachment">
                <Form.Label>Attachment</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  // onChange={handleImageChange}
                  className="form-control"
                //   filename={attachment}
                  readOnly
                  disabled
                />
                {/* Conditional rendering for attachment preview or 'No Attachment' */}
                
              </Form.Group>
            </Col>

            <Col md={2} style={{display:'flex', alignItems:'end'}}>
            {attachment ? (
                  <div className="attachment-preview">
                    <Button
                      variant="primary"
                      href={attachment}
                      target="_blank"
                      style={{ marginTop: "10px" }}
                    >
                      View Attachment
                    </Button>
                  </div>
                ) : (
                  <p
                    style={{
                      marginTop: "10px",
                      fontStyle: "italic",
                      color: "#888",
                    }}
                  >
                    No Attachment
                  </p>
                )}
            </Col>

            <Col>
            
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  max={endDate}
                  disabled = {tenant_identification ? true : false}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                {formErrors.startDate && (
                  <span className="text-danger">{formErrors.startDate}</span>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="endDate">
                <Form.Label>Estimate Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  min={startDate}
                  max="9999-12-31"
                  disabled = {tenant_identification ? true : false}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                {formErrors.endDate && (
                  <span className="text-danger">{formErrors.endDate}</span>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group controlId="status">
                <Form.Label>Task Status</Form.Label>
                <Form.Control
                  as="select"
                  value={status}
                  disabled = {tenant_identification ? true : false}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" disabled>Select Status</option>
                  <option value="1">Pending</option>
                  <option value="2">In-Progress</option>
                  <option value="3">Completed</option>
                </Form.Control>
                {formErrors.status && (
                  <span className="text-danger">{formErrors.status}</span>
                )}
              </Form.Group>
            </Col>

          </Row>

          <Row>
            <Col md={12}>
              <Form.Group controlId="description">
                <Form.Label>Comments</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={commands}
                  disabled = {tenant_identification ? true : false}
                  onChange={(e) => setCommands(e.target.value)}
                />
                {formErrors.commands && (
                  <span className="text-danger">{formErrors.commands}</span>
                )}
              </Form.Group>
            </Col>
          </Row>
          <br></br>
         {tenant_identification ? null :(
          <>
          <Button variant="primary" type="submit">
            Update
          </Button>
          </>
         ) }
        </Form>
      </div>
      <Commands Commands_id={id} />
    </div>
  );
};

export default TenantEditTicketList;
