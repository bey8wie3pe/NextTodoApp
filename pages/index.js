// pages/index.js
import React from 'react';
import Link from 'next/link';
const HomePage = () => {
  return (
    <div>
      <h1>Welcome to my Todo app!</h1>
      <Link href='/LoginPage'>
      <div>loginpage to go</div>
      </Link>
    </div>
  );
};

export default HomePage;
