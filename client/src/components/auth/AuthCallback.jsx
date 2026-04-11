import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const refresh = searchParams.get('refresh');
    if (token) {
      localStorage.setItem('accessToken', token);
      if (refresh) localStorage.setItem('refreshToken', refresh);
      fetchUser().then(() => navigate('/'));
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, fetchUser]);

  return (
    <div className="loading-screen">
      <div className="spinner" />
    </div>
  );
};

export default AuthCallback;
