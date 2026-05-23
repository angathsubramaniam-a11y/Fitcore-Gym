import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore sessions from localStorage
    const adminToken = localStorage.getItem('fitcore_admin_token');
    const adminUser = localStorage.getItem('fitcore_admin_user');
    if (adminToken && adminUser) {
      setAdmin({ token: adminToken, user: JSON.parse(adminUser) });
    }

    const trainerToken = localStorage.getItem('fitcore_trainer_token');
    const trainerUser = localStorage.getItem('fitcore_trainer_user');
    if (trainerToken && trainerUser) {
      setTrainer({ token: trainerToken, user: JSON.parse(trainerUser) });
    }

    const memberToken = localStorage.getItem('fitcore_member_token');
    const memberUser = localStorage.getItem('fitcore_member_user');
    if (memberToken && memberUser) {
      setMember({ token: memberToken, user: JSON.parse(memberUser) });
    }

    setLoading(false);
  }, []);

  const loginAdmin = (token, user) => {
    localStorage.setItem('fitcore_admin_token', token);
    localStorage.setItem('fitcore_admin_user', JSON.stringify(user));
    setAdmin({ token, user });
  };

  const logoutAdmin = () => {
    localStorage.removeItem('fitcore_admin_token');
    localStorage.removeItem('fitcore_admin_user');
    setAdmin(null);
  };

  const loginTrainer = (token, user) => {
    localStorage.setItem('fitcore_trainer_token', token);
    localStorage.setItem('fitcore_trainer_user', JSON.stringify(user));
    setTrainer({ token, user });
  };

  const logoutTrainer = () => {
    localStorage.removeItem('fitcore_trainer_token');
    localStorage.removeItem('fitcore_trainer_user');
    setTrainer(null);
  };

  const loginMember = (token, user) => {
    localStorage.setItem('fitcore_member_token', token);
    localStorage.setItem('fitcore_member_user', JSON.stringify(user));
    setMember({ token, user });
  };

  const logoutMember = () => {
    localStorage.removeItem('fitcore_member_token');
    localStorage.removeItem('fitcore_member_user');
    setMember(null);
  };

  const getAuthHeaders = (role) => {
    if (role === 'admin' && admin) return { Authorization: `Bearer ${admin.token}` };
    if (role === 'trainer' && trainer) return { Authorization: `Bearer ${trainer.token}` };
    if (role === 'member' && member) return { Authorization: `Bearer ${member.token}` };
    return {};
  };

  return (
    <AuthContext.Provider value={{
      admin,
      trainer,
      member,
      loading,
      loginAdmin,
      logoutAdmin,
      loginTrainer,
      logoutTrainer,
      loginMember,
      logoutMember,
      getAuthHeaders
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
