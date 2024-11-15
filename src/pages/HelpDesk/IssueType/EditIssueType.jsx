import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';

function EditIssueType() {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add shiftslot page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitaddshiftslot = () => {
        navigate(`/admin/addissue`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------

    // Issue type Slot Save

    const [issueType, setIssueType] = useState();
    const [status, setStatus] = useState();
    const [formErrors, setFormErrors] = useState({});


    const handleSave = (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        if (!issueType) {
            errors.issueType = 'Issue Type Name is required.';
        }

        if (!status) {
            errors.status = 'Status is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        const requestData = {
            id: id,
            issue_type_name: issueType,
            status: status,
            updated_by: userempid
        };


        axios.put(`https://epkgroup.in/crm/api/public/api/update_issuetype`, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Issue Type has been updated successfully!',
                    });
                    handleVisitaddshiftslot()

                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating the Issue Type. Please try again later.',
                });

                console.error('There was an error with the API:', error);
            });
    };
    const handleCancel = () => {
        handleVisitaddshiftslot()
        setFormErrors({});
    };
    const handleInputChange = (setter) => (e) => {
        let value = e.target.value;
        if (value.startsWith(' ')) {
            value = value.trimStart();
        }
        setter(value);
    };
    // ------------------------------------------------------------------------------------------------
    // fetch data fromapi to set initial issue type state
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get(`http://epkgroup.in/crm/api/public/api/editnewview_raiselist/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.data);
                    setIssueType(res.data.data.issue_type_name);
                    setStatus(res.data.data.status);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);
    console.log("vieweditraisedata------------->", data)
    // ------------------------------------------------------------------------------------------------
    return (
        <>
            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f6f6f6'
                }}>
                    <ScaleLoader color="rgb(20 166 249)" />
                </div>
            ) : (
                <Container fluid className='shift__container'>
                    <h5 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Issue Type</h5>

                    {/* Issue Type Edit form */}
                    <Row className='mb-5 shift__row'>
                        <Col>
                            <Form>
                                <Form.Group controlId="formShift">
                                    <Form.Label style={{ fontWeight: 'bold', color: 'rgb(0, 39, 92)' }}>Issue Type</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Issue Type" value={issueType} onChange={(e) => handleInputChange(setIssueType)(e)} />
                                    {formErrors.issueType && <span className="text-danger">{formErrors.issueType}</span>}
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col>
                            <Form.Group controlId="formStatus">
                                <Form.Label style={{ fontWeight: 'bold', color: 'rgb(0, 39, 92)' }}>Status</Form.Label>
                                <Form.Control as="select" value={status} onChange={(e) => handleInputChange(setStatus)(e)}>
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="In-Active">In-Active</option>
                                </Form.Control>
                                {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                            </Form.Group>  
                        </Col>
                        <div className='submit__cancel mt-5'>
                            <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSave}>
                                Save
                            </Button>
                            <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                Cancel
                            </Button>
                        </div>
                    </Row>
                </Container>
            )}
        </>
    )
}
export default EditIssueType