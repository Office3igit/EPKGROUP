import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';

function EditDocumentType() {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add Emp Document Type category page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitadddocumenttype = () => {
        navigate(`/admin/adddocumenttype`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------

    // Edit Employee Document Type  Save

    const [empdoctype, setEmpdoctype] = useState('');
    const [status, setStatus] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const handleSave = (e) => {
        e.preventDefault();
        // Validate input fields
        const errors = {};

        if (!empdoctype) {
            errors.empdoctype = 'Document Name is required.';
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
            document_name: empdoctype,
            document_status: status,
            updated_by: userempid
        };


        axios.put(`https://epkgroup.in/crm/api/public/api/update_empdoctype`, requestData, {
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
                        text: 'Employee Document Type has been updated successfully!',
                    });
                    handleVisitadddocumenttype()

                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating the Employee Document Type. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };

    const handleCancel = () => {
        setEmpdoctype('');
        setStatus('');
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
    // edit Document Type

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://epkgroup.in/crm/api/public/api/editview_empdoctype/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.data);
                    setEmpdoctype(res.data.data.document_name);
                    setStatus(res.data.data.status);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

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
                    <h5 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Employee Document Type </h5>

                    {/* Document Type add form */}

                    <Row className='mb-5 shift__row'>
                        <Col>
                            <Form>
                                <Form.Group controlId="formShift">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Employee Document Type</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Document Type (Ex: Probation)" value={empdoctype} onChange={(e) => handleInputChange(setEmpdoctype)(e)}  />
                                </Form.Group>
                                {formErrors.empdoctype && <span className="text-danger">{formErrors.empdoctype}</span>}
                            </Form>
                        </Col>
                        <Col>
                            <Form.Group controlId="formStatus">
                                <Form.Label style={{ fontWeight: 'bold' }}> Status</Form.Label>
                                <Form.Control as="select" value={status} onChange={(e) => handleInputChange(setStatus)(e)}>
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="In-Active">In-Active</option>
                                </Form.Control>
                                {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                            </Form.Group>

                        </Col>
                        <div className='submit__cancel'>
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

export default EditDocumentType