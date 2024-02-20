// pages/signup.js

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Signup = () => {
  const [user_name, setUser_name] = useState('');
  const [password, setPassword] = useState('');

  const signup = () => {
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_name, password })
    })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="container">
      <h1 className="mt-5 mb-4 text-center">アカウント作成</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <a href="/LoginPage" className="d-block mb-4">アカウントをお持ちの方はこちら</a>
          <div className="form-group">
            <label htmlFor="user_name">ユーザー名</label>
            <input type="text" className="form-control" id="user_name" name="user_name" value={user_name} onChange={(e) => setUser_name(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input type="password" className="form-control" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="button" id="signup" className="btn btn-primary" onClick={signup}>アカウント作成</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
