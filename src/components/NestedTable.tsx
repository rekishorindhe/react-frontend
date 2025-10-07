import {
  DeleteOutlined,
  EditOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { TableColumnsType } from "antd";
import {
  Badge,
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  message
} from "antd";
import clsx from "clsx";
import React from "react";

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

  const handleDelete = (name: string) => {
    message.success(`${name} deleted successfully`);
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
        <div className="rounded-lg p-4 shadow-inner bg-black">
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

          <Popconfirm
            title={`Delete ${record.firstName}?`}
            description="Are you sure you want to delete this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.firstName)}
          >
            <Tooltip title="Delete User">
              <Button
                type="text"
                icon={<DeleteOutlined className="text-red-500" />}
              />
            </Tooltip>
          </Popconfirm>
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

  if (isError)
    return <p className="text-red-600 text-center mt-4">Failed to load users.</p>;



  return (
    <Table<UserType>
      rowSelection={rowSelection}
      columns={columns}
      loading={isLoading}
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
      rowKey="key"
      scroll={{ x: 1000 }}
    />
  );
};

export default NestedTable;
