import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 백엔드 서버 IP 주소와 포트로 수정
      await axios.post('http://3.36.148.12:8080/api/users/register', { username, password, email });
      alert('회원가입이 성공적으로 완료되었습니다.');
      // 회원가입 성공 후 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
      <div>
        <h2>회원가입</h2>
        <form onSubmit={handleRegister}>
          <input
              type="text"
              placeholder="사용자 이름"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />
          <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">회원가입</button>
        </form>
      </div>
  );
}

export default Register;
