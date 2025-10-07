import { useState } from "react";
import {
  Button,
  Form,
  Input,
  Steps,
  DatePicker,
  Select,
  Divider,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginSchema, signupSchema } from "../../../api/types/auth.types";

interface LoginFormWithFormikProps {
  isSignup: boolean;
}

const { Option } = Select;

const LoginFormWithFormik: React.FC<LoginFormWithFormikProps> = ({
  isSignup,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Steps configuration
  const steps = [
    { title: "Credentials", fields: ["email", "password", "confirmPassword"] },
    {
      title: "Personal Details",
      fields: ["fullName", "phoneNumber", "dateOfBirth"],
    },
    { title: "Address", fields: ["streetAddress", "city", "country"] },
    {
      title: "Preferences",
      fields: ["emailNotifications", "smsNotifications"],
    },
  ];

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
      dateOfBirth: "",
      streetAddress: "",
      city: "",
      country: "",
      emailNotifications: false,
      smsNotifications: false,
    },
    validationSchema: toFormikValidationSchema(
      isSignup ? signupSchema : loginSchema
    ),
    validateOnChange: true,
    validateOnBlur: false, // we’re removing touched tracking
    onSubmit: async (values) => {
      if (isSignup && currentStep < steps.length - 1) {
        const fieldsToValidate = steps[currentStep].fields;
        const errors = await formik.validateForm();
        const hasErrors = fieldsToValidate.some((f) => (errors as any)[f]);
        if (hasErrors) {
          message.error("Please fix the errors before proceeding.");
        } else {
          setCurrentStep((prev) => prev + 1);
        }
        return;
      }

      const errors = await formik.validateForm();
      if (Object.keys(errors).length === 0) {
        console.log("Form Submission:", values);
        message.success("Form submitted successfully!");
        navigate("/dashboard");
      } else {
        message.error("Please complete all required fields correctly.");
      }
    },
  });

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep].fields;
    const errors = await formik.validateForm();
    const hasErrors = fieldsToValidate.some((f) => (errors as any)[f]);
    if (hasErrors) {
      message.error("Please fix the errors before proceeding.");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const { values, errors, handleChange, setFieldValue, handleSubmit } = formik;

  return (
    <Form layout="vertical" className="w-full" onFinish={handleSubmit}>
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
            validateStatus={errors.email ? "error" : ""}
            help={errors.email ?? ""}
          >
            <Input
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password}
          >
            <Input.Password
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Enter password"
              size="large"
            />
          </Form.Item>

          {isSignup && (
            <Form.Item
              label="Confirm Password"
              validateStatus={errors.confirmPassword ? "error" : ""}
              help={errors.confirmPassword}
            >
              <Input.Password
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                size="large"
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
            validateStatus={errors.fullName ? "error" : ""}
            help={errors.fullName}
          >
            <Input
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            validateStatus={errors.phoneNumber ? "error" : ""}
            help={errors.phoneNumber}
          >
            <Input
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            validateStatus={errors.dateOfBirth ? "error" : ""}
            help={errors.dateOfBirth}
          >
            <DatePicker
              value={
                values.dateOfBirth
                  ? moment(values.dateOfBirth, "YYYY-MM-DD")
                  : null
              }
              onChange={(date) =>
                setFieldValue(
                  "dateOfBirth",
                  date ? date.format("YYYY-MM-DD") : ""
                )
              }
              format="YYYY-MM-DD"
              size="large"
              className="w-full"
            />
          </Form.Item>
        </>
      )}

      {/* Step 2: Address */}
      {currentStep === 2 && (
        <>
          <Form.Item
            label="Street Address"
            validateStatus={errors.streetAddress ? "error" : ""}
            help={errors.streetAddress}
          >
            <Input
              name="streetAddress"
              value={values.streetAddress}
              onChange={handleChange}
              placeholder="Enter street address"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="City"
            validateStatus={errors.city ? "error" : ""}
            help={errors.city}
          >
            <Input
              name="city"
              value={values.city}
              onChange={handleChange}
              placeholder="Enter city"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Country"
            validateStatus={errors.country ? "error" : ""}
            help={errors.country}
          >
            <Input
              name="country"
              value={values.country}
              onChange={handleChange}
              placeholder="Enter country"
              size="large"
            />
          </Form.Item>
        </>
      )}

      {/* Step 3: Preferences */}
      {currentStep === 3 && (
        <>
          <Form.Item
            label="Email Notifications"
            validateStatus={errors.emailNotifications ? "error" : ""}
            help={errors.emailNotifications}
          >
            <Select
              value={values.emailNotifications}
              onChange={(val) => setFieldValue("emailNotifications", val)}
              size="large"
              placeholder="Select email notification preference"
            >
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="SMS Notifications"
            validateStatus={errors.smsNotifications ? "error" : ""}
            help={errors.smsNotifications}
          >
            <Select
              value={values.smsNotifications}
              onChange={(val) => setFieldValue("smsNotifications", val)}
              size="large"
              placeholder="Select SMS notification preference"
            >
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
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
            htmlType={currentStep < steps.length - 1 ? "button" : "submit"}
            onClick={currentStep < steps.length - 1 ? handleNext : undefined}
          >
            {currentStep < steps.length - 1
              ? "Next"
              : isSignup
              ? "Sign Up"
              : "Login"}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default LoginFormWithFormik;
