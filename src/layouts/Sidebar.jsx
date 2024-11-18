import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './css/sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSitemap, faClipboardUser, faUser, faUserTie, faUserGroup, faHandshakeAngle, faComputer, faCalendarDays, faUsersViewfinder, faListCheck, faMoneyBill, faFaceSmileBeam, faBarsProgress, faMessage, faFile, faBusinessTime, faUsers, faScaleBalanced, faBook } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';



function Sidebar() {

    const location = useLocation();

    const activeStyle = {
        border: "3px solid",
        borderImage: "linear-gradient(to right, #1aceff, #0056f0) 1",
        padding: "8px 7px",
        margin: "8px 10px 6px 10px",
        color: 'rgb(26, 206, 255)',

    };
    const navigate = useNavigate();

    const HandleclickTeamTask = (e) => {
        e.preventDefault();
        navigate('/admin/projectslist');
    }

    const HandleclickAttendanceCalculation = (e) => {
        e.preventDefault();
        navigate('/admin/attendancedashboard');
    }

    
    const HandleclickEmployeeManagement = (e) => {
        e.preventDefault();
        navigate('/admin/employeedashboard');
    }

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const userrole = userData?.userrole || '';
    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const sluge = userData?.sluge || '';


    // ------------------------------------------------------------------------------------------------\

    const [checkedNames, setCheckedNames] = useState({
        'Dashboard': [],
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
        'Events': [],
        'Meeting': [],
        'TeamTask': [],
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
        }
    });

    useEffect(() => {
        axios.get(`https://epkgroup.in/crm/api/public/api/editview_role/${userrole}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    const roleData = res.data.data;

                    // console.log('roleData.permission:', roleData.permission);
                    // setRole(roleData.role_name);

                    let parsedPermissions;
                    try {
                        parsedPermissions = JSON.parse(roleData.permission);
                    } catch (error) {
                        console.error('Error parsing permissions JSON:', error);
                        parsedPermissions = {};
                    }

                    // console.log("parsedPermissions----->", typeof parsedPermissions);

                    // Additional check to ensure parsedPermissions is an object
                    if (typeof parsedPermissions === 'string') {
                        parsedPermissions = JSON.parse(parsedPermissions);
                    }

                    if (typeof parsedPermissions === 'object' && parsedPermissions !== null) {
                        setCheckedNames(parsedPermissions);
                        console.log("parsedPermissions--->karthik", parsedPermissions)
                        // console.log("parsedPermissions----->virat", typeof parsedPermissions);
                    } else {
                        console.error('Parsed permissions are not in the expected format:', parsedPermissions);
                    }

                    // setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [userempid, usertoken]);
    // ------------------------------------------------------------------------------------------------\
    // console.log("virat------------>", checkedNames)



    // const permissions = {
    //     "Dashboard": ["Dashboard"],
    //     "ORGStructure": [],
    //     "LeaveAndAttendancePolicy": [
    //         "addShiftSlot",
    //         "assignEmployeeShift",
    //         "attendancePolicy",
    //         "attendanceLocation",
    //         "leavePolicyType",
    //         "leavePolicyCategory"
    //     ],
    //     "Employee": [],
    //     "Attendance": [],
    //     "HRSupport": [],
    //     "TLApproval": [],
    //     "HelpDesk": [],
    //     "Assets": [],
    //     "Events": [],
    //     "Meeting": [],
    //     "TeamTask": ["addproject", "addtask"],
    //     "Payroll": [],
    //     "Holiday": [],
    //     "Visitiormanagement": [],
    //     "Logs": []
    // };



    // --------------------------------------------------------------------------------------------------------------------

    const DashboardPermissions = ['Dashboard'];

    const hasAccessToDashboard = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return DashboardPermissions.some(permission => checkedNames.Dashboard.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------

    // const PostJobPermissions = ['PostJob'];

    // const hasAccessToPostJob = () => {
    //     if (!userrole.includes('1') || !userrole.includes('2')) {
    //         return PostJobPermissions.some(permission => checkedNames.Recruitment?.PostJob.includes(permission));
    //     }
    //     return false;
    // };

    // --------------------------------------------------------------------------------------------------------------------

    const PostJobPermissions = ['Post_Job'];

    const hasAccessToPostJob = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            // return LeaveAndAttendancePolicyPermissions.some(permission => checkedNames.LeaveAndAttendancePolicy.includes(permission));
            return PostJobPermissions.some(permission => checkedNames.Recruitment?.PostJob.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------

    const ListJobPermissions = ['List_Job'];

    const hasAccessToListJob = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return ListJobPermissions.some(permission => checkedNames.Recruitment?.ListJob.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const InboxResumePermissions = ['Inbox_Resume'];

    const hasAccessToInboxResume = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return InboxResumePermissions.some(permission => checkedNames.Recruitment?.InboxResume.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------


    const candidatetrackerPermissions = {
        AddResume: ['Add_Resume'],
        CandidateStatus: ['Candidate_Status'],
    };

    const hasAccessTocandidatetracker = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return Object.keys(candidatetrackerPermissions).some(candidatetrackerType =>
                candidatetrackerPermissions[candidatetrackerType].some(permission =>
                    checkedNames.Recruitment?.CandidateTracker[candidatetrackerType]?.includes(permission)
                )
            );

        }
        return false;
    };


    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const SearchResumePermissions = ['Search_Resume'];

    const hasAccessToSearchResume = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return SearchResumePermissions.some(permission => checkedNames.Recruitment?.SearchResume.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const orgStructurePermissions = ['add_Role', 'roles_list', 'supervisor_list', 'empLevel_Category', 'emp_DocumentType', 'org_Chart'];

    const hasAccessToorgStructure = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            // return orgStructurePermissions.some(permission => checkedNames.ORGStructure.includes(permission));
            return orgStructurePermissions.some(permission => checkedNames.EmployeeManagement?.ORGStructure.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------------------------------------------

    const LeaveAndAttendancePolicyPermissions = ['addShiftSlot', 'assignEmployeeShift', 'attendancePolicy', 'attendanceType', 'attendanceLocation', 'leavePolicyType', 'leavePolicyCategory', 'leavePolicy', 'overtimeType', 'Holiday'];

    const hasAccessToLeaveAndAttendancePolicy = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            // return LeaveAndAttendancePolicyPermissions.some(permission => checkedNames.LeaveAndAttendancePolicy.includes(permission));
            return LeaveAndAttendancePolicyPermissions.some(permission => checkedNames.EmployeeManagement?.LeaveAndAttendancePolicy.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------

    const CompanyPolicyPermissions = ['companypolicy'];

    const hasAccessToCompanyPolicy = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            // return LeaveAndAttendancePolicyPermissions.some(permission => checkedNames.LeaveAndAttendancePolicy.includes(permission));
            return CompanyPolicyPermissions.some(permission => checkedNames.EmployeeManagement?.CompanyPolicy.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------


    const templatePermissions = {
        OfferLetter: ['Add_OfferLetter', 'Offer_LetterList'],
        AppointmentLetter: ['Add_AppointmentLetter', 'Appoint_mentLetterList'],
        RelievingLetter: ['Add_RelievingLetter', 'Relieving_LetterList'],
    };

    const hasAccessToTemplate = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return Object.keys(templatePermissions).some(templateType =>
                templatePermissions[templateType].some(permission =>
                    checkedNames.EmployeeManagement?.Template[templateType]?.includes(permission)
                )
            );
        }
        return false;
    };


    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const EmployeePermissions = ['Add_Employee', 'Emp_loyeeList', 'Employee_Confirmation'];

    const hasAccessToEmployee = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return EmployeePermissions.some(permission => checkedNames.EmployeeManagement?.Employee.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const AttendancePermissions = ['DailyAttendance', 'Monthly_Attendance', 'Monthly_AttendanceCalendar', 'Monthly_List', 'Approval_List', 'Leave_Approval'];

    const hasAccessToAttendance = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return AttendancePermissions.some(permission => checkedNames.Attendance.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const HRSupportPermissions = ['Approval_List', 'Template', 'Job_Opening'];

    const hasAccessToHRSupport = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return HRSupportPermissions.some(permission => checkedNames.HRSupport.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const TLApprovalPermissions = ['Leave_Approval', 'OT_Approval'];

    const hasAccessToTLApproval = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return TLApprovalPermissions.some(permission => checkedNames.TLApproval.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const HelpDeskPermissions = ['Add_Issue', 'Raise_Ticket', 'Tickets_List', 'Assigned_List'];

    const hasAccessToHelpDesk = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return HelpDeskPermissions.some(permission => checkedNames.HelpDesk.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const HelpDeskTenantPermissions = ['Add_Tenant', 'Tenant_List', 'Raise_Ticket', 'Ticket_List', 'Assigned_List'];

    // Check if user has access based on permissions
    const hasAccessToHelpDeskTenant = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return HelpDeskTenantPermissions.some(permission => checkedNames.HelpDeskTenant.includes(permission));
        }
        return false;
    };

    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const AssetsPermissions = ['Assets_Type', 'Assign_Asset', 'Asset_List'];

    const hasAccessToAssets = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return AssetsPermissions.some(permission => checkedNames.Assets.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    // const EventsPermissions = ['Add_Event', 'Event_List'];

    // const hasAccessToEvents = () => {
    //     if (!userrole.includes('1') || !userrole.includes('2')) {
    //         return EventsPermissions.some(permission => checkedNames.Events.includes(permission));
    //     }
    //     return false;
    // };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    // const MeetingPermissions = ['Add_Meeting', 'Meeting_List'];

    // const hasAccessToMeeting = () => {
    //     if (!userrole.includes('1') || !userrole.includes('2')) {
    //         return MeetingPermissions.some(permission => checkedNames.Meeting.includes(permission));
    //     }
    //     return false;
    // };
    // --------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------

    // const teamTaskPermissions = ['Add_Project', 'Project_List', 'Add_task', 'Task_List', 'Assigned_Task', 'TL_Assigned_Task'];

    // const hasAccessToTeamTask = () => {
    //     if (!userrole.includes('1') || !userrole.includes('2')) {
    //         return teamTaskPermissions.some(permission => checkedNames.TeamTask.includes(permission));
    //     }
    //     return false;
    // };
    // --------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------

    const PayrollPermissions = ['OverTimeCalculation', 'Assign Employee Salary', 'Salarycalculation', 'Generate_payslip', 'Payslip_list'];

    const hasAccessToPayroll = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return PayrollPermissions.some(permission => checkedNames.Payroll.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const HolidayPermissions = ['Holiday'];

    const hasAccessToHoliday = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return HolidayPermissions.some(permission => checkedNames.Holiday.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const VisitiormanagementPermissions = ['Add_visitor', 'Visitor_log'];

    const hasAccessToVisitiormanagement = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return VisitiormanagementPermissions.some(permission => checkedNames.Visitiormanagement.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------------

    const LogsPermissions = ['Activity_Log', 'Employee_ActivityLog']

    const hasAccessToLogs = () => {
        if (!userrole.includes('1') || !userrole.includes('2')) {
            return LogsPermissions.some(permission => checkedNames.Logs.includes(permission));
        }
        return false;
    };
    // --------------------------------------------------------------------------------------------------------------------
    // Accounts

    const goodsAndServicesPermissions = ['goodsandservices'];
    const companyDetailsPermissions = {
        AddCompany: ['addcompany'],
        CompanyList: ['companylist']
    };
    const salesPermissions = {
        AddSales: ['addsales'],
        SalesList: ['saleslist']
    };
    const purchasePermissions = {
        AddPurchase: ['addpurchase'],
        PurchaseList: ['purchaselist']
    };
    const dailyAccountsPermissions = ['dailyaccounts'];

    // Define access check functions
    const hasAccessToGoodsAndServices = () => {
        return goodsAndServicesPermissions.some(permission => checkedNames.Accounts?.GoodsandServices.includes(permission));
    };

    const hasAccessToCompanyDetails = () => {
        return Object.keys(companyDetailsPermissions).some(companyDetail =>
            companyDetailsPermissions[companyDetail].some(permission =>
                checkedNames.Accounts?.CompanyDetails[companyDetail]?.includes(permission)
            )
        );
    };

    const hasAccessToSalesInvoice = () => {
        return Object.keys(salesPermissions).some(saleType =>
            salesPermissions[saleType].some(permission =>
                checkedNames.Accounts?.Sales[saleType]?.includes(permission)
            )
        );
    };

    const hasAccessToPurchaseInvoice = () => {
        return Object.keys(purchasePermissions).some(purchaseType =>
            purchasePermissions[purchaseType].some(permission =>
                checkedNames.Accounts?.Purchase[purchaseType]?.includes(permission)
            )
        );
    };

    const hasAccessToDailyAccounts = () => {
        return dailyAccountsPermissions.some(permission => checkedNames.Accounts?.DailyAccounts.includes(permission));
    };

    // Check if any permissions are available
    const hasAnyAccountPermissions = () => {
        return hasAccessToGoodsAndServices() ||
            hasAccessToCompanyDetails() ||
            hasAccessToSalesInvoice() ||
            hasAccessToPurchaseInvoice() ||
            hasAccessToDailyAccounts();
    };



    // // --------------------------------------------------------------------------------------------------------------------
    // Sales Management

    // Define permissions based on API response
    const salesManagementPermissions = {
        Lead: {
            EnquiryList: ['enquirylist'],
            AddLead: ['addlead'],
            LeadList: ['leadlist']
        },
        PreSales: {
            EnquiryList: ['enquirylist'],
            LeadList: ['leadlist'],
            AddLead: ['addlead']
        },
        Sales: {
            LeadList: ['leadlist']
        }
    };

    // Define access check functions
    const hasAccessToLead = () => {
        return Object.keys(salesManagementPermissions.Lead).some(permissionType =>
            salesManagementPermissions.Lead[permissionType].some(permission =>
                checkedNames.SalesManagement?.Lead[permissionType]?.includes(permission)
            )
        );
    };

    const hasAccessToPreSales = () => {
        return Object.keys(salesManagementPermissions.PreSales).some(permissionType =>
            salesManagementPermissions.PreSales[permissionType].some(permission =>
                checkedNames.SalesManagement?.PreSales[permissionType]?.includes(permission)
            )
        );
    };

    const hasAccessToSales = () => {
        return Object.keys(salesManagementPermissions.Sales).some(permissionType =>
            salesManagementPermissions.Sales[permissionType].some(permission =>
                checkedNames.SalesManagement?.Sales[permissionType]?.includes(permission)
            )
        );
    };

    // Check if any permissions are available
    const hasAnySalesManagementPermissions = () => {
        return hasAccessToLead() || hasAccessToPreSales() || hasAccessToSales();
    };


    // --------------------------------------------------------------------------------------------------------------------
    //    Team Management

    // Define permissions based on API response
    const teamManagementPermissions = {
        Events: {
            AddEvent: ['addevent'],
            EventList: ['eventlist']
        },
        Meeting: {
            AddMeeting: ['addmeeting'],
            MeetingList: ['meetinglist']
        },
        TeamTask: {
            AddProject: ['addproject'],
            ProjectList: ['projectlist'],
            AddTask: ['addtask'],
            TaskList: ['tasklist'],
            AssignedTask: ['assignedtask'],
            TLAssignedTask: ['tlassignedtask']
        }
    };

    // Define access check functions
    const hasAccessToEvents = () => {
        return Object.keys(teamManagementPermissions.Events).some(permissionType =>
            teamManagementPermissions.Events[permissionType].some(permission =>
                checkedNames.TeamManagement?.Events[permissionType]?.includes(permission)
            )
        );
    };

    const hasAccessToMeeting = () => {
        return Object.keys(teamManagementPermissions.Meeting).some(permissionType =>
            teamManagementPermissions.Meeting[permissionType].some(permission =>
                checkedNames.TeamManagement?.Meeting[permissionType]?.includes(permission)
            )
        );
    };

    const hasAccessToTeamTask = () => {
        return Object.keys(teamManagementPermissions.TeamTask).some(permissionType =>
            teamManagementPermissions.TeamTask[permissionType].some(permission =>
                checkedNames.TeamManagement?.TeamTask[permissionType]?.includes(permission)
            )
        );
    };

    // Check if any permissions are available
    const hasAnyTeamManagementPermissions = () => {
        return hasAccessToEvents() || hasAccessToMeeting() || hasAccessToTeamTask();
    };

    // --------------------------------------------------------------------------------------------------------------------







    return (
        <>
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">



                <div className="sb-sidenav-menu">


                    <div className="nav">
                        {hasAccessToDashboard() && checkedNames.Dashboard.length > 0 && (
                            <>
                                {checkedNames.Dashboard.includes('Dashboard') && (
                                    <Link
                                        to="/admin"
                                        className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                                        style={location.pathname === '/admin' ? activeStyle : {}}
                                    >
                                        <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                        Dashboard
                                    </Link>
                                )}
                                <hr />
                            </>
                        )}

                        {/* -------------------------------------------------------------------------------------------------------- */}
                        {/* <>
                            {checkedNames.Dashboard.includes('Dashboard') && (
                                <Link
                                    to="/admin/maindashboard"
                                    className={`nav-link ${location.pathname === '/admin/maindashboard' ? 'active' : ''}`}
                                    style={location.pathname === '/admin/maindashboard' ? activeStyle : {}}
                                >
                                    <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                    Main Dashboard
                                </Link>
                            )}
                            <hr />
                        </> */}

                        {/* -------------------------------------------------------------------------------------------------------- */}























                        {(
                            (hasAccessToorgStructure() && checkedNames.EmployeeManagement?.ORGStructure.length > 0) ||
                            (hasAccessToLeaveAndAttendancePolicy() && checkedNames.EmployeeManagement?.LeaveAndAttendancePolicy.length > 0)
                        ) && (
                                <>
                                    {/* ---------------------------------------------------------------------------------------- */}
                                    <Link 
                                        onClick={userrole === "1" || userrole === "2" ? HandleclickEmployeeManagement : undefined}
                                    className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Employee_Management" aria-expanded="false" aria-controls="Employee_Management">
                                        <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faUser} /></div>
                                        Employee Management
                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down">fdsfsdf</i></div>
                                    </Link>

                                    <div className="collapse" id="Employee_Management" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                        <nav className="sb-sidenav-menu-nested nav">

                                            {/* ---------------------------------------------------------------------------------------- */}


                                            {hasAccessToorgStructure() && checkedNames.EmployeeManagement?.ORGStructure.length > 0 && (
                                                <>
                                                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#ORGStructure_sidebar" aria-expanded="false" aria-controls="ORGStructure_sidebar">
                                                        <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faSitemap} /></div>
                                                        ORG Structure
                                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                    </Link>

                                                    <div className="collapse" id="ORGStructure_sidebar" aria-labelledby="headingOne" data-bs-parent="#Employee_Management">
                                                        <nav className="sb-sidenav-menu-nested nav">
                                                            <Link
                                                                to="/admin/department"
                                                                className={`nav-link ${location.pathname === '/admin/department' ? 'active' : ''}`}
                                                                style={location.pathname === '/admin/department' ? activeStyle : {}}
                                                            >Department List</Link>
                                                            {checkedNames.EmployeeManagement.ORGStructure.includes('add_Role') && (
                                                                <Link
                                                                    to="/admin/addrole"
                                                                    className={`nav-link ${location.pathname === '/admin/addrole' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/addrole' ? activeStyle : {}}
                                                                >Add Role / Designation</Link>
                                                            )}

                                                            {checkedNames.EmployeeManagement.ORGStructure.includes('roles_list') && (

                                                                <Link
                                                                    to="/admin/rolelist"
                                                                    className={`nav-link ${location.pathname === '/admin/rolelist' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/rolelist' ? activeStyle : {}}
                                                                >Role List</Link>
                                                            )}

                                                            {checkedNames.EmployeeManagement.ORGStructure.includes('supervisor_list') && (
                                                                <Link
                                                                    to="/admin/supervisorlist"
                                                                    className={`nav-link ${location.pathname === '/admin/supervisorlist' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/supervisorlist' ? activeStyle : {}}
                                                                >Supervisor List / Hierarchy</Link>
                                                            )}

                                                            {checkedNames.EmployeeManagement.ORGStructure.includes('org_Chart') && (
                                                                <Link
                                                                    to="/admin/verticalorgchart"
                                                                    className={`nav-link ${location.pathname === '/admin/verticalorgchart' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/verticalorgchart' ? activeStyle : {}}
                                                                >ORG Chart</Link>
                                                            )}

                                                            {/* {checkedNames.EmployeeManagement.ORGStructure.includes('empLevel_Category') && (

                                                                <Link
                                                                    to="/admin/addemplevelcategory"
                                                                    className={`nav-link ${location.pathname === '/admin/addemplevelcategory' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/addemplevelcategory' ? activeStyle : {}}
                                                                >Employee Level Category</Link>
                                                            )} */}

                                                            {/* {checkedNames.EmployeeManagement.ORGStructure.includes('emp_DocumentType') && (
                                                                <Link
                                                                    to="/admin/adddocumenttype"
                                                                    className={`nav-link ${location.pathname === '/admin/adddocumenttype' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/adddocumenttype' ? activeStyle : {}}
                                                                >Employee Document Type</Link>
                                                            )} */}


                                                        </nav>
                                                    </div>
                                                </>
                                            )}


                                            {hasAccessToLeaveAndAttendancePolicy() && checkedNames.EmployeeManagement?.LeaveAndAttendancePolicy.length > 0 && (
                                                <>
                                                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#LeaveAttendancePolicy" aria-expanded="false" aria-controls="LeaveAttendancePolicy">
                                                        <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faClipboardUser} /></div>
                                                        Attendance Policy
                                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                    </Link>

                                                    <div className="collapse" id="LeaveAttendancePolicy" aria-labelledby="headingTwo" data-bs-parent="#Employee_Management">
                                                        <nav className="sb-sidenav-menu-nested nav">
                                                            {/* {checkedNames.EmployeeManagement.LeaveAndAttendancePolicy.includes('addShiftSlot') && (
                                                                <Link
                                                                    to="/admin/addshiftslot"
                                                                    className={`nav-link ${location.pathname === '/admin/addshiftslot' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/addshiftslot' ? activeStyle : {}}
                                                                >Add Shift Slot</Link>
                                                            )} */}




                                                            {checkedNames.EmployeeManagement.LeaveAndAttendancePolicy.includes('attendancePolicy') && (
                                                                <Link
                                                                    to="/admin/addattendancepolicy"
                                                                    className={`nav-link ${location.pathname === '/admin/addattendancepolicy' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/addattendancepolicy' ? activeStyle : {}}
                                                                >Attendance Slot</Link>
                                                            )}

                                                            {/* {checkedNames.EmployeeManagement.LeaveAndAttendancePolicy.includes('attendanceType') && (
                                                                <Link
                                                                    to="/admin/attendancetype"
                                                                    className={`nav-link ${location.pathname === '/admin/attendancetype' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/attendancetype' ? activeStyle : {}}
                                                                >Attendance Type</Link>
                                                            )} */}

                                                            {/* {checkedNames.EmployeeManagement.LeaveAndAttendancePolicy.includes('attendanceLocation') && (
                                                                <Link
                                                                    to="/admin/attendancelocation"
                                                                    className={`nav-link ${location.pathname === '/admin/attendancelocation' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/attendancelocation' ? activeStyle : {}}
                                                                >Attendance Location</Link>
                                                            )} */}

                                                            {/* {checkedNames.EmployeeManagement.LeaveAndAttendancePolicy.includes('leavePolicyType') && (
                                                                <Link
                                                                    to="/admin/leavepolicytype"
                                                                    className={`nav-link ${location.pathname === '/admin/leavepolicytype' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/leavepolicytype' ? activeStyle : {}}
                                                                >Leave Policy Type</Link>
                                                            )} */}

                                                            {/* {checkedNames.EmployeeManagement.LeaveAndAttendancePolicy.includes('leavePolicyCategory') && (
                                                                <Link
                                                                    to="/admin/leavepolicycategory"
                                                                    className={`nav-link ${location.pathname === '/admin/leavepolicycategory' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/leavepolicycategory' ? activeStyle : {}}
                                                                >Leave Policy Category</Link>
                                                            )} */}

                                                            {checkedNames.EmployeeManagement.LeaveAndAttendancePolicy.includes('leavePolicy') && (
                                                                <Link
                                                                    to="/admin/leavepolicy"
                                                                    className={`nav-link ${location.pathname === '/admin/leavepolicy' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/leavepolicy' ? activeStyle : {}}
                                                                >Leave Policy</Link>
                                                            )}

                                                            {checkedNames.EmployeeManagement.LeaveAndAttendancePolicy.includes('assignEmployeeShift') && (
                                                                <Link
                                                                    to="/admin/assignemployeeshift"
                                                                    className={`nav-link ${location.pathname === '/admin/assignemployeeshift' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/assignemployeeshift' ? activeStyle : {}}
                                                                >Assign Employee Shift</Link>
                                                            )}

                                                            {/* {checkedNames.EmployeeManagement.LeaveAndAttendancePolicy.includes('overtimeType') && (
                                                                <Link
                                                                    to="/admin/overtimetype"
                                                                    className={`nav-link ${location.pathname === '/admin/overtimetype' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/overtimetype' ? activeStyle : {}}
                                                                >Overtime Type</Link>
                                                            )} */}
                                                            {checkedNames.EmployeeManagement.LeaveAndAttendancePolicy.includes('Holiday') && (
                                                                <Link
                                                                    to="/admin/holiday"
                                                                    className={`nav-link ${location.pathname === '/admin/holiday' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/holiday' ? activeStyle : {}}
                                                                >Holiday List</Link>
                                                            )}

                                                        </nav>
                                                    </div>

                                                </>
                                            )}


                                            {hasAccessToCompanyPolicy() && checkedNames.EmployeeManagement?.CompanyPolicy.length > 0 && (
                                                <>
                                                    {checkedNames.EmployeeManagement.CompanyPolicy.includes('companypolicy') && (
                                                        <Link
                                                            to="/admin/templates"
                                                            className={`nav-link ${location.pathname === '/admin/templates' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/templates' ? activeStyle : {}}
                                                        >
                                                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                                            Company Policy
                                                        </Link>
                                                    )}
                                                </>
                                            )}

                                            {/* --------------------------------------------------------------- */}


                                            {hasAccessToTemplate() && (
                                                <>
                                                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#TemplateSection" aria-expanded="false" aria-controls="TemplateSection">
                                                        <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faFile} /></div>
                                                        Template
                                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                    </Link>

                                                    <div className="collapse" id="TemplateSection" aria-labelledby="headingFour" data-bs-parent="#Employee_Management">
                                                        <nav className="sb-sidenav-menu-nested nav">

                                                            <Link
                                                                to="/admin/headFooter"
                                                                className={`nav-link ${location.pathname === '/admin/headFooter' ? 'active' : ''}`}
                                                                style={location.pathname === '/admin/headFooter' ? activeStyle : {}}
                                                            >Header & Footer</Link>

                                                            {/* Offer Letter Section */}
                                                            {templatePermissions.OfferLetter.some(permission => checkedNames.EmployeeManagement.Template.OfferLetter.includes(permission)) && (
                                                                <>
                                                                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#OfferLetterSection" aria-expanded="false" aria-controls="OfferLetterSection">
                                                                        Offer Letter
                                                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                                    </Link>
                                                                    <div className="collapse" id="OfferLetterSection" aria-labelledby="headingThree" data-bs-parent="#TemplateSection">
                                                                        <nav className="sb-sidenav-menu-nested nav">
                                                                            {checkedNames.EmployeeManagement.Template.OfferLetter.includes('Add_OfferLetter') && (
                                                                                <Link
                                                                                    to="/admin/offerletter"
                                                                                    className={`nav-link ${location.pathname === '/admin/offerletter' ? 'active' : ''}`}
                                                                                    style={location.pathname === '/admin/offerletter' ? activeStyle : {}}
                                                                                >Add Offer Letter</Link>
                                                                            )}
                                                                            {checkedNames.EmployeeManagement.Template.OfferLetter.includes('Offer_LetterList') && (
                                                                                <Link
                                                                                    to="/admin/offerletterList"
                                                                                    className={`nav-link ${location.pathname === '/admin/offerletterList' ? 'active' : ''}`}
                                                                                    style={location.pathname === '/admin/offerletterList' ? activeStyle : {}}
                                                                                >Offer Letter List</Link>
                                                                            )}
                                                                        </nav>
                                                                    </div>
                                                                </>
                                                            )}

                                                            {/* Appointment Letter Section */}
                                                            {templatePermissions.AppointmentLetter.some(permission => checkedNames.EmployeeManagement.Template.AppointmentLetter.includes(permission)) && (
                                                                <>
                                                                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#AppointmentLetterSection" aria-expanded="false" aria-controls="AppointmentLetterSection">
                                                                        Appointment Letter
                                                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                                    </Link>
                                                                    <div className="collapse" id="AppointmentLetterSection" aria-labelledby="headingThree" data-bs-parent="#TemplateSection">
                                                                        <nav className="sb-sidenav-menu-nested nav">
                                                                            {checkedNames.EmployeeManagement.Template.AppointmentLetter.includes('Add_AppointmentLetter') && (
                                                                                <Link
                                                                                    to="/admin/appointmentletter"
                                                                                    className={`nav-link ${location.pathname === '/admin/appointmentletter' ? 'active' : ''}`}
                                                                                    style={location.pathname === '/admin/appointmentletter' ? activeStyle : {}}
                                                                                >Add Appointment Letter</Link>
                                                                            )}
                                                                            {checkedNames.EmployeeManagement.Template.AppointmentLetter.includes('Appoint_mentLetterList') && (
                                                                                <Link
                                                                                    to="/admin/appointmentletterlist"
                                                                                    className={`nav-link ${location.pathname === '/admin/appointmentletterlist' ? 'active' : ''}`}
                                                                                    style={location.pathname === '/admin/appointmentletterlist' ? activeStyle : {}}
                                                                                >Appointment Letter List</Link>
                                                                            )}
                                                                        </nav>
                                                                    </div>
                                                                </>
                                                            )}

                                                            {/* Relieving Letter Section */}
                                                            {templatePermissions.RelievingLetter.some(permission => checkedNames.EmployeeManagement.Template.RelievingLetter.includes(permission)) && (
                                                                <>
                                                                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#RelievingLetterSection" aria-expanded="false" aria-controls="RelievingLetterSection">
                                                                        Relieving Letter
                                                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                                    </Link>
                                                                    <div className="collapse" id="RelievingLetterSection" aria-labelledby="headingThree" data-bs-parent="#TemplateSection">
                                                                        <nav className="sb-sidenav-menu-nested nav">
                                                                            {checkedNames.EmployeeManagement.Template.RelievingLetter.includes('Add_RelievingLetter') && (
                                                                                <Link
                                                                                    to="/admin/relievingletter"
                                                                                    className={`nav-link ${location.pathname === '/admin/relievingletter' ? 'active' : ''}`}
                                                                                    style={location.pathname === '/admin/relievingletter' ? activeStyle : {}}
                                                                                >Add Relieving Letter</Link>
                                                                            )}
                                                                            {checkedNames.EmployeeManagement.Template.RelievingLetter.includes('Relieving_LetterList') && (
                                                                                <Link
                                                                                    to="/admin/relievingletterList"
                                                                                    className={`nav-link ${location.pathname === '/admin/relievingletterList' ? 'active' : ''}`}
                                                                                    style={location.pathname === '/admin/relievingletterList' ? activeStyle : {}}
                                                                                >Relieving Letter List</Link>
                                                                            )}
                                                                        </nav>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </nav>
                                                    </div>
                                                </>
                                            )}


                                            {/* --------------------------------------------------------------- */}


                                            {hasAccessToEmployee() && checkedNames.EmployeeManagement?.Employee.length > 0 && (
                                                <>
                                                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Employee" aria-expanded="false" aria-controls="Employee">
                                                        <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faUser} /></div>
                                                        Employee Info
                                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                    </Link>

                                                    <div className="collapse" id="Employee" aria-labelledby="headingFive" data-bs-parent="#Employee_Management">
                                                        <nav className="sb-sidenav-menu-nested nav">
                                                            {checkedNames.EmployeeManagement.Employee.includes('Add_Employee') && (
                                                                <Link
                                                                    to="/admin/addemployee"
                                                                    className={`nav-link ${location.pathname === '/admin/addemployee' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/addemployee' ? activeStyle : {}}
                                                                >Add Employee</Link>
                                                            )}

                                                            {checkedNames.EmployeeManagement.Employee.includes('Emp_loyeeList') && (
                                                                <Link
                                                                    to="/admin/EmployeeList"
                                                                    className={`nav-link ${location.pathname === '/admin/EmployeeList' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/EmployeeList' ? activeStyle : {}}
                                                                >Employee List</Link>
                                                            )}

                                                            {checkedNames.EmployeeManagement.Employee.includes('Employee_Confirmation') && (

                                                                <Link
                                                                    to="/admin/employeeconfirmation"
                                                                    className={`nav-link ${location.pathname === '/admin/employeeconfirmation' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/employeeconfirmation' ? activeStyle : {}}
                                                                >Probation Completion</Link>
                                                            )}

                                                        </nav>
                                                    </div>

                                                </>
                                            )}



                                            {/* ---------------------------------------------------------------------------------------- */}
                                        </nav>
                                    </div>
                                    <hr />
                                    {/* ---------------------------------------------------------------------------------------- */}

                                </>
                            )}

                        {hasAccessToAttendance() && checkedNames.Attendance.length > 0 && (
                            <>
                                <Link
                                        onClick={userrole === "1" || userrole === "2" ? HandleclickAttendanceCalculation : undefined}
                                        className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Attendance" aria-expanded="false" aria-controls="Attendance">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faClipboardUser} /></div>
                                    Attendance Calculation
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="Attendance" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.Attendance.includes('DailyAttendance') && (
                                            <Link
                                                to="/admin/dailyattendance"
                                                className={`nav-link ${location.pathname === '/admin/dailyattendance' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/dailyattendance' ? activeStyle : {}}
                                            >Daily Attendance</Link>
                                        )}

                                        {checkedNames.Attendance.includes('Monthly_Attendance') && (
                                            <Link
                                                to="/admin/monthlyattendance"
                                                className={`nav-link ${location.pathname === '/admin/monthlyattendance' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/monthlyattendance' ? activeStyle : {}}
                                            >Monthly Attendance</Link>
                                        )}

                                        {checkedNames.Attendance.includes('Monthly_AttendanceCalendar') && (
                                            <Link
                                                to="/admin/monthlyattendancecalendaremployee"
                                                className={`nav-link ${location.pathname === '/admin/monthlyattendancecalendaremployee' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/monthlyattendancecalendaremployee' ? activeStyle : {}}
                                            >
                                                Monthly Attendance Calendar View
                                            </Link>
                                        )}

                                        {checkedNames.Attendance.includes('Monthly_List') && (
                                            <Link
                                                to="/admin/monthlylist"
                                                className={`nav-link ${location.pathname === '/admin/monthlylist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/monthlylist' ? activeStyle : {}}
                                            >Monthly List</Link>
                                        )}

                                        {checkedNames.Attendance.includes('Approval_List') && (
                                            <Link
                                                to="/admin/approvalrequest"
                                                className={`nav-link ${location.pathname === '/admin/approvalrequest' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/approvalrequest' ? activeStyle : {}}
                                            >HR Approvals List</Link>
                                        )}

                                        {checkedNames.Attendance.includes('Leave_Approval') && (
                                            <Link
                                                to="/admin/tlapprovalrequest"
                                                className={`nav-link ${location.pathname === '/admin/tlapprovalrequest' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/tlapprovalrequest' ? activeStyle : {}}
                                            >TL Approval List</Link>
                                        )}


                                    </nav>
                                </div>
                                <hr />
                            </>
                        )}


                        {/* --------------------------------------------------------------- */}

                        {(hasAccessToPostJob() && checkedNames.Recruitment?.PostJob.length > 0) ||
                            (hasAccessToListJob() && checkedNames.Recruitment?.ListJob.length > 0) ||
                            (hasAccessToInboxResume() && checkedNames.Recruitment?.InboxResume.length > 0) ||
                            (hasAccessTocandidatetracker() && (
                                checkedNames.Recruitment?.CandidateTracker.AddResume.length > 0 ||
                                checkedNames.Recruitment?.CandidateTracker.CandidateStatus.length > 0
                            )) ||
                            (hasAccessToSearchResume() && checkedNames.Recruitment?.SearchResume.length > 0) ? (
                            <>


                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Recruitment" aria-expanded="false" aria-controls="Recruitment">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faUsers} /></div>
                                    Recruitment
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="Recruitment" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {hasAccessToPostJob() && checkedNames.Recruitment?.PostJob.length > 0 && (
                                            <>
                                                {checkedNames.Recruitment.PostJob.includes('Post_Job') && (

                                                    <Link
                                                        to="/admin/postjob"
                                                        className={`nav-link ${location.pathname === '/admin/postjob' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/postjob' ? activeStyle : {}}
                                                    >Post Job</Link>

                                                )}
                                            </>
                                        )}

                                        {hasAccessToListJob() && checkedNames.Recruitment?.ListJob.length > 0 && (
                                            <>
                                                {checkedNames.Recruitment.ListJob.includes('List_Job') && (

                                                    <Link
                                                        to="/admin/listjob"
                                                        className={`nav-link ${location.pathname === '/admin/listjob' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/listjob' ? activeStyle : {}}
                                                    >List Job</Link>
                                                )}
                                            </>
                                        )}

                                        {hasAccessToInboxResume() && checkedNames.Recruitment?.InboxResume.length > 0 && (
                                            <>
                                                {checkedNames.Recruitment.InboxResume.includes('Inbox_Resume') && (


                                                    <Link
                                                        to="/admin/resumescreening"
                                                        className={`nav-link ${location.pathname === '/admin/resumescreening' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/resumescreening' ? activeStyle : {}}
                                                    >Inbox Webmail</Link>
                                                )}
                                            </>
                                        )}

                                        {/* ------------------------------------------------------ */}
                                        {hasAccessTocandidatetracker() && (
                                            <>

                                                {/* Candidaetracking Sub menu  */}
                                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Candidaetracking" aria-expanded="false" aria-controls="Candidaetracking">
                                                    Candidate Tracker
                                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                </Link>
                                                <div className="collapse" id="Candidaetracking" aria-labelledby="headingThree" data-bs-parent="#Recruitment">
                                                    {candidatetrackerPermissions.AddResume.some(permission => checkedNames.Recruitment.CandidateTracker.AddResume.includes(permission)) && (
                                                        <>
                                                            {checkedNames.Recruitment.CandidateTracker.AddResume.includes('Add_Resume') && (
                                                                <Link
                                                                    to="/admin/addresume"
                                                                    className={`nav-link ${location.pathname === '/admin/addresume' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/addresume' ? activeStyle : {}}
                                                                >Call Tracker</Link>
                                                            )}
                                                        </>
                                                    )}
                                                    {candidatetrackerPermissions.CandidateStatus.some(permission => checkedNames.Recruitment.CandidateTracker.CandidateStatus.includes(permission)) && (
                                                        <>
                                                            {checkedNames.Recruitment.CandidateTracker.CandidateStatus.includes('Candidate_Status') && (
                                                                <Link
                                                                    to="/admin/candidatestatus"
                                                                    className={`nav-link ${location.pathname === '/admin/candidatestatus' ? 'active' : ''}`}
                                                                    style={location.pathname === '/admin/candidatestatus' ? activeStyle : {}}
                                                                >View Tracker</Link>
                                                            )}

                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        {/* ------------------------------------------------------ */}

                                        {hasAccessToSearchResume() && checkedNames.Recruitment?.SearchResume.length > 0 && (
                                            <>
                                                {checkedNames.Recruitment.SearchResume.includes('Search_Resume') && (

                                                    <Link
                                                        to="/admin/searchresume"
                                                        className={`nav-link ${location.pathname === '/admin/searchresume' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/searchresume' ? activeStyle : {}}
                                                    >Search Resume</Link>

                                                )}
                                            </>
                                        )}
                                    </nav>
                                </div>
                                <hr />
                            </>
                        ) : null}

                        {/* --------------------------------------------------------------- */}

                        {hasAccessToPayroll() && checkedNames.Payroll.length > 0 && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Payroll" aria-expanded="false" aria-controls="Payroll">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faMoneyBill} /></div>
                                    Payroll
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="Payroll" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.Payroll.includes('OverTimeCalculation') && (
                                            <Link
                                                to="/admin/overtimecalculationlist"
                                                className={`nav-link ${location.pathname === '/admin/overtimecalculationlist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/overtimecalculationlist' ? activeStyle : {}}
                                            >Overtime Calculation</Link>
                                        )}

                                        {checkedNames.Payroll.includes('Assign Employee Salary') && (
                                            <Link
                                                to="/admin/assignemployeesalarylist"
                                                className={`nav-link ${location.pathname === '/admin/assignemployeesalarylist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/assignemployeesalarylist' ? activeStyle : {}}
                                            >Assign Employee Salary</Link>
                                        )}

                                        {checkedNames.Payroll.includes('Salarycalculation') && (
                                            <Link
                                                to="/admin/salarycalculation"
                                                className={`nav-link ${location.pathname === '/admin/salarycalculation' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/salarycalculation' ? activeStyle : {}}
                                            >Salary Calculation</Link>
                                        )}

                                        {checkedNames.Payroll.includes('Generate_payslip') && (
                                            <Link
                                                to="/admin/generatepayslip"
                                                className={`nav-link ${location.pathname === '/admin/generatepayslip' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/generatepayslip' ? activeStyle : {}}
                                            >Generate Payslip</Link>
                                        )}

                                        {checkedNames.Payroll.includes('Payslip_list') && (
                                            <>
                                                {(userrole === "1" || userrole === "2") ? (
                                                    <Link
                                                        to="/admin/paysliplist"
                                                        className={`nav-link ${location.pathname === '/admin/paysliplist' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/paysliplist' ? activeStyle : {}}
                                                    >Payslip List</Link>
                                                ) : (
                                                    <Link
                                                        to={`/admin/Payslip/${userempid}`}
                                                        className={`nav-link ${location.pathname === '/admin/Payslip' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/Payslip' ? activeStyle : {}}
                                                    >Payslip List</Link>
                                                )}

                                            </>
                                        )}



                                        {/* <Link
                                    to="/admin/assignemployeesalary"
                                    className={`nav-link ${location.pathname === '/admin/assignemployeesalary' ? 'active' : ''}`}
                                    style={location.pathname === '/admin/assignemployeesalary' ? activeStyle : {}}
                                >Assign Employee Salary</Link> */}



                                    </nav>
                                </div>
                                <hr />
                            </>
                        )}
                        {/* --------------------------------------------------------------- */}

                        {hasAnyAccountPermissions() && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Accounts" aria-expanded="false" aria-controls="Accounts">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faScaleBalanced} /></div>
                                    Accounts
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="Accounts" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {hasAccessToGoodsAndServices() && (
                                            <Link
                                                to="/admin/addgoodsservices"
                                                className={`nav-link ${location.pathname === '/admin/addgoodsservices' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/addgoodsservices' ? activeStyle : {}}
                                            >
                                                Goods & Services
                                            </Link>
                                        )}

                                        {/* Company Details Sub menu */}
                                        {hasAccessToCompanyDetails() && (
                                            <>
                                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Companydetails" aria-expanded="false" aria-controls="Companydetails">
                                                    Company Details
                                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                </Link>
                                                <div className="collapse" id="Companydetails" aria-labelledby="headingThree" data-bs-parent="#Accounts">
                                                    <nav className="sb-sidenav-menu-nested nav">
                                                        {checkedNames.Accounts?.CompanyDetails.AddCompany.length > 0 && (
                                                            <Link
                                                                to="/admin/addcompany"
                                                                className={`nav-link ${location.pathname === '/admin/addcompany' ? 'active' : ''}`}
                                                                style={location.pathname === '/admin/addcompany' ? activeStyle : {}}
                                                            >
                                                                Add Company
                                                            </Link>
                                                        )}
                                                        {checkedNames.Accounts?.CompanyDetails.CompanyList.length > 0 && (
                                                            <Link
                                                                to="/admin/companyList"
                                                                className={`nav-link ${location.pathname === '/admin/companyList' ? 'active' : ''}`}
                                                                style={location.pathname === '/admin/companyList' ? activeStyle : {}}
                                                            >
                                                                Company List
                                                            </Link>
                                                        )}
                                                    </nav>
                                                </div>
                                            </>
                                        )}

                                        {/* Sales Invoice Sub menu */}
                                        {hasAccessToSalesInvoice() && (
                                            <>
                                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Salesinvoice" aria-expanded="false" aria-controls="Salesinvoice">
                                                    Sales Invoice
                                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                </Link>
                                                <div className="collapse" id="Salesinvoice" aria-labelledby="headingThree" data-bs-parent="#Accounts">
                                                    <nav className="sb-sidenav-menu-nested nav">
                                                        {checkedNames.Accounts?.Sales.AddSales.length > 0 && (
                                                            <Link
                                                                to="/admin/salesinvoice"
                                                                className={`nav-link ${location.pathname === '/admin/salesinvoice' ? 'active' : ''}`}
                                                                style={location.pathname === '/admin/salesinvoice' ? activeStyle : {}}
                                                            >
                                                                Add Sales Invoice
                                                            </Link>
                                                        )}
                                                        {checkedNames.Accounts?.Sales.SalesList.length > 0 && (
                                                            <Link
                                                                to="/admin/salesinvoicelist"
                                                                className={`nav-link ${location.pathname === '/admin/salesinvoicelist' ? 'active' : ''}`}
                                                                style={location.pathname === '/admin/salesinvoicelist' ? activeStyle : {}}
                                                            >
                                                                Sales Invoice List
                                                            </Link>
                                                        )}

                                                        <Link
                                                            to="/admin/proformainvoicelist"
                                                            className={`nav-link ${location.pathname === '/admin/proformainvoicelist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/proformainvoicelist' ? activeStyle : {}}
                                                        >
                                                            Proforma Invoice List
                                                        </Link>
                                                        <Link
                                                            to="/admin/productinvoicelist"
                                                            className={`nav-link ${location.pathname === '/admin/productinvoicelist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/productinvoicelist' ? activeStyle : {}}
                                                        >
                                                            Product Invoice List
                                                        </Link>
                                                    </nav>
                                                </div>
                                            </>
                                        )}

                                        {/* Purchase Invoice Sub menu */}
                                        {hasAccessToPurchaseInvoice() && (
                                            <>
                                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Purchaseinvoice" aria-expanded="false" aria-controls="Purchaseinvoice">
                                                    Purchase Invoice
                                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                </Link>
                                                <div className="collapse" id="Purchaseinvoice" aria-labelledby="headingThree" data-bs-parent="#Accounts">
                                                    <nav className="sb-sidenav-menu-nested nav">
                                                        {checkedNames.Accounts?.Purchase.AddPurchase.length > 0 && (
                                                            <Link
                                                                to="/admin/addpurchaseinvoice"
                                                                className={`nav-link ${location.pathname === '/admin/addpurchaseinvoice' ? 'active' : ''}`}
                                                                style={location.pathname === '/admin/addpurchaseinvoice' ? activeStyle : {}}
                                                            >
                                                                Add Purchase Invoice
                                                            </Link>
                                                        )}
                                                        {checkedNames.Accounts?.Purchase.PurchaseList.length > 0 && (
                                                            <Link
                                                                to="/admin/purchaseinvoicelist"
                                                                className={`nav-link ${location.pathname === '/admin/purchaseinvoicelist' ? 'active' : ''}`}
                                                                style={location.pathname === '/admin/purchaseinvoicelist' ? activeStyle : {}}
                                                            >
                                                                Purchase Invoice List
                                                            </Link>
                                                        )}
                                                    </nav>
                                                </div>
                                            </>
                                        )}

                                        {/* Daily Accounts */}
                                        {hasAccessToDailyAccounts() && checkedNames.Accounts?.DailyAccounts.length > 0 && (
                                            <Link
                                                to="/admin/adddailyaccounts"
                                                className={`nav-link ${location.pathname === '/admin/adddailyaccounts' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/adddailyaccounts' ? activeStyle : {}}
                                            >
                                                Daily Accounts
                                            </Link>
                                        )}
                                    </nav>
                                </div>
                                <hr />
                            </>
                        )}
                        {/* --------------------------------------------------------------- */}

                        {hasAnySalesManagementPermissions() && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Salesmanagement" aria-expanded="false" aria-controls="Salesmanagement">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faBusinessTime} /></div>
                                    Sales Management
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="Salesmanagement" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">

                                        {/* Lead Sub menu */}
                                        {hasAccessToLead() && (
                                            <>
                                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Lead" aria-expanded="false" aria-controls="Lead">
                                                    Lead
                                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                </Link>
                                                <div className="collapse" id="Lead" aria-labelledby="headingThree" data-bs-parent="#Salesmanagement" style={{ paddingLeft: '20px' }}>
                                                    {checkedNames.SalesManagement?.Lead?.EnquiryList?.length > 0 && (
                                                        <Link
                                                            to="/admin/leadenquirylist"
                                                            className={`nav-link ${location.pathname === '/admin/leadenquirylist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/leadenquirylist' ? activeStyle : {}}
                                                        >
                                                            Enquiry List
                                                        </Link>
                                                    )}
                                                    {checkedNames.SalesManagement?.Lead?.AddLead?.length > 0 && (
                                                        <Link
                                                            to="/admin/addlead"
                                                            className={`nav-link ${location.pathname === '/admin/addlead' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/addlead' ? activeStyle : {}}
                                                        >
                                                            Add Enquiry
                                                        </Link>
                                                    )}

                                                    <Link
                                                        to="/admin/marketsurvey"
                                                        className={`nav-link ${location.pathname === '/admin/marketsurvey' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/marketsurvey' ? activeStyle : {}}
                                                    >
                                                        Market Survey
                                                    </Link>

                                                    {/* {checkedNames.SalesManagement?.Lead?.LeadList?.length > 0 && (
                                                        <Link
                                                            to="/admin/leadlist"
                                                            className={`nav-link ${location.pathname === '/admin/leadlist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/leadlist' ? activeStyle : {}}
                                                        >
                                                            Lead List
                                                        </Link>
                                                    )} */}
                                                </div>
                                            </>
                                        )}

                                        {/* Pre Sales Sub menu */}
                                        {hasAccessToPreSales() && (
                                            <>
                                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Presales" aria-expanded="false" aria-controls="Presales">
                                                    Pre Sales
                                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                </Link>
                                                <div className="collapse" id="Presales" aria-labelledby="headingThree" data-bs-parent="#Salesmanagement" style={{ paddingLeft: '20px' }}>
                                                    {checkedNames.SalesManagement?.PreSales?.EnquiryList?.length > 0 && (
                                                        <Link
                                                            to="/admin/presalesenquirylist"
                                                            className={`nav-link ${location.pathname === '/admin/presalesenquirylist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/presalesenquirylist' ? activeStyle : {}}
                                                        >
                                                            Enquiry List
                                                        </Link>
                                                    )}

                                                    <Link
                                                        to="/admin/addcustomer"
                                                        className={`nav-link ${location.pathname === '/admin/addcustomer' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/addcustomer' ? activeStyle : {}}
                                                    >
                                                        Add Customer
                                                    </Link>
                                                    <Link
                                                        to="/admin/trialpacklist"
                                                        className={`nav-link ${location.pathname === '/admin/trialpacklist' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/trialpacklist' ? activeStyle : {}}
                                                    >
                                                        Trial Pack List
                                                    </Link>
                                                    <Link
                                                        to="/admin/presalesbuypacklist"
                                                        className={`nav-link ${location.pathname === '/admin/presalesbuypacklist' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/presalesbuypacklist' ? activeStyle : {}}
                                                    >
                                                        Buy Pack List
                                                    </Link>

                                                    {/* {checkedNames.SalesManagement?.PreSales?.LeadList?.length > 0 && (
                                                        <Link
                                                            to="/admin/presalesleadlist"
                                                            className={`nav-link ${location.pathname === '/admin/presalesleadlist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/presalesleadlist' ? activeStyle : {}}
                                                        >
                                                            Lead List
                                                        </Link>
                                                    )}
                                                    {checkedNames.SalesManagement?.PreSales?.AddLead?.length > 0 && (
                                                        <Link
                                                            to="/admin/presalesaddlead"
                                                            className={`nav-link ${location.pathname === '/admin/presalesaddlead' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/presalesaddlead' ? activeStyle : {}}
                                                        >
                                                            Add Lead
                                                        </Link>
                                                    )} */}
                                                </div>
                                            </>
                                        )}

                                        {/* Sales Sub menu */}
                                        {hasAccessToSales() && (
                                            <>
                                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Sales" aria-expanded="false" aria-controls="Sales">
                                                    Sales
                                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                </Link>
                                                <div className="collapse" id="Sales" aria-labelledby="headingThree" data-bs-parent="#Salesmanagement" style={{ paddingLeft: '20px' }}>
                                                    {checkedNames.SalesManagement?.Sales?.LeadList?.length > 0 && (
                                                        <Link
                                                            to="/admin/salestrialpacklist"
                                                            className={`nav-link ${location.pathname === '/admin/salestrialpacklist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/salestrialpacklist' ? activeStyle : {}}
                                                        >
                                                            Trial Pack List
                                                        </Link>
                                                    )}

                                                    <Link
                                                        to="/admin/salesbuypacklist"
                                                        className={`nav-link ${location.pathname === '/admin/salesbuypacklist' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/salesbuypacklist' ? activeStyle : {}}
                                                    >
                                                        Buy Pack List
                                                    </Link>
                                                </div>
                                            </>
                                        )}


                                        {/* Online Customer Submenu */}
                                        <>
                                            <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#OnlineCustomer" aria-expanded="false" aria-controls="OnlineCustomer">
                                                Online Customer
                                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                            </Link>
                                            <div className="collapse" id="OnlineCustomer" aria-labelledby="headingThree" data-bs-parent="#Salesmanagement" style={{ paddingLeft: '20px' }}>

                                                <Link
                                                    to="/admin/onlinetrialpacklist"
                                                    className={`nav-link ${location.pathname === '/admin/onlinetrialpacklist' ? 'active' : ''}`}
                                                    style={location.pathname === '/admin/onlinetrialpacklist' ? activeStyle : {}}
                                                >
                                                    Trial Pack List
                                                </Link>
                                                <Link
                                                    to="/admin/buypacklist"
                                                    className={`nav-link ${location.pathname === '/admin/buypacklist' ? 'active' : ''}`}
                                                    style={location.pathname === '/admin/buypacklist' ? activeStyle : {}}
                                                >
                                                    Buy Pack List
                                                </Link>

                                            </div>
                                        </>
                                    </nav>
                                </div>
                                <hr />
                            </>
                        )}
                        {/* --------------------------------------------------------------- */}

                        {hasAccessToVisitiormanagement() && checkedNames.Visitiormanagement.length > 0 && (
                            <>

                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#VisitorManagement" aria-expanded="false" aria-controls="VisitorManagement">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faBarsProgress} /></div>
                                    Visitor Management
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="VisitorManagement" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.Visitiormanagement.includes('Add_visitor') && (
                                            <Link
                                                to="/admin/addvisitor"
                                                className={`nav-link ${location.pathname === '/admin/addvisitor' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/addvisitor' ? activeStyle : {}}
                                            >Add Visitor</Link>
                                        )}

                                        {checkedNames.Visitiormanagement.includes('Visitor_log') && (
                                            <Link
                                                to="/admin/visitorlog"
                                                className={`nav-link ${location.pathname === '/admin/visitorlog' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/visitorlog' ? activeStyle : {}}
                                            >Visitor Log</Link>
                                        )}


                                    </nav>
                                </div>
                                <hr />
                            </>
                        )}
                        {/* --------------------------------------------------------------- */}

                        {hasAnyTeamManagementPermissions() && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#TeamManagement" aria-expanded="false" aria-controls="TeamManagement">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faUsers} /></div>
                                    Team Management
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="TeamManagement" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">

                                        {/* Events Sub menu */}
                                        {hasAccessToEvents() && (
                                            <>
                                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Events" aria-expanded="false" aria-controls="Events">
                                                    Events
                                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                </Link>
                                                <div className="collapse" id="Events" aria-labelledby="headingThree" data-bs-parent="#TeamManagement">
                                                    {checkedNames.TeamManagement?.Events?.AddEvent?.length > 0 && (
                                                        <Link
                                                            to="/admin/addevent"
                                                            className={`nav-link ${location.pathname === '/admin/addevent' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/addevent' ? activeStyle : {}}
                                                        >
                                                            Add Event
                                                        </Link>
                                                    )}
                                                    {checkedNames.TeamManagement?.Events?.EventList?.length > 0 && (
                                                        <Link
                                                            to="/admin/eventlist"
                                                            className={`nav-link ${location.pathname === '/admin/eventlist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/eventlist' ? activeStyle : {}}
                                                        >
                                                            Event List
                                                        </Link>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* Meeting Sub menu */}
                                        {hasAccessToMeeting() && (
                                            <>
                                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Meeting" aria-expanded="false" aria-controls="Meeting">
                                                    Meeting
                                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                </Link>
                                                <div className="collapse" id="Meeting" aria-labelledby="headingThree" data-bs-parent="#TeamManagement">
                                                    {checkedNames.TeamManagement?.Meeting?.AddMeeting?.length > 0 && (
                                                        <Link
                                                            to="/admin/addmeeting"
                                                            className={`nav-link ${location.pathname === '/admin/addmeeting' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/addmeeting' ? activeStyle : {}}
                                                        >
                                                            Add Meeting
                                                        </Link>
                                                    )}
                                                    {checkedNames.TeamManagement?.Meeting?.MeetingList?.length > 0 && (
                                                        <Link
                                                            to="/admin/meetinglist"
                                                            className={`nav-link ${location.pathname === '/admin/meetinglist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/meetinglist' ? activeStyle : {}}
                                                        >
                                                            Meeting List
                                                        </Link>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* Team Task Sub menu */}
                                        {hasAccessToTeamTask() && (
                                            <>
                                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#TeamTask" aria-expanded="false" aria-controls="TeamTask">
                                                    Team Task
                                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                                </Link>
                                                <div className="collapse" id="TeamTask" aria-labelledby="headingThree" data-bs-parent="#TeamManagement">
                                                    {checkedNames.TeamManagement?.TeamTask?.AddProject?.length > 0 && (
                                                        <Link
                                                            to="/admin/addproject"
                                                            className={`nav-link ${location.pathname === '/admin/addproject' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/addproject' ? activeStyle : {}}
                                                        >
                                                            Add Project
                                                        </Link>
                                                    )}
                                                    {checkedNames.TeamManagement?.TeamTask?.ProjectList?.length > 0 && (
                                                        <Link
                                                            to="/admin/projectlist"
                                                            className={`nav-link ${location.pathname === '/admin/projectlist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/projectlist' ? activeStyle : {}}
                                                        >
                                                            Project List
                                                        </Link>
                                                    )}
                                                    {checkedNames.TeamManagement?.TeamTask?.AddTask?.length > 0 && (
                                                        <Link
                                                            to="/admin/addtask"
                                                            className={`nav-link ${location.pathname === '/admin/addtask' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/addtask' ? activeStyle : {}}
                                                        >
                                                            Add Task
                                                        </Link>
                                                    )}
                                                    {checkedNames.TeamManagement?.TeamTask?.TaskList?.length > 0 && (
                                                        <Link
                                                            to="/admin/tasklist"
                                                            className={`nav-link ${location.pathname === '/admin/tasklist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/tasklist' ? activeStyle : {}}
                                                        >
                                                            Task List
                                                        </Link>
                                                    )}
                                                    {checkedNames.TeamManagement?.TeamTask?.AssignedTask?.length > 0 && (
                                                        <Link
                                                            to="/admin/adminassignedtasklist"
                                                            className={`nav-link ${location.pathname === '/admin/adminassignedtasklist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/adminassignedtasklist' ? activeStyle : {}}
                                                        >
                                                            Assigned Task
                                                        </Link>
                                                    )}
                                                    {checkedNames.TeamManagement?.TeamTask?.TLAssignedTask?.length > 0 && (
                                                        <Link
                                                            to="/admin/tlassignedtasklist"
                                                            className={`nav-link ${location.pathname === '/admin/tlassignedtasklist' ? 'active' : ''}`}
                                                            style={location.pathname === '/admin/tlassignedtasklist' ? activeStyle : {}}
                                                        >
                                                            TL Assigned Task
                                                        </Link>
                                                    )}
                                                </div>
                                            </>
                                        )}



                                        {/* ---------------------------------------------------------------------------------- */}

                                        <>
                                            <Link onClick={HandleclickTeamTask} className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#TeamTask_manage" aria-expanded="false" aria-controls="TeamTask_manage">
                                                Team Task
                                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                            </Link>
                                            <div className="collapse" id="TeamTask_manage" aria-labelledby="headingThree" data-bs-parent="#TeamManagement">

                                                <Link
                                                    to="/admin/manageprojects"
                                                    className={`nav-link ${location.pathname === '/admin/manageprojects' ? 'active' : ''}`}
                                                    style={location.pathname === '/admin/manageprojects' ? activeStyle : {}}
                                                >
                                                    Manage Project
                                                </Link>
                                            </div>
                                        </>
                                        {/* ---------------------------------------------------------------------------------- */}
                                    </nav>
                                </div>
                                <hr />
                            </>
                        )}

                        {/* --------------------------------------------------------------- */}
                        {hasAccessToAssets() && checkedNames.Assets.length > 0 && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Assets" aria-expanded="false" aria-controls="Assets">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faComputer} /></div>
                                    Asset Management
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="Assets" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.Assets.includes('Assets_Type') && (
                                            <Link
                                                to="/admin/assetstype"
                                                className={`nav-link ${location.pathname === '/admin/assetstype' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/assetstype' ? activeStyle : {}}
                                            >Assets Type</Link>
                                        )}

                                        {checkedNames.Assets.includes('Assign_Asset') && (
                                            <Link
                                                to="/admin/assignassets"
                                                className={`nav-link ${location.pathname === '/admin/assignassets' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/assignassets' ? activeStyle : {}}
                                            >Assign Assets</Link>
                                        )}

                                        {checkedNames.Assets.includes('Asset_List') && (
                                            <Link
                                                to="/admin/assetslist"
                                                className={`nav-link ${location.pathname === '/admin/assetslist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/assetslist' ? activeStyle : {}}
                                            >Asset List</Link>
                                        )}


                                    </nav>
                                </div>
                                <hr />
                            </>
                        )}
                        {/* --------------------------------------------------------------- */}
                        {hasAccessToHelpDesk() && checkedNames.HelpDesk.length > 0 && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#HelpDesk" aria-expanded="false" aria-controls="HelpDesk">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faHandshakeAngle} /></div>
                                    Help Desk - Employee
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="HelpDesk" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.HelpDesk.includes('Add_Issue') && (
                                            <Link
                                                to="/admin/addissue"
                                                className={`nav-link ${location.pathname === '/admin/addissue' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/addissue' ? activeStyle : {}}
                                            >Add Issue</Link>
                                        )}

                                        {checkedNames.HelpDesk.includes('Raise_Ticket') && (
                                            <>
                                                {(userrole === "1" || userrole === "2") ? (
                                                    <Link
                                                        to="/admin/raiseticket"
                                                        className={`nav-link ${location.pathname === '/admin/raiseticket' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/raiseticket' ? activeStyle : {}}
                                                    >Raise Ticket</Link>
                                                ) : (
                                                    <Link
                                                        to="/admin/userraiseticket"
                                                        className={`nav-link ${location.pathname === '/admin/userraiseticket' ? 'active' : ''}`}
                                                        style={location.pathname === '/admin/userraiseticket' ? activeStyle : {}}
                                                    >Raise Ticket</Link>
                                                )}
                                            </>
                                        )}

                                        {checkedNames.HelpDesk.includes('Tickets_List') && (
                                            <Link
                                                to="/admin/ticketslist"
                                                className={`nav-link ${location.pathname === '/admin/ticketslist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/ticketslist' ? activeStyle : {}}
                                            >Tickets List</Link>
                                        )}

                                        {checkedNames.HelpDesk.includes('Assigned_List') && (
                                            <Link
                                                to="/admin/assignedlist"
                                                className={`nav-link ${location.pathname === '/admin/assignedlist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/assignedlist' ? activeStyle : {}}
                                            >Assigned List</Link>
                                        )}
                                    </nav>
                                </div>

                                <hr />
                            </>
                        )}
                        {/* --------------------------------------------------------------- */}


                        {/* --------------------------------------------------------------- */}

                        {((hasAccessToHelpDeskTenant() && checkedNames.HelpDeskTenant.length > 0) || sluge === "TENANT") && (

                            <>
                                <Link
                                    className="nav-link collapsed"
                                    to="#"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#Help_Desk_Tenant"
                                    aria-expanded="false"
                                    aria-controls="Help_Desk_Tenant"
                                >
                                    <div className="sb-nav-link-icon">
                                        <FontAwesomeIcon icon={faClipboardUser} />
                                    </div>
                                    Help Desk - Tenant
                                    <div className="sb-sidenav-collapse-arrow">
                                        <i className="fas fa-angle-down"></i>
                                    </div>
                                </Link>

                                <div className="collapse" id="Help_Desk_Tenant" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.HelpDeskTenant.includes('Add_Tenant') && (
                                            <Link
                                                to="/admin/add_tenant"
                                                className={`nav-link ${location.pathname === '/admin/add_tenant' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/add_tenant' ? activeStyle : {}}
                                            >
                                                Add Tenant
                                            </Link>
                                        )}
                                        {checkedNames.HelpDeskTenant.includes('Tenant_List') && (
                                            <Link
                                                to="/admin/list_tenant"
                                                className={`nav-link ${location.pathname === '/admin/list_tenant' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/list_tenant' ? activeStyle : {}}
                                            >
                                                Tenant List
                                            </Link>
                                        )}
                                        {(checkedNames.HelpDeskTenant.includes('Raise_Ticket') || sluge == "TENANT") && (
                                            <Link
                                                to="/admin/raise_ticket_tenant"
                                                className={`nav-link ${location.pathname === '/admin/raise_ticket_tenant' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/raise_ticket_tenant' ? activeStyle : {}}
                                            >
                                                Raise Ticket
                                            </Link>
                                        )}
                                        {(checkedNames.HelpDeskTenant.includes('Ticket_List') || sluge === "TENANT") && (
                                            <Link
                                                to="/admin/tenant_ticket_list"
                                                className={`nav-link ${location.pathname === '/admin/tenant_ticket_list' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/tenant_ticket_list' ? activeStyle : {}}
                                            >
                                                Ticket List
                                            </Link>
                                        )}
                                        {checkedNames.HelpDeskTenant.includes('Assigned_List') && (
                                            <Link
                                                to="/admin/tenant_assigned_list"
                                                className={`nav-link ${location.pathname === '/admin/tenant_assigned_list' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/tenant_assigned_list' ? activeStyle : {}}
                                            >
                                                Assigned List
                                            </Link>
                                        )}
                                    </nav>
                                </div>
                                <hr />
                            </>
                        )}





                        {/* --------------------------------------------------------------- */}


                        {/* {hasAccessToHRSupport() && checkedNames.HRSupport.length > 0 && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#HRSupport" aria-expanded="false" aria-controls="HRSupport">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faUserTie} /></div>
                                    HR Support
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="HRSupport" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.HRSupport.includes('Approval_List') && (
                                            <Link
                                                to="/admin/approvalrequest"
                                                className={`nav-link ${location.pathname === '/admin/approvalrequest' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/approvalrequest' ? activeStyle : {}}
                                            >Approvals List</Link>
                                        )}

                                        {checkedNames.HRSupport.includes('Template') && (
                                            <Link
                                                to="/admin/templates"
                                                className={`nav-link ${location.pathname === '/admin/templates' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/templates' ? activeStyle : {}}
                                            >Template</Link>
                                        )}

                                        {checkedNames.HRSupport.includes('Job_Opening') && (
                                            <Link
                                                to="/admin/Jobopening"
                                                className={`nav-link ${location.pathname === '/admin/Jobopening' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/Jobopening' ? activeStyle : {}}
                                            >Job Opening</Link>
                                        )}



                                    </nav>
                                </div>
                                <hr />
                            </>
                        )}



                        {hasAccessToTLApproval() && checkedNames.TLApproval.length > 0 && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#TLApproval" aria-expanded="false" aria-controls="TLApproval">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faUserGroup} /></div>
                                    TL Approval
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="TLApproval" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.TLApproval.includes('Leave_Approval') && (
                                            <Link
                                                to="/admin/tlapprovalrequest"
                                                className={`nav-link ${location.pathname === '/admin/tlapprovalrequest' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/tlapprovalrequest' ? activeStyle : {}}
                                            >Leave Approval</Link>
                                        )}

                                        {checkedNames.TLApproval.includes('OT_Approval') && (
                                            <Link
                                                to="/admin/tlovertimerequest"
                                                className={`nav-link ${location.pathname === '/admin/tlovertimerequest' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/tlovertimerequest' ? activeStyle : {}}
                                            >OT Approval</Link>
                                        )}


                                    </nav>
                                </div>
                                <hr />
                            </>
                        )} */}








                        {/* {hasAccessToEvents() && checkedNames.Events.length > 0 && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Events" aria-expanded="false" aria-controls="Events">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faCalendarDays} /></div>
                                    Events
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="Events" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.Events.includes('Add_Event') && (
                                            <Link
                                                to="/admin/addevent"
                                                className={`nav-link ${location.pathname === '/admin/addevent' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/addevent' ? activeStyle : {}}
                                            >Add Event</Link>
                                        )}

                                        {checkedNames.Events.includes('Event_List') && (
                                            <Link
                                                to="/admin/eventlist"
                                                className={`nav-link ${location.pathname === '/admin/eventlist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/eventlist' ? activeStyle : {}}
                                            >Event List</Link>
                                        )}

                                    </nav>
                                </div>
                                <hr />
                            </>
                        )}


                        {hasAccessToMeeting() && checkedNames.Meeting.length > 0 && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Meeting" aria-expanded="false" aria-controls="Meeting">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faUsersViewfinder} /></div>
                                    Meeting
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="Meeting" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.Meeting.includes('Add_Meeting') && (
                                            <Link
                                                to="/admin/addmeeting"
                                                className={`nav-link ${location.pathname === '/admin/addmeeting' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/addmeeting' ? activeStyle : {}}
                                            >Add Meeting</Link>
                                        )}

                                        {checkedNames.Meeting.includes('Meeting_List') && (
                                            <Link
                                                to="/admin/meetinglist"
                                                className={`nav-link ${location.pathname === '/admin/meetinglist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/meetinglist' ? activeStyle : {}}
                                            >Meeting List</Link>
                                        )}

                                    </nav>
                                </div>
                                <hr />
                            </>
                        )}


                        {hasAccessToTeamTask() && checkedNames.TeamTask.length > 0 && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#TeamTask" aria-expanded="false" aria-controls="TeamTask">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faListCheck} /></div>
                                    Team Task
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="TeamTask" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.TeamTask.includes('Add_Project') && (
                                            <Link
                                                to="/admin/addproject"
                                                className={`nav-link ${location.pathname === '/admin/addproject' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/addproject' ? activeStyle : {}}
                                            >Add Project</Link>
                                        )}

                                        {checkedNames.TeamTask.includes('Project_List') && (
                                            <Link
                                                to="/admin/projectlist"
                                                className={`nav-link ${location.pathname === '/admin/projectlist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/projectlist' ? activeStyle : {}}
                                            >Project List</Link>
                                        )}

                                        {checkedNames.TeamTask.includes('Add_task') && (
                                            <Link
                                                to="/admin/addtask"
                                                className={`nav-link ${location.pathname === '/admin/addtask' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/addtask' ? activeStyle : {}}
                                            >Add Task</Link>
                                        )}

                                        {checkedNames.TeamTask.includes('Task_List') && (

                                            <Link
                                                to="/admin/tasklist"
                                                className={`nav-link ${location.pathname === '/admin/tasklist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/tasklist' ? activeStyle : {}}
                                            >Task List</Link>
                                        )}

                                        {checkedNames.TeamTask.includes('Assigned_Task') && (
                                            <Link
                                                to="/admin/adminassignedtasklist"
                                                className={`nav-link ${location.pathname === '/admin/adminassignedtasklist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/adminassignedtasklist' ? activeStyle : {}}
                                            >Assigned Task</Link>
                                        )}

                                        {checkedNames.TeamTask.includes('TL_Assigned_Task') && (
                                            <Link
                                                to="/admin/tlassignedtasklist"
                                                className={`nav-link ${location.pathname === '/admin/tlassignedtasklist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/tlassignedtasklist' ? activeStyle : {}}
                                            >TL Assigned Task</Link>
                                        )}

                                    </nav>
                                </div>
                                <hr />
                            </>
                        )} */}










                        {hasAccessToHoliday() && checkedNames.Holiday.length > 0 && (
                            <>
                                {checkedNames.Holiday.includes('Holiday') && (
                                    <Link
                                        to="/admin/holiday"
                                        className={`nav-link ${location.pathname === '/admin/holiday' ? 'active' : ''}`}
                                        style={location.pathname === '/admin/holiday' ? activeStyle : {}}
                                    >
                                        <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                        Holiday
                                    </Link>
                                )}
                                <hr />
                            </>
                        )}






                        {hasAccessToLogs() && checkedNames.Logs.length > 0 && (
                            <>
                                <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Logs" aria-expanded="false" aria-controls="Logs">
                                    <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faMessage} /></div>
                                    Logs
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </Link>

                                <div className="collapse" id="Logs" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        {checkedNames.Logs.includes('Activity_Log') && (
                                            <Link
                                                to="/admin/activitylog"
                                                className={`nav-link ${location.pathname === '/admin/activitylog' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/activitylog' ? activeStyle : {}}
                                            >Activity Log</Link>
                                        )}

                                        {checkedNames.Logs.includes('Employee_ActivityLog') && (
                                            <Link
                                                to="/admin/employeeactivitylog"
                                                className={`nav-link ${location.pathname === '/admin/employeeactivitylog' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/employeeactivitylog' ? activeStyle : {}}
                                            >Employee Activity Log</Link>
                                        )}
                                    </nav>
                                </div>
                            </>
                        )}







                        {/* --------------------------------------------------------------- */}


                        {/* --------------------------------------------------------------- */}


                        {/* <>
                            <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#CustomerManagement" aria-expanded="false" aria-controls="CustomerManagement">
                                <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faUsers} /></div>
                                Customer Management
                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                            </Link>

                            <div className="collapse" id="CustomerManagement" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                <nav className="sb-sidenav-menu-nested nav">

                                    <>
                                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#Customer" aria-expanded="false" aria-controls="Customer">
                                            Customer
                                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </Link>
                                        <div className="collapse" id="Customer" aria-labelledby="headingThree" data-bs-parent="#TeamManagement">

                                            <Link
                                                to="/admin/customerenquirylist"
                                                className={`nav-link ${location.pathname === '/admin/customerenquirylist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/customerenquirylist' ? activeStyle : {}}
                                            >
                                                Customer Enquiry List
                                            </Link>

                                            <Link
                                                to="/admin/addcustomer"
                                                className={`nav-link ${location.pathname === '/admin/addcustomer' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/addcustomer' ? activeStyle : {}}
                                            >
                                                Add Customer
                                            </Link>
                                            <Link
                                                to="/admin/customerlist"
                                                className={`nav-link ${location.pathname === '/admin/customerlist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/customerlist' ? activeStyle : {}}
                                            >
                                                Customer List
                                            </Link>

                                        </div>
                                    </>



                                    <>
                                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#UserPlan" aria-expanded="false" aria-controls="UserPlan">
                                            User Plan
                                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </Link>
                                        <div className="collapse" id="UserPlan" aria-labelledby="headingThree" data-bs-parent="#TeamManagement">

                                            <Link
                                                to="/admin/trialplanList"
                                                className={`nav-link ${location.pathname === '/admin/trialplanList' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/trialplanList' ? activeStyle : {}}
                                            >
                                                Trial plan List
                                            </Link>


                                            <Link
                                                to="/admin/buynowplanlist"
                                                className={`nav-link ${location.pathname === '/admin/buynowplanlist' ? 'active' : ''}`}
                                                style={location.pathname === '/admin/buynowplanlist' ? activeStyle : {}}
                                            >
                                                Buy Now Plan List
                                            </Link>

                                        </div>
                                    </>





                                </nav>
                            </div>

                        </> */}

                        {/* --------------------------------------------------------------- */}







                    </div>
                </div>

            </nav >
        </>

    )
}

export default Sidebar