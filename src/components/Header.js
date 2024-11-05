import React from 'react';

function Header() {
  return (
      <header>
        <h1>병원 추천 서비스</h1>
        <input type="text" placeholder="병원 검색" />
        <div className="user-profile">
          <button>로그인</button>
          <button>회원가입</button>
        </div>
      </header>
  );
}

export default Header;
