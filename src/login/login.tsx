import React from 'react';
import { Form, Input, Button } from 'antd';


const Login: any = () => {
  const onFinish = (data: any) => {
    const { username, password } = data || {};
    fetch(`http://localhost:3001/user?username=${username}&password=${password}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ('Bearer ' + localStorage.getItem('token')) || '' // 从localStorageStorage中获取access token
      },
    }).then(res => {
      res.json().then(response => {
        const valueData: any = response?.[0] || {};
        const { token, permission } = valueData || {};
        localStorage.setItem('token', token);
        localStorage.setItem('permission', permission);
        window.location.href = `${window.location.origin}/#/homepage`;
      });
    });
  };


  return (
    <Form
      name="login"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          登陆
        </Button>
      </Form.Item>
    </Form>
  );
};


export default Login;