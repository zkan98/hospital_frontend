// HospitalDetail.js
import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import axiosInstance from '../axiosInstance';

const HospitalDetail = ({ hospital, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/reviews/hospital/${hospital.id}`);
      setReviews(response.data);
      calculateAverageRating(response.data);
    } catch (error) {
      console.error("리뷰 불러오기 오류:", error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(null);
    } else {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating((totalRating / reviews.length).toFixed(1));
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [hospital.id]);

  const handleReviewSubmit = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
    calculateAverageRating([...reviews, newReview]);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
      alert("리뷰가 삭제되었습니다.");
    } catch (error) {
      console.error("리뷰 삭제 오류:", error);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  const handleEditReview = (reviewId) => {
    alert("수정 기능은 개발 중입니다.");
  };

  return (
      <div className="hospital-detail-panel">
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="hospital-name">{hospital.name}</h2>
        <p className="hospital-address">주소: {hospital.address}</p>
        <p className="hospital-phone">전화번호: {hospital.phoneNumber || "정보 없음"}</p>
        <p className="hospital-specialty">전문 분야: {hospital.specialtyKorean || hospital.specialty}</p>
        <p className="hospital-rating">총 평점: {averageRating ? `${averageRating} / 5` : "평점 없음"}</p>
        <ReviewForm hospitalId={hospital.id} onReviewSubmit={handleReviewSubmit} />
        <div className="reviews-section">
          {reviews.length === 0 ? (
              <p>리뷰가 없습니다.</p>
          ) : (
              reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <p>작성자: {review.username}</p> {/* 작성자 이름 표시 */}
                    <p>작성일: {new Date(review.createdAt).toLocaleDateString()}</p>
                    <p>내용: {review.content}</p>
                    <p>평점: {review.rating}점</p>
                    {review.photos && review.photos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo.url}
                            alt="리뷰 이미지"
                            style={{ width: '100px', height: 'auto', marginTop: '10px' }}
                        />
                    ))}
                    {review.userId === parseInt(localStorage.getItem('userId')) && (
                        <div>
                          <button onClick={() => handleEditReview(review.id)}>수정</button>
                          <button onClick={() => handleDeleteReview(review.id)}>삭제</button>
                        </div>
                    )}
                  </div>
              ))
          )}
        </div>
      </div>
  );
};

export default HospitalDetail;
