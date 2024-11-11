import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";
import ReactPaginate from "react-paginate";
import { ScaleLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import "./TenantListView.css";

export default function TenantList() {
  // ------------------------------------------------------------------------------------------------

  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem("userData"));

  const usertoken = userData?.token || "";
  const userempid = userData?.userempid || "";
  const userrole = userData?.userrole || "";

  // ------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------
  // Navigat to editevent
  const navigate = useNavigate();

  const GoToEditPage = (id) => {
    navigate(`/admin/edit_tenant/${id}`);
  };

  //   const GoToViewPage = (id, layout_id) => {
  //     navigate(`/admin/offerletterview/${id}/${layout_id}`);
  //   };

  const [loading, setLoading] = useState(true);

  const [popup_id, setPopup_id] = useState("");

  const [tnt_id, setTntId] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tenant_type, setTenant_type] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [building, setBuilding] = useState("");
  const [cubicle, setCubicle] = useState("");
  const [advance_amount, setAdvance_amount] = useState("");
  const [rent_amount, setRent_amount] = useState("");
  const [agreement_start, setAgreement_start] = useState("");
  const [agreement_end, setAgreement_end] = useState("");
  const [type_of_rent, setType_of_rent] = useState("");
  const [notice_period, setNotice_period] = useState("");
  const [generate_charges, setGenerate_charges] = useState("");
  const [tenant_status, setTenant_status] = useState("");
  // ------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------

  // Table list view api

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData();
  }, []);

  const [showPopup, setShowPopup] = useState(false);

  const handleButtonClick = (popup_id) => {
    // GoToViewPage(row.id, row.layout_id);
    axios
      .get(`https://epkgroup.in/crm/api/public/api/edit_tenant/${popup_id}`, {
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setShowPopup(true);

          // setData(res.data.data);
          const data = res.data.data;
          setTntId(data.tnt_id);
          setName(data.tnt_name);
          setCompanyName(data.company_name);
          setTenant_type(data.tenant_type);
          setMobile(data.contact_number);
          setEmail(data.email);
          setPassword(data.password);
          setLoading(false);
          setBuilding(data.building);
          setCubicle(data.office);
          setAdvance_amount(data.advance_amount);
          setRent_amount(data.rental_amount);
          setAgreement_start(data.agrement_start);
          setAgreement_end(data.agrement_end);
          setType_of_rent(data.type_of_rent);
          setNotice_period(data.notice_period);
          setGenerate_charges(data.generator_charges);
          setTenant_status(data.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Format day with leading zero
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Format month with leading zero
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const fetchTableData = async () => {
    try {
      // const response = await fetch('https://epkgroup.in/crm/api/public/api/tenant_list', {
      //     headers: {
      //         'Authorization': `Bearer ${usertoken}`
      //     }
      // });
      const response = await fetch(
        "https://epkgroup.in/crm/api/public/api/tenant_list",
        {
          method: "POST", // Specify the method as POST
          headers: {
            Authorization: `Bearer ${usertoken}`, // Include authorization token
            "Content-Type": "application/json", // Specify content type as JSON
          },
          body: JSON.stringify({
            user_roleid: userrole,
          }),
        }
      );
      console.log(response, "responce");
      if (response.ok) {
        const responseData = await response.json();
        setTableData(responseData.data);
        setLoading(false);
      } else {
        throw new Error("Error fetching data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // ------------------------------------------------------------------------------------------------

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const componentRef = React.useRef();

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
    const csvData = tableData.map((row, index) => ({
      "#": index + 1,                  // Serial number
      tnt_id: row.tnt_id,              // Tenant ID
      tnt_name: row.tnt_name,          // Tenant Name
      company_name: row.company_name,  // Company Name
      contact_number: row.contact_number, // Mobile Number
      email: row.email,                // Email
      status: row.status               // Status
    }));
  
    const headers = [
      { label: "S.No", key: "#" },
      { label: "Tenant ID", key: "tnt_id" },
      { label: "Tenant Name", key: "tnt_name" },
      { label: "Company Name", key: "company_name" },
      { label: "Mobile Number", key: "contact_number" },
      { label: "Email", key: "email" },
      { label: "Status", key: "status" }
    ];
  
    const csvReport = {
      data: csvData,
      headers: headers,
      filename: "Total_Tenant_List.csv"
    };
  
    return (
      <CSVLink {...csvReport}>
        <i className="fas fa-file-csv" style={{ fontSize: "25px", color: "#0d6efd" }}></i>
      </CSVLink>
    );
  };

  // csv end
  // ========================================

  // ========================================
  // PDF start
  const handleExportPDF = () => {
    const unit = "pt";
    const size = "A4";
    const doc = new jsPDF("landscape", unit, size);
  
    // Map tableData to create rows for the PDF table, including all columns
    const data = tableData.map((row, index) => [
      index + 1,
      row.tnt_id,
      row.tnt_name,
      row.company_name,
      row.contact_number,
      row.email,
      row.status
    ]);
  
    // Define the headers with your desired column names
    const headers = [["S.No", "Tenant ID", "Tenant Name", "Company Name", "Mobile Number", "Email", "Status"]];
  
    doc.autoTable({
      head: headers,
      body: data,
      styles: { fontSize: 10 }, // Optionally set font size
      columnStyles: {
        0: { halign: 'center' }, // Align S.No to center
        6: { halign: 'center' }, // Align Status to center
      },
      margin: { top: 50 }, // Optionally set margin
    });
  
    doc.save("TenantList.pdf");
  };

  // PDF End
  // ========================================

  const filteredData = tableData.filter((row) =>
    Object.values(row).some(
      (value) =>
        (typeof value === "string" || typeof value === "number") &&
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const pageCount = Math.ceil(tableData.length / itemsPerPage);

  const filteredEvents = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // ========================================

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

  const popupOverlayStyle = {
    position: "fixed",
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden'; // Disable background scrolling
    } else {
      document.body.style.overflow = 'auto'; // Re-enable background scrolling
    }
    return () => {
      document.body.style.overflow = 'auto'; // Clean up on component unmount
    };
  }, [showPopup]);

  const popupContentStyle = {
    // backgroundColor: "white",
    // padding: "20px",
    // borderRadius: "8px",
    width: "43%",
    // textAlign: "center",
  };
  console.log("Filtered Events:", filteredEvents); // Check the values before mapping

  return (
    <>
      {showPopup && (
        <div
          class="modal"
          tabindex="-1"
          role="dialog"
          style={popupOverlayStyle}
        >
          <div class="modal-dialog" role="document" style={popupContentStyle}>
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  Tenant Details -{" "}
                  <span>
                    {tenant_status == "Active" ? (
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                      >
                        Active
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                      >
                        In-Active
                      </button>
                    )}
                  </span>
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={closePopup}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <Row className="mb-3">
                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Tenant ID</p>
                      <p>{tnt_id}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Tenant Name</p>
                      <p>{name}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Company Name</p>
                      <p>{companyName}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Tenant Type</p>
                      <p>{tenant_type}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Email</p>
                      <p>{email}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Mobile Number</p>
                      <p>{mobile}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Building Name</p>
                      <p>{building}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Cubicle</p>
                      <p>{cubicle}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Rent Type</p>
                      <p>{type_of_rent}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Advance Amount</p>
                      <p>{advance_amount}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Rent Amount</p>
                      <p>{rent_amount}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Agreement Start Date</p>
                      <p>{formatDate(agreement_start)}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Agreement End Date</p>
                      <p>{formatDate(agreement_end)}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Notice Period</p>
                      <p>{notice_period}</p>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Name */}
                    <div className="mb-3">
                      <p>Generate Charges</p>
                      <p>{generate_charges}</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      )}
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
          <ScaleLoader color="#36d7b7" />
        </div>
      ) : (
        <div
          style={{
            maxWidth: "100%",
            overflowX: "auto",
            paddingTop: "7vh",
            padding: "10px 40px",
          }}
        >
          <h3 className="mb-5" style={{ fontWeight: "bold", color: "#00275c" }}>
            Tenant List
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingBottom: "10px",
              justifyContent: "space-between",
            }}
          >
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

          <div ref={componentRef} style={{ width: "100%", overflowX: "auto" }}>
            <table
              className="table"
              style={{ minWidth: "100%", width: "max-content" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th style={{width:'5%'}}>S.No</th>
                  <th style={{width:'10%'}}>Tenant ID</th>
                  <th style={{width:'10%'}}>Tenant Name</th>
                  <th style={{width:'15%'}}>Company Name</th>
                  <th style={{width:'10%'}}>Mobile Number</th>
                  <th style={{width:'15%'}}>Email</th>
                  <th style={{width:'10%'}}>Status</th>
                  <th style={{width:'15%'}}>More Details</th>
                  {/* <th>Status</th> */}
                  <th style={{width:'10%'}} className="no-print">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center" }}>
                      No search data found
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((row, index) => (
                    <tr key={index}>
                      <td style={{width:'5%'}}>{index + 1}</td>
                      <td style={{width:'10%'}}>{row.tnt_id}</td>
                      <td style={{width:'10%'}}>{row.tnt_name}</td>
                      <td style={{width:'15%'}}>{row.company_name}</td>
                      <td style={{width:'10%'}}>{row.contact_number}</td>
                      <td style={{width:'15%'}}>{row.email}</td>
                      <td style={{width:'10%'}}>
                        {row.status === "Active" ? (
                          <button
                            type="button"
                            className="btn btn_for_status btn-success btn-sm"
                          >
                            Active
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn_for_status btn-danger btn-sm"
                          >
                            In-Active
                          </button>
                        )}
                      </td>
                      <td style={{width:'15%'}}>
                        {" "}
                        <button
                          className="btn-view"
                          onClick={() => handleButtonClick(row.id)} // Use an arrow function here
                        >
                          <FontAwesomeIcon icon={faEye} /> View
                        </button>
                      </td>
                      <td style={{width:'10%'}} className="no-print">
                        <span style={{ }}>
                          <button
                            className="btn-edit"
                            onClick={() => {
                              GoToEditPage(row.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faPen} /> Edit
                          </button>
                          {/* <button
                            className="btn-delete"
                            onClick={() => handleDelete(row.id)}
                          >
                            <FontAwesomeIcon icon={faTrashCan} /> Delete
                          </button> */}
                        </span>
                      </td>
                    </tr>
                  ))

                  // =====================
                )}
              </tbody>
            </table>
          </div>

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
              pageCount={pageCount}
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
        </div>
      )}
    </>
  );
}
