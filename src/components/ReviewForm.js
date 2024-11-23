import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import '../ReviewForm.css';

const ReviewForm = ({ hospitalId, onReviewSubmit }) => {
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(0); // 호버 상태의 별점 추가
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async () => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    const formData = new FormData();
    const reviewDTO = {
      rating: parseInt(rating),
      content: content || null,
    };

    formData.append('review', new Blob([JSON.stringify(reviewDTO)], { type: 'application/json' }));
    if (image) formData.append('image', image);

    try {
      const response = await axiosInstance.post('/reviews', formData, {
        params: { userId, hospitalId },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('리뷰가 제출되었습니다.');
      onReviewSubmit(response.data);
      setRating(1);
      setHoverRating(0); // 초기화
      setContent('');
      setImage(null);
    } catch (error) {
      console.error('리뷰 제출 오류:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('리뷰 제출에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
      <div className="review-form">
        <h2>리뷰 작성</h2>
        <div className="rating-section">
          <label>별점 선택:</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((num) => (
                <span
                    key={num}
                    className={`star ${hoverRating >= num ? 'hovered' : ''} ${rating >= num ? 'selected' : ''}`}
                    onClick={() => setRating(num)}
                    onMouseEnter={() => setHoverRating(num)}
                    onMouseLeave={() => setHoverRating(0)}
                >
              ★
            </span>
            ))}
          </div>
        </div>
        <textarea
            className="review-textarea"
            placeholder="리뷰 작성 (선택 사항)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
        <input type="file" className="file-input" onChange={handleFileChange} />
        <button className="submit-button" onClick={handleSubmit}>리뷰 제출</button>
      </div>
  );
};

export default ReviewForm;
