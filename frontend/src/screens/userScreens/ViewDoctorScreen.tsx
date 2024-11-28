import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom';
import { Container, Card, Button, Spinner, Row, Col, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.js';
import { IDoc } from '../../types/doctorInterface'
import { IReview } from '../../types/reviewInterface.js';
import { useUserViewDoctorQuery,
         useUserFetchDoctorReviewsQuery,
         useUserAddDoctorReviewMutation
        } from '../../slices/userSlices/userApiSlice';
import { skipToken } from '@reduxjs/toolkit/query/react';
import './style.css';
import { toast } from 'react-toastify';

const ViewDoctorScreen: React.FC = () => {
  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [doctor, setDoctor] = useState<IDoc | null>(null);
  const [reviews, setReviews] = useState<IReview[] | []>([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number>(0);

  const { data, error, isLoading } = useUserViewDoctorQuery(email);
  const { data: reviewsData,  
          isError, refetch }       = useUserFetchDoctorReviewsQuery(doctor?._id? doctor._id.toString() : skipToken);
  const [addReview, { isLoading: isAddingReview }] = useUserAddDoctorReviewMutation();

  useEffect(() => {
    if (data) {
      setDoctor(data);
    }
  }, [data]);

  useEffect(() => {
    if (reviewsData) {
      setReviews(reviewsData.result)
    }
  }, [reviewsData]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('You need to be logged in to submit a review.');
      return;
    }

    try {
      const response = await addReview({
        doctorId: doctor?._id,
        rating,
        comment,
      }).unwrap();
      
      toast.success(response.message || 'success')
      setComment('');
      setRating(0);
      refetch(); 
    } catch (error:any) {
      toast.error(error.data.message || 'Failed to submit review. Please try again.');
    }
  };

  if (isLoading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <h2 className="text-danger text-center my-5">Failed to load doctor details.</h2>;

  return (
    <Container fluid className="view-doctor-screen d-flex align-items-center mt-5">
      {doctor && (
        <Card className="doctor-card shadow w-100">
          <Row>
            {/* Left side - Profile Picture */}
            <Col md={4} className="text-center">
              <img
                src={`http://localhost:5000/${doctor.profilePicture}`}
                alt={`${doctor.name}'s profile`}
                className="doctor-profile-img mb-3"
              />
            </Col>

            {/*  Right side - Personal Details & Appointment Box  */}
            <Col md={8}>
              <h2 className="display-6 mb-3">Dr. {doctor.name}</h2>

                {/* Personal Details with Appointment Box */}
                <Row>
                {/* Personal Details */}
                <Col md={7}>
                    <section className="doctor-details mb-4">
                      <h4>Personal Details</h4>
                      <p><strong>Specialization:</strong> {doctor.specialization}</p>
                      <p><strong>Experience:</strong> {doctor.experience} years</p>
                    </section>

                    {/* Contact Details */}
                    <section className="doctor-details mb-4">
                      <h4>Contact Details</h4>
                      <p><strong>Email:</strong> {doctor.email}</p>
                      <p><strong>Phone:</strong> {doctor.phone}</p>
                      <p><strong>Address:</strong> {doctor.address?.clinicName}, {doctor.address?.district}, {doctor.address?.city}</p>
                    </section>
                    {/* About */}                 
                </Col>
                
            {/* Right section - Ticket Price & Time Slots */}
            <Col md={5}>
              <Card className="p-4 shadow-lg rounded border-0">
                  {/* Ticket Price */}
                  <div className="text-center mb-4">
                    <h5 className="text-uppercase text-muted">Ticket Price</h5>
                    <p className="display-4 text-primary fw-bold">₹ {doctor.consultationFee}</p>
                  </div>

                  {/* Book Button */}
                  <Button 
                    variant="primary" 
                    className="w-100 py-2 shadow rounded-pill"
                    disabled={doctorInfo !== null}
                    onClick={() => navigate("/user/book-slot", { state: { doctor } })}>
                    <i className="bi bi-calendar-plus me-2"></i> Book an Appointment
                  </Button>
              </Card>
            </Col>

          </Row>
         </Col>
           
          </Row>
          <Row>
          <section className="doctor-details mb-4">
                      <h4>About</h4>
                      <p>{doctor.bio}</p>
          </section>         
          </Row>
          <Row>
             {/* Educational Certificates */}
             <section className="doctor-details mb-4">
                      <h4>Educational Certificates</h4>
                      {doctor.documents.medicalDegree ? (
                        <img
                          src={`http://localhost:5000/${doctor.documents.medicalDegree}`}
                          alt="Degree Certificate"
                          className="degree-certificate-img"
                        />
                      ) : (
                        <p>No certificate available</p>
                      )}
                    </section>
          </Row>

          {/* Review section */}
          <Row>
            <Col xs={12}>
              <section className="review-section mt-4">
                <h4 className="mb-4">Patient Reviews</h4>
                <div className="review-container w-100">
                  <Card className="shadow-sm p-4">
                    {reviews && reviews.length > 0 ? (
                      reviews.map((review: any) => (
                        <div key={review._id} className="review-item mb-4">
                          <div className="d-flex align-items-start">
                            <div className="review-avatar me-3">

                              {review.patientId.profilePicture ? (
                                  <img
                                  src={`http://localhost:5000/${review.patientId.profilePicture}`}
                                  alt={`${review.patientId.name}'s profile`}
                                  className="review-profile-img"
                                  />
                                ) : (
                                  <i className="bi bi-person-circle display-4 text-secondary"></i>
                                )}

                            </div>
                            <div className="review-content">
                              <h5 className="review-title mb-1">
                                {review.patientId.name}{' '}
                                <span className="star-rating">
                                  {[...Array(5)].map((_, index) => (
                                    <span key={index} className={index < review.rating ? 'star-filled' : 'star-empty' }>
                                      ★
                                    </span> 
                                  ))}
                                </span>
                              </h5>
                              <p className="review-comment mb-0">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No reviews available yet. Be the first to leave a review!</p>
                    )}
                  </Card>
                </div>
              </section>

              <section className="add-review-section mt-4">
                <h4>Add Your Review</h4>
                <Card className="shadow-sm p-4 w-100">
                  <Form onSubmit={handleSubmitReview}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                      >
                        <option value="">Select Rating</option>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <option key={star} value={star}>
                            {star} {star === 1 ? 'Star' : 'Stars'}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary" disabled={isAddingReview}>
                      {isAddingReview ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        'Submit Review'
                      )}
                    </Button>
                  </Form>
                </Card>
              </section>
            </Col>
          </Row>

        </Card>
      )}
    </Container>
  );
};

export default ViewDoctorScreen;
