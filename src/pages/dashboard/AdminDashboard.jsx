import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
import '../../assets/admin/css/dashboard.css'

import ManualEntry from '../../assets/admin/assets/img/Dashboard/Manual Entry.png'
import MissedCount from '../../assets/admin/assets/img/Dashboard/Missed Count.png'
import OnDuty from '../../assets/admin/assets/img/Dashboard/On Duty.svg'
import Permission from '../../assets/admin/assets/img/Dashboard/Permission.png'
import TotalVisitors from '../../assets/admin/assets/img/Dashboard/Total Visitors.png'
import absent from '../../assets/admin/assets/img/Dashboard/absent.png'
import employee from '../../assets/admin/assets/img/Dashboard/employee.png'
import halfday from '../../assets/admin/assets/img/Dashboard/halfday.png'
import late from '../../assets/admin/assets/img/Dashboard/late.png'
import leave from '../../assets/admin/assets/img/Dashboard/leave.png'
import present from '../../assets/admin/assets/img/Dashboard/present.png'



import face_shy from '../../assets/admin/assets/img/emoji/face_shy.png'
import happy from '../../assets/admin/assets/img/emoji/happy.png'
import happy_positive from '../../assets/admin/assets/img/emoji/happy_positive.png'
import love_happy from '../../assets/admin/assets/img/emoji/love_happy.png'
import sad_smiley from '../../assets/admin/assets/img/emoji/sad_smiley.png'

import profile from '../../assets/admin/assets/img/Dashboard/profile.jpg'

import Swal from 'sweetalert2';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import api from '../../api';


const DashboardPage = () => {




    // ===========================================================================

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';


    // loading state
    const [loading, setLoading] = useState(true);

    // ===========================================================================



    // ===========================================================================
    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditAnnouncement = () => {
        navigate(`/admin/editannouncement`);
    };

    const [activeButton, setActiveButton] = useState('admin');

    const goToHRDashboard = () => {
        setActiveButton('hr');
        navigate(`/admin/userdashboard`);
    };

    // ===========================================================================

    // ===========================================================================

    // dashboard  values

    const [totalEmployee, setTotalEmployee] = useState('');
    const [presentCount, setPresentCount] = useState('');
    const [lateCount, setLateCount] = useState('');
    const [permissionCount, setPermissionCount] = useState('');
    const [halfDayCount, setHalfDayCount] = useState('');
    const [leaveCount, setLeaveCount] = useState('');
    const [absentCount, setAbsentCount] = useState('');
    const [onDutyCount, setOnDutyCount] = useState('');
    const [missedCount, setMissedCount] = useState('');
    const [manualEntryCount, setManualEntryCount] = useState('');
    const [totalVisitors, setTotalVisitors] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/adminIndexTodayCount', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}` 
                    }
                });
                const data = response.data;

                setTotalEmployee(data.total_employee_count);
                setPresentCount(data.days_present);
                setLateCount(data.days_late);
                setPermissionCount(data.days_permission);
                setHalfDayCount(data.days_halfday);
                setLeaveCount(data.days_leave);
                setAbsentCount(data.days_absent);
                setOnDutyCount(data.days_onduty);
                setMissedCount(data.total_missed_count);
                setManualEntryCount(data.ManualEntryCount);
                setTotalVisitors(data.vistorcount);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    // ===========================================================================


    // ===========================================================================

    // moodboard popup

    const [moodboardModel, setMoodboardModel] = useState(false);
    const handleClosemoodboard = () => setMoodboardModel(false);
    const handleShowmoodboard = () => setMoodboardModel(true);


    const [allemojicount, setAllemojicount] = useState(30);
    const [shyCount, setShyCount] = useState(10);
    const [happyCount, setHappyCount] = useState(0);
    const [happyPositiveCount, setHappyPositiveCount] = useState(5);
    const [loveHappyCount, setLoveHappyCount] = useState(10);
    const [sadSmileyCount, setSadSmileyCount] = useState(5);

    // ===========================================================================

    // ===========================================================================

    // announcement popup

    const [announcementModel, setAnnouncementModel] = useState(false);
    const handleCloseannouncement = () => {

        setTitle('');
        setDescription('');
        setDate('');
        setFormErrors({});
        setAnnouncementModel(false);
    }
    const handleShowannouncement = () => setAnnouncementModel(true);

    // State variables for announcement form inputs
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const [formErrors, setFormErrors] = useState({});


    // Function to restrict year input to four characters
    const handleDateChange = (e) => {
        const inputDate = e.target.value;
        setDate(inputDate)
    };
    // ===========================================================================




    // ===========================================================================


    const handleAddAnnouncement = (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        if (!title) {
            errors.title = 'Title is required.';
        }

        if (!description) {
            errors.description = 'Description is required.';
        }

        if (!date) {
            errors.date = 'Date is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});


        const requestData = {
            validdate: date,
            title: title,
            description: description,
            created_by: userempid
        };

        axios.post('https://epkgroup.in/crm/api/public/api/addannouncement', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { status, message } = response.data;

                if (status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: message
                    });

                    setTitle('');
                    setDescription('');
                    setDate('');
                    handleCloseannouncement()


                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Operation Failed',
                        text: message
                    });
                }
            })
            .catch(error => {
                console.error('There was an error with the API:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error creating the announcement. Please try again later.'
                });
            });
    };


    const handleInputChange = (setter) => (e) => {
        let value = e.target.value;
        if (value.startsWith(' ')) {
            value = value.trimStart();
        }
        setter(value);
    };


    // ===========================================================================


    // ===========================================================================

    // Table list view api

    const [announcementlist, setAnnouncementlist] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/view_announcement', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setAnnouncementlist(responseData.data);
                // console.log("view_announcement", responseData.data);
            } else {
                throw new Error('Failed to fetch data'); // Providing more specific error feedback
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Ensure loading is set to false both in success and failure cases
        }
    };

    // Conditional logging, to avoid errors if announcementlist is not populated yet
    // if (announcementlist.length > 0) {
    //     console.log('First announcement title--->', announcementlist[0].a_title);
    // } else {
    //     console.log('No announcements found');
    // }

    // console.log('announcementlist--->', announcementlist.a_title)
    // ===========================================================================


    // ===========================================================================

    // mood board list view api

    const [moodboardlist, setModboardlist] = useState([]);

    useEffect(() => {
        fetchmoodboardData();
    }, []);

    const fetchmoodboardData = async () => {
        try {
            const response = await fetch('https://epkgroup.in/crm/api/public/api/view_moodboard', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setModboardlist(responseData.data.moodboard);
                console.log("-----------", responseData.data);

                setAllemojicount(responseData.data.total_count)
                setShyCount(responseData.data.mood_counts.face_shy)
                setHappyCount(responseData.data.mood_counts.happy)
                setHappyPositiveCount(responseData.data.mood_counts.happy_positive)
                setLoveHappyCount(responseData.data.mood_counts.love_happy)
                setSadSmileyCount(responseData.data.mood_counts.sad_smiley)
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // console.log("Employee Name:", moodboardlist[0].emp_name);



    // ===========================================================================




    return (
        <Container fluid>
            {(userrole.includes('2')) &&
                <div className='mb-4' style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        style={{ background: activeButton === 'admin' ? 'grey' : '', borderColor: activeButton === 'admin' ? 'grey' : '' }}
                    >
                        Admin Dashboard
                    </Button>
                    <Button
                        style={{ background: activeButton === 'hr' ? 'grey' : '', borderColor: activeButton === 'hr' ? 'grey' : '' }}
                        onClick={goToHRDashboard}
                    >
                        HR Dashboard
                    </Button>
                </div>
            }


            <Row>
                {/* First column */}
                <Col lg={8}>
                    <Row>
                        <Row>
                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Link to="/admin/EmployeeList" style={{ color: '#212529', textDecoration: 'none' }}>
                                    <div className='mb-3 card__container'>
                                        <div className='image__container'>
                                            <img src={employee} alt="" className='dash-img' />
                                        </div>
                                        <div className='feild__container'>
                                            <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Total Employee</h5>
                                            <h3 className='feild__value'>{totalEmployee}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </Col>

                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Link to="/admin/dashboardviewempdetails/P" style={{ color: '#212529', textDecoration: 'none' }}>
                                    <div className='mb-3 card__container'>
                                        <div className='image__container'>
                                            <img src={present} alt="" className='dash-img' />
                                        </div>
                                        <div className='feild__container'>
                                            <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Present</h5>
                                            <h3 className='feild__value'>{presentCount}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </Col>

                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Link to="/admin/dashboardviewempdetails/LA" style={{ color: '#212529', textDecoration: 'none' }}>
                                    <div className='mb-3 card__container'>
                                        <div className='image__container'>
                                            <img src={late} alt="" className='dash-img' />
                                        </div>
                                        <div className='feild__container'>
                                            <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Late</h5>
                                            <h3 className='feild__value'>{lateCount}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </Col>

                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Link to="/admin/dashboardviewempdetails/PR" style={{ color: '#212529', textDecoration: 'none' }}>
                                    <div className='mb-3 card__container'>
                                        <div className='image__container'>
                                            <img src={Permission} alt="" className='dash-img' />
                                        </div>
                                        <div className='feild__container'>
                                            <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Permission</h5>
                                            <h3 className='feild__value'>{permissionCount}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </Col>

                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Link to="/admin/dashboardviewempdetails/HL" style={{ color: '#212529', textDecoration: 'none' }}>
                                    <div className='mb-3 card__container'>
                                        <div className='image__container'>
                                            <img src={halfday} alt="" className='dash-img' />
                                        </div>
                                        <div className='feild__container'>
                                            <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Half Day</h5>
                                            <h3 className='feild__value'>{halfDayCount}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </Col>

                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Link to="/admin/dashboardviewempdetails/L" style={{ color: '#212529', textDecoration: 'none' }}>
                                    <div className='mb-3 card__container'>
                                        <div className='image__container'>
                                            <img src={leave} alt="" className='dash-img' />
                                        </div>
                                        <div className='feild__container'>
                                            <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Leave</h5>
                                            <h3 className='feild__value'>{leaveCount}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </Col>

                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Link to="/admin/dashboardviewempdetails/A" style={{ color: '#212529', textDecoration: 'none' }}>
                                    <div className='mb-3 card__container'>
                                        <div className='image__container'>
                                            <img src={absent} alt="" className='dash-img' />
                                        </div>
                                        <div className='feild__container'>
                                            <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Absent</h5>
                                            <h3 className='feild__value'>{absentCount}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </Col>

                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Link to="/admin/dashboardviewempdetails/ON" style={{ color: '#212529', textDecoration: 'none' }}>
                                    <div className='mb-3 card__container'>
                                        <div className='image__container'>
                                            <img src={OnDuty} alt="" className='dash-img-onduty' />
                                        </div>
                                        <div className='feild__container__onduty'>
                                            <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>On Duty</h5>
                                            <h3 className='feild__value'>{onDutyCount}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </Col>

                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Link to="/admin/missedcount" style={{ color: '#212529', textDecoration: 'none' }}>

                                    <div className='mb-3 card__container'>
                                        <div className='image__container'>
                                            <img src={MissedCount} alt="" className='dash-img' />
                                        </div>
                                        <div className='feild__container'>
                                            <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Missed Count</h5>
                                            <h3 className='feild__value'>{missedCount}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </Col>

                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Link to="/admin/dashboardviewempdetails/ME" style={{ color: '#212529', textDecoration: 'none' }}>
                                    <div className='mb-3 card__container'>
                                        <div className='image__container'>
                                            <img src={ManualEntry} alt="" className='dash-img-Manualentry' />
                                        </div>
                                        <div className='feild__container__Manualentry'>
                                            <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Manual Entry</h5>
                                            <h3 className='feild__value'>{manualEntryCount}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </Col>

                            <Col sm={12} md={6} lg={4} xl={3}>
                                <Link to="/admin/dashboardvisitors" style={{ color: '#212529', textDecoration: 'none' }}>
                                    <div className='mb-3 card__container'>
                                        <div className='image__container'>
                                            <img src={TotalVisitors} alt="" className='dash-img' />
                                        </div>
                                        <div className='feild__container'>
                                            <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Total Visitors</h5>
                                            <h3 className='feild__value'>{totalVisitors}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </Col>

                        </Row>

                    </Row>
                </Col>

                {/* Second column */}
                <Col lg={4}>

                    {/* Employee__mood__board */}

                    <div className='mb-3 Employee__mood__board'>

                        <div className='mood__title'>
                            <h5 className='mb-2'>Employee's Mood Board</h5>
                            <hr className='mood__rule' />
                        </div>

                        <div className='mood__reactions mb-4'>
                            <Row className='mb-3' style={{display:'flex', alignItems:'center'}}>
                                <Col>
                                    <h5 className='mood__all'>All</h5>
                                </Col>

                                <Col>
                                    <span><img src={face_shy} alt="face_shy" className='emoji-icon' /></span>
                                </Col>

                                <Col>
                                    <span><img src={happy} alt="face_shy" className='emoji-icon' /></span>
                                </Col>

                                <Col>
                                    <span><img src={happy_positive} alt="face_shy" className='emoji-icon' /></span>
                                </Col>

                                <Col>
                                    <span><img src={love_happy} alt="face_shy" className='emoji-icon' /></span>
                                </Col>

                                <Col>
                                    <span><img src={sad_smiley} alt="face_shy" className='emoji-icon' /></span>
                                </Col>

                            </Row>
                            <Row>

                                {moodboardlist.slice(-2).map(item => (
                                    <Col key={item.id} sm={12} md={12} lg={12} xl={12} className='mb-3 Reacted__emoji'>
                                        <p className='reacted__name__emoji'>
                                            <span className='reacted__name'>{item.emp_name}</span>
                                            {item.mood_name === 'face_shy' && <img src={face_shy} alt="face_shy" className='emoji-icon-reacted' />}
                                            {item.mood_name === 'happy' && <img src={happy} alt="happy" className='emoji-icon-reacted' />}
                                            {item.mood_name === 'happy_positive' && <img src={happy_positive} alt="happy_positive" className='emoji-icon-reacted' />}
                                            {item.mood_name === 'love_happy' && <img src={love_happy} alt="love_happy" className='emoji-icon-reacted' />}
                                            {item.mood_name === 'sad_smiley' && <img src={sad_smiley} alt="sad_smiley" className='emoji-icon-reacted' />}


                                        </p>
                                    </Col>
                                ))}
                            </Row>

                        </div>

                        <div className='show__more'>
                            <span onClick={handleShowmoodboard}>Show more...</span>
                        </div>

                    </div>

                    {/* ========================================================================== */}

                    {/* Modal for showing mood board */}

                    <Modal show={moodboardModel} onHide={handleClosemoodboard}>
                        <Modal.Header closeButton>
                            <Modal.Title>Employee's Mood Board</Modal.Title>
                        </Modal.Header>

                        <Modal.Body style={{ maxHeight: '50vh', overflowY: 'auto' }}>

                            <div className='mood__reactions__popup'>
                                <Row className='mb-3'>
                                    <Col className='ALL__design'>
                                        <h5 className='mood__all__popup'>All{'\u00a0'}{allemojicount}</h5>
                                    </Col>

                                    <Col>
                                        <span className='emoji__count'><img src={face_shy} alt="face_shy" className='emoji-icon__popup' /> <h5 className='emoji__count__value'>{shyCount}</h5></span>
                                    </Col>

                                    <Col>
                                        <span className='emoji__count'><img src={happy} alt="face_shy" className='emoji-icon__popup' /><h5 className='emoji__count__value'>{happyCount}</h5></span>
                                    </Col>

                                    <Col>
                                        <span className='emoji__count'><img src={happy_positive} alt="face_shy" className='emoji-icon__popup' /><h5 className='emoji__count__value'>{happyPositiveCount}</h5></span>
                                    </Col>

                                    <Col>
                                        <span className='emoji__count'><img src={love_happy} alt="face_shy" className='emoji-icon__popup' /><h5 className='emoji__count__value'>{loveHappyCount}</h5></span>
                                    </Col>

                                    <Col>
                                        <span className='emoji__count'><img src={sad_smiley} alt="face_shy" className='emoji-icon__popup' /><h5 className='emoji__count__value'>{sadSmileyCount}</h5></span>
                                    </Col>

                                </Row>


                                {/* ======================================= */}

                                <Row>
                                    <Col sm={12} md={12} lg={12} xl={12} className='mb-3 Reacted__emoji__popup'>
                                        {moodboardlist.map(item => (
                                            <p className='reacted__name__emoji__popup mb-3'>

                                                <img src={`https://epkgroup.in/crm/api/storage/app/${item.profile_img}`} alt='' className='profile__popup' />
                                                <span className='reacted__name__popup'>{item.emp_name}</span>
                                                {item.mood_name === 'face_shy' && <img src={face_shy} alt="face_shy" className='emoji-icon-reacted' />}
                                                {item.mood_name === 'happy' && <img src={happy} alt="happy" className='emoji-icon-reacted' />}
                                                {item.mood_name === 'happy_positive' && <img src={happy_positive} alt="happy_positive" className='emoji-icon-reacted' />}
                                                {item.mood_name === 'love_happy' && <img src={love_happy} alt="love_happy" className='emoji-icon-reacted' />}
                                                {item.mood_name === 'sad_smiley' && <img src={sad_smiley} alt="sad_smiley" className='emoji-icon-reacted' />}
                                            </p>
                                        ))}
                                    </Col>


                                </Row>

                                {/* ======================================= */}
                            </div>
                        </Modal.Body>

                    </Modal>

                    {/* ========================================================================== */}



                    {/* announcement__container */}

                    <div className='announcement__container'>

                        <div className='mb-3 announcement__head'>
                            <h5>Announcements</h5>
                            <span style={{ display: 'flex', gap: '5px' }}>
                                <button className='Add__announcement' onClick={GoToEditAnnouncement}>View</button>
                                <button className='Add__announcement' onClick={handleShowannouncement}>+ ADD</button>
                            </span>
                        </div>
                        {/* ======================================== */}

                        <div>
                            {announcementlist.length > 0 ? (
                                <div className='announcement__body'>
                                    {announcementlist.map((announcement, index) => (
                                        <div key={index} className='mb-3 announcement__message1'>
                                            <div className='title__day'>
                                                <h6 className='message__title'>{announcement.a_title}</h6>
                                                <span className='announcement__day'>{announcement.created_at_formatted}</span> {/* You can make this dynamic based on data */}
                                            </div>
                                            <p className='message'>{announcement.a_description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No announcements to display.</p>
                            )}
                        </div>

                        {/* ======================================== */}



                    </div>

                    {/* ========================================================================== */}

                    {/* Modal for adding announcement */}

                    <Modal show={announcementModel} onHide={handleCloseannouncement}>
                        <Modal.Header closeButton>
                            <Modal.Title><h3 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Announcement</h3></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label>Title <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => handleInputChange(setTitle)(e)}
                            />
                            {formErrors.title && <p className="text-danger">{formErrors.title}</p>}
                            <label>Description <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => handleInputChange(setDescription)(e)}
                            />
                            {formErrors.description && <p className="text-danger">{formErrors.description}</p>}
                            <label>Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></label>
                            <input
                                type="date"
                                className="form-control"
                                value={date}
                                min={today}
                                max="9999-12-31"
                                onChange={handleDateChange} // Custom handler to limit year input
                            />
                            {formErrors.date && <p className="text-danger">{formErrors.date}</p>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseannouncement}>Cancel</Button>
                            <Button variant="primary" onClick={handleAddAnnouncement}>Add Announcement</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* ========================================================================== */}

                </Col>


            </Row>


        </Container >
    );
};

export default DashboardPage;