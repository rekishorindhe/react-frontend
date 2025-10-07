import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <Card className="w-full max-w-md shadow-lg">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-4">404</h1>
        <p className="text-center mb-6 text-gray-600">Oops! The page you're looking for doesn't exist.</p>
        <div className="flex justify-center">
          <Button type="primary" size="large" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;