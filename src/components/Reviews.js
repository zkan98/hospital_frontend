import React from 'react';

const Reviews = ({ reviews }) => {
  return (
      <div>
        <h2>리뷰</h2>
        {reviews.length === 0 ? (
            <p>리뷰가 없습니다.</p>
        ) : (
            reviews.map((review) => (
                <div key={review.id}>
                  <p>{review.content}</p>
                  <p>평점: {review.rating}점</p>
                </div>
            ))
        )}
      </div>
  );
};

export default Reviews;
