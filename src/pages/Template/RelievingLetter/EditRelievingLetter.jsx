import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';

export default function EditRelievingLetter() {

    const { id } = useParams();
    const navigate = useNavigate();

    const GoToEventList = () => {
        navigate(`/admin/relievingletterList`);
    };

    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userrole = userData?.userrole || '';
    const userempid = userData?.userempid || '';

    // const [headerAttachment, setHeaderAttachment] = useState(null);
    // console.log("headerAttachment******************", headerAttachment)
    // const [footerAttachment, setFooterAttachment] = useState(null);
    const [header_footer_layout_id, setheader_footer_layout_id] = useState('');
    const [salutation, setSalutation] = useState('');
    const [annualCTC, setAnnualCTC] = useState('');


    const [date, setDate] = useState('');
    //const [employeeName, setEmployeeName] = useState('');
    const [designation, setDesignation] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [lastWorkingDay, setLastWorkingDay] = useState('');
    const [authorisedPersonName, setAuthorisedPersonName] = useState('');
    const [authorisedPersonDesignation, setAuthorisedPersonDesignation] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const today = new Date().toISOString().split('T')[0];

    const [refreshKey, setRefreshKey] = useState(0);
    const [headerFooterData, setHeaderFooterData] = useState([]); // Initialize with an empty array
    const [loading, setLoading] = useState(true);

    const [maindepartment, setMainDepartment] = useState([]);
    const [selectdepartment, setSelectdepartment] = useState('');
    const [selectrole, setSelectRole] = useState([]);
    const [selectedmainroleid, setSelectMainRoleId] = useState('');
    const [selectmainemployee, setSelectMainEmployee] = useState([]);
    const [selectedemployee, setSelectedMainEmployee] = useState('');

    
    useEffect(() => {
        axios.get('https://epkgroup.in/crm/api/public/api/department_list', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { data } = response.data;
                console.log("department and supervisor options", response.data);

                if (Array.isArray(data)) {
                    setMainDepartment(data);
                } else {
                    console.error("Unexpected data format:", data);
                }
            })
            .catch(error => {
                console.error('Error fetching department and supervisor options:', error);
            });
    }, [usertoken]);

     // --------------------------------------- Role Dropdown ------------------------------------------------

     useEffect(() => {
        const apiUrl = `https://epkgroup.in/crm/api/public/api/departmentbasedrole_list/${selectdepartment}`;
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl,

                    {
                        headers: {
                            'Authorization': `Bearer ${usertoken}`
                        }
                    });
                const data = response.data.data;
                setSelectRole(data);
                console.log("setEmployeesDropdown", data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [selectdepartment]);

     // --------------------------------------- Employee Dropdown ------------------------------------------------

     useEffect(() => {
        const apiUrl = `https://epkgroup.in/crm/api/public/api/supervisorrole_list/${selectedmainroleid}`;
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl,

                    {
                        headers: {
                            'Authorization': `Bearer ${usertoken}`
                        }
                    });
                const data = response.data.data;
                setSelectMainEmployee(data);
                console.log("setEmployeesDropdown", data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [selectedmainroleid]);



    const handleSave = async (e) => {
        e.preventDefault();

        const errors = {};

        // if (!headerAttachment) {
        //     errors.headerAttachment = 'Header Attachment is required.';
        // }
        // if (!footerAttachment) {
        //     errors.footerAttachment = 'Footer Attachment is required.';
        // }
        if (!header_footer_layout_id) errors.header_footer_layout_attachment = 'Layout company name is required.';

        if (!salutation) errors.salutation = 'Salutation is required.';

        if (!annualCTC) errors.annualCTC = 'Annual CTC is required.';


        if (!date) {
            errors.date = 'Date is required.';
        }
        
        if (!selectdepartment) {
            errors.selectdepartment = 'Department Name is required.';
        }
        
        if (!selectedmainroleid) {
            errors.selectedmainroleid = 'Role Name is required.';
        }
        if (!selectedemployee) {
            errors.selectedemployee = 'Employee Name is required.';
        }
        if (!designation) {
            errors.designation = 'Designation is required.';
        }
        if (!companyName) {
            errors.companyName = 'Company Name is required.';
        }
        if (!joiningDate) {
            errors.joiningDate = 'Joining Date is required.';
        }
        if (!lastWorkingDay) {
            errors.lastWorkingDay = 'Last Working Day is required.';
        }
        if (!authorisedPersonName) {
            errors.authorisedPersonName = 'Authorised Person Name is required.';
        }
        if (!authorisedPersonDesignation) {
            errors.authorisedPersonDesignation = 'Authorised Person Designation is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const formData = new FormData();
        formData.append('id', id);

        // if (headerAttachment instanceof File) {
        //     formData.append('header_attachment', headerAttachment);
        // } else {
        //     formData.append('header_oldpath', headerAttachment);
        // }

        // if (footerAttachment instanceof File) {
        //     formData.append('footer_attached', footerAttachment);
        // } else {
        //     formData.append('footer_oldpath', footerAttachment);
        // }

        formData.append('header_footer_layout_id', header_footer_layout_id);
        formData.append('salutation', salutation);
        formData.append('annual_ctc', annualCTC);

        formData.append('date', date);
        formData.append('employee_name', selectedemployee);
        formData.append('designation', designation);
        formData.append('company_name', companyName);
        formData.append('joining_date', joiningDate);
        formData.append('last_working_day', lastWorkingDay);
        formData.append('authorised_person_name', authorisedPersonName);
        formData.append('authorised_person_designation', authorisedPersonDesignation);
        formData.append('updated_by', userData.userempid);

        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/update_relieving_letter', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            const data = await response.json();

            if (data.status === 'success') {
                // setHeaderAttachment(null);
                // setFooterAttachment(null);
                setheader_footer_layout_id('');
                setSelectMainRoleId('');
                setSelectdepartment('');
                setSelectedMainEmployee('');
                setSalutation('');
                setDate('');
              //  setEmployeeName('');
                setDesignation('');
                setCompanyName('');
                setJoiningDate('');
                setLastWorkingDay('');
                setAuthorisedPersonName('');
                setAuthorisedPersonDesignation('');
                setAnnualCTC('');

                setRefreshKey(prevKey => prevKey + 1);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Relieving Letter Added Successfully.',
                });
                GoToEventList();
            } else {
                throw new Error("Can't able to Edit Relieving Letter.");
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error: ${error.message}`,
            });
        }
    };

    const fileInputRef = useRef(null);
    const handleCancel = () => {
        GoToEventList()
    };

    // --------------------------------------------------------------------------------------------

    useEffect(() => {
        axios.get(`https://epkgroup.in/crm/api/public/api/edit_relieving_list/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    // setData(res.data.data);
                    console.log("setData----------->", res.data.data)
                    const data = res.data.data

                    // setHeaderAttachment(data.header_attachment)
                    // setFooterAttachment(data.footer_attached)
                    setheader_footer_layout_id(data.layout_id);
                    setSelectdepartment(data.department_id);
                    setSelectMainRoleId(data.role_id);
                    setSelectedMainEmployee(data.emp_id);
                    
                    setSalutation(data.salutation);
                    setAnnualCTC(data.annual_ctc);
                    setDate(data.date)
                   // setEmployeeName(data.employee_name)
                    setDesignation(data.designation)

                    setCompanyName(data.company_name)
                    setJoiningDate(data.joining_date)
                    setLastWorkingDay(data.last_working_day)
                    setAuthorisedPersonName(data.authorised_person_name)
                    setAuthorisedPersonDesignation(data.authorised_person_designation)
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        const formdata = {
            user_roleid: userrole,
            emp_id: userempid
        };

        try {

            const response = await fetch('https://epkgroup.in/crm/api/public/api/headerFooter_templatelist', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                },
                // body: JSON.stringify(formdata)
            });

            if (response.ok) {
                const responseData = await response.json();
                setHeaderFooterData(responseData.data);
                // setTableData(responseData.data);
                // console.log('responce data for offter_letter', responseData.data);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };


    // --------------------------------------------------------------------------------------------

    // const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    // const [footerImagePreviewUrl, setFooterImagePreviewUrl] = useState('');



    // useEffect(() => {
    //     if (headerAttachment && headerAttachment instanceof File) {
    //         setImagePreviewUrl(URL.createObjectURL(headerAttachment));
    //     } else if (headerAttachment) {
    //         setImagePreviewUrl(`https://epkgroup.in/crm/api/storage/app/${headerAttachment}`);
    //     }
    //     // Cleanup URL when component unmounts or file changes
    //     return () => {
    //         if (imagePreviewUrl) {
    //             URL.revokeObjectURL(imagePreviewUrl);
    //         }
    //     };
    // }, [headerAttachment, headerAttachment]);



    // useEffect(() => {
    //     if (footerAttachment && footerAttachment instanceof File) {
    //         setFooterImagePreviewUrl(URL.createObjectURL(footerAttachment));
    //     } else if (footerAttachment) {
    //         setFooterImagePreviewUrl(`https://epkgroup.in/crm/api/storage/app/${footerAttachment}`);
    //     }
    //     // Cleanup URL when component unmounts or file changes
    //     return () => {
    //         if (footerImagePreviewUrl) {
    //             URL.revokeObjectURL(footerImagePreviewUrl);
    //         }
    //     };
    // }, [footerAttachment, footerAttachment]);


    // const handleHeaderAttachmentChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImagePreviewUrl(reader.result);
    //             setHeaderAttachment(file);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setImagePreviewUrl('');
    //         setHeaderAttachment(null);
    //     }
    // };

    // const handleFooterAttachmentChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setFooterImagePreviewUrl(reader.result);
    //             setFooterAttachment(file);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setFooterImagePreviewUrl('');
    //         setFooterAttachment(null);
    //     }
    // };

    return (
        <div className="container mt-5" style={{ padding: '0px 70px 0px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Relieving Letter</h3>
            <div style={{ boxShadow: '#0000007d 0px 0px 10px 1px', padding: '35px 50px' }}>
                <form onSubmit={handleSave}>
                    <Row className="mb-3">
                        <Col md={12}>
                            <div className="mb-3">
                                <label htmlFor="header_footer_layout" className="form-label">Select Layout</label>
                                <select
                                    id="header_footer_layout"
                                    className="form-control"
                                    value={header_footer_layout_id}
                                    onChange={(e) => setheader_footer_layout_id(e.target.value)}
                                >
                                    <option value="" disabled>Select Company</option>
                                    {headerFooterData.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.company_title}
                                        </option>
                                    ))}

                                    {/* Add more options as needed */}
                                </select>
                                {formErrors.header_footer_layout_attachment && <span className="text-danger">{formErrors.header_footer_layout_attachment}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>

                            {/* Annual CTC */}
                            <div className="mb-3">
                                <label htmlFor="annualCTC" className="form-label">Annual CTC</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="annualCTC"
                                    value={annualCTC}
                                    onChange={(e) => setAnnualCTC(e.target.value)}
                                />
                                {formErrors.annualCTC && <span className="text-danger">{formErrors.annualCTC}</span>}
                            </div>
                        </Col>

                        <Col md={6}>
                            {/* Select Salutation */}
                            <div className="mb-3">
                                <label htmlFor="salutation" className="form-label">Select Salutation</label>
                                <select
                                    id="salutation"
                                    className="form-control"
                                    value={salutation}
                                    onChange={(e) => setSalutation(e.target.value)}
                                >
                                    <option value="" disabled>Select Salutation</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    {/* Add more options as needed */}
                                </select>
                                {formErrors.salutation && <span className="text-danger">{formErrors.salutation}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                                <Col md={6}>
                                    {/* Select Salutation */}
                                    <div className="mb-3">
                                        <label htmlFor="departmentname" className="form-label">Select Department</label>
                                        <select
                                            id="departmentname"
                                            className="form-control"
                                            value={selectdepartment}
                                            onChange={(e) => setSelectdepartment(e.target.value)}
                                        >
                                            <option value="" >Select Department</option>
                                            {maindepartment.map(option => (
                                                <option key={option.id} value={option.id}>
                                                    {option.depart_name}
                                                </option>
                                            ))}

                                            {/* Add more options as needed */}
                                        </select>
                                        {formErrors.selectdepartment && <span className="text-danger">{formErrors.selectdepartment}</span>}
                                    </div>
                                </Col>
                                <Col md={6}>
                                <div className="mb-3">
                                        <label htmlFor="selectrolename" className="form-label">Select Role</label>
                                        <select
                                            id="selectrolename"
                                            className="form-control"
                                            value={selectedmainroleid}
                                            onChange={(e) => setSelectMainRoleId(e.target.value)}
                                        >
                                            <option value="" >Select Role</option>
                                            {selectrole.map(option => (
                                                <option key={option.id} value={option.id}>
                                                    {option.role_name}
                                                </option>
                                            ))}

                                            {/* Add more options as needed */}
                                        </select>
                                        {formErrors.selectedmainroleid && <span className="text-danger">{formErrors.selectedmainroleid}</span>}
                                    </div>
                                </Col>
                            </Row>

                    <Row className="mb-3">

                    <Col md={6}>
                    <div className="mb-3">
                                        <label htmlFor="selectrolename" className="form-label">Select Employee</label>
                                        <select
                                            id="selectrolename"
                                            className="form-control"
                                            value={selectedemployee}
                                            onChange={(e) => setSelectedMainEmployee(e.target.value)}
                                        >
                                            <option value="">Select Employee</option>
                                            {selectmainemployee.map(option => (
                                                <option key={option.id} value={option.id}>
                                                    {option.supervisor_name}
                                                </option>
                                            ))}

                                            {/* Add more options as needed */}
                                        </select>
                                        {formErrors.selectedemployee && <span className="text-danger">{formErrors.selectedemployee}</span>}
                                    </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={date}
                                    max="9999-12-31"
                                    onChange={(e) => {
                                        setDate(e.target.value)
                                        if (joiningDate || lastWorkingDay) {
                                            setJoiningDate('');
                                            setLastWorkingDay('');
                                        }
                                    }}
                                />
                                {formErrors.date && <span className="text-danger">{formErrors.date}</span>}
                            </div>
                        </Col>
                      
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Designation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                />
                                {formErrors.designation && <span className="text-danger">{formErrors.designation}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Company Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                                {formErrors.companyName && <span className="text-danger">{formErrors.companyName}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Joining Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={joiningDate}
                                    min={'0001-01-01'}
                                    max={lastWorkingDay || '9999-12-12'}
                                    onChange={(e) => setJoiningDate(e.target.value)}
                                />
                                {formErrors.joiningDate && <span className="text-danger">{formErrors.joiningDate}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Last Working Day</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={lastWorkingDay}
                                    // min={joiningDate}
                                    min={joiningDate || '0001-01-01'}
                                    onChange={(e) => setLastWorkingDay(e.target.value)}
                                />
                                {formErrors.lastWorkingDay && <span className="text-danger">{formErrors.lastWorkingDay}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Authorised Person Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={authorisedPersonName}
                                    onChange={(e) => setAuthorisedPersonName(e.target.value)}
                                />
                                {formErrors.authorisedPersonName && <span className="text-danger">{formErrors.authorisedPersonName}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Authorised Person Designation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={authorisedPersonDesignation}
                                    onChange={(e) => setAuthorisedPersonDesignation(e.target.value)}
                                />
                                {formErrors.authorisedPersonDesignation && <span className="text-danger">{formErrors.authorisedPersonDesignation}</span>}
                            </div>
                        </Col>
                    </Row>

                    <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>Edit Relieving Letter</button>
                    <button type="button" className="btn btn-secondary" style={{ background: 'white', color: '#0d6efd' }} onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
