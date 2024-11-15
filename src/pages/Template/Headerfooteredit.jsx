import React, { useRef, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import '../HRsupport/css/Templatestyle.css'
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';



function Head_footer_layout() {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/headFooter`);
    };

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ------------------------------------------------------------------------------------------------
    // Add Shift Slot submit

    // For Header and footer
    const headerFileInputRef = useRef(null);
    const footerFileInputRef = useRef(null);

    const [headerAttachment, setHeaderAttachment] = useState(null);
    const [footerAttachment, setFooterAttachment] = useState(null);
    const [title, setTitle] = useState('');



    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [footerImagePreviewUrl, setFooterImagePreviewUrl] = useState('');
    // f


    // const [status, setStatus] = useState('');
    // const [file, setFile] = useState(null);

    const [refreshKey, setRefreshKey] = useState(0);

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     setFile(file);
    // };

    const [formErrors, setFormErrors] = useState({});

    const { id } = useParams();


    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form fields
        const errors = {};

        if (!title) {
            errors.title = 'Title is required.';
        }

        if (!headerAttachment) {
            errors.headerAttachment = 'Header Attachment is required.';
        }

        if (!footerAttachment) {
            errors.footerAttachment = 'Footer Attachment is required.';
        }
        // if (!status) {
        //     errors.status = 'Status is required.';
        // }
        // if (!file) {
        //     errors.file = 'File is required.';
        // }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});


        const formData = new FormData();
        formData.append('created_by', userempid);
        // formData.append('status', status);
        formData.append('title', title);
        formData.append('header_attached', headerAttachment);
        formData.append('footer_attached', footerAttachment);
        formData.append('id', id);

        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        axios.post('https://epkgroup.in/crm/api/public/api/update_header_footer', formData, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { status, message } = response.data;
                if (status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: message,
                    });
                    setRefreshKey(prevKey => prevKey + 1);
                    navigate(-1);
                    // handleCancel();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Operation Failed',
                        text: message,
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error creating the shift slot. Please try again later.',
                });
                console.error('There was an error with the API:', error);
            });

    };

    const fileInputRef = useRef(null);

    const handleCancel = () => {
        setTitle('');
        setImagePreviewUrl('');
        setFooterImagePreviewUrl('');
        // setStatus('')
        // setFile(null)
        setFormErrors({});

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        //Header And Footer
        headerFileInputRef.current.value = null;
        footerFileInputRef.current.value = null;

        setHeaderAttachment(null);
        setFooterAttachment(null);
        
    };

    const handleHeaderAttachmentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
                setHeaderAttachment(file);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreviewUrl('');
            setHeaderAttachment(null);
        }
    };

    const handleFooterAttachmentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFooterImagePreviewUrl(reader.result);
                setFooterAttachment(file);
            };
            reader.readAsDataURL(file);
        } else {
            setFooterImagePreviewUrl('');
            setFooterAttachment(null);
        }
    };

    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);


    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        setLoading(false);
    };

    useEffect(() => {
        axios.get(`https://epkgroup.in/crm/api/public/api/edit_header_footer/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    // setData(res.data.data);
                    console.log("setData----------->", res.data.data)
                    const data = res.data.data
                    setTitle(data.company_title);
                    setHeaderAttachment(data.header_layout);
                    setImagePreviewUrl(`https://epkgroup.in/crm/api/storage/app/${data.header_layout}`);
                    setFooterImagePreviewUrl(`https://epkgroup.in/crm/api/storage/app/${data.footer_layout}`);
                    setFooterAttachment(data.footer_layout);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    // ========================================
    // pagination, search, print state

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const componentRef = React.useRef();

    // loading state
    const [loading, setLoading] = useState(true);

    // ========================================
    // print start

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // print end
    // ========================================


    // ========================================
    // CSV start


    const handleExportCSV = () => {
        const csvData = tableData.map(({ title, status }, index) => ({
            '#': index + 1,
            title,
            status,

        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Title', key: 'title' },
            { label: 'Status', key: 'status' },

        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Company Policy.csv',
        };

        return <CSVLink {...csvReport}><i className="fas fa-file-csv" style={{ fontSize: '25px', color: '#0d6efd' }}></i></CSVLink>;
    };

    // csv end
    // ========================================


    // ========================================
    // PDF start

    const handleExportPDF = () => {
        const unit = 'pt';
        const size = 'A4'; // You can change to 'letter' or other sizes as needed
        const doc = new jsPDF('landscape', unit, size);

        const data = tableData.map(({ title, status }, index) => [
            index + 1,
            title,
            status,

        ]);

        doc.autoTable({
            head: [['S.No', 'Title', 'Status']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('Company Policy.pdf');

    };

    // PDF End
    // ========================================

    // ========================================
    // Fillter start

    const filteredData = tableData.filter((row) =>
        Object.values(row).some(
            (value) =>
                (typeof value === 'string' || typeof value === 'number') &&
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Fillter End
    // ========================================

    const filteredleaveData = filteredData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // ============================================

    const myStyles = {
        color: 'white',
        fontSize: '16px',
        border: '1px solid #0d6efd',
        marginRight: '15px',
        borderRadius: '21px',
        padding: '5px 7px',
        boxShadow: 'rgba(13, 110, 253, 0.5) 0px 0px 10px 1px'
    };

    const myStyles1 = {
        color: '#0d6efd',
        fontSize: '16px',
        border: '1px solid #0d6efd',
        marginRight: '15px',

        padding: '5px 7px',
        boxShadow: 'rgba(13, 110, 253, 0.5) 0px 0px 10px 1px'
    };

    // ===============================================

    const handleDownload = (url, filename) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(console.error);
    };


    return (
        <>
            <style>
                { `@media print {
            .no-print {
              display: none !important;
            }
          }
        `}
            </style>

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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Template</h3>


                    {/* ------------------------------------------------------------------------------------------------ */}
                    {(userrole === "1" || userrole === "2") && (
                        <>
                            <h5 className='mb-2'>Add Header Footer</h5>
                            {/* shift slot add form */}
                            <div className='mb-5' style={{
                                background: '#ffffff',
                                padding: '60px 40px',
                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)',
                                margin: '2px'
                            }}>
                                <Row className='mb-3'>
                                    <Form.Group controlId="formTitle">
                                        <Form.Label style={{ fontWeight: 'bold' }}>Company Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter company name" value={title} onChange={(e) => setTitle(e.target.value)} />
                                        {formErrors.title && <span className="text-danger">{formErrors.title}</span>}
                                    </Form.Group>
                                </Row>

                                <Row className='mb-3'>
                                    {/* Title Input Field */}
                                    <Col>
                                        <div className="mb-3">
                                            <label className="form-label">Insert Header</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={headerFileInputRef}
                                                onChange={handleHeaderAttachmentChange}
                                                className="form-control"
                                            />
                                            {formErrors.headerAttachment && <span className="text-danger">{formErrors.headerAttachment}</span>}
                                            {imagePreviewUrl && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <img src={imagePreviewUrl} alt="Header Preview" style={{ width: '30%', height: '100px', objectFit: 'contain' }} />
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                    {/* Status Selection Dropdown */}
                                    <Col>
                                        <div className="mb-3">
                                            <label className="form-label">Insert Footer</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={footerFileInputRef}
                                                onChange={handleFooterAttachmentChange}
                                                className="form-control"
                                            />
                                            {formErrors.footerAttachment && <span className="text-danger">{formErrors.footerAttachment}</span>}
                                            {footerImagePreviewUrl && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <img src={footerImagePreviewUrl} alt="Footer Preview" style={{ width: '30%', height: '100px', objectFit: 'contain' }} />
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>

                                    {/* Action Buttons */}
                                    <div className='mt-3 submit__cancel'>
                                        <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSubmit}>
                                            Update
                                        </Button>
                                        <Button variant="secondary" onClick={GoToEditPage} className='shift__cancel__btn'>
                                            Cancel
                                        </Button>
                                    </div>
                                </Row>
                            </div>
                        </>
                    )}

                    {/* ------------------------------------------------------------------------------------------------ */}


                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}

                </Container>


            )}
        </>



    )
}

export default Head_footer_layout