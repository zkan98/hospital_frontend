import React from 'react';
import { Link } from 'react-router-dom';

function Header({ isLoggedIn, onLogout }) {
  return (
      <header>
        <Link to="/">
          <h1>병원 추천 서비스</h1>
        </Link>
        <input type="text" placeholder="병원 검색" />
        <div className="user-profile">
          {isLoggedIn ? (
              <button onClick={onLogout}>로그아웃</button>
          ) : (
              <>
                <Link to="/login">
                  <button>로그인</button>
                </Link>
                <Link to="/register">
                  <button>회원가입</button>
                </Link>
              </>
          )}
        </div>
      </header>
  );
}

export default Header;
