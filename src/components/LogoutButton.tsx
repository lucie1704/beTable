'use client'

import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: '/login'
    });
  }

  return (
    <button onClick={handleLogout}>Se déconnecter</button>
  )
}

export default LogoutButton;
