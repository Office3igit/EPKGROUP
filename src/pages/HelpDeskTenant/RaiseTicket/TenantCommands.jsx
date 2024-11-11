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

import "../TenantListView.css";

const Tenant_Command = ({ Commands_id }) => {
    // ------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (Commands_id) {
            // Run the API when the `commandsValue` changes
            fetchTableData(Commands_id);
        }
    }, [Commands_id]);

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

    const [showPopup, setShowPopup] = useState(false);

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

    const fetchTableData = async (Commands_id) => {
        console.log('Condiion Working', Commands_id);
        try {
            const response = await fetch(
                `http://epkgroup.in/crm/api/public/api/tenant_status_command_list/${Commands_id}`,
                {
                    method: "GET", // Specify the method as POST
                    headers: {
                        Authorization: `Bearer ${usertoken}`, // Include authorization token
                        "Content-Type": "application/json", // Specify content type as JSON
                    }
                }
            );
            console.log("Ok Response --------", response);
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
        const csvData = tableData.map(({ date, name, designation }, index) => ({
            "#": index + 1,
            date,
            name,
            designation,
        }));

        const headers = [
            { label: "S.No", key: "#" },
            { label: "Date", key: "date" },
            { label: "Employee Name", key: "name" },
            { label: "Status", key: "status" },
            { label: "Designation", key: "designation" },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: "OfferLetterList .csv",
        };

        return (
            <CSVLink {...csvReport}>
                <i
                    className="fas fa-file-csv"
                    style={{ fontSize: "25px", color: "#0d6efd" }}
                ></i>
            </CSVLink>
        );
    };

    // csv end
    // ========================================

    // ========================================
    // PDF start

    const handleExportPDF = () => {
        const unit = "pt";
        const size = "A4"; // You can change to 'letter' or other sizes as needed
        const doc = new jsPDF("landscape", unit, size);

        const data = tableData.map(({ date, name, designation }, index) => [
            index + 1,
            date,
            name,
            designation,
        ]);

        doc.autoTable({
            head: [["S.No", "Date", "Employee Name", "Designation"]],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } },
        });

        doc.save("OfferLetterList.pdf");
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
            <style>
                {
                `@media print {
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
                        padding: "3% 0px",
                    }}
                >

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
                                    <th>S.No</th>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                    <th>Start Date</th>
                                    <th>Estimate Date</th>
                                    <th>Status</th>
                                    <th>Commands</th>
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
                                            <td>{index + 1}</td>
                                            <td>{row.hrms_emp_id}</td>
                                            <td>{row.emp_name}</td>
                                            <td>{row.start_date}</td>
                                            <td>{row.estimate_date}</td>
                                            <td>{row.status_description}</td>
                                            <td>{row.commands}</td>
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

export default Tenant_Command;