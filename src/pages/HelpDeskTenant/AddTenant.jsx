import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { MultiSelect } from "react-multi-select-component";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { ScaleLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export default function Add_Tenant() {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));
  const usertoken = userData?.token || "";
  const userrole = userData?.userrole || "";
  const userempid = userData?.userempid || "";

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tenant_type, setTenant_type] = useState("");
  
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [building, setBuilding] = useState("");
  const [cubicle, setCubicle] = useState("");
  const [advance_amount, setAdvance_amount] = useState("");
  const [rent_amount, setRent_amount] = useState("");
  const [agreement_start, setAgreement_start] = useState("");
  const [agreement_end, setAgreement_end] = useState("");
  const [type_of_rent, setType_of_rent] = useState("");
  const [notice_period, setNotice_period] = useState("");
  const [generate_charges, setGenerate_charges] = useState("");

  const [formErrors, setFormErrors] = useState({});

  const [loading, setLoading] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  const handleCancel = () => {
    setName("");
    setCompanyName("");
    setMobile("");
    setEmail("");
    setBuilding("");
    setCubicle("");
    setAdvance_amount("");
    setRent_amount("");
    setAgreement_start("");
    setAgreement_end("");
    setType_of_rent("");
    setNotice_period("");
    setGenerate_charges("");
    setTenant_type("");
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    const errors = {};
    // if (!headerAttachment) errors.headerAttachment = 'Header Attachment is required.';
    // if (!footerAttachment) errors.footerAttachment = 'Footer Attachment is required.';

    if (!name) errors.name = "Tenant name is required.";
    if (!companyName) errors.companyName = "Company Name is required.";
    if (!tenant_type) errors.tenant_type = "Tenant type is required";
    if (!mobile) errors.mobile = "Mobile number is required.";
    if (!email) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    if (!building) errors.building = "Building Name is required.";
    if (!cubicle) errors.cubicle = "Cubicle Name is required."; 
    if (!advance_amount) errors.advance_amount = "Advance amount is required.";
    if (!rent_amount) errors.rent_amount = "Rent amount is required.";
    if (!agreement_start)
      errors.agreement_start = "Agreement Start is required.";
    if (!agreement_end) errors.agreement_end = "Agreement End is required.";
    if (!type_of_rent) errors.type_of_rent = "Type of rend is required.";
    if (!notice_period) errors.notice_period = "Notice Period is required.";
    if (!generate_charges)
      errors.generate_charges = "Generate Charges is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const formData = new FormData();

    formData.append("tnt_name", name);
    formData.append("email", email);
    formData.append("tenant_type", tenant_type);
    formData.append("password", password);
    formData.append("contact_number", mobile);
    formData.append("company_name", companyName);
    formData.append("building", building);
    formData.append("office", cubicle);
    formData.append("type_of_rent", type_of_rent);
    formData.append("generator_charges", generate_charges);
    formData.append("agrement_start", agreement_start);
    formData.append("agrement_end", agreement_end);
    formData.append("notice_period", notice_period);
    formData.append("advance_amount", advance_amount);
    formData.append("rental_amount", rent_amount);
    formData.append("current_user_emp", userData.userempid);

    try {
      const response = await axios.post(
        "https://epkgroup.in/crm/api/public/api/add_tenant",
        formData,
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        handleCancel();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Tenant Added Successfully.`,
        });
        navigate("/admin/list_tenant");
      } else {
        throw new Error(response.data.errors);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${error.message}`,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    // const formdata = {
    //   user_roleid: userrole,
    //   emp_id: userempid,
    // };

    setLoading(false);

  };

  return (
    <>
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
        <div className="container mt-5" style={{ padding: "0px 70px 0px" }}>
          <h3 className="mb-5" style={{ fontWeight: "bold", color: "#00275c" }}>
            Add New Tenant
          </h3>

          <div
            style={{
              boxShadow: "#0000007d 0px 0px 10px 1px",
              padding: "35px 50px",
            }}
            className="mb-5"
          >
            <form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={4}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="tenant_name" className="form-label">
                      Tenant Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tenant_name"
                      placeholder="Enter Tenant Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {formErrors.name && (
                      <span className="text-danger">{formErrors.name}</span>
                    )}
                  </div>
                </Col>

                <Col md={4}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="company_name" className="form-label">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="company_name"
                      placeholder="Enter Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    {formErrors.companyName && (
                      <span className="text-danger">{formErrors.companyName}</span>
                    )}
                  </div>
                </Col>

                <Col md={4}>
                  {/* Select Salutation */}
                  <div className="mb-3">
                    <label htmlFor="tenant_type" className="form-label">
                      Tenant Type
                    </label>
                    <select
                      id="tenant_type"
                      className="form-control"
                      value={tenant_type}
                      onChange={(e) => setTenant_type(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Tenant Type
                      </option>
                      <option value="Co-Working">Co-Working</option>
                      <option value="Individual">Individual</option>
                    </select>
                    {formErrors.tenant_type && (
                      <span className="text-danger">
                        {formErrors.tenant_type}
                      </span>
                    )}
                  </div>
                </Col>

              </Row>

              <Row className="mb-3">

                <Col md={6}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="tenant_email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="tenant_email"
                      placeholder="Enter Company Name"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {formErrors.email && (
                      <span className="text-danger">{formErrors.email}</span>
                    )}
                  </div>
                </Col>

                <Col md={6}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="tenant_password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="tenant_password"
                      placeholder="Enter Password Here"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {formErrors.password && (
                      <span className="text-danger">{formErrors.password}</span>
                    )}
                  </div>
                </Col>

              </Row>

              <Row className="mb-3">
                
                <Col md={6}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="tenant_mobile" className="form-label">
                      Mobile Number
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="tenant_mobile"
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                    {formErrors.mobile && (
                      <span className="text-danger">{formErrors.mobile}</span>
                    )}
                  </div>
                </Col>

                <Col md={6}>
                  {/* Select Salutation */}
                  <div className="mb-3">
                    <label htmlFor="type_of_rent" className="form-label">
                      Type of Rent
                    </label>
                    <select
                      id="type_of_rent"
                      className="form-control"
                      value={type_of_rent}
                      onChange={(e) => setType_of_rent(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Rent
                      </option>
                      <option value="Pre-rent">Pre-Rent</option>
                      <option value="Post-rent">Post-Rent</option>
                      {/* Add more options as needed */}
                    </select>
                    {formErrors.type_of_rent && (
                      <span className="text-danger">
                        {formErrors.type_of_rent}
                      </span>
                    )}
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="tenant_building" className="form-label">
                      Building Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tenant_building"
                      placeholder="Enter Building"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                    />
                    {formErrors.building && (
                      <span className="text-danger">{formErrors.building}</span>
                    )}
                  </div>
                </Col>

                <Col md={6}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="tenant_cubicle" className="form-label">
                      Office
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tenant_cubicle"
                      placeholder="e.g., Cubicle A1, B2, etc."
                      value={cubicle}
                      onChange={(e) => setCubicle(e.target.value)}
                    />
                    {formErrors.cubicle && (
                      <span className="text-danger">{formErrors.cubicle}</span>
                    )}
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  {/* Name */}
                  <div className="mb-3">
                    <label
                      htmlFor="tenant_advance_amount"
                      className="form-label"
                    >
                      Advance Amount
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="tenant_advance_amount"
                      placeholder="Enter Advance Amount"
                      value={advance_amount}
                      onChange={(e) => setAdvance_amount(e.target.value)}
                    />
                    {formErrors.advance_amount && (
                      <span className="text-danger">{formErrors.advance_amount}</span>
                    )}
                  </div>
                </Col>

                <Col md={6}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="tenant_rent_amount" className="form-label">
                      Rent Amount
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="tenant_rent_amount"
                      placeholder="Enter Rent Amount"
                      value={rent_amount}
                      onChange={(e) => setRent_amount(e.target.value)}
                    />
                    {formErrors.rent_amount && (
                      <span className="text-danger">{formErrors.rent_amount}</span>
                    )}
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  {/* Agreement Start Date */}
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                      Agreement Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="Aggrement_start"
                      value={agreement_start}
                      max={agreement_end || "9999-12-31"} // Set max to end date if available
                      onChange={(e) => {
                        setAgreement_start(e.target.value);
                      }}
                    />
                    {formErrors.agreement_start && (
                      <span className="text-danger">
                        {formErrors.agreement_start}
                      </span>
                    )}
                  </div>
                </Col>

                <Col md={6}>
                  {/* Agreement End Date */}
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                      Agreement End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="Aggrement_end"
                      value={agreement_end}
                      min={agreement_start} // Set min to start date
                      max="9999-12-31"
                      onChange={(e) => {
                        setAgreement_end(e.target.value);
                      }}
                    />
                    {formErrors.agreement_end && (
                      <span className="text-danger">{formErrors.agreement_end}</span>
                    )}
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">

                <Col md={6}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="notice_period" className="form-label">
                      Notice Period
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="notice_period"
                      value={notice_period}
                      placeholder="Enter the notice period"
                      onChange={(e) => setNotice_period(e.target.value)}
                    />
                    {formErrors.notice_period && (
                      <span className="text-danger">{formErrors.notice_period}</span>
                    )}
                  </div>
                </Col>

                <Col md={6}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="generate_charges" className="form-label">
                      Generate Charges
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="generate_charges"
                      placeholder="Enter the generate charges"
                      value={generate_charges}
                      onChange={(e) => setGenerate_charges(e.target.value)}
                    />
                    {formErrors.generate_charges && (
                      <span className="text-danger">{formErrors.generate_charges}</span>
                    )}
                  </div>
                </Col>
              </Row>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginRight: "10px" }}
              >
                Add Tenant
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ background: "white", color: "#0d6efd" }}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
