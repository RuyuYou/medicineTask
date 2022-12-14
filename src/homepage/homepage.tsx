import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import './homepage.less';

export interface homeState {
  showModal: boolean;
  dataList: any[];
  editId: string;
}

export default class HomePage extends React.Component<any, homeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showModal: false,
      dataList: [],
      editId: ''
    };
  }

  public formRef: any = React.createRef();

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = `${window.location.origin}/#/login`;
    } else {
      this.getList();
    }
  }


  getList = () => {
    fetch('http://localhost:3001/adminList', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ('Bearer ' + localStorage.getItem('token')) || '' // 从localStorageStorage中获取access token
      },
    }).then((res: any) =>
      res.json().then((response: any) => {
        this.setState({
          dataList: response || []
        });
      })
    );
  };

  openMedicineModal = () => {
    this?.formRef?.current?.resetFields();
    this.setState({
      showModal: true
    });
  };

  onFinish = async (formValue: any) => {
    const { editId } = this.state;
    if (editId) {
      const response = await this.update(formValue);
      if (response) {
        message.success('修改成功！');
        this.setState({
          showModal: false,
          editId: ''
        }, () => {
          this.getList();
        });
        this?.formRef?.current?.resetFields();
      }
    } else {
      const response = await this.addMedicine(formValue);
      if (response) {
        message.success('添加成功！');
        this.setState({
          showModal: false,
          editId: ''
        }, () => {
          this.getList();
        });
        this?.formRef?.current?.resetFields();
      }
    }
  };

  update = (formValue: any) => {
    const { editId } = this.state;
    const url = `http://localhost:3001/adminList/${editId}`;
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ('Bearer ' + localStorage.getItem('token')) || '' // 从localStorageStorage中获取access token
      },
      body: JSON.stringify(formValue)
    }).then((res: any) => {
      return res.json().then((response: any) => {
        return response;
      }).catch(() => {
        message.error('修改失败，请稍后重试！');
      });
    });
  };

  reset = () => {
    this.setState({
      showModal: false,
      editId: ''
    }, () => {
      this?.formRef?.current?.resetFields();
    });
  };

  addMedicine = async (values: any) => {
    return fetch('http://localhost:3001/adminList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ('Bearer ' + localStorage.getItem('token')) || '' // 从localStorageStorage中获取access token
      },
      body: JSON.stringify(values)
    }).then((res: any) => {
      return res.json().then((response: any) => {
        return response;
      }).catch(() => {
        message.error('添加失败，请稍后重试！');
      });
    });
  };

  openModal = (record: any) => {
    this.setState({
      showModal: true,
      editId: record.id
    }, () => {
      this?.formRef?.current?.setFieldsValue(record);
    });
  };

  delete = (record: any) => {
    const url = `http://localhost:3001/adminList/${record.id}`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ('Bearer ' + localStorage.getItem('token')) || '' // 从localStorageStorage中获取access token
      },
    }).then((res: any) => {
      return res.json().then(() => {
        message.success('删除成功！');
        this.getList();
      }).catch(() => {
        message.error('删除失败，请稍后重试！');
      });
    });
  };

  render() {
    const { showModal, dataList, editId } = this.state;
    const columns: any = [
      {
        title: '药品代码',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '药品名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '商家',
        dataIndex: 'store',
        key: 'store',
      },
      {
        title: '类别',
        dataIndex: 'source',
        key: 'source',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (key: any, record: any) => {
          return (
            <>
              <Button
                type="link"
                onClick={() => this.openModal(record)}
              >
                修改
              </Button>
              <Button
                type="link"
                onClick={() => this.delete(record)}
              >
                删除
              </Button>
            </>
          );
        }
      },
    ];
    const permission: any = localStorage.getItem('permission');
    if (permission && +permission !== 0) {
      columns.pop();
    }
    return (<div>
      {
        permission && +permission === 0 && (
          <Button
            type="primary"
            onClick={this.openMedicineModal}
          >
            增加
          </Button>
        )
      }
      <Table
        columns={columns}
        dataSource={dataList}
        rowKey="id"
      />
      <Modal
        title={`${editId ? '修改' : '新增'}数据`}
        footer={false}
        open={showModal}
      >
        <Form
          name="medicine"
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <Form.Item
            label="药品代码"
            name="id"
            rules={[{ required: true, message: '请输入药品代码' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="药品名称"
            name="name"
            rules={[{ required: true, message: '请输入药品名称' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="商家"
            name="store"
            rules={[{ required: true, message: '请输入商家' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="类别"
            name="source"
            rules={[{ required: true, message: '请输入类别' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            className="footer-action"
          >
            <Button
              type="primary"
              htmlType="submit"
              className="submit-btn"
            >
              确定
            </Button>
            <Button
              htmlType="button"
              onClick={this.reset}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>);
  }
}

