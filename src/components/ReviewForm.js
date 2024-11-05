import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ hospitalId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('review', review);
    formData.append('hospitalId', hospitalId);
    if (image) formData.append('image', image);

    try {
      await axios.post(`/api/reviews`, formData);
      alert('리뷰가 제출되었습니다.');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
      <div>
        <h2>리뷰 작성</h2>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value={0}>별점 선택</option>
          {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}점</option>
          ))}
        </select>
        <textarea
            placeholder="리뷰 작성"
            value={review}
            onChange={(e) => setReview(e.target.value)}
        />
        <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
        />
        <button onClick={handleSubmit}>리뷰 제출</button>
      </div>
  );
};

export default ReviewForm;
