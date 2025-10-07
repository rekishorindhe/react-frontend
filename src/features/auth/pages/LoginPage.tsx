import { Card } from 'antd';
import LoginForm from '../components/LoginForm';

interface LoginPageProps {
  isSignup?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ isSignup = false }) => {
  return (
    <div className="flex justify-center items-center max-h-screen ">
      <Card className="w-full max-w-[800px] shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isSignup ? 'Sign Up' : 'Login'}
        </h2>
        <LoginForm isSignup={isSignup} />
      </Card>
    </div>
  );
};

export default LoginPage;