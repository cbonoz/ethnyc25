'use client';

import React from 'react';
import { 
    Form, 
    Input, 
    Select, 
    Typography 
} from 'antd';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const SERVICE_CATEGORIES = [
    'Web Development',
    'Mobile Development',
    'Design & Graphics',
    'Writing & Content',
    'Marketing & SEO',
    'Consulting',
    'Photography',
    'Video Production',
    'Legal Services',
    'Accounting & Finance',
    'Other'
];

export default function ServiceDetailsForm() {
    return (
        <div>
            <Title level={3}>Service Details</Title>
            <Paragraph type="secondary">
                Describe the service you're offering and set basic requirements.
            </Paragraph>
            
            <Form.Item
                name="title"
                label="Service Title"
                rules={[{ required: true, message: 'Please enter a service title' }]}
            >
                <Input 
                    placeholder="e.g., Custom Website Development"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                name="category"
                label="Service Category"
                rules={[{ required: true, message: 'Please select a category' }]}
            >
                <Select placeholder="Select category" size="large">
                    {SERVICE_CATEGORIES.map(category => (
                        <Option key={category} value={category}>{category}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="description"
                label="Service Description"
                rules={[{ required: true, message: 'Please provide a description' }]}
            >
                <TextArea 
                    rows={4}
                    placeholder="Describe what you'll deliver, timeline, requirements, etc."
                />
            </Form.Item>

            <Form.Item
                name="deliverables"
                label="Key Deliverables"
                rules={[{ required: true, message: 'Please list key deliverables' }]}
            >
                <TextArea 
                    rows={3}
                    placeholder="- Website with responsive design&#10;- 3 rounds of revisions&#10;- 30 days of support"
                />
            </Form.Item>

            <Form.Item
                name="timeline"
                label="Estimated Timeline"
            >
                <Input 
                    placeholder="e.g., 2-3 weeks"
                    size="large"
                />
            </Form.Item>
        </div>
    );
}
