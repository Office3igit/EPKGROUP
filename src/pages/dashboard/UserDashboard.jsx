import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
import '../../assets/admin/css/dashboard.css'


import checkin from '../../assets/admin/assets/img/Dashboard/checkin.png'
import checkout from '../../assets/admin/assets/img/Dashboard/checkout.png'
import totalhours from '../../assets/admin/assets/img/Dashboard/totalhours.png'


import face_shy from '../../assets/admin/assets/img/emoji/face_shy.png'
import happy from '../../assets/admin/assets/img/emoji/happy.png'
import happy_positive from '../../assets/admin/assets/img/emoji/happy_positive.png'
import love_happy from '../../assets/admin/assets/img/emoji/love_happy.png'
import sad_smiley from '../../assets/admin/assets/img/emoji/sad_smiley.png'

import profile from '../../assets/admin/assets/img/Dashboard/profile.jpg'
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { detect } from 'detect-browser';
import { useNavigate } from 'react-router-dom';





const UserDashboard = () => {

  const admin = useSelector(state => state.admin.value)

  // ===========================================================================
  // Redirect to the edit page
  const navigate = useNavigate();


  const [activeButton, setActiveButton] = useState('hr');

  const goToAdminDashboard = () => {
    setActiveButton('admin');
    navigate(`/admin/admindashboard`);
  };

  // ===========================================================================

  // ===========================================================================

  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));

  const usertoken = userData?.token || '';
  const userempid = userData?.userempid || '';
  const userrole = userData?.userrole || '';

  // ===========================================================================

  // loading state
  const [loading, setLoading] = useState(false);
  const [loadingcheckin, setLoadingcheckin] = useState(false);
  const [loadingcheckout, setLloadingcheckout] = useState(false);
  // ===========================================================================

  // dashboard  values

  const [checkintime, setCheckintime] = useState('');
  const [checkouttime, setCheckouttime] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [attendanceType, setAttendanceType] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    userCheckInCheckOutCount();
  }, [refreshKey]);

  const userCheckInCheckOutCount = async () => {
    const requestData = {
      emp_id: userempid
    };

    try {
      const response = await fetch('https://epkgroup.in/crm/api/public/api/employeeIndexinouttime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usertoken}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const responseData = await response.json();
        // setAnnouncementList(responseData.data);
        console.log("responseData--->", responseData);

        // Assuming responseData.data contains these fields
        setAttendanceType(responseData.attendance_type);
        setCheckintime(responseData.userempcheckintime);
        setCheckouttime(responseData.userempcheckouttime);
        setWorkingHours(responseData.userempchecktotaltime);

      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);

    } finally {
      setLoading(false);
    }
  };

  // ===========================================================================


  // ===========================================================================

  // moodboard

  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
  };



  const [refreshKeymood, setRefreshKeymood] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedEmoji) {
      Swal.fire('Error', 'Please select your mood before submitting', 'error');
      setLoading(false);
      return;

    }

    const requestData = {
      mood_name: selectedEmoji,
      created_by: userempid
    };

    let successMessage;

    axios.post('https://epkgroup.in/crm/api/public/api/addmoodboard', requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usertoken}`
      }
    })
      .then(response => {
        const { status, message } = response.data;



        if (status === 'success') {

          switch (selectedEmoji) {
            case 'face_shy':
              successMessage = 'Your mood is shy today!';
              break;
            case 'happy':
              successMessage = 'Your mood is happy today!';
              break;
            case 'happy_positive':
              successMessage = 'You are positively happy today!';
              break;
            case 'love_happy':
              successMessage = 'You are lovingly happy today!';
              break;
            case 'sad_smiley':
              successMessage = 'Your mood is sad today!';
              break;
            default:
              successMessage = 'Your mood has been submitted!';
          }
          Swal.fire('Success', successMessage, 'success');
          setRefreshKeymood(prevKey => prevKey + 1);
          setLoading(false);


        } else {
          Swal.fire({
            icon: 'error',
            title: 'Operation Failed',
            text: message
          });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error with the API:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error creating the Mood Board. Please try again later.'
        });
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setSelectedEmoji(null);
  };


  const [storeselectedmood, setStoreselectedmood] = useState([]);


  const handlegotoprevious = () => {
    setStoreselectedmood([])
  }

  useEffect(() => {
    fetchDatamood();
  }, [refreshKeymood]);

  const fetchDatamood = async () => {
    try {
      const response = await fetch(`https://epkgroup.in/crm/api/public/api/editview_moodboard/${userempid}`, {
        headers: {
          'Authorization': `Bearer ${usertoken}`
        }
      });
      if (response.ok) {
        const responseData = await response.json();
        setStoreselectedmood(responseData.data);
        console.log("setStoreselectedmood", responseData.data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [moodname, setMoodname] = useState('');


  useEffect(() => {
    let moodMessage;

    switch (storeselectedmood.mood_name) {
      case 'face_shy':
        moodMessage = <span>Your mood is <img src={face_shy} style={{ width: '10%' }} alt="face shy" /> today</span>;
        break;
      case 'happy':
        moodMessage = <span>Your mood is <img src={happy} style={{ width: '10%' }} alt="happy" /> today</span>;
        break;
      case 'happy_positive':
        moodMessage = <span>You are <img src={happy_positive} style={{ width: '10%' }} alt="happy positive" /> happy today</span>;
        break;
      case 'love_happy':
        moodMessage = <span>You are <img src={love_happy} style={{ width: '10%' }} alt="love happy" /> happy today</span>;
        break;
      case 'sad_smiley':
        moodMessage = <span>Your mood is <img src={sad_smiley} style={{ width: '10%' }} alt="sad smiley" /> today</span>;
        break;
      default:
        moodMessage = 'Your mood has been Empty';
    }

    setMoodname(moodMessage);
  }, [storeselectedmood]);



  const moodNames = ['face_shy', 'happy', 'happy_positive', 'love_happy', 'sad_smiley'];


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
        console.log("view_announcement", responseData.data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  // ===========================================================================


  // ===========================================================================
  // To Fetch User Device Name
  const browser = detect();

  const getDeviceName = () => {
    if (browser) {
      console.log("browser:", browser)
      return `${browser.name} ${browser.version}`;
    }
    return 'Unknown Device';
  };

  // ===========================================================================

  // ===========================================================================
  //To Fetch Use Ip Address
  const [userIP, setUserIP] = useState('');

  const getUserIP = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'Unknown IP';
    }
  };

  useEffect(() => {
    const fetchIP = async () => {
      const ip = await getUserIP();
      setUserIP(ip);
    };

    fetchIP();
  }, []);

  // ===========================================================================

  // ===========================================================================
  // check In

  const handleCheckIn = () => {
    // handleCheckInsingle()

    setLoadingcheckin(true);

    const checkInData = {
      checkinuserempid: userempid,
      checkinuseripaddress: userIP,
      device: getDeviceName(),
      checking_type: 'Web',
      created_by: userempid,
    };

    fetch('https://epkgroup.in/crm/api/public/api/insertwebcheckin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usertoken}`
      },
      body: JSON.stringify(checkInData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Check-in Successful',
            text: data.message,
          });
          setRefreshKey(prevKey => prevKey + 1);
          setLoadingcheckin(false);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Check-in Failed',
            text: data.message || 'An error occurred. Please try again.',
          });
          setLoadingcheckin(false);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Check-in failed. Please try again.',
        });
        console.error('Error:', error);
        setLoadingcheckin(false);
      });
  };

  // ===========================================================================


  // ===========================================================================
  //Check out

  const handleCheckOut = () => {

    setLloadingcheckout(true);

    const checkOutData = {
      checkinuserempid: userempid,
      updated_by: userempid
    };

    fetch('https://epkgroup.in/crm/api/public/api/insertcheckout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usertoken}`
      },
      body: JSON.stringify(checkOutData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Check-out Successful',
            text: data.message,
          });
          setRefreshKey(prevKey => prevKey + 1);
          setLloadingcheckout(false);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Check-out Failed',
            text: data.message || 'An error occurred. Please try again.',
          });
          setLloadingcheckout(false);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Check-out failed. Please try again.',
        });
        console.error('Error:', error);
        setLloadingcheckout(false);
      });
  };
  // ===========================================================================

  // ===========================================================================
  // CHECKIN SINGLE PUCH
  // const [hasCheckedIn, setHasCheckedIn] = useState(false);

  // const handleCheckInsingle = () => {
  //   setHasCheckedIn(true);
  // }
  // ===========================================================================



  return (
    <Container fluid>
      {(userrole === "2") &&
        <div className='mb-4' style={{ display: 'flex', gap: '10px' }}>
          <Button
            style={{ background: activeButton === 'admin' ? 'grey' : '', borderColor: activeButton === 'admin' ? 'grey' : '' }}
            onClick={goToAdminDashboard}
          >
            Admin Dashboard
          </Button>
          <Button
            style={{ background: activeButton === 'hr' ? 'grey' : '', borderColor: activeButton === 'hr' ? 'grey' : '' }}
          >
            HR Dashboard
          </Button>
        </div>
      }

      <Row>
        {/* First column */}
        <Col sm={8}>
          <Row>
            <Col sm={12} className='mb-5 checkin__checkout__container'>
              <Button className='checkin-btn' onClick={handleCheckIn} disabled={attendanceType == '0'} >
                {loadingcheckin ? (
                  <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Check-in
                  </span>
                ) : (
                  'Check-in'
                )}
              </Button>
              {/* disabled={checkouttime !== '00:00:00'} */}
              <Button className='checkout-btn' onClick={handleCheckOut} disabled={checkouttime !== '00:00:00'}>
                {loadingcheckout ? (
                  <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Check-out
                  </span>
                ) : (
                  'Check-out'
                )}
              </Button>
            </Col>
          </Row>
          <Row>
            <Row>
              <Col sm={12} md={6} lg={4} xl={4}>
                <div className='card__container'>
                  <div className='image__container'>
                    <img src={checkin} alt="" className='dash-img' />
                  </div>
                  <div className='feild__container'>
                    <h5 className='feild__title'>Checkin Time</h5>
                    <h3 className='feild__value'>{checkintime}</h3>
                  </div>
                </div>
              </Col>

              <Col sm={12} md={6} lg={4} xl={4}>
                <div className='mb-3 card__container'>
                  <div className='image__container'>
                    <img src={checkout} alt="" className='dash-img' />
                  </div>
                  <div className='feild__container'>
                    <h5 className='feild__title'>Checkout Time</h5>
                    <h3 className='feild__value'>{checkouttime}</h3>
                  </div>
                </div>
              </Col>

              <Col sm={12} md={6} lg={4} xl={4}>
                <div className='mb-3 card__container'>
                  <div className='image__container'>
                    <img src={totalhours} alt="" className='dash-img' />
                  </div>
                  <div className='feild__container'>
                    <h5 className='feild__title'>Working Hours</h5>
                    <h3 className='feild__value'>{workingHours}</h3>
                  </div>
                </div>
              </Col>



            </Row>

          </Row>
        </Col>

        {/* Second column */}
        <Col sm={4}>

          {/* Employee__mood__board */}

          <div className='mb-3 Employee__mood__board'>

            <div className='mood__title'>
              <h5 className='mb-2'>Employee's Mood Board</h5>
              <hr className='mood__rule' />

            </div>


            {
              moodNames.includes(storeselectedmood.mood_name) ? (


                <div className='updated__mood'>


                  <h6 className='mb-3'>{moodname}</h6>
                  <div className='Mood_update_btn'>
                    <Button className='mood__Change' onClick={handlegotoprevious}>Change</Button>
                  </div>

                </div>

              ) : (
                <>
                  <div className='mood__reactions'>
                    <h6 className='mb-3'>What's Your Mood Today?</h6>
                    <Row className='mb-3' style={{ display: 'flex', gap: '0px' }}>
                      <Col xs={6} md={2} lg={2} xl={2} className={selectedEmoji === 'face_shy' ? 'selected' : ''} style={{ padding: '0px', width: '20%' }}>
                        <span onClick={() => handleEmojiClick('face_shy')} style={{ display: 'flex', justifyContent: 'center', padding: '7px 0px' }}><img src={face_shy} alt="face_shy" className='emoji-icon-user' /></span>
                      </Col>
                      <Col xs={6} md={2} lg={2} xl={2} className={selectedEmoji === 'happy' ? 'selected' : ''} style={{ padding: '0px', width: '20%' }}>
                        <span onClick={() => handleEmojiClick('happy')} style={{ display: 'flex', justifyContent: 'center', padding: '7px 0px' }}><img src={happy} alt="happy" className='emoji-icon-user' /></span>
                      </Col>
                      <Col xs={6} md={2} lg={2} xl={2} className={selectedEmoji === 'happy_positive' ? 'selected' : ''} style={{ padding: '0px', width: '20%' }}>
                        <span onClick={() => handleEmojiClick('happy_positive')} style={{ display: 'flex', justifyContent: 'center', padding: '7px 0px' }}><img src={happy_positive} alt="happy_positive" className='emoji-icon-user' /></span>
                      </Col>
                      <Col xs={6} md={2} lg={2} xl={2} className={selectedEmoji === 'love_happy' ? 'selected' : ''} style={{ padding: '0px', width: '20%' }}>
                        <span onClick={() => handleEmojiClick('love_happy')} style={{ display: 'flex', justifyContent: 'center', padding: '7px 0px' }}><img src={love_happy} alt="love_happy" className='emoji-icon-user' /></span>
                      </Col>
                      <Col xs={6} md={2} lg={2} xl={2} className={selectedEmoji === 'sad_smiley' ? 'selected' : ''} style={{ padding: '0px', width: '20%' }}>
                        <span onClick={() => handleEmojiClick('sad_smiley')} style={{ display: 'flex', justifyContent: 'center', padding: '7px 0px' }}><img src={sad_smiley} alt="sad_smiley" className='emoji-icon-user' /></span>
                      </Col>

                    </Row>
                  </div>

                  <div className='reaction__submit__btns'>
                    <Button onClick={handleSubmit} className='mood__submit' disabled={loading}>
                      {loading ? (
                        <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Submit
                        </span>
                      ) : (
                        'Submit'
                      )}
                    </Button>
                    <Button onClick={handleCancel} className='mood__Cancel'>Cancel</Button>
                  </div>
                </>

              )}


          </div>


          {/* announcement__container */}

          <div className='announcement__container'>

            <div className='mb-3 announcement__head'>
              <h5>Announcements</h5>
              {/* <button className='Add__announcement' onClick={handleShowannouncement}>+ ADD</button> */}
            </div>

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

          </div>



        </Col>


      </Row>


    </Container>
  );
};

export default UserDashboard;
