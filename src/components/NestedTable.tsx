import React from "react";
import {
  Table,
  Space,
  Modal,
  message,
  Badge,
  Tooltip,
  Button,
  Tag,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { TableColumnsType } from "antd";
import clsx from "clsx";

const { confirm } = Modal;

interface UserType {
  key: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  company: {
    name: string;
  };
}

// Fetch users
const fetchUsers = async (): Promise<UserType[]> => {
  const res = await fetch("https://dummyjson.com/users");
  const data = await res.json();
  return data.users.map((user: any) => ({
    key: user.id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    gender: user.gender,
    email: user.email,
    company: { name: user.company?.name || "N/A" },
  }));
};

const NestedTable: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const showDeleteConfirm = (name: string) => {
    confirm({
      title: `Are you sure you want to delete ${name}?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk() {
        message.success(`${name} deleted successfully`);
      },
      onCancel() {
        message.info("Delete cancelled");
      },
    });
  };

  const expandedRowRender = (record: UserType) => {
    const expandColumns: TableColumnsType<any> = [
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Company", dataIndex: ["company", "name"], key: "company" },
      {
        title: "Status",
        key: "status",
        render: () => <Badge status="success" text="Active" />,
      },
    ];

    const expandData = [
      {
        key: record.key,
        email: record.email,
        company: record.company.name,
      },
    ];

    return (
      <div
        className={clsx(
          "p-[2px] rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        )}
      >
        <div className="rounded-lg p-4 shadow-inner">
          <Table
            columns={expandColumns}
            dataSource={expandData}
            pagination={false}
            size="small"
          />
        </div>
      </div>
    );
  };

  const columns: TableColumnsType<UserType> = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      fixed: "left",
      width: 150,
    },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (age: number) => (
        <Tag color={age > 40 ? "volcano" : "green"}>
          {age > 40 ? "Senior" : "Young"}
        </Tag>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => (
        <Tag color={gender === "male" ? "blue" : "pink"}>{gender}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit User">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-600" />}
              onClick={() => message.info(`Editing ${record.firstName}`)}
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Button
              type="text"
              icon={<DeleteOutlined className="text-red-500" />}
              onClick={() => showDeleteConfirm(record.firstName)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: UserType[]) => {
      console.log("Selected rows:", selectedRows);
    },
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };



  if (isError) return <p className="text-red-600">Failed to load users.</p>;

  return (
    <Table<UserType>
      rowSelection={rowSelection}
      columns={columns}
      expandable={{
        expandedRowRender,
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <MinusSquareOutlined
              onClick={(e) => onExpand(record, e)}
              className="text-blue-600 cursor-pointer"
            />
          ) : (
            <PlusSquareOutlined
              onClick={(e) => onExpand(record, e)}
              className="text-green-600 cursor-pointer"
            />
          ),
      }}
      dataSource={data}
      pagination={{ pageSize: 10 }}
      loading={isLoading}
      rowKey="key"
      scroll={{ x: 1000 }}
      className="rounded-lg  shadow-sm"
    />
  );
};

export default NestedTable;
