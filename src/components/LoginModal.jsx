import { Button, Form, Input, Modal, Tabs } from "antd";
import { useState } from "react";

function LoginModal({ open, onClose }) {
  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState("login");

  const handleSubmit = (values) => {
    if (tabKey === "login") {
      console.log("Logging in with", values);
    } else {
      console.log("Signing up with", values);
    }
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="!rounded-xl [&_.ant-modal-content]:!bg-[#0d0d0d] [&_.ant-modal-content]:!border-2 [&_.ant-modal-content]:!border-emerald-500"
    >
      <Tabs
        activeKey={tabKey}
        onChange={(key) => {
          setTabKey(key);
          form.resetFields();
        }}
        defaultActiveKey="login"
        tabBarGutter={40}
        className="text-white [&_.ant-tabs-ink-bar]:!bg-emerald-500"
      >
        <Tabs.TabPane
          tab={<span className="text-white font-semibold">Login</span>}
          key="login"
        >
          <div className="p-4 bg-[#0d0d0d] text-white">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="email"
                label={<span className="text-white">Email Address</span>}
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input
                  autoComplete="email"
                  className="!bg-[#0d0d0d] !text-white !border-emerald-500 focus:!border-emerald-500 focus:!ring-emerald-500"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label={<span className="text-white">Password</span>}
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  autoComplete="current-password"
                  className="!bg-[#0d0d0d] !text-white !border-emerald-500 focus:!border-emerald-500 focus:!ring-emerald-500"
                />
              </Form.Item>
              <Button
                htmlType="submit"
                className="!bg-emerald-500 !hover:bg-emerald-600 !text-white w-full"
              >
                Login
              </Button>
              <p className="mt-3 text-center text-white">
                Don’t have an account?{" "}
                <Button type="link" onClick={() => setTabKey("signup")}>
                  <span className="text-emerald-500">Create an account</span>
                </Button>
              </p>
            </Form>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={
            <span className="text-white font-semibold">Create an Account</span>
          }
          key="signup"
        >
          <div className="p-4 bg-[#0d0d0d] text-white">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="email"
                label={<span className="text-white">Email Address</span>}
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input
                  autoComplete="email"
                  className="!bg-[#0d0d0d] !text-white !border-emerald-500 focus:!border-emerald-500 focus:!ring-emerald-500"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label={<span className="text-white">Password</span>}
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  autoComplete="new-password"
                  className="!bg-[#0d0d0d] !text-white !border-emerald-500 focus:!border-emerald-500 focus:!ring-emerald-500"
                />
              </Form.Item>
              <Button
                htmlType="submit"
                className="!bg-emerald-500 !hover:bg-emerald-600 !text-white w-full"
              >
                Sign Up
              </Button>
              <p className="mt-3 text-center text-white">
                Already have an account?{" "}
                <Button type="link" onClick={() => setTabKey("login")}>
                  <span className="text-emerald-500">Login</span>
                </Button>
              </p>
            </Form>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

export default LoginModal;
