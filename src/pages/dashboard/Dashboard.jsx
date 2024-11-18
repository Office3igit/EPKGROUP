import React, { useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import axios from 'axios';


export default function MainDashboard() {

    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    const userrole = userData.userrole || '';
    const usertoken = userData?.token || '';
    const requestData={
        auth:usertoken
    }

    useEffect(() => {
        axios.post('https://epkgroup.in/crm/api/public/api/login_test',requestData, {
        })
            .then(response => {
                console.log("res",response);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    }, []);


    return (
        <div>
            {userrole === '1' && <AdminDashboard />}
            {userrole === '2' && (
                <>
                    <div style={{paddingBottom:'50px'}}>
                        <AdminDashboard />
                    </div>
                  
                </>
            )}
            {!['1', '2'].includes(userrole) && <UserDashboard />}
        </div>
    );
}
