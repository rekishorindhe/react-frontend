import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../context/AuthContext';
import { Button } from 'antd';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className=" p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">My App</h1>
      <div>
        {isAuthenticated ? (
          <Button type="primary" onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </Button>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;