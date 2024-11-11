import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
// import Footer from './Footer'
import '../assets/admin/css/styles.css'
import '../assets/admin/js/scripts'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import { Route, Routes, } from 'react-router-dom';

import AddRole from '../pages/organization_structure/AddRole'
import UserDashboard from '../pages/dashboard/UserDashboard'
import AddShiftSlot from '../pages/leave_attendance_policy/AddShiftSlot'
import EditShiftSlot from '../pages/leave_attendance_policy/EditShiftSlot'
import RoleList from '../pages/organization_structure/RoleList'
import EditRole from '../pages/organization_structure/EditRole'

import AddEmpLevelcat from '../pages/organization_structure/AddEmpLevelcat'
import EditEmpLevelCat from '../pages/organization_structure/EditEmpLevelCat'
import AddDocumentType from '../pages/organization_structure/AddDocumentType'
import EditDocumentType from '../pages/organization_structure/EditDocumentType'
import AttendancePolicy from '../pages/leave_attendance_policy/AttendancePolicy'
import EditAttendancePolicy from '../pages/leave_attendance_policy/EditAttendancePolicy'
import { AddEmployee } from '../pages/employee/AddEmployee/AddEmployee'
import BasicDetails from '../pages/employee/AddEmployee/BasicDetails'
import EmployeeDetails from '../pages/employee/AddEmployee/EmployeeDetails'
import EmployeeRole from '../pages/employee/AddEmployee/EmployeeRole'
import BankDetails from '../pages/employee/AddEmployee/BankDetails'
import Documents from '../pages/employee/AddEmployee/Documents'
import EditAnnouncement from '../pages/dashboard/EditAnnouncement'
import AttendanceType from '../pages/leave_attendance_policy/AttendanceType'
import Attendancelocation from '../pages/leave_attendance_policy/Attendancelocation'
import Leavepolicytype from '../pages/leave_attendance_policy/Leavepolicytype'
import Leavepolicycategory from '../pages/leave_attendance_policy/Leavepolicycategory'
import EditAttendanceType from '../pages/leave_attendance_policy/EditAttendanceType'
import EditAttendancelocation from '../pages/leave_attendance_policy/EditAttendancelocation'
import EditLeavepolicytype from '../pages/leave_attendance_policy/EditLeavepolicytype'
import EditLeavepolicycategory from '../pages/leave_attendance_policy/EditLeavepolicycategory'
import AssignEmployeeShift from '../pages/leave_attendance_policy/AssignEmployeeShift'
import EditEmployeeShift from '../pages/leave_attendance_policy/EditEmployeeShift'
import Supervisorlist from '../pages/organization_structure/Supervisorlist'
import EditSupervisorlist from '../pages/organization_structure/EditSupervisorlist'
import LeavePolicy from '../pages/leave_attendance_policy/LeavePolicy'
import EditLeavepolicy from '../pages/leave_attendance_policy/EditLeavePolicy'
import EmployeeListCard from '../pages/employee/EmployeeListCard'
import EmployeeList from '../pages/employee/EmployeeList'
import ViewProfile from '../pages/employee/ViewProfile'
import { EditEmployee } from '../pages/employee/EditEmployee/EditEmployee'
import EmployeeConfirmation from '../pages/employee/EmployeeConfirmation'
import ApprovalRequest from '../pages/HRsupport/ApprovalRequest/ApprovalRequest'
import AttendanceRequest from '../pages/HRsupport/ApprovalRequest/AttendanceRequest'
import LeaveRequest from '../pages/HRsupport/ApprovalRequest/LeaveRequest'
import PermissionRequest from '../pages/HRsupport/ApprovalRequest/PermissionRequest'
import HalfDayRequest from '../pages/HRsupport/ApprovalRequest/HalfDayRequest'
import OverTimeRequest from '../pages/HRsupport/ApprovalRequest/OverTimeRequest'
import Templates from '../pages/HRsupport/Templates'
import EditTemplate from '../pages/HRsupport/EditTemplate'
import Jobopening from '../pages/HRsupport/Jobopening/Jobopening'
import Jobcard from '../pages/HRsupport/Jobopening/Jobcard'
import ViewJobcard from '../pages/HRsupport/Jobopening/ViewJobcard'
import EditJobopening from '../pages/HRsupport/Jobopening/EditJobopening'
import TLApprovalRequest from '../pages/TLApproval/TLApprovalRequest/TLApprovalRequest'
import TLPermissionRequest from '../pages/TLApproval/TLApprovalRequest/TLPermissionRequest'
import TLLeaveRequest from '../pages/TLApproval/TLApprovalRequest/TLLeaveRequest'
import TLHalfDayRequest from '../pages/TLApproval/TLApprovalRequest/TLHalfDayRequest'
import TLOverTimeRequest from '../pages/TLApproval/OTApproval/TLOverTimeRequest'
import Dashboard from '../pages/dashboard/Dashboard'
import DailyAttendance from '../pages/Attendance/DailyAttendance/DailyAttendance'
import AddVisitor from '../pages/VisitorManagement/AddVisitor'
import VisitorLogcard from '../pages/VisitorManagement/VisitorLog/VisitorLogcard'
import VisitorLog from '../pages/VisitorManagement/VisitorLog/VisitorLog'
import ActivityLog from '../pages/Logs/ActivityLog'
import EmployeeActivityLog from '../pages/Logs/EmployeeActivityLog'
import Holiday from '../pages/Holiday/Holiday'
import MonthlyList from '../pages/Attendance/MonthlyList/MonthlyList'
import IndividualMonthlyList from '../pages/Attendance/MonthlyList/IndividualMonthlyList'
import MonthlyAttendance from '../pages/Attendance/MonthlyAttendance/MonthlyAttendance'
import MonthlyAttendanceCalendar from '../pages/Attendance/MonthlyAttendanceCalendar/MonthlyAttendanceCalendar'
import MonthlyAttendanceCard from '../pages/Attendance/MonthlyAttendanceCalendar/MonthlyAttendanceCard'
import MonthlyAttendanceCount from '../pages/Attendance/MonthlyAttendanceCalendar/MonthlyAttendanceCount'
import MonthlyAttendanceCardEmployee from '../pages/Attendance/MonthlyAttendanceCalendar/MonthlyAttendanceCalendarEmployee'
import MonthlyAttendanceCalendarEmployee from '../pages/Attendance/MonthlyAttendanceCalendar/MonthlyAttendanceCalendarEmployee'
import AddEvent from '../pages/AddEvent/AddEvent'
import EventList from '../pages/AddEvent/EventList'
import EditEvent from '../pages/AddEvent/EditEvent'
import AddMeeting from '../pages/AddMeeting/AddMeeting'
import MeetingList from '../pages/AddMeeting/MeetingList'
import EditMeeting from '../pages/AddMeeting/EditMeeting'
import AssetsType from '../pages/Assets/AssetsType/AssetsType'
import EditAssetsType from '../pages/Assets/AssetsType/EditAssetsType'
import AssignAssets from '../pages/Assets/AssignAssets/AssignAssets'
import AssetsList from '../pages/Assets/AssignAssets/AssetsList'
import EditAssets from '../pages/Assets/AssignAssets/EditAssets'
import IssueType from '../pages/HelpDesk/IssueType/IssueType'
import EditIssueType from '../pages/HelpDesk/IssueType/EditIssueType'
import RaiseTicket from '../pages/HelpDesk/RaiseTicket/RaiseTicket'
import TicketsList from '../pages/HelpDesk/TicketsList/TicketsList'
import AssignedList from '../pages/HelpDesk/AssignedList/AssignedList'
import EditRaiseTicket from '../pages/HelpDesk/RaiseTicket/EditRaiseTicket'
import EditAssignedList from '../pages/HelpDesk/AssignedList/EditAssignedList'
import UserRaiseTicket from '../pages/HelpDesk/RaiseTicket/UserRaiseTicket'
import OrganizationChart from '../pages/organization_structure/OrganizationChart'
import OrgChart from '../pages/organization_structure/OrgChart'
import AddProject from '../pages/TeamTask/AddProject/AddProject'
import ProjectList from '../pages/TeamTask/AddProject/ProjectList'
import EditProjectList from '../pages/TeamTask/AddProject/EditProjectList'
import AddTask from '../pages/TeamTask/AddTask/AddTask'
import TaskList from '../pages/TeamTask/AddTask/TaskList'
import EditTaskList from '../pages/TeamTask/AddTask/EditTaskList'
import AdminAssignedTaskList from '../pages/TeamTask/AssignedTaskList/AdminAssignedTaskList'
import EditAdminAssignedTaskList from '../pages/TeamTask/AssignedTaskList/EditAdminAssignedTaskList'
import TLAssignedTaskList from '../pages/TeamTask/AssignedTaskList/TLAssignedTaskList'
import EditTLAssignedTaskList from '../pages/TeamTask/AssignedTaskList/EditTLAssignedTaskList'
import OverTimeCalculationList from '../pages/Payroll/OverTimeCalculation/OverTimeCalculationList'
import PayslipList from '../pages/Payroll/PayslipList/PayslipList'
import Payslip from '../pages/Payroll/PayslipList/Payslip'
import Payslippdfview from '../pages/Payroll/PayslipList/Payslippdfview'
import GeneratePayslip from '../pages/Payroll/GeneratePayslip/GeneratePayslip'
import AssignEmployeeSalary from '../pages/Payroll/AssignEmployeeSalary/AssignEmployeeSalary'
import AssignEmployeeSalaryList from '../pages/Payroll/AssignEmployeeSalary/AssignEmployeeSalaryList'
import EditEmployeeSalary from '../pages/Payroll/AssignEmployeeSalary/EditEmployeeSalary'
import SalaryCalculation from '../pages/Payroll/SalaryCalculation/SalaryCalculation'
import SalaryCalculationList from '../pages/Payroll/SalaryCalculation/SalaryCalculationList'
import DashboardViewEmpDetails from '../pages/dashboard/Redirectedpage/DashboardViewEmpDetails'
import MissedCount from '../pages/dashboard/Redirectedpage/MissedCount'
import DashboardVisitors from '../pages/dashboard/Redirectedpage/DashboardVisitors'
import AuthRoute from '../AuthRoute'
import OvertimeType from '../pages/leave_attendance_policy/OverTimeType'
import EditOverTimeType from '../pages/leave_attendance_policy/EditOverTimeType'
import PostJob from '../pages/Recruitment/PostJob/PostJob'
import ListJob from '../pages/Recruitment/ListJob/ListJob'
import EditJob from '../pages/Recruitment/PostJob/EditJob'
import ViewJob from '../pages/Recruitment/ListJob/ViewJob'
import ResumeForm from '../pages/Recruitment/PostResume/PostResume'
import CandidateStatus from '../pages/Recruitment/CandidateStatus/CandidateStatus'
import ResumeScreening from '../pages/Recruitment/ResumeScreening/ResumeScreening'
import ViewDetails from '../pages/Recruitment/ViewDetails/ViewDetails'
import EditResume from '../pages/Recruitment/PostResume/EditResume'
import SearchResume from '../pages/Recruitment/SearchResume/SearchResume'
import RelievingLetter from '../pages/Template/RelievingLetter/RelievingLetter'
import RelievingLetterList from '../pages/Template/RelievingLetter/RelievingLetterList'
import AppointmentLetter from '../pages/Template/AppointmentLetter/AppointmentLetter'
import OfferLetter from '../pages/Template/OfferLetter/OfferLetter'
import OfferLetterList from '../pages/Template/OfferLetter/OfferLetterList'
import EditOfferLetter from '../pages/Template/OfferLetter/EditOfferLetter.jsx'
import OfferLetterView from '../pages/Template/OfferLetter/OfferLetterView.jsx'
import EditRelievingLetter from '../pages/Template/RelievingLetter/EditRelievingLetter'
import RelievingLetterview from '../pages/Template/RelievingLetter/RelievingLetterView'
import AppointmentLetterList from '../pages/Template/AppointmentLetter/AppointmentLetterList'
import EditAppointmentLetter from '../pages/Template/AppointmentLetter/EditAppointmentLetter'
import AppointmentLetterView from '../pages/Template/AppointmentLetter/AppointmentLetterView'
import LeadEnquiryList from '../pages/SalesManagement/Lead/LeadEnquiryList'
import LeadList from '../pages/SalesManagement/Lead/LeadList'
import AddLead from '../pages/SalesManagement/Lead/AddLead'
import ViewLeadList from '../pages/SalesManagement/Lead/ViewLeadList'

import PreSalesLeadList from '../pages/SalesManagement/Presales/PreSalesLeadList'
import ViewPreSalesLeadList from '../pages/SalesManagement/Presales/ViewPreSalesLeadList'
import PresalesLeadEnquiryList from '../pages/SalesManagement/Presales/PresalesLeadEnquiryList'
import PresalesAddLead from '../pages/SalesManagement/Presales/PresalesAddLead'
import EditLead from '../pages/SalesManagement/Presales/EditLead'


import SalesLeadList from '../pages/SalesManagement/Sales/SalesLeadList'
import SalesEditLead from '../pages/SalesManagement/Sales/SalesEditLead'

import AddGoodsServices from '../pages/Accounts/Goodservices/AddGoodsServices'
import EditGoodsServices from '../pages/Accounts/Goodservices/EditGoodsServices'
import AddCompany from '../pages/Accounts/Companyinformation/AddCompany'
import CompanyList from '../pages/Accounts/Companyinformation/CompanyList'
import EditCompany from '../pages/Accounts/Companyinformation/EditCompany'
import SalesInvoice from '../pages/Accounts/SalesInvoice/SalesInvoice'
import SalesInvoiceList from '../pages/Accounts/SalesInvoice/SalesInvoiceList'
import EditSalesInvoice from '../pages/Accounts/SalesInvoice/EditSalesInvoice'
import SalesInvoiceView from '../pages/Accounts/SalesInvoice/SalesInvoiceView'
import AddDailyAccounts from '../pages/Accounts/Dailyaccounts/AddDailyAccounts'
import EditDailyAccounts from '../pages/Accounts/Dailyaccounts/EditDailyAccounts'
import AddPurchaseInvoice from '../pages/Accounts/PurchaseInvoice/AddPurchaseInvoice'
import PurchaseInvoiceList from '../pages/Accounts/PurchaseInvoice/PurchaseInvoiceList'
import EditPurchaseInvoice from '../pages/Accounts/PurchaseInvoice/EditPurchaseInvoice'
import ViewSalesLeadList from '../pages/SalesManagement/Sales/ViewSalesLeadList'
import CustomerEnquiryList from '../pages/CustomerManagement/Customer/CustomerEnquiryList'
import EditCustomerEnquiryList from '../pages/CustomerManagement/Customer/EditCustomerEnquiryList'
import CustomerList from '../pages/CustomerManagement/Customer/CustomerList'
import AddCustomer from '../pages/CustomerManagement/Customer/AddCustomer'
import AddCustomerOTP from '../pages/CustomerManagement/Customer/AddCustomerOTP'
import TrialPlanList from '../pages/CustomerManagement/UserPlan/TrialPlanList'
import BuynowplanList from '../pages/CustomerManagement/UserPlan/BuynowplanList'
import TrialPackList from '../pages/SalesManagement/Presales/TrialPackList'
import SalesTrialPackList from '../pages/SalesManagement/Sales/TrialPackList'
import OnlineTrialPackList from '../pages/SalesManagement/OnlineCustomer/OnlineTrialPackList'
import BuyPackList from '../pages/SalesManagement/OnlineCustomer/BuyPackList'
import PresalesBuyPackList from '../pages/SalesManagement/Presales/PresalesBuyPackList'
import SalesBuyPackList from '../pages/SalesManagement/Sales/SalesBuyPackList'
import ProformaInvoiceList from '../pages/Accounts/SalesInvoice/ProformaInvoiceList'
import ProductInvoiceList from '../pages/Accounts/SalesInvoice/ProductInvoiceList'
import EditProformaInvoiceList from '../pages/Accounts/SalesInvoice/EditProformaInvoiceList'
import ProformaInvoiceView from '../pages/Accounts/SalesInvoice/ProformaInvoiceView'
import ProductInvoiceView from '../pages/Accounts/SalesInvoice/ProductInvoiceView'
import EditPresalesBuyPackList from '../pages/SalesManagement/Presales/EditPresalesBuyPackList'
import EditSalesBuyPackList from '../pages/SalesManagement/Sales/EditSalesBuyPackList'
import SalesBuyPackView from '../pages/SalesManagement/Sales/SalesBuyPackView'
import PresalesBuyPackView from '../pages/SalesManagement/Presales/PresalesBuyPackView'
import MarketSurvey from '../pages/SalesManagement/Lead/MarketSurvey'
import ManageProjects from '../pages/TeamTaskManagement/ManageProjects/ManageProjects'
import ProjectsList from '../pages/TeamTaskManagement/ProjectsList/ProjectsList'
import AttendanceDashboardPowerBIReport from '../pages/Attendance/AttendanceDashboard/AttendanceDashboard'
// import VerticalOrgChart from '../pages/TeamTaskManagement/ManageProjects/VerticalOrgChart'
import DepartmentList from '../pages/organization_structure/DepartmentList'
import EditDepartmentList from '../pages/organization_structure/EditDepartmentList'

import Head_footer_layout from '../pages/Template/Head_footer.jsx'
import Headerfooterview from '../pages/Template/Headerfooterview.jsx'
import Headerfooteredit from '../pages/Template/Headerfooteredit.jsx'
import VerticalOrgChart from '../pages/organization_structure/VerticalOrgChart'
import EmployeeDashboardPowerBIReport from '../pages/employee/EmployeeDashboard/EmployeeDashboard'
import MainDashboard from '../pages/dashboard/MainDashboard/MainDashboard'

// For Tenant
import Add_Tenant from '../pages/HelpDeskTenant/AddTenant.jsx';
import TenantList from '../pages/HelpDeskTenant/TenantListView.jsx';
import EditTenant from '../pages/HelpDeskTenant/EditTenant.jsx';

import Tenant_raise_ticket from '../pages/HelpDeskTenant/RaiseTicket/Tenant_raise_ticket.jsx';
import Tenant_ticket_list from '../pages/HelpDeskTenant/RaiseTicket/TenantTicketList.jsx';
import TenantEditTicketList from '../pages/HelpDeskTenant/RaiseTicket/TenantEditTicketList.jsx';
import TenantAssignedList from '../pages/HelpDeskTenant/RaiseTicket/TenantAssignedList.jsx';




function MasterLayout() {
    return (
        <div className='sb-nav-fixed'>
            <Navbar />

            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <Sidebar />
                </div>

                <div id="layoutSidenav_content">
                    <main>
                        <Routes>
                            <Route path="/" element={<AuthRoute><Dashboard /></AuthRoute>} />
                            <Route path="/admindashboard" element={<AuthRoute><AdminDashboard /></AuthRoute>} />
                            <Route path="/userdashboard" element={<AuthRoute><UserDashboard /></AuthRoute>} />
                            <Route path="/maindashboard" element={<AuthRoute><MainDashboard /></AuthRoute>} />


                            <Route path="/addrole" element={<AuthRoute><AddRole /></AuthRoute>} />
                            <Route path="/addshiftslot" element={<AuthRoute><AddShiftSlot /></AuthRoute>} />
                            <Route path="/editshiftslot/:id" element={<AuthRoute><EditShiftSlot /></AuthRoute>} />

                            <Route path="/rolelist" element={<AuthRoute><RoleList /></AuthRoute>} />
                            <Route path="/editrole/:id" element={<AuthRoute><EditRole /></AuthRoute>} />


                            <Route path="/addemplevelcategory" element={<AuthRoute><AddEmpLevelcat /></AuthRoute>} />
                            <Route path="/editemplevelcategory/:id" element={<AuthRoute><EditEmpLevelCat /></AuthRoute>} />
                            <Route path="/adddocumenttype" element={<AuthRoute><AddDocumentType /></AuthRoute>} />
                            <Route path="/editdocumenttype/:id" element={<AuthRoute><EditDocumentType /></AuthRoute>} />
                            <Route path="/addattendancepolicy" element={<AuthRoute><AttendancePolicy /></AuthRoute>} />
                            <Route path="/editattendancepolicy/:id" element={<AuthRoute><EditAttendancePolicy /></AuthRoute>} />
                            <Route path="/addemployee" element={<AuthRoute><AddEmployee /></AuthRoute>} />
                            <Route path="/basicdetails" element={<AuthRoute><BasicDetails /></AuthRoute>} />
                            <Route path="/employeedetails" element={<AuthRoute><EmployeeDetails /></AuthRoute>} />
                            <Route path="/employeerole" element={<AuthRoute><EmployeeRole /></AuthRoute>} />
                            <Route path="/bankdetails" element={<AuthRoute><BankDetails /></AuthRoute>} />
                            <Route path="/documents" element={<AuthRoute><Documents /></AuthRoute>} />
                            <Route path="/editannouncement" element={<AuthRoute><EditAnnouncement /></AuthRoute>} />


                            <Route path="/assignemployeeshift" element={<AuthRoute><AssignEmployeeShift /></AuthRoute>} />
                            <Route path="/attendancetype" element={<AuthRoute><AttendanceType /></AuthRoute>} />
                            <Route path="/attendancelocation" element={<AuthRoute><Attendancelocation /></AuthRoute>} />
                            <Route path="/leavepolicytype" element={<AuthRoute><Leavepolicytype /></AuthRoute>} />
                            <Route path="/overtimetype" element={<AuthRoute><OvertimeType /></AuthRoute>} />
                            <Route path="/editovertimeType/:id" element={<AuthRoute><EditOverTimeType /></AuthRoute>} />
                            <Route path="/leavepolicycategory" element={<AuthRoute><Leavepolicycategory /></AuthRoute>} />


                            <Route path="/editattendancetype/:id" element={<AuthRoute><EditAttendanceType /></AuthRoute>} />
                            <Route path="/editattendancelocation/:id" element={<AuthRoute><EditAttendancelocation /></AuthRoute>} />
                            <Route path="/editleavepolicytype/:id" element={<AuthRoute><EditLeavepolicytype /></AuthRoute>} />
                            <Route path="/editLeavepolicycategory/:id" element={<AuthRoute><EditLeavepolicycategory /></AuthRoute>} />
                            <Route path="/editemployeeshift/:id" element={<AuthRoute><EditEmployeeShift /></AuthRoute>} />


                            <Route path="/supervisorlist" element={<AuthRoute><Supervisorlist /></AuthRoute>} />
                            <Route path="/editsupervisorlist/:id" element={<AuthRoute><EditSupervisorlist /></AuthRoute>} />

                            <Route path="/leavepolicy" element={<AuthRoute><LeavePolicy /></AuthRoute>} />
                            <Route path="/editleavepolicy/:id" element={<AuthRoute><EditLeavepolicy /></AuthRoute>} />


                            <Route path="/employeelistcard" element={<AuthRoute><EmployeeListCard /></AuthRoute>} />

                            <Route path="/employeelist" element={<AuthRoute><EmployeeList /></AuthRoute>} />

                            <Route path="/viewprofile/:id" element={<AuthRoute><ViewProfile /></AuthRoute>} />




                            <Route path="/editemployee/:id" element={<AuthRoute><EditEmployee /></AuthRoute>} />

                            <Route path="/employeeconfirmation" element={<AuthRoute><EmployeeConfirmation /></AuthRoute>} />

                            <Route path="/approvalrequest" element={<AuthRoute><ApprovalRequest /></AuthRoute>} />
                            <Route path="/attendancerequest" element={<AuthRoute><AttendanceRequest /></AuthRoute>} />
                            <Route path="/leaverequest" element={<AuthRoute><LeaveRequest /></AuthRoute>} />
                            <Route path="/permissionrequest" element={<AuthRoute><PermissionRequest /></AuthRoute>} />
                            <Route path="/halfdayrequest" element={<AuthRoute><HalfDayRequest /></AuthRoute>} />
                            <Route path="/overtimerequest" element={<AuthRoute><OverTimeRequest /></AuthRoute>} />


                            <Route path="/templates" element={<AuthRoute><Templates /></AuthRoute>} />
                            <Route path="/edittemplate/:id" element={<AuthRoute><EditTemplate /></AuthRoute>} />


                            <Route path="/jobopening" element={<AuthRoute><Jobopening /></AuthRoute>} />
                            <Route path="/jobcard" element={<AuthRoute><Jobcard /></AuthRoute>} />
                            <Route path="/viewjobcard/:id" element={<AuthRoute><ViewJobcard /></AuthRoute>} />
                            <Route path="/editjobopening/:id" element={<AuthRoute><EditJobopening /></AuthRoute>} />


                            <Route path="/tlapprovalrequest" element={<AuthRoute><TLApprovalRequest /></AuthRoute>} />

                            <Route path="/tlleaverequest" element={<AuthRoute><TLLeaveRequest /></AuthRoute>} />
                            <Route path="/tlpermissionrequest" element={<AuthRoute><TLPermissionRequest /></AuthRoute>} />
                            <Route path="/tlhalfdayrequest" element={<AuthRoute><TLHalfDayRequest /></AuthRoute>} />
                            <Route path="/tlovertimerequest" element={<AuthRoute><TLOverTimeRequest /></AuthRoute>} />

                            <Route path="/dailyattendance" element={<AuthRoute><DailyAttendance /></AuthRoute>} />


                            <Route path="/addvisitor" element={<AuthRoute><AddVisitor /></AuthRoute>} />
                            <Route path="/visitorlog" element={<AuthRoute><VisitorLog /></AuthRoute>} />
                            <Route path="/visitorlogcard" element={<AuthRoute><VisitorLogcard /></AuthRoute>} />

                            <Route path="/activitylog" element={<AuthRoute><ActivityLog /></AuthRoute>} />
                            <Route path="/employeeactivitylog" element={<AuthRoute><EmployeeActivityLog /></AuthRoute>} />

                            <Route path="/holiday" element={<AuthRoute><Holiday /></AuthRoute>} />

                            <Route path="/monthlylist" element={<AuthRoute><MonthlyList /></AuthRoute>} />
                            <Route path="/individualmonthlylist/:id" element={<AuthRoute><IndividualMonthlyList /></AuthRoute>} />

                            <Route path="/monthlyattendance" element={<AuthRoute><MonthlyAttendance /></AuthRoute>} />



                            <Route path="/monthlyattendancecalendar/:id" element={<AuthRoute><MonthlyAttendanceCalendar /></AuthRoute>} />
                            <Route path="/monthlyattendancecalendaremployee" element={<AuthRoute><MonthlyAttendanceCalendarEmployee /></AuthRoute>} />
                            <Route path="/monthlyattendancecount" element={<AuthRoute><MonthlyAttendanceCount /></AuthRoute>} />
                            <Route path="/monthlyattendancecard" element={<AuthRoute><MonthlyAttendanceCard /></AuthRoute>} />


                            <Route path="/addevent" element={<AuthRoute><AddEvent /></AuthRoute>} />
                            <Route path="/eventlist" element={<AuthRoute><EventList /></AuthRoute>} />
                            <Route path="/editevent/:id" element={<AuthRoute><EditEvent /></AuthRoute>} />


                            <Route path="/addmeeting" element={<AuthRoute><AddMeeting /></AuthRoute>} />
                            <Route path="/meetinglist" element={<AuthRoute><MeetingList /></AuthRoute>} />
                            <Route path="/editmeeting/:id" element={<AuthRoute><EditMeeting /></AuthRoute>} />


                            <Route path="/assetstype" element={<AuthRoute><AssetsType /></AuthRoute>} />
                            <Route path="/editassetstype/:id" element={<AuthRoute><EditAssetsType /></AuthRoute>} />
                            <Route path="/assignassets" element={<AuthRoute><AssignAssets /></AuthRoute>} />
                            <Route path="/assetslist" element={<AuthRoute><AssetsList /></AuthRoute>} />
                            <Route path="/editassets/:id" element={<AuthRoute><EditAssets /></AuthRoute>} />


                            <Route path="/issuetype" element={<AuthRoute><IssueType /></AuthRoute>} />
                            <Route path="/editissuetype/:id" element={<AuthRoute><EditIssueType /></AuthRoute>} />

                            <Route path="/raiseticket" element={<AuthRoute><RaiseTicket /></AuthRoute>} />
                            <Route path="/ticketslist" element={<AuthRoute><TicketsList /></AuthRoute>} />
                            <Route path="/assignedlist" element={<AuthRoute><AssignedList /></AuthRoute>} />
                            <Route path="/editraiseticket/:id" element={<AuthRoute><EditRaiseTicket /></AuthRoute>} />
                            <Route path="/editassignedlist/:id" element={<AuthRoute><EditAssignedList /></AuthRoute>} />
                            <Route path="/editassignedlist/:id" element={<AuthRoute><EditAssignedList /></AuthRoute>} />
                            <Route path="/userraiseticket" element={<AuthRoute><UserRaiseTicket /></AuthRoute>} />

                            <Route path="/organizationchart" element={<AuthRoute><OrganizationChart /></AuthRoute>} />
                            <Route path="/orgchart" element={<AuthRoute><OrgChart /></AuthRoute>} />


                            <Route path="/addproject" element={<AuthRoute><AddProject /></AuthRoute>} />
                            <Route path="/projectlist" element={<AuthRoute><ProjectList /></AuthRoute>} />
                            <Route path="/editprojectlist/:id" element={<AuthRoute><EditProjectList /></AuthRoute>} />


                            <Route path="/addtask" element={<AuthRoute><AddTask /></AuthRoute>} />
                            <Route path="/tasklist" element={<AuthRoute><TaskList /></AuthRoute>} />
                            <Route path="/edittasklist/:id" element={<AuthRoute><EditTaskList /></AuthRoute>} />


                            <Route path="/adminassignedtasklist" element={<AuthRoute><AdminAssignedTaskList /></AuthRoute>} />

                            <Route path="/editadminassignedtasklist/:id" element={<AuthRoute><EditAdminAssignedTaskList /></AuthRoute>} />

                            <Route path="/tlassignedtasklist" element={<AuthRoute><TLAssignedTaskList /></AuthRoute>} />
                            <Route path="/edittlassignedtasklist/:id" element={<AuthRoute><EditTLAssignedTaskList /></AuthRoute>} />


                            <Route path="/overtimecalculationlist" element={<AuthRoute><OverTimeCalculationList /></AuthRoute>} />

                            <Route path="/paysliplist" element={<AuthRoute><PayslipList /></AuthRoute>} />
                            <Route path="/Payslip/:id" element={<AuthRoute><Payslip /></AuthRoute>} />
                            <Route path="/payslippdfview/:id" element={<AuthRoute><Payslippdfview /></AuthRoute>} />


                            <Route path="/generatepayslip" element={<AuthRoute><GeneratePayslip /></AuthRoute>} />
                            <Route path="/assignemployeesalary" element={<AuthRoute><AssignEmployeeSalary /></AuthRoute>} />
                            <Route path="/assignemployeesalarylist" element={<AuthRoute><AssignEmployeeSalaryList /></AuthRoute>} />


                            <Route path="/editemployeesalary/:id" element={<AuthRoute><EditEmployeeSalary /></AuthRoute>} />
                            <Route path="/salarycalculation" element={<AuthRoute><SalaryCalculation /></AuthRoute>} />

                            <Route path="/salarycalculationlist" element={<AuthRoute><SalaryCalculationList /></AuthRoute>} />

                            <Route path="/dashboardviewempdetails/:aId" element={<AuthRoute><DashboardViewEmpDetails /></AuthRoute>} />

                            <Route path="/missedcount" element={<AuthRoute><MissedCount /></AuthRoute>} />
                            <Route path="/dashboardvisitors" element={<AuthRoute><DashboardVisitors /></AuthRoute>} />



                            <Route path="/postjob" element={<AuthRoute><PostJob /></AuthRoute>} />
                            <Route path="/listjob" element={<AuthRoute><ListJob /></AuthRoute>} />
                            <Route path="/editjob/:id" element={<AuthRoute><EditJob /></AuthRoute>} />
                            <Route path="/viewjob/:id" element={<AuthRoute><ViewJob /></AuthRoute>} />
                            <Route path="/addresume" element={<AuthRoute><ResumeForm /></AuthRoute>} />

                            <Route path="/candidatestatus" element={<AuthRoute><CandidateStatus /></AuthRoute>} />
                            <Route path="/resumescreening" element={<AuthRoute><ResumeScreening /></AuthRoute>} />
                            <Route path="/viewdetails/:id" element={<AuthRoute><ViewDetails /></AuthRoute>} />
                            <Route path="/editResume/:id" element={<AuthRoute><EditResume /></AuthRoute>} />
                            <Route path="/searchresume" element={<AuthRoute><SearchResume /></AuthRoute>} />



                            <Route path="/relievingletter" element={<AuthRoute><RelievingLetter /></AuthRoute>} />
                            <Route path="/editrelievingletter/:id" element={<AuthRoute><EditRelievingLetter /></AuthRoute>} />
                            <Route path="/relievingletterList" element={<AuthRoute><RelievingLetterList /></AuthRoute>} />

                            <Route path="/appointmentletter" element={<AuthRoute><AppointmentLetter /></AuthRoute>} />
                            <Route path="/editappointmentletter/:id" element={<AuthRoute><EditAppointmentLetter /></AuthRoute>} />
                            <Route path="/appointmentletterlist" element={<AuthRoute><AppointmentLetterList /></AuthRoute>} />
                            <Route path="/appointmentletterview/:id/:layout_id" element={<AuthRoute><AppointmentLetterView /></AuthRoute>} />
                            <Route path="/offerletter" element={<AuthRoute><OfferLetter /></AuthRoute>} />
                            <Route path="/offerletterList" element={<AuthRoute><OfferLetterList /></AuthRoute>} />
                            <Route path="/editofferletter/:id" element={<AuthRoute><EditOfferLetter /></AuthRoute>} />
                            <Route path="/offerletterview/:id/:layout_id" element={<AuthRoute><OfferLetterView /></AuthRoute>} />

                            <Route path="/relievingletterview/:id/:layout_id" element={<AuthRoute><RelievingLetterview /></AuthRoute>} />

                            {/* New route for head_foot layout */}
                            <Route path="/headFooter" element={<AuthRoute><Head_footer_layout /></AuthRoute>} />
                            <Route path="/headerfooterview/:id" element={<AuthRoute><Headerfooterview /></AuthRoute>} />
                            <Route path="/Headerfooteredit/:id" element={<AuthRoute><Headerfooteredit /></AuthRoute>} />

                            {/* --------------------------------------------------------------------------------- */}
                            <Route path="/leadenquirylist" element={<AuthRoute><LeadEnquiryList /></AuthRoute>} />
                            <Route path="/addlead" element={<AuthRoute><AddLead /></AuthRoute>} />
                            <Route path="/marketsurvey" element={<AuthRoute><MarketSurvey /></AuthRoute>} />
                            <Route path="/leadlist" element={<AuthRoute><LeadList /></AuthRoute>} />
                            <Route path="/viewleadlist/:id" element={<AuthRoute><ViewLeadList /></AuthRoute>} />

                            <Route path="/presalesenquirylist" element={<AuthRoute><PresalesLeadEnquiryList /></AuthRoute>} />
                            <Route path="/trialpacklist" element={<AuthRoute><TrialPackList /></AuthRoute>} />
                            <Route path="/presalesbuypacklist" element={<AuthRoute><PresalesBuyPackList /></AuthRoute>} />
                            <Route path="/editpresalesbuypackList/:id" element={<AuthRoute><EditPresalesBuyPackList /></AuthRoute>} />
                            <Route path="/presalesbuypackview/:id" element={<AuthRoute><PresalesBuyPackView /></AuthRoute>} />
                            <Route path="/presalesleadlist" element={<AuthRoute><PreSalesLeadList /></AuthRoute>} />
                            <Route path="/viewpresalesleadlist/:id" element={<AuthRoute><ViewPreSalesLeadList /></AuthRoute>} />
                            <Route path="/editlead/:id" element={<AuthRoute><EditLead /></AuthRoute>} />
                            <Route path="/presalesaddlead" element={<AuthRoute><PresalesAddLead /></AuthRoute>} />


                            <Route path="/salesleadlist" element={<AuthRoute><SalesLeadList /></AuthRoute>} />
                            <Route path="/salestrialpacklist" element={<AuthRoute><SalesTrialPackList /></AuthRoute>} />
                            <Route path="/salesbuypacklist" element={<AuthRoute><SalesBuyPackList /></AuthRoute>} />
                            <Route path="/editsalesbuypackList/:id" element={<AuthRoute><EditSalesBuyPackList /></AuthRoute>} />
                            <Route path="/salesbuypackview/:id" element={<AuthRoute><SalesBuyPackView /></AuthRoute>} />

                            <Route path="/saleseditlead/:id" element={<AuthRoute><SalesEditLead /></AuthRoute>} />

                            <Route path="/onlinetrialpacklist" element={<AuthRoute><OnlineTrialPackList /></AuthRoute>} />
                            <Route path="/buypacklist" element={<AuthRoute><BuyPackList /></AuthRoute>} />
                            {/* -----------------------------.---------------------------------------------------- */}
                            <Route path="/addgoodsservices/" element={<AuthRoute><AddGoodsServices /></AuthRoute>} />
                            <Route path="/editgoodsservices/:id" element={<AuthRoute><EditGoodsServices /></AuthRoute>} />
                            <Route path="/addcompany/" element={<AuthRoute><AddCompany /></AuthRoute>} />
                            <Route path="/companyList/" element={<AuthRoute><CompanyList /></AuthRoute>} />
                            <Route path="/editcompanylist/:id" element={<AuthRoute><EditCompany /></AuthRoute>} />
                            <Route path="/salesinvoice" element={<AuthRoute><SalesInvoice /></AuthRoute>} />
                            <Route path="/salesinvoicelist" element={<AuthRoute><SalesInvoiceList /></AuthRoute>} />
                            <Route path="/proformainvoicelist" element={<AuthRoute><ProformaInvoiceList /></AuthRoute>} />
                            <Route path="/editproformainvoicelist/:id" element={<AuthRoute><EditProformaInvoiceList /></AuthRoute>} />
                            <Route path="/productinvoicelist" element={<AuthRoute><ProductInvoiceList /></AuthRoute>} />
                            <Route path="/editsalesinvoice/:id" element={<AuthRoute><EditSalesInvoice /></AuthRoute>} />
                            <Route path="/salesinvoiceview/:id" element={<AuthRoute><SalesInvoiceView /></AuthRoute>} />
                            <Route path="/proformainvoiceview/:id" element={<AuthRoute><ProformaInvoiceView /></AuthRoute>} />
                            <Route path="/productinvoiceview/:id" element={<AuthRoute><ProductInvoiceView /></AuthRoute>} />


                            <Route path="/adddailyaccounts/" element={<AuthRoute><AddDailyAccounts /></AuthRoute>} />
                            <Route path="/editdailyaccounts/:id" element={<AuthRoute><EditDailyAccounts /></AuthRoute>} />
                            <Route path="/viewsalesleadlist/:id" element={<AuthRoute><ViewSalesLeadList /></AuthRoute>} />

                            {/* --------------------------------------------------------------------------------------------------- */}
                            <Route path="/addpurchaseinvoice" element={<AuthRoute><AddPurchaseInvoice /></AuthRoute>} />
                            <Route path="/purchaseinvoicelist" element={<AuthRoute><PurchaseInvoiceList /></AuthRoute>} />
                            <Route path="/editpurchaseinvoice/:id" element={<AuthRoute><EditPurchaseInvoice /></AuthRoute>} />





                            <Route path="/customerenquirylist" element={<AuthRoute><CustomerEnquiryList /></AuthRoute>} />
                            <Route path="/editcustomerenquirylist/:id" element={<AuthRoute><EditCustomerEnquiryList /></AuthRoute>} />

                            <Route path="/customerlist" element={<AuthRoute><CustomerList /></AuthRoute>} />
                            <Route path="/addcustomer" element={<AuthRoute><AddCustomer /></AuthRoute>} />
                            <Route path="/addcustomerotp" element={<AuthRoute><AddCustomerOTP /></AuthRoute>} />


                            <Route path="/trialplanList" element={<AuthRoute><TrialPlanList /></AuthRoute>} />
                            <Route path="/buynowplanlist" element={<AuthRoute><BuynowplanList /></AuthRoute>} />

                            {/* --------------------------------------------------------------------------------------------------- */}

                            <Route path="/manageprojects" element={<AuthRoute><ManageProjects /></AuthRoute>} />
                            <Route path="/projectslist" element={<AuthRoute><ProjectsList /></AuthRoute>} />

                            {/* --------------------------------------------------------------------------------------------------- */}

                            <Route path="/attendancedashboard" element={<AuthRoute><AttendanceDashboardPowerBIReport /></AuthRoute>} />
                            <Route path="/employeedashboard" element={<AuthRoute><EmployeeDashboardPowerBIReport /></AuthRoute>} />
                            <Route path="/verticalorgchart" element={<AuthRoute><VerticalOrgChart /></AuthRoute>} />


                            <Route path="/department" element={<AuthRoute><DepartmentList /></AuthRoute>} />
                            <Route path="/editdepartment/:id" element={<AuthRoute><EditDepartmentList /></AuthRoute>} />

                            {/* Tenant Help Desk */}

                            <Route path="/add_tenant" element={<AuthRoute><Add_Tenant /></AuthRoute>} />
                            <Route path="/list_tenant" element={<AuthRoute><TenantList /></AuthRoute>} />
                            <Route path="/edit_tenant/:id" element={<AuthRoute><EditTenant /></AuthRoute>} />

                            <Route path="/raise_ticket_tenant" element={<AuthRoute><Tenant_raise_ticket /></AuthRoute>} />
                            <Route path="/tenant_ticket_list" element={<AuthRoute><Tenant_ticket_list /></AuthRoute>} />
                            <Route path="/tenant_edit_ticket_list/:id" element={<AuthRoute><TenantEditTicketList /></AuthRoute>} />
                            <Route path="/tenant_assigned_list" element={<AuthRoute><TenantAssignedList /></AuthRoute>} />





                        </Routes>
                    </main>

                    {/* <Footer /> */}
                </div>
            </div>

        </div>
    )
}

export default MasterLayout