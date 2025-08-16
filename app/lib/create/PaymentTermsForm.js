'use client';

import React from 'react';
import { 
    Form, 
    Input, 
    Select, 
    InputNumber,
    Row,
    Col,
    Typography 
} from 'antd';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const PAYMENT_TYPES = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'hourly', label: 'Hourly Rate' },
    { value: 'milestone', label: 'Milestone-based' },
    { value: 'deposit', label: 'Deposit + Final Payment' }
];

export default function PaymentTermsForm() {
    return (
        <div>
            <Title level={3}>Payment Terms</Title>
            <Paragraph type="secondary">
                Set your pricing structure and payment requirements.
            </Paragraph>

            <Form.Item
                name="paymentType"
                label="Payment Structure"
                rules={[{ required: true, message: 'Please select payment type' }]}
            >
                <Select placeholder="Select payment structure" size="large">
                    {PAYMENT_TYPES.map(type => (
                        <Option key={type.value} value={type.value}>{type.label}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="amount"
                        label="Amount (PYUSD)"
                        rules={[{ required: true, message: 'Please enter amount' }]}
                    >
                        <InputNumber
                            min={1}
                            precision={2}
                            placeholder="100.00"
                            size="large"
                            style={{ width: '100%' }}
                            prefix="$"
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="depositPercentage"
                        label="Deposit Required (%)"
                    >
                        <InputNumber
                            min={0}
                            max={100}
                            placeholder="50"
                            size="large"
                            style={{ width: '100%' }}
                            suffix="%"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="paymentTerms"
                label="Payment Terms & Conditions"
            >
                <TextArea 
                    rows={3}
                    placeholder="Payment upon completion, 50% deposit required, refund policy, etc."
                />
            </Form.Item>

            <Form.Item
                name="requiresApproval"
                label="Client Approval Required"
            >
                <Select defaultValue="yes" size="large">
                    <Option value="yes">Yes, require client approval before payment release</Option>
                    <Option value="no">No, automatic payment upon completion</Option>
                </Select>
            </Form.Item>
        </div>
    );
}
