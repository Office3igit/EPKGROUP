import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

import ManualEntry from '../../../assets/admin/assets/img/Dashboard/Manual Entry.png'
import MissedCount from '../../../assets/admin/assets/img/Dashboard/Missed Count.png'
import OnDuty from '../../../assets/admin/assets/img/Dashboard/On Duty.svg'
import Permission from '../../../assets/admin/assets/img/Dashboard/Permission.png'
import TotalVisitors from '../../../assets/admin/assets/img/Dashboard/Total Visitors.png'
import absent from '../../../assets/admin/assets/img/Dashboard/absent.png'
import employee from '../../../assets/admin/assets/img/Dashboard/employee.png'
import halfday from '../../../assets/admin/assets/img/Dashboard/halfday.png'
import late from '../../../assets/admin/assets/img/Dashboard/late.png'
import leave from '../../../assets/admin/assets/img/Dashboard/leave.png'
import present from '../../../assets/admin/assets/img/Dashboard/present.png'
import api from "../../../api";
import './AttendanceDashboard.css'

const AttendanceDashboardPowerBIReport = () => {
  const embedUrl = "https://app.powerbi.com/view?r=eyJrIjoiNDY5NDMxZTgtN2VkOS00ODYwLTliOTgtN2I2YTRjMzdmMmM1IiwidCI6IjAwY2I0OWZkLTcwN2YtNDU1Yi1hZGQxLTkyMmY5NDVhZGJhNSJ9";  // Use your actual embed URL

  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));

  const usertoken = userData?.token || '';
  const userrole = userData.userrole || '';

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

        console.log("data", data)

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


  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {['1', '2'].includes(userrole) &&
        <div>
          <div>

            <div>
              <h2 className="mb-4" style={{ paddingLeft: '27px' }}>Attendance Dashboard</h2>
              <div>
                <div className="custom-grid">


                  <div>
                    <Link to="/admin/dashboardviewempdetails/P" style={{ color: '#212529', textDecoration: 'none' }}>
                      <div className='mb-3 card__container__powerbi'>
                        <div className='image__container'>
                          <img src={present} alt="" className='dash-img-power' />
                        </div>
                        <div className='feild__container'>
                          <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Present</h5>
                          <h3 className='feild__value'>{presentCount}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div>
                    <Link to="/admin/dashboardviewempdetails/LA" style={{ color: '#212529', textDecoration: 'none' }}>
                      <div className='mb-3 card__container__powerbi'>
                        <div className='image__container'>
                          <img src={late} alt="" className='dash-img-power' />
                        </div>
                        <div className='feild__container'>
                          <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Late</h5>
                          <h3 className='feild__value'>{lateCount}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div>
                    <Link to="/admin/dashboardviewempdetails/PR" style={{ color: '#212529', textDecoration: 'none' }}>
                      <div className='mb-3 card__container__powerbi'>
                        <div className='image__container'>
                          <img src={Permission} alt="" className='dash-img-power' />
                        </div>
                        <div className='feild__container'>
                          <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Permission</h5>
                          <h3 className='feild__value'>{permissionCount}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div>
                    <Link to="/admin/dashboardviewempdetails/HL" style={{ color: '#212529', textDecoration: 'none' }}>
                      <div className='mb-3 card__container__powerbi'>
                        <div className='image__container'>
                          <img src={halfday} alt="" className='dash-img-power' />
                        </div>
                        <div className='feild__container'>
                          <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Half Day</h5>
                          <h3 className='feild__value'>{halfDayCount}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div>
                    <Link to="/admin/dashboardviewempdetails/L" style={{ color: '#212529', textDecoration: 'none' }}>
                      <div className='mb-3 card__container__powerbi'>
                        <div className='image__container'>
                          <img src={leave} alt="" className='dash-img-power' />
                        </div>
                        <div className='feild__container'>
                          <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Leave</h5>
                          <h3 className='feild__value'>{leaveCount}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div>
                    <Link to="/admin/dashboardviewempdetails/A" style={{ color: '#212529', textDecoration: 'none' }}>
                      <div className='mb-3 card__container__powerbi'>
                        <div className='image__container'>
                          <img src={absent} alt="" className='dash-img-power' />
                        </div>
                        <div className='feild__container'>
                          <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Absent</h5>
                          <h3 className='feild__value'>{absentCount}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div>
                    <Link to="/admin/dashboardviewempdetails/ON" style={{ color: '#212529', textDecoration: 'none' }}>
                      <div className='mb-3 card__container__powerbi'>
                        <div className='image__container'>
                          <img src={OnDuty} alt="" className='dash-img-power-onduty' />
                        </div>
                        <div className='feild__container__onduty'>
                          <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>On Duty</h5>
                          <h3 className='feild__value'>{onDutyCount}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div>
                    <Link to="/admin/missedcount" style={{ color: '#212529', textDecoration: 'none' }}>

                      <div className='mb-3 card__container__powerbi'>
                        <div className='image__container'>
                          <img src={MissedCount} alt="" className='dash-img-power' />
                        </div>
                        <div className='feild__container'>
                          <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Missed Count</h5>
                          <h3 className='feild__value'>{missedCount}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div>
                    <Link to="/admin/dashboardviewempdetails/ME" style={{ color: '#212529', textDecoration: 'none' }}>
                      <div className='mb-3 card__container__powerbi'>
                        <div className='image__container'>
                          <img src={ManualEntry} alt="" className='dash-img-power-Manualentry' />
                        </div>
                        <div className='feild__container__Manualentry'>
                          <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Manual Entry</h5>
                          <h3 className='feild__value'>{manualEntryCount}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div>
                    <Link to="/admin/dashboardvisitors" style={{ color: '#212529', textDecoration: 'none' }}>
                      <div className='mb-3 card__container__powerbi'>
                        <div className='image__container'>
                          <img src={TotalVisitors} alt="" className='dash-img-power' />
                        </div>
                        <div className='feild__container'>
                          <h5 className='feild__title text-base md:text-lg lg:text-lg xl:text-lg'>Total Visitors</h5>
                          <h3 className='feild__value'>{totalVisitors}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      }
      <iframe
        title="Power BI Report"
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen="true"
      ></iframe>
    </div>
  );
};

export default AttendanceDashboardPowerBIReport;