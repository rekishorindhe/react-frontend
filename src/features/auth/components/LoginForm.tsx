import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Steps, DatePicker, Select, Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { loginSchema, signupSchema } from '../../../api/types/auth.types';

interface LoginFormProps {
  isSignup: boolean;
}

type LoginFormData = {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  streetAddress?: string;
  city?: string;
  country?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
};

const { Option } = Select;

const LoginForm: React.FC<LoginFormProps> = ({ isSignup }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, trigger,clearErrors } = useForm<LoginFormData>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phoneNumber: '',
      dateOfBirth: '',
      streetAddress: '',
      city: '',
      country: '',
      emailNotifications: false,
      smsNotifications: false,
    },
  });

  const steps = [
    { title: 'Credentials', fields: ['email', 'password', 'confirmPassword'] as (keyof LoginFormData)[] },
    { title: 'Personal Details', fields: ['fullName', 'phoneNumber', 'dateOfBirth'] as (keyof LoginFormData)[] },
    { title: 'Address', fields: ['streetAddress', 'city', 'country'] as (keyof LoginFormData)[] },
    { title: 'Preferences', fields: ['emailNotifications', 'smsNotifications'] as (keyof LoginFormData)[] },
  ];

  const stepFields = steps.map(step => step.fields);

  const onSubmit = async (data: LoginFormData) => {
    // If multi-step signup and not last step
    if (isSignup && currentStep < steps.length - 1) {
      const fieldsToValidate = stepFields[currentStep];
      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setCurrentStep((prev) => prev + 1);
      } else {
        message.error('Please fix the errors before proceeding.');
      }
      return;
    }

    // Validate entire form on last step or login
    const isValid = await trigger();
    if (isValid) {
      console.log('Form Submission:', data);
      navigate('/dashboard');
    } else {
      message.error('Please complete all required fields correctly.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

const handleNext = async () => {
  const fieldsToValidate = stepFields[currentStep];
  const isValid = await trigger(fieldsToValidate);

  if (isValid) {
    // Clear errors of the current step before moving to next step
    clearErrors(fieldsToValidate);

    // Move to next step
    setCurrentStep((prev) => prev + 1);
  } else {
    message.error('Please fix the errors before proceeding.');
  }
};


  return (
    <Form layout="vertical" className="w-full">
      {isSignup && (
        <Steps current={currentStep} className="mb-6">
          {steps.map((step) => (
            <Steps.Step key={step.title} title={step.title} />
          ))}
        </Steps>
      )}

      <Divider />

      {/* Step 0: Credentials */}
      {currentStep === 0 && (
        <>
          <Form.Item
            label="Email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter email" size="large" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Enter password" size="large" />
              )}
            />
          </Form.Item>

          {isSignup && (
            <Form.Item
              label="Confirm Password"
              validateStatus={errors.confirmPassword ? 'error' : ''}
              help={errors.confirmPassword?.message}
            >
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input.Password {...field} placeholder="Confirm password" size="large" />
                )}
              />
            </Form.Item>
          )}
        </>
      )}

      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <>
          <Form.Item
            label="Full Name"
            validateStatus={errors.fullName ? 'error' : ''}
            help={errors.fullName?.message}
          >
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter full name" size="large" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            validateStatus={errors.phoneNumber ? 'error' : ''}
            help={errors.phoneNumber?.message}
          >
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter phone number" size="large" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            validateStatus={errors.dateOfBirth ? 'error' : ''}
            help={errors.dateOfBirth?.message}
          >
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value ? moment(field.value, 'YYYY-MM-DD') : null}
                  onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                  format="YYYY-MM-DD"
                  size="large"
                  className="w-full"
                />
              )}
            />
          </Form.Item>
        </>
      )}

      {/* Step 2: Address */}
      {currentStep === 2 && (
        <>
          <Form.Item
            label="Street Address"
            validateStatus={errors.streetAddress ? 'error' : ''}
            help={errors.streetAddress?.message}
          >
            <Controller
              name="streetAddress"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter street address" size="large" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="City"
            validateStatus={errors.city ? 'error' : ''}
            help={errors.city?.message}
          >
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter city" size="large" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Country"
            validateStatus={errors.country ? 'error' : ''}
            help={errors.country?.message}
          >
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter country" size="large" />
              )}
            />
          </Form.Item>
        </>
      )}

      {/* Step 3: Preferences */}
      {currentStep === 3 && (
        <>
          <Form.Item
            label="Email Notifications"
            validateStatus={errors.emailNotifications ? 'error' : ''}
            help={errors.emailNotifications?.message}
          >
            <Controller
              name="emailNotifications"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  size="large"
                  placeholder="Select email notification preference"
                >
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="SMS Notifications"
            validateStatus={errors.smsNotifications ? 'error' : ''}
            help={errors.smsNotifications?.message}
          >
            <Controller
              name="smsNotifications"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  size="large"
                  placeholder="Select SMS notification preference"
                >
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              )}
            />
          </Form.Item>
        </>
      )}

      {/* Buttons */}
      <Form.Item>
        <div className="flex gap-4">
          {currentStep > 0 && (
            <Button onClick={handlePrevious} className="w-full">
              Previous
            </Button>
          )}
          <Button
            type="primary"
            className="w-full"
            onClick={() => isSignup ? handleNext() :  null}
          >
            { isSignup &&currentStep < steps.length - 1 ? 'Next' : isSignup ? 'Sign Up' : 'Login'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
