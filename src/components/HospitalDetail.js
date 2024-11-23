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

  return (
      <div className="hospital-detail-panel">
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="hospital-name">{hospital.name}</h2>
        <p className="hospital-address">주소: {hospital.address}</p>
        <p className="hospital-phone">전화번호: {hospital.phoneNumber || "정보 없음"}</p>
        <p className="hospital-specialty">전문 분야: {hospital.specialtyKorean || hospital.specialty}</p>
        <p className="hospital-rating">총 평점: {averageRating ? `${averageRating} / 5` : "평점 없음"}</p>
        <p className="hospital-website">
          웹사이트:{" "}
          {hospital.websiteUrl ? (
              <a href={hospital.websiteUrl} target="_blank" rel="noopener noreferrer">
                {hospital.websiteUrl}
              </a>
          ) : (
              "정보 없음"
          )}
        </p>
        <ReviewForm
            hospitalId={hospital.id}
            onReviewSubmit={(newReview) =>
                setReviews((prevReviews) => [...prevReviews, newReview])
            }
        />
        <div className="reviews-section">
          {reviews.length === 0 ? (
              <p>리뷰가 없습니다.</p>
          ) : (
              reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <p>작성자: {review.username}</p>
                    <p>작성일: {new Date(review.createdAt).toLocaleDateString()}</p>
                    <p>내용: {review.content}</p>
                    <p>평점: {review.rating}점</p>
                    {/* 이미지 렌더링 */}
                    {review.photos && review.photos.length > 0 && (
                        <div className="review-photos">
                          {review.photos.map((photo) => (
                              <img
                                  key={photo.id}
                                  src={photo.url}
                                  alt="리뷰 이미지"
                                  style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                              />
                          ))}
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
