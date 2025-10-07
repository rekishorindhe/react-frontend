import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <Card className="w-full max-w-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">Welcome to My App</h1>
        <p className="text-center mb-6 text-gray-600">
          This is the home page of our application. Explore the features or get started below!
        </p>
        <div className="flex justify-center gap-4">
          {isAuthenticated ? (
            <Button type="primary" size="large" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button type="primary" size="large" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="large" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
              <Button size="large" onClick={() => navigate('/formik')}>
                Formik
              </Button>
              <Button size="large" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HomePage;