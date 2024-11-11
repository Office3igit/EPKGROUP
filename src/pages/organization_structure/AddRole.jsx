import React, { useEffect } from 'react';
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import './css/AddRolestyle.css';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddRole = () => {


  // ------------------------------------------------------------------------------------------------

  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));
  const useremail = userData?.useremail || '';

  const usertoken = userData?.token || '';
  const userempid = userData?.userempid || '';
  const userrole = userData?.userrole || '';

  // ------------------------------------------------------------------------------------------------


  // ------------------------------------------------------------------------------------------------

  // Redirect to the edit page
  const navigate = useNavigate();

  const GoTorolelist = () => {
    navigate(`/admin/rolelist`);
  };


  // ------------------------------------------------------------------------------------------------

  const [checkedNames, setCheckedNames] = useState({
    'Dashboard': ['Dashboard'],
    'EmployeeManagement': {
      'ORGStructure': [],
      'LeaveAndAttendancePolicy': [],
      'CompanyPolicy': [],
      'Employee': [],
      'Template': {
        'OfferLetter': [],
        'AppointmentLetter': [],
        'RelievingLetter': [],
      }
    },
    'Attendance': [],
    'HRSupport': [],
    'TLApproval': [],
    'HelpDesk': [],
    'HelpDeskTenant': [],
    'Assets': [],
    'TeamManagement': {
      'Events': {
        'AddEvent': [],
        'EventList': [],
      },
      'Meeting': {
        'AddMeeting': [],
        'MeetingList': [],
      },
      'TeamTask': {
        'AddProject': [],
        'ProjectList': [],
        'AddTask': [],
        'TaskList': [],
        'AssignedTask': [],
        'TLAssignedTask': [],
      }
    },
    'Payroll': [],
    'Holiday': [],
    'Visitiormanagement': [],
    'Logs': [],
    'Recruitment': {
      'PostJob': [],
      'ListJob': [],
      'InboxResume': [],
      'CandidateTracker': {
        'AddResume': [],
        'CandidateStatus': [],
      },
      'SearchResume': [],
    },
    'Accounts': {
      'GoodsandServices': [],
      'CompanyDetails': {
        'AddCompany': [],
        'CompanyList': [],
      },
      'Purchase': {
        'AddPurchase': [],
        'PurchaseList': [],
      },
      'Sales': {
        'AddSales': [],
        'SalesList': [],
      },
      'DailyAccounts': [],
    },

    'SalesManagement': {
      'Lead': {
        'EnquiryList': [],
        'AddLead': [],
        'LeadList': [],
      },
      'PreSales': {
        'EnquiryList': [],
        'LeadList': [],
        'AddLead': [],
      },
      'Sales': {
        'LeadList': [],
      }

    },

  });


  const handlesingleCheckboxChange = (event) => {
    const { value, checked, name } = event.target;
    setCheckedNames(prevState => ({
      ...prevState,
      [name]: checked ? [...prevState[name], value] : prevState[name].filter(item => item !== value)
    }));
  };


  const handleCheckboxChange = (event) => {
    const { value, checked, name, dataset } = event.target;
    const category = dataset.category;
    const subCategory = dataset.subCategory;

    setCheckedNames(prevState => {
      // If it's within a subcategory (e.g., Template)
      if (subCategory) {
        return {
          ...prevState,
          [category]: {
            ...prevState[category],
            [subCategory]: {
              ...prevState[category][subCategory],
              [name]: checked ? [...prevState[category][subCategory][name], value] : prevState[category][subCategory][name].filter(item => item !== value)
            }
          }
        };
      }

      // Otherwise, update the main category
      return {
        ...prevState,
        [category]: {
          ...prevState[category],
          [name]: checked ? [...prevState[category][name], value] : prevState[category][name].filter(item => item !== value)
        }
      };
    });
  };

  // ------------------------------------------------------------------------------------------------

  const [role, setRole] = useState('');

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // ------------------------------------------------------------------------------------------------

  console.log(checkedNames);


  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();


    // Validate form fields
    const errors = {};

    if (!role) {
      errors.role = 'Role Name is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    try {
      const response = await axios.post(
        'https://epkgroup.in/crm/api/public/api/addroleinsert',
        {
          role_name: role,
          permission: checkedNames,
          created_by: userempid,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${usertoken}`,
            'Registered-Email': useremail
          },
        }
      );
      console.log(response.data);
      
      if (response.data.status === 'success') {

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        });
        GoTorolelist()
      } else if(response.data.status === 'error') {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      // Handle errors
      console.error('Error:', error);


      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while adding role.',
      });
    }
  };
  // ------------------------------------------------------------------------------------------------

  const handleCancel = () => {

    console.log('Form canceled');

    setCheckedNames({
      'Dashboard': ['Dashboard'],
      'EmployeeManagement': {
        'ORGStructure': [],
        'LeaveAndAttendancePolicy': [],
        'CompanyPolicy': [],
        'Employee': [],
        'Template': {
          'OfferLetter': [],
          'AppointmentLetter': [],
          'RelievingLetter': [],
        }
      },
      'Attendance': [],
      'HRSupport': [],
      'TLApproval': [],
      'HelpDesk': [],
      'HelpDeskTenant': [],
      'Assets': [],
      'TeamManagement': {
        'Events': {
          'AddEvent': [],
          'EventList': [],
        },
        'Meeting': {
          'AddMeeting': [],
          'MeetingList': [],
        },
        'TeamTask': {
          'AddProject': [],
          'ProjectList': [],
          'AddTask': [],
          'TaskList': [],
          'AssignedTask': [],
          'TLAssignedTask': [],
        }
      },
      'Payroll': [],
      'Holiday': [],
      'Visitiormanagement': [],
      'Logs': [],
      'Recruitment': {
        'PostJob': [],
        'ListJob': [],
        'InboxResume': [],
        'CandidateTracker': {
          'AddResume': [],
          'CandidateStatus': [],
        },
        'SearchResume': [],
      },
      'Accounts': {
        'GoodsandServices': [],
        'CompanyDetails': {
          'AddCompany': [],
          'CompanyList': [],
        },
        'Purchase': {
          'AddPurchase': [],
          'PurchaseList': [],
        },
        'Sales': {
          'AddSales': [],
          'SalesList': [],
        },
        'DailyAccounts': [],
      },

      'SalesManagement': {
        'Lead': {
          'EnquiryList': [],
          'AddLead': [],
          'LeadList': [],
        },
        'PreSales': {
          'EnquiryList': [],
          'LeadList': [],
          'AddLead': [],
        },
        'Sales': {
          'LeadList': [],
        }

      },
    });

    setFormErrors({});
  };

  // ------------------------------------------------------------------------------------------------

  // ADDROLE SHOW AND DISABLE VALIDATION


  // useEffect(() => {
  //   axios.get(`https://epkgroup.in/crm/api/public/api/editview_role/${userrole}`, {
  //     headers: {
  //       'Authorization': `Bearer ${usertoken}`,
  //       'Registered-Email': useremail
  //     }
  //   })
  //     .then(res => {
  //       if (res.status === 200) {
  //         const roleData = res.data.data;

  //         // console.log('roleData.permission:', roleData.permission);
  //         // setRole(roleData.role_name);

  //         let parsedPermissions;
  //         try {
  //           parsedPermissions = JSON.parse(roleData.permission);
  //         } catch (error) {
  //           console.error('Error parsing permissions JSON:', error);
  //           parsedPermissions = {};
  //         }

  //         // console.log("parsedPermissions----->", typeof parsedPermissions);

  //         // Additional check to ensure parsedPermissions is an object
  //         if (typeof parsedPermissions === 'string') {
  //           parsedPermissions = JSON.parse(parsedPermissions);
  //         }

  //         if (typeof parsedPermissions === 'object' && parsedPermissions !== null) {
  //           setCheckedNames(parsedPermissions);
  //           console.log("parsedPermissions--->karthik", parsedPermissions)
  //           // console.log("parsedPermissions----->virat", typeof parsedPermissions);
  //         } else {
  //           console.error('Parsed permissions are not in the expected format:', parsedPermissions);
  //         }

  //         // setLoading(false);
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, [userempid, usertoken]);


  // ------------------------------------------------------------------------------------------------
  const DashboardPermissions = ['Dashboard'];

  const hasAccessToDashboard = () => {
    if (!userrole.includes('1') || !userrole.includes('2')) {
      return DashboardPermissions.some(permission => checkedNames.Dashboard.includes(permission));
    }
    return false;
  };
  // ------------------------------------------------------------------------------------------------


  // ------------------------------------------------------------------------------------------------

  return (
    <div>
      <Container className='checklist__container'>
        <Row className='mb-4'>
          <Col>
            <h3 style={{ fontWeight: 'bold', color: '#00275c' }}>ADD ROLE</h3>
          </Col>
        </Row>

        <Row className='mb-5'>

          <Col sm={12} md={6} lg={6} xl={6}>
            <Form.Group controlId="formRole">
              <Form.Label style={{ fontWeight: 'bold' }}>Add Role Name</Form.Label>
              <Form.Control type="text" value={role} onChange={handleRoleChange} placeholder="Enter Role Name" />
              {formErrors.role && <span className="text-danger">{formErrors.role}</span>}
            </Form.Group>
          </Col>
        </Row>


        <div className='checklist'>

          {/* ----------1-------------- */}
          <Row className='mb-5'>

            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 list__colum'>
              <label className="checkbox-container" style={{ cursor: 'not-allowed' }}>
                <input type="checkbox" id="dashboard" value="Dashboard" name="Dashboard"

                  checked={checkedNames['Dashboard'] && checkedNames['Dashboard'].includes('Dashboard')}
                  onChange={handleCheckboxChange}
                  disabled
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Dashboard</span>
              </label>

            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 list__colum'>
              <h4 className='list__title' id="EmployeeManagement">Employee Management</h4>

              <h5 id="ORGStructure">ORG Structure</h5>
              {/* 1 */}
              <label className="checkbox-container">
                <input type="checkbox" id="addRole" value="add_Role" name="ORGStructure" data-category="EmployeeManagement"
                  // checked={checkedNames['ORGStructure'] && checkedNames['ORGStructure'].includes('add_Role')}
                  checked={checkedNames['EmployeeManagement']['ORGStructure'].includes('add_Role')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Role / Designation</span>
              </label>
              {/* 2 */}
              <label className="checkbox-container">
                <input type="checkbox" id="roleslist" value="roles_list" name="ORGStructure" data-category="EmployeeManagement"
                  // checked={checkedNames['ORGStructure'] && checkedNames['ORGStructure'].includes('roles_list')}
                  checked={checkedNames['EmployeeManagement']['ORGStructure'].includes('roles_list')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Roles List</span>
              </label>
              {/* 3 */}
              <label className="checkbox-container">
                <input type="checkbox" id="supervisorlist" value="supervisor_list" name="ORGStructure" data-category="EmployeeManagement"
                  // checked={checkedNames['ORGStructure'] && checkedNames['ORGStructure'].includes('supervisor_list')}
                  checked={checkedNames['EmployeeManagement']['ORGStructure'].includes('supervisor_list')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Supervisor List / Hierarchy</span>
              </label>
              {/* 4 */}
              {/* <label className="checkbox-container">
                <input type="checkbox" id="empLevelCategory" value="empLevel_Category" name="ORGStructure" data-category="EmployeeManagement"
                  
                  checked={checkedNames['EmployeeManagement']['ORGStructure'].includes('empLevel_Category')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Employee Level Category</span>
              </label> */}
              {/* 5 */}
              {/* <label className="checkbox-container">
                <input type="checkbox" id="empDocumentType" value="emp_DocumentType" name="ORGStructure" data-category="EmployeeManagement"

                 
                  checked={checkedNames['EmployeeManagement']['ORGStructure'].includes('emp_DocumentType')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Employee Document Type</span>
              </label> */}
              {/* 6 */}
              <label className="checkbox-container">
                <input type="checkbox" id="orgChart" value="org_Chart" name="ORGStructure" data-category="EmployeeManagement"

                  // checked={checkedNames['ORGStructure'] && checkedNames['ORGStructure'].includes('org_Chart')}
                  checked={checkedNames['EmployeeManagement']['ORGStructure'].includes('org_Chart')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">ORG chart</span>
              </label>

              <h5 id="LeaveandAttendancePolicy">Attendance Policy</h5>
              {/* 
              <label className="checkbox-container">
                <input type="checkbox" id="AddShiftSlot" value="addShiftSlot" name="LeaveAndAttendancePolicy" data-category="EmployeeManagement"

                  // checked={checkedNames['LeaveAndAttendancePolicy'] && checkedNames['LeaveAndAttendancePolicy'].includes('addShiftSlot')}
                  checked={checkedNames['EmployeeManagement']['LeaveAndAttendancePolicy'].includes('addShiftSlot')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Shift Slot</span>
              </label> */}



              <label className="checkbox-container">
                <input type="checkbox" id="AttendancePolicy" value="attendancePolicy" name="LeaveAndAttendancePolicy" data-category="EmployeeManagement"
                  // checked={checkedNames['LeaveAndAttendancePolicy'] && checkedNames['LeaveAndAttendancePolicy'].includes('attendancePolicy')}
                  checked={checkedNames['EmployeeManagement']['LeaveAndAttendancePolicy'].includes('attendancePolicy')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Attendance Slot</span>
              </label>

              {/* <label className="checkbox-container">
                <input type="checkbox" id="AttendanceType" value="attendanceType" name="LeaveAndAttendancePolicy" data-category="EmployeeManagement"
                  // checked={checkedNames['LeaveAndAttendancePolicy'] && checkedNames['LeaveAndAttendancePolicy'].includes('attendanceType')}
                  checked={checkedNames['EmployeeManagement']['LeaveAndAttendancePolicy'].includes('attendanceType')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Attendance Type</span>
              </label> */}

              {/* <label className="checkbox-container">
                <input type="checkbox" id="AttendanceLocation" value="attendanceLocation" name="LeaveAndAttendancePolicy" data-category="EmployeeManagement"
                  // checked={checkedNames['LeaveAndAttendancePolicy'] && checkedNames['LeaveAndAttendancePolicy'].includes('attendanceLocation')}
                  checked={checkedNames['EmployeeManagement']['LeaveAndAttendancePolicy'].includes('attendanceLocation')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Attendance Location</span>
              </label>

              <label className="checkbox-container">
                <input type="checkbox" id="LeavePolicyType" value="leavePolicyType" name="LeaveAndAttendancePolicy" data-category="EmployeeManagement"
                  // checked={checkedNames['LeaveAndAttendancePolicy'] && checkedNames['LeaveAndAttendancePolicy'].includes('leavePolicyType')}
                  checked={checkedNames['EmployeeManagement']['LeaveAndAttendancePolicy'].includes('leavePolicyType')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Leave Policy Type</span>
              </label> */}

              {/* <label className="checkbox-container">
                <input type="checkbox" id="LeavePolicyCategory" value="leavePolicyCategory" name="LeaveAndAttendancePolicy" data-category="EmployeeManagement"
                  // checked={checkedNames['LeaveAndAttendancePolicy'] && checkedNames['LeaveAndAttendancePolicy'].includes('leavePolicyCategory')}
                  checked={checkedNames['EmployeeManagement']['LeaveAndAttendancePolicy'].includes('leavePolicyCategory')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Leave Policy Category</span>
              </label> */}

              <label className="checkbox-container">
                <input type="checkbox" id="LeavePolicy" value="leavePolicy" name="LeaveAndAttendancePolicy" data-category="EmployeeManagement"
                  // checked={checkedNames['LeaveAndAttendancePolicy'] && checkedNames['LeaveAndAttendancePolicy'].includes('leavePolicy')}
                  checked={checkedNames['EmployeeManagement']['LeaveAndAttendancePolicy'].includes('leavePolicy')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Leave Policy</span>
              </label>

              <label className="checkbox-container">
                <input type="checkbox" id="AssignEmployeeShift" value="assignEmployeeShift" name="LeaveAndAttendancePolicy" data-category="EmployeeManagement"
                  // checked={checkedNames['LeaveAndAttendancePolicy'] && checkedNames['LeaveAndAttendancePolicy'].includes('assignEmployeeShift')}
                  checked={checkedNames['EmployeeManagement']['LeaveAndAttendancePolicy'].includes('assignEmployeeShift')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Assign Employee Shift</span>
              </label>

              {/* <label className="checkbox-container">
                <input type="checkbox" id="OvertimeType" value="overtimeType" name="LeaveAndAttendancePolicy" data-category="EmployeeManagement"
                  // checked={checkedNames['LeaveAndAttendancePolicy'] && checkedNames['LeaveAndAttendancePolicy'].includes('overtimeType')}
                  checked={checkedNames['EmployeeManagement']['LeaveAndAttendancePolicy'].includes('overtimeType')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Overtime Type</span>
              </label> */}

              <label className="checkbox-container">
                <input type="checkbox" id="Holiday" value="Holiday" name="LeaveAndAttendancePolicy" data-category="EmployeeManagement"
                  // checked={checkedNames['Holiday'] && checkedNames['Holiday'].includes('Holiday')}
                  checked={checkedNames['EmployeeManagement']['LeaveAndAttendancePolicy'].includes('Holiday')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Holiday</span>
              </label>
            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 mt-7 list__colum' style={{ whiteSpace: 'nowrap' }}>
              <label className="checkbox-container">
                <input type="checkbox" id="CompanyPolicy" value="companypolicy" name="CompanyPolicy" data-category="EmployeeManagement"

                  // checked={checkedNames['Dashboard'] && checkedNames['Dashboard'].includes('Dashboard')}
                  checked={checkedNames['EmployeeManagement']['CompanyPolicy'].includes('companypolicy')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Company Policy</span>
              </label>


              <h5 id="Template">Template</h5>

              <Col sm={12} md={6} lg={6} xl={3} className='mb-3  ml-3 list__colum'>

                <h6 className='list__title' id="OfferLetter">OfferLetter</h6>
                {/* 1 */}
                <label className="checkbox-container">
                  <input type="checkbox" id="AddOffetLetter" value="Add_OfferLetter" name="OfferLetter" data-category="EmployeeManagement" data-sub-category="Template"

                    checked={checkedNames['EmployeeManagement']['Template']['OfferLetter'].includes('Add_OfferLetter')}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Add Offer Letter</span>
                </label>
                {/* 2 */}
                <label className="checkbox-container">
                  <input type="checkbox" id="OfferLetterList" value="Offer_LetterList" name="OfferLetter" data-category="EmployeeManagement" data-sub-category="Template"

                    checked={checkedNames['EmployeeManagement']['Template']['OfferLetter'].includes('Offer_LetterList')}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Offer Letter List</span>
                </label>


              </Col>

              <Col sm={12} md={6} lg={6} xl={3} className='mb-3 ml-3 list__colum'>

                <h6 className='list__title' id="AppointmentLetter">Appointment Letter</h6>
                {/* 1 */}
                <label className="checkbox-container">
                  <input type="checkbox" id="AddAppointmentLetter" value="Add_AppointmentLetter" name="AppointmentLetter" data-category="EmployeeManagement" data-sub-category="Template"

                    checked={checkedNames['EmployeeManagement']['Template']['AppointmentLetter'].includes('Add_AppointmentLetter')}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Add Appointment Letter</span>
                </label>
                {/* 2 */}
                <label className="checkbox-container">
                  <input type="checkbox" id="AppointmentLetterList" value="Appoint_mentLetterList" name="AppointmentLetter" data-category="EmployeeManagement" data-sub-category="Template"

                    checked={checkedNames['EmployeeManagement']['Template']['AppointmentLetter'].includes('Appoint_mentLetterList')}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Appointment Letter List</span>
                </label>

              </Col>

              <Col sm={12} md={6} lg={6} xl={3} className='mb-3 ml-3 list__colum'>

                <h6 className='list__title' id="RelievingLetter">Relieving Letter</h6>
                {/* 1 */}
                <label className="checkbox-container">
                  <input type="checkbox" id="AddRelievingLetter" value="Add_RelievingLetter" name="RelievingLetter" data-category="EmployeeManagement" data-sub-category="Template"

                    checked={checkedNames['EmployeeManagement']['Template']['RelievingLetter'].includes('Add_RelievingLetter')}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Add Relieving Letter</span>
                </label>
                {/* 2 */}
                <label className="checkbox-container">
                  <input type="checkbox" id="RelievingLetterList" value="Relieving_LetterList" name="RelievingLetter" data-category="EmployeeManagement" data-sub-category="Template"

                    checked={checkedNames['EmployeeManagement']['Template']['RelievingLetter'].includes('Relieving_LetterList')}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Relieving Letter List</span>
                </label>

              </Col>


              <h5 id="Employee">Employee Info</h5>
              {/* 1 */}
              <label className="checkbox-container">
                <input type="checkbox" id="AddEmployee" value="Add_Employee" name="Employee" data-category="EmployeeManagement"
                  // checked={checkedNames['Employee'] && checkedNames['Employee'].includes('Add_Employee')}
                  checked={checkedNames['EmployeeManagement']['Employee'].includes('Add_Employee')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Employee</span>
              </label>
              {/* 2 */}
              <label className="checkbox-container">
                <input type="checkbox" id="EmployeeList" value="Emp_loyeeList" name="Employee" data-category="EmployeeManagement"
                  // checked={checkedNames['Employee'] && checkedNames['Employee'].includes('Emp_loyeeList')}
                  checked={checkedNames['EmployeeManagement']['Employee'].includes('Emp_loyeeList')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Employee List</span>
              </label>
              {/* 3 */}
              <label className="checkbox-container">
                <input type="checkbox" id="EmployeeConfirmation" value="Employee_Confirmation" name="Employee" data-category="EmployeeManagement"
                  // checked={checkedNames['Employee'] && checkedNames['Employee'].includes('Employee_Confirmation')}
                  checked={checkedNames['EmployeeManagement']['Employee'].includes('Employee_Confirmation')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Probation Completion</span>
              </label>

            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 list__colum'>
              <h4 className='list__title' id="Attendance">Attendance Calculation</h4>
              {/* 1 */}
              <label className="checkbox-container">
                <input type="checkbox" id="DailyAttendance" value="DailyAttendance" name="Attendance"
                  checked={checkedNames['Attendance'] && checkedNames['Attendance'].includes('DailyAttendance')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Daily Attendance</span>
              </label>
              {/* 2 */}
              <label className="checkbox-container">
                <input type="checkbox" id="MonthlyAttendance" value="Monthly_Attendance" name="Attendance"
                  checked={checkedNames['Attendance'] && checkedNames['Attendance'].includes('Monthly_Attendance')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Monthly Attendance</span>
              </label>
              {/* 3 */}
              <label className="checkbox-container">
                <input type="checkbox" id="MonthlyAttendanceCalendar" value="Monthly_AttendanceCalendar" name="Attendance"
                  checked={checkedNames['Attendance'] && checkedNames['Attendance'].includes('Monthly_AttendanceCalendar')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label" style={{ display: 'flex' }}>Monthly Attendance Calendar View</span>
              </label>
              {/* 4 */}
              <label className="checkbox-container">
                <input type="checkbox" id="MonthlyList" value="Monthly_List" name="Attendance"
                  checked={checkedNames['Attendance'] && checkedNames['Attendance'].includes('Monthly_List')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Monthly List</span>
              </label>

              {/* 5 */}
              <label className="checkbox-container">
                <input type="checkbox" id="ApprovalList" value="Approval_List" name="Attendance"
                  checked={checkedNames['Attendance'] && checkedNames['Attendance'].includes('Approval_List')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">HR Approval List</span>
              </label>

              {/* 6 */}
              <label className="checkbox-container">
                <input type="checkbox" id="LeaveApproval" value="Leave_Approval" name="Attendance"
                  checked={checkedNames['Attendance'] && checkedNames['Attendance'].includes('Leave_Approval')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">TL Approval List</span>
              </label>


              <h4 className='list__title' id="Recruitment">Recruitment</h4>

              <label className="checkbox-container">
                <input type="checkbox" id="PostJob" value="Post_Job" name="PostJob" data-category="Recruitment"
                  checked={checkedNames['Recruitment']['PostJob'].includes('Post_Job')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Post Job</span>
              </label>

              <label className="checkbox-container">
                <input type="checkbox" id="ListJob" value="List_Job" name="ListJob" data-category="Recruitment"
                  checked={checkedNames['Recruitment']['ListJob'].includes('List_Job')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">List Job</span>
              </label>

              <label className="checkbox-container">
                <input type="checkbox" id="InboxResume" value="Inbox_Resume" name="InboxResume" data-category="Recruitment"
                  checked={checkedNames['Recruitment']['InboxResume'].includes('Inbox_Resume')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Inbox Webmail</span>
              </label>

              <h5 id="CandidateTracker">Candidate Tracker</h5>
              <label className="checkbox-container">
                <input type="checkbox" id="AddResume" value="Add_Resume" name="AddResume" data-category="Recruitment" data-sub-category="CandidateTracker"
                  checked={checkedNames['Recruitment']['CandidateTracker']['AddResume'].includes('Add_Resume')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Call Tracker</span>
              </label>
              <label className="checkbox-container">
                <input type="checkbox" id="CandidateStatus" value="Candidate_Status" name="CandidateStatus" data-category="Recruitment" data-sub-category="CandidateTracker"
                  checked={checkedNames['Recruitment']['CandidateTracker']['CandidateStatus'].includes('Candidate_Status')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">View Tracker</span>
              </label>

              <label className="checkbox-container">
                <input type="checkbox" id="SearchResume" value="Search_Resume" name="SearchResume" data-category="Recruitment"
                  checked={checkedNames['Recruitment']['SearchResume'].includes('Search_Resume')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Search Resume</span>
              </label>


            </Col>
          </Row>

          {/* ----------1-------------- */}


          {/* ----------2-------------- */}

          <Row className='mb-5'>

            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 list__colum'>
              <h4 className='list__title' id="Payroll">Payroll</h4>
              {/* 1 */}
              <label className="checkbox-container">
                <input type="checkbox" id="OverTimeCalculation" value="OverTimeCalculation" name="Payroll"
                  checked={checkedNames['Payroll'] && checkedNames['Payroll'].includes('OverTimeCalculation')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">OverTime Calculation</span>
              </label>
              {/* 2 */}
              <label className="checkbox-container">
                <input type="checkbox" id="Assign Employee Salary" value="Assign Employee Salary" name="Payroll"
                  checked={checkedNames['Payroll'] && checkedNames['Payroll'].includes('Assign Employee Salary')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Assign Employee Salary</span>
              </label>
              {/* 3 */}
              <label className="checkbox-container">
                <input type="checkbox" id="Salarycalculation" value="Salarycalculation" name="Payroll"
                  checked={checkedNames['Payroll'] && checkedNames['Payroll'].includes('Salarycalculation')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Salary calculation</span>
              </label>
              {/* 4 */}
              <label className="checkbox-container">
                <input type="checkbox" id="Generatepayslip" value="Generate_payslip" name="Payroll"
                  checked={checkedNames['Payroll'] && checkedNames['Payroll'].includes('Generate_payslip')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Generate payslip</span>
              </label>
              {/* 5 */}
              <label className="checkbox-container">
                <input type="checkbox" id="Paysliplist" value="Payslip_list" name="Payroll"
                  checked={checkedNames['Payroll'] && checkedNames['Payroll'].includes('Payslip_list')}
                  onChange={handlesingleCheckboxChange} />

                <span className="checkmark"></span>
                <span className="checkbox-label">Payslip list</span>
              </label>


            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 list__colum'>
              <h4 className='list__title' id="Accounts">Accounts</h4>

              {/* Goods and Services */}
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="GoodsandServices"
                  value="goodsandservices"
                  name="GoodsandServices"
                  data-category="Accounts"
                  checked={checkedNames['Accounts']['GoodsandServices'].includes('goodsandservices')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Goods and Services</span>
              </label>

              {/* Company Details */}
              <h5 id="CompanyDetails">Company Details</h5>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AddCompany"
                  value="addcompany"
                  name="AddCompany"
                  data-category="Accounts"
                  data-sub-category="CompanyDetails"
                  checked={checkedNames['Accounts']['CompanyDetails']['AddCompany'].includes('addcompany')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Company</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="CompanyList"
                  value="companylist"
                  name="CompanyList"
                  data-category="Accounts"
                  data-sub-category="CompanyDetails"
                  checked={checkedNames['Accounts']['CompanyDetails']['CompanyList'].includes('companylist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Company List</span>
              </label>

              {/* Purchase */}
              <h5 id="Purchase">Purchase</h5>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AddPurchase"
                  value="addpurchase"
                  name="AddPurchase"
                  data-category="Accounts"
                  data-sub-category="Purchase"
                  checked={checkedNames['Accounts']['Purchase']['AddPurchase'].includes('addpurchase')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Purchase</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="PurchaseList"
                  value="purchaselist"
                  name="PurchaseList"
                  data-category="Accounts"
                  data-sub-category="Purchase"
                  checked={checkedNames['Accounts']['Purchase']['PurchaseList'].includes('purchaselist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Purchase List</span>
              </label>

              {/* Sales */}
              <h5 id="Sales">Sales</h5>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AddSales"
                  value="addsales"
                  name="AddSales"
                  data-category="Accounts"
                  data-sub-category="Sales"
                  checked={checkedNames['Accounts']['Sales']['AddSales'].includes('addsales')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Sales</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="SalesList"
                  value="saleslist"
                  name="SalesList"
                  data-category="Accounts"
                  data-sub-category="Sales"
                  checked={checkedNames['Accounts']['Sales']['SalesList'].includes('saleslist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Sales List</span>
              </label>

              {/* Daily Accounts */}
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="DailyAccounts"
                  value="dailyaccounts"
                  name="DailyAccounts"
                  data-category="Accounts"
                  checked={checkedNames['Accounts']['DailyAccounts'].includes('dailyaccounts')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Daily Accounts</span>
              </label>
            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 list__colum'>
              <h4 className='list__title' id="SalesManagement">Sales Management</h4>

              {/* Lead */}
              <h5 id="Lead">Lead</h5>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="EnquiryListLead"
                  value="enquirylist"
                  name="EnquiryList"
                  data-category="SalesManagement"
                  data-sub-category="Lead"
                  checked={checkedNames['SalesManagement']['Lead']['EnquiryList'].includes('enquirylist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Enquiry List</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AddLead"
                  value="addlead"
                  name="AddLead"
                  data-category="SalesManagement"
                  data-sub-category="Lead"
                  checked={checkedNames['SalesManagement']['Lead']['AddLead'].includes('addlead')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Lead</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="LeadList"
                  value="leadlist"
                  name="LeadList"
                  data-category="SalesManagement"
                  data-sub-category="Lead"
                  checked={checkedNames['SalesManagement']['Lead']['LeadList'].includes('leadlist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Lead List</span>
              </label>

              {/* PreSales */}
              <h5 id="PreSales">PreSales</h5>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="EnquiryListPreSales"
                  value="enquirylist"
                  name="EnquiryList"
                  data-category="SalesManagement"
                  data-sub-category="PreSales"
                  checked={checkedNames['SalesManagement']['PreSales']['EnquiryList'].includes('enquirylist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Enquiry List</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="LeadListPreSales"
                  value="leadlist"
                  name="LeadList"
                  data-category="SalesManagement"
                  data-sub-category="PreSales"
                  checked={checkedNames['SalesManagement']['PreSales']['LeadList'].includes('leadlist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Lead List</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AddLeadPreSales"
                  value="addlead"
                  name="AddLead"
                  data-category="SalesManagement"
                  data-sub-category="PreSales"
                  checked={checkedNames['SalesManagement']['PreSales']['AddLead'].includes('addlead')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Lead</span>
              </label>

              {/* Sales */}
              <h5 id="Sales">Sales</h5>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="LeadListSales"
                  value="leadlist"
                  name="LeadList"
                  data-category="SalesManagement"
                  data-sub-category="Sales"
                  checked={checkedNames['SalesManagement']['Sales']['LeadList'].includes('leadlist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Lead List</span>
              </label>
            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 list__colum'>
              <h4 className='list__title' id="Visitiormanagement">Visitor management</h4>
              {/* 1 */}
              <label className="checkbox-container">
                <input type="checkbox" id="Addvisitor" value="Add_visitor" name="Visitiormanagement"
                  checked={checkedNames['Visitiormanagement'] && checkedNames['Visitiormanagement'].includes('Add_visitor')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add visitor</span>
              </label>
              {/* 2 */}
              <label className="checkbox-container">
                <input type="checkbox" id="Visitorlog" value="Visitor_log" name="Visitiormanagement"
                  checked={checkedNames['Visitiormanagement'] && checkedNames['Visitiormanagement'].includes('Visitor_log')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Visitor log</span>
              </label>


              <h4 className='list__title' id="TeamManagement">Team Management</h4>

              {/* Events */}
              <h5 id="Events">Events</h5>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AddEvent"
                  value="addevent"
                  name="AddEvent"
                  data-category="TeamManagement"
                  data-sub-category="Events"
                  checked={checkedNames['TeamManagement']['Events']['AddEvent'].includes('addevent')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Event</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="EventList"
                  value="eventlist"
                  name="EventList"
                  data-category="TeamManagement"
                  data-sub-category="Events"
                  checked={checkedNames['TeamManagement']['Events']['EventList'].includes('eventlist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Event List</span>
              </label>

              {/* Meeting */}
              <h5 id="Meeting">Meeting</h5>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AddMeeting"
                  value="addmeeting"
                  name="AddMeeting"
                  data-category="TeamManagement"
                  data-sub-category="Meeting"
                  checked={checkedNames['TeamManagement']['Meeting']['AddMeeting'].includes('addmeeting')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Meeting</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="MeetingList"
                  value="meetinglist"
                  name="MeetingList"
                  data-category="TeamManagement"
                  data-sub-category="Meeting"
                  checked={checkedNames['TeamManagement']['Meeting']['MeetingList'].includes('meetinglist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Meeting List</span>
              </label>

              {/* TeamTask */}
              <h5 id="TeamTask">Team Task</h5>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AddProject"
                  value="addproject"
                  name="AddProject"
                  data-category="TeamManagement"
                  data-sub-category="TeamTask"
                  checked={checkedNames['TeamManagement']['TeamTask']['AddProject'].includes('addproject')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Project</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="ProjectList"
                  value="projectlist"
                  name="ProjectList"
                  data-category="TeamManagement"
                  data-sub-category="TeamTask"
                  checked={checkedNames['TeamManagement']['TeamTask']['ProjectList'].includes('projectlist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Project List</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AddTask"
                  value="addtask"
                  name="AddTask"
                  data-category="TeamManagement"
                  data-sub-category="TeamTask"
                  checked={checkedNames['TeamManagement']['TeamTask']['AddTask'].includes('addtask')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Task</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="TaskList"
                  value="tasklist"
                  name="TaskList"
                  data-category="TeamManagement"
                  data-sub-category="TeamTask"
                  checked={checkedNames['TeamManagement']['TeamTask']['TaskList'].includes('tasklist')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Task List</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AssignedTask"
                  value="assignedtask"
                  name="AssignedTask"
                  data-category="TeamManagement"
                  data-sub-category="TeamTask"
                  checked={checkedNames['TeamManagement']['TeamTask']['AssignedTask'].includes('assignedtask')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Assigned Task</span>
              </label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="TLAssignedTask"
                  value="tlassignedtask"
                  name="TLAssignedTask"
                  data-category="TeamManagement"
                  data-sub-category="TeamTask"
                  checked={checkedNames['TeamManagement']['TeamTask']['TLAssignedTask'].includes('tlassignedtask')}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">TL Assigned Task</span>
              </label>
            </Col>


          </Row>
          {/* ----------2-------------- */}

          {/* ----------3-------------- */}

          <Row className='mb-5'>

            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 list__colum'>
              <h4 className='list__title' id="Assets">Assets Management</h4>
              {/* 1 */}
              <label className="checkbox-container">
                <input type="checkbox" id="AssetsType" value="Assets_Type" name="Assets"
                  checked={checkedNames['Assets'] && checkedNames['Assets'].includes('Assets_Type')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Assets Type</span>
              </label>
              {/* 2 */}
              <label className="checkbox-container">
                <input type="checkbox" id="AssignAsset" value="Assign_Asset" name="Assets"
                  checked={checkedNames['Assets'] && checkedNames['Assets'].includes('Assign_Asset')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Assign Asset</span>
              </label>
              {/* 3 */}
              <label className="checkbox-container">
                <input type="checkbox" id="AssetList" value="Asset_List" name="Assets"
                  checked={checkedNames['Assets'] && checkedNames['Assets'].includes('Asset_List')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Asset List</span>
              </label>


            </Col>


            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 list__colum'>
              <h4 className='list__title' id="HelpDesk">HelpDesk</h4>

              {/* Issue Type */}
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="IssueType"
                  value="Issue_Type"
                  name="HelpDesk"
                  checked={checkedNames['HelpDesk'] && checkedNames['HelpDesk'].includes('Issue_Type')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Issue Type</span>
              </label>

              {/* Raise Ticket */}
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="RaiseTicket"
                  value="Raise_Ticket"
                  name="HelpDesk"
                  checked={checkedNames['HelpDesk'] && checkedNames['HelpDesk'].includes('Raise_Ticket')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Raise Ticket</span>
              </label>

              {/* Tickets List */}
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="TicketsList"
                  value="Tickets_List"
                  name="HelpDesk"
                  checked={checkedNames['HelpDesk'] && checkedNames['HelpDesk'].includes('Tickets_List')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Tickets List</span>
              </label>

              {/* Assigned List */}
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AssignedList"
                  value="Assigned_List"
                  name="HelpDesk"
                  checked={checkedNames['HelpDesk'] && checkedNames['HelpDesk'].includes('Assigned_List')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Assigned List</span>
              </label>
            </Col>


            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 list__colum'>
              <h4 className='list__title' id="HelpDeskTenant">HelpDesk-Tenant</h4>

              {/* Add Tenat */}
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AddTenant"
                  value="Add_Tenant"
                  name="HelpDeskTenant"
                  checked={checkedNames['AddTenant'] && checkedNames['AddTenant'].includes('Add_Tenant')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Add Tenat</span>
              </label>

              {/* Tenant List */}
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="TenantList"
                  value="Tenant_List"
                  name="HelpDeskTenant"
                  checked={checkedNames['TenantList'] && checkedNames['TenantList'].includes('Tenant_List')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Tenant List</span>
              </label>

              {/* Raise Ticket */}
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="RaiseTicket"
                  value="Raise_Ticket"
                  name="HelpDeskTenant"
                  checked={checkedNames['RaiseTicket'] && checkedNames['RaiseTicket'].includes('Raise_Ticket')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Raise Ticket</span>
              </label>

              {/* Ticket List */}
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="TicketList"
                  value="Ticket_List"
                  name="HelpDeskTenant"
                  checked={checkedNames['TicketList'] && checkedNames['TicketList'].includes('Ticket_List')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Ticket List</span>
              </label>

              {/* Ticket List */}
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="AssignedList"
                  value="Assigned_List"
                  name="HelpDeskTenant"
                  checked={checkedNames['AssignedList'] && checkedNames['AssignedList'].includes('Assigned_List')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Assigned List</span>
              </label>
            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className='mb-3 list__colum'>
              <h4 className='list__title' id="Logs">Logs</h4>
              {/* 1 */}
              <label className="checkbox-container">
                <input type="checkbox" id="ActivityLog" value="Activity_Log" name="Logs"
                  checked={checkedNames['Logs'] && checkedNames['Logs'].includes('Activity_Log')}
                  onChange={handlesingleCheckboxChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Activity Log</span>
              </label>
              {/* 2 */}
              <label className="checkbox-container">
                <input type="checkbox" id="EmployeeActivityLog" value="Employee_ActivityLog" name="Logs"
                  checked={checkedNames['Logs'] && checkedNames['Logs'].includes('Employee_ActivityLog')}
                  onChange={handlesingleCheckboxChange} />

                <span className="checkmark"></span>
                <span className="checkbox-label">Employee Activity Log</span>
              </label>
            </Col>

          </Row>
          {/* ----------3-------------- */}


          <Row>
            <Col style={{ display: 'flex', gap: '15px' }}>
              <Button className='checklist__submit__btn' onClick={handleSubmit}>Submit</Button>
              <Button className='checklist__cancel__btn' onClick={handleCancel}>Cancel</Button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default AddRole;
