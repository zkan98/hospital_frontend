// src/components/Reviews.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reviews = ({ hospitalId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await axios.get(`/api/reviews?hospitalId=${hospitalId}`);
      setReviews(response.data);
    };

    fetchReviews();
  }, [hospitalId]);

  return (
      <div>
        <h2>리뷰</h2>
        {reviews.length === 0 ? (
            <p>리뷰가 없습니다.</p>
        ) : (
            reviews.map((review) => (
                <div key={review.id}>
                  <p>{review.text}</p>
                  <p>평점: {review.rating}</p>
                </div>
            ))
        )}
      </div>
  );
};

export default Reviews;
