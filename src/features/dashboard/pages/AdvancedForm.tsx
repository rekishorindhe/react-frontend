import React, { useState } from 'react';
import { Form, Input, Button, Upload, Card, Row, Col, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RichTextEditor from './RichTextEditor';
import type { UploadFile } from 'antd/es/upload/interface';

// Zod schema for advanced form validation
const advancedFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .min(1)
    .refine(
      (val) => val.replace(/<[^>]*>/g, '').trim().length >= 10,
      'Description must be at least 10 characters (excluding HTML tags)'
    ),
  price: z.number().min(0.01, 'Price must be greater than 0').max(10000, 'Price must not exceed 10000'),
  category: z.string().min(1, 'Category is required'),
  images: z
    .array(z.instanceof(File))
    .min(1, 'At least one image is required')
    .max(5, 'Maximum 5 images allowed')
    .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), 'Each image must be less than 5MB')
    .refine((files) => files.every((file) => file.type.startsWith('image/')), 'All files must be images'),
});

type FormData = z.infer<typeof advancedFormSchema>;

const AdvancedForm: React.FC = () => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(advancedFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      category: '',
      images: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setUploading(true);
    try {
      // Create FormData for submission (binary files + HTML description)
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description); // Rich HTML content
      formData.append('price', data.price.toString());
      formData.append('category', data.category);
      data.images.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      // Submit to server
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log('Server Response:', result); // e.g., { success: true, productImageUrls: [...] }

      message.success('Form submitted successfully!');
      reset();
      form.setFieldsValue({ images: [], description: '' });
    } catch (error) {
      message.error(`Submission failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card title="Advanced Product Form with Tiptap Editor" style={{ maxWidth: 1000, margin: '0 auto', background: '#1f1f1f', color: '#d9d9d9' }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Title" validateStatus={errors.title ? 'error' : ''} help={errors.title?.message}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter product title" style={{ background: '#2c2c2c', color: '#d9d9d9', borderColor: '#434343' }} />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Price" validateStatus={errors.price ? 'error' : ''} help={errors.price?.message}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    placeholder="Enter price"
                    style={{ background: '#2c2c2c', color: '#d9d9d9', borderColor: '#434343' }}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Category" validateStatus={errors.category ? 'error' : ''} help={errors.category?.message}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter category"
                suffix={<PlusOutlined style={{ color: '#d9d9d9' }} />}
                style={{ background: '#2c2c2c', color: '#d9d9d9', borderColor: '#434343' }}
              />
            )}
          />
        </Form.Item>

        {/* Tiptap rich text editor for description */}
        <Form.Item
          label="Description (Tiptap Editor)"
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Enter rich product description with images, formatting, etc."
              />
            )}
          />
        </Form.Item>

        {/* Product images upload (thumbnails/covers) */}
        <Form.Item
          label="Product Images (Thumbnails/Covers)"
          validateStatus={errors.images ? 'error' : ''}
          help={errors.images?.message}
        >
          <Controller
            name="images"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Upload
                listType="picture-card"
                fileList={value.map((file: File, index: number) => ({
                  uid: `-${index}`,
                  name: file.name,
                  status: 'done' as const,
                  url: URL.createObjectURL(file),
                }))}
                onChange={({ fileList }) => {
                  const files = fileList
                    .filter((f) => f.originFileObj)
                    .map((f) => f.originFileObj as File);
                  onChange(files);
                }}
                onRemove={(file) => {
                  if (file.url?.startsWith('blob:')) {
                    URL.revokeObjectURL(file.url);
                  }
                  return true;
                }}
                beforeUpload={() => false}
                maxCount={5}
                accept="image/*"
              >
                {value.length < 5 && (
                  <div style={{ color: '#d9d9d9' }}>
                    <UploadOutlined />
                    <div>Upload</div>
                  </div>
                )}
              </Upload>
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={uploading}
            icon={<UploadOutlined />}
            style={{ background: '#1890ff', borderColor: '#1890ff' }}
          >
            Submit Form
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AdvancedForm;