'use client'
import React, { useState, useEffect } from 'react';
import GameScreen from "@/components/modules/game-screen";
import LoginForm from "@/components/modules/login-form";


interface User {
  username: string;
  userType: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (username: string, userType: string) => {
    if (username.trim() === '') {
      setError('Username cannot be empty');
      return;
    }

    const newUser: User = {
      username,
      userType
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setError('');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  if (user) {
    return <GameScreen user={user} />;
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoginForm onSubmit={handleSubmit} error={error} />
      </div>
  );
}
