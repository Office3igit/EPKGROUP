import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,

} from 'mdb-react-ui-kit';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { ScaleLoader } from 'react-spinners';

import Accordion from 'react-bootstrap/Accordion';
import AccordionItem from 'react-bootstrap/AccordionItem';
import AccordionHeader from 'react-bootstrap/AccordionHeader';
import AccordionBody from 'react-bootstrap/AccordionBody';


export default function ViewProfile() {

    const { id } = useParams();


    console.log('karthik praveen', id)

    // ------------------------------------------------------------------------------------------------






    const navigate = useNavigate();

    const handleVisitedit = (id) => {
        // Use navigate function to navigate to the '/profile' route
        navigate(`/admin/editemployee/${id}`);
    };


    // const [employeeData, setEmployeeData] = useState({});

    const [loading, setLoading] = useState(true);

    // const [employeeData, setEmployeeData] = useState({
    //     epkemployee_id: '23',
    //     first_name: 'example name',
    //     dob: 'January 1, 1990',
    //     gender: 'Males',
    //     phone_no: '(097) 234-5678',
    //     whatsapp: '(098) 765-4321',
    //     email: 'example@example.com',
    //     address: 'Bay Area, San Francisco, CA',
    //     current_address: 'New York, NY',
    //     marital_status: 'Single',
    //     doj: 'January 1, 2020',
    //     spouse_name: 'Spouse Smith',
    //     department_name: 'IT Department',
    //     bank_accountnumber: '1234567890',
    //     bank_name: 'ABC Bank',
    //     bank_branch: 'Main Street Branch',
    //     ifsc_code: 'ABCD0123456',
    //     ac_type: 'Savings',
    // });

    // console.log("employeeData values------------>:", employeeData.image);


    const [employeeData, setEmployeeData] = useState({});

    const [empdocument, setEmpdocument] = useState([])


    const horizontalRule = {
        margin: '0.6rem 0',
        color: 'inherit',
        border: '0',
        borderTop: 'var(--bs-border-width) solid',
        opacity: '0.25',
    };



    //   ============================

    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userrole = userData?.userrole || '';




    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://epkgroup.in/crm/api/public/api/employee_detailslitshow/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const { data } = response.data;
                console.log('data-->', data)

                if (data && data.employee_details) {
                    setEmployeeData(data.employee_details);
                    console.log("setEmployeeData", data.employee_details)
                    setEmpdocument(data.employee_documents);


                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchData();
    }, [id]);


    console.log("empdocument", empdocument.document_name)


    return (
        <section>




            <MDBContainer className="py-5">

                {/* {loading ? (
                    <div style={{
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#f6f6f6'
                    }}>
                        <ScaleLoader color="#36d7b7" />
                    </div>
                ) : ( */}
                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    src={`https://epkgroup.in/crm/api/storage/app/${employeeData.profile_img}`}
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: '400px', height: '20vh', objectFit: 'contain', marginBottom: '30px' }}
                                    fluid
                                />

                                <h4 className=" mb-1" style={{ color: '#00275c', fontWeight: 'bold' }}>{employeeData.first_name} {employeeData.last_name}</h4>
                                <h5 className="text-muted mb-4">{employeeData.department_name}</h5>
                                <div className="d-flex justify-content-center mb-2">
                                    {/* <MDBBtn>Follow</MDBBtn>
                  <MDBBtn outline className="ms-1">Message</MDBBtn> */}
                                </div>
                            </MDBCardBody>
                        </MDBCard>


                    </MDBCol>



                    <MDBCol lg="8">

                        <Accordion defaultActiveKey="0" flush>



                            <MDBCard className="mb-4">
                                <AccordionItem eventKey="0">
                                    <MDBCardBody style={{ padding: '0px' }}>
                                        <AccordionHeader>
                                            <MDBRow>
                                                <MDBCol>
                                                    <h3 style={{ color: '#00275c', fontWeight: 'bold' }}>Basic Details</h3>
                                                </MDBCol>
                                            </MDBRow>
                                        </AccordionHeader>
                                        <AccordionBody>

                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Employee ID</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.hrms_emp_id}</MDBCardText> {/* Replace with actual Employee ID */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>First Name</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.first_name}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Last Name</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.last_name}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Gender</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.gender}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Status</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.emp_status}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Phone Number</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.mobile_no}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Whatsapp Number</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.whatsapp}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Email</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.email}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Date of Birth</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.dob}</MDBCardText> {/* Replace with actual date of birth */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Permanant address</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.address}</MDBCardText> {/* Replace with actual gender */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Current address</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.current_address}</MDBCardText> {/* Replace with actual gender */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />

                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Parent/Guadian Name</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.parents}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Marital Status</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.marital_status}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Spouse Name</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.spouse_name}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Aadhar Number</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.aadhar_number}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Pan Number</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.pan_number}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                        </AccordionBody>

                                    </MDBCardBody>
                                </AccordionItem>
                            </MDBCard>


                            <MDBCard className="mb-4">
                                <AccordionItem eventKey="1">
                                    <MDBCardBody style={{ padding: '0px' }}>
                                        <AccordionHeader>
                                            <MDBRow>
                                                <MDBCol>
                                                    <h3 style={{ color: '#00275c', fontWeight: 'bold' }}>Employee Details</h3>
                                                </MDBCol>
                                            </MDBRow>
                                        </AccordionHeader>

                                        <AccordionBody>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Employee Category</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.employee_category}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Date Of Joining</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.doj}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Probation Period</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.probation_period}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Confirmation Date</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.confirmation_date}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Employee Agreement Period</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.emp_aggrement}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Notice Period</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.notices_period}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>CTC</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.ctc}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Gross Salary</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.emp_grosssalary}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Net Salary</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.emp_salary}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Last Working Day</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.last_working_date}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Provident Fund</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.emp_pf}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>UAN Number</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.uan_number}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Employee PF Contribution</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.employee_contribution}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Employer PF Contribution</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.employeer_contribution}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>ESI</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.emp_esi}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>ESI Number</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.esi_number}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Employee ESI Contribution</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.employee_esi_contribution}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Employer ESI Contribution</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.employeer_esi_contribution}</MDBCardText> {/* Replace with actual address */}
                                                </MDBCol>
                                            </MDBRow>
                                        </AccordionBody>

                                    </MDBCardBody>
                                </AccordionItem>
                            </MDBCard>

                            <MDBCard className="mb-4">
                                <AccordionItem eventKey="2">

                                    <MDBCardBody style={{ padding: '0px' }}>
                                        <AccordionHeader>
                                            <MDBRow>
                                                <MDBCol>
                                                    <h3 style={{ color: '#00275c', fontWeight: 'bold' }}>Employee Role</h3>
                                                </MDBCol>
                                            </MDBRow>
                                        </AccordionHeader>
                                        <AccordionBody>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>User Role</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.role_name}</MDBCardText> {/* Replace with actual marital status */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Designation</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.department_name}</MDBCardText> {/* Replace with actual date of join */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Supervisor</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.supervisor_name}</MDBCardText> {/* Replace with actual spouse name */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Official Email ID</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.official_email}</MDBCardText> {/* Replace with actual department */}
                                                </MDBCol>
                                            </MDBRow>
                                            {/* <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Password</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.password}</MDBCardText> 
                                                </MDBCol>
                                            </MDBRow> */}
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Checkin/Checkout</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">
                                                        {
                                                            employeeData.emp_punch === '1' ? 'Checkin' :
                                                                employeeData.emp_punch === '2' ? 'Checkin/Checkout' :
                                                                    employeeData.emp_punch === '3' ? 'none' : ''
                                                        }
                                                    </MDBCardText> {/* Replace with actual spouse name */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>OverTime</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.ot_status}</MDBCardText> {/* Replace with actual spouse name */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Late Allowed</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.late_policy}</MDBCardText> {/* Replace with actual spouse name */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Permission Allowed</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.permission_policy}</MDBCardText> {/* Replace with actual spouse name */}
                                                </MDBCol>
                                            </MDBRow>
                                        </AccordionBody>
                                    </MDBCardBody>
                                </AccordionItem>
                            </MDBCard>

                            <MDBCard className="mb-4">
                                <AccordionItem eventKey="3">
                                    <MDBCardBody style={{ padding: '0px' }}>
                                        <AccordionHeader>
                                            <MDBRow>
                                                <MDBCol>
                                                    <h3 style={{ color: '#00275c', fontWeight: 'bold' }}>Bank Account Details</h3>
                                                </MDBCol>
                                            </MDBRow>
                                        </AccordionHeader>
                                        <AccordionBody>

                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Bank Account Number</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.bank_accountnumber}</MDBCardText> {/* Replace with actual account number */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Bank Name</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.bank_name}</MDBCardText> {/* Replace with actual bank name */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Bank Branch</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.bank_branch}</MDBCardText> {/* Replace with actual branch name */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>IFSC Code</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.ifsc_code}</MDBCardText> {/* Replace with actual IFSC code */}
                                                </MDBCol>
                                            </MDBRow>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Account Type</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{employeeData.ac_type}</MDBCardText> {/* Replace with actual account type */}
                                                </MDBCol>
                                            </MDBRow>
                                        </AccordionBody>
                                    </MDBCardBody>
                                </AccordionItem>

                            </MDBCard>

                            <MDBCard className="mb-4">
                                <AccordionItem eventKey="4">
                                    <MDBCardBody style={{ padding: '0px' }}>
                                        <AccordionHeader>
                                            <MDBRow>
                                                <MDBCol>
                                                    <h3 style={{ color: '#00275c', fontWeight: 'bold' }}>Documents</h3>
                                                </MDBCol>
                                            </MDBRow>
                                        </AccordionHeader>

                                        <AccordionBody>
                                            <hr style={horizontalRule} />
                                            <MDBRow>
                                                {empdocument && empdocument.map((document, index) => (
                                                    <React.Fragment key={index}>
                                                        <MDBCol sm="3">
                                                            <MDBCardText>{document.document_type_name}</MDBCardText>
                                                        </MDBCol>
                                                        <MDBCol sm="9">
                                                            <MDBCardText className="text-muted">{document.document_name}</MDBCardText>
                                                        </MDBCol>
                                                        <hr style={horizontalRule} />
                                                    </React.Fragment>
                                                ))}
                                            </MDBRow>




                                        </AccordionBody>
                                    </MDBCardBody>
                                </AccordionItem>
                            </MDBCard>

                        </Accordion>
                        {(userrole === "1" || userrole === "2") &&
                            <button className="btn btn-primary" onClick={() => handleVisitedit(id)}>
                                Edit
                            </button>
                        }

                    </MDBCol>
                </MDBRow>
                {/* )} */}
            </MDBContainer>


        </section >
    );
}

