import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  message,
  Popconfirm,
  Card,
  Avatar,
} from "antd";
import { CheckOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import {
  getAllAdoptionApplications,
  updateAdoptionStatus,
} from "../../api/adoption.api";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // GET /getAllAdoptionApplications (ADMIN)
      const { data } = await getAllAdoptionApplications();
      setApplications(data?.result || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (id, status) => {
    try {
      // PUT /updateAdoptionStatus (ADMIN)
      await updateAdoptionStatus({ id, status });
      message.success(`Application ${status.toLowerCase()} successfully`);

      // Optimistic update
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const columns = [
    {
      title: "Pet",
      key: "pet",
      render: (_, record) => (
        <Space>
          <Avatar shape="square" src={record.petImage} />
          <div>
            <div style={{ fontWeight: "bold" }}>
              {record.petName || "Deleted"}
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.petBreed}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Applicant",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: "bold" }}>
              {record.userName || "N/A"}
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.userEmail || "N/A"}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Applied On",
      dataIndex: "createdAt",
      key: "appliedDate",
      render: (date) => dayjs(date).format("DD MMM YYYY, hh:mm A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "orange";
        if (status === "approved") color = "green";
        if (status === "rejected") color = "red";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "pending" ? (
            <>
              <Popconfirm
                title="Approve application?"
                description="This will set the pet's status to Adopted."
                onConfirm={() => handleAction(record._id, "approved")}
                okText="Approve"
                cancelText="No"
              >
                <Button type="primary" icon={<CheckOutlined />} ghost>
                  Approve
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Reject application?"
                description="Are you sure you want to reject this request?"
                onConfirm={() => handleAction(record._id, "rejected")}
                okText="Reject"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button icon={<CloseOutlined />} danger ghost>
                  Reject
                </Button>
              </Popconfirm>
            </>
          ) : (
            <Text type="secondary" italic>
              No actions available
            </Text>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "12px" }}>
      <Title level={2}>Adoption Applications Management</Title>
      <Card>
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ApplicationsManagement;
