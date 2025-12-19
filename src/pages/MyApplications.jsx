import { useState, useEffect } from "react";
import { Table, Tag, Typography, Card } from "antd";
import { getUsersAdoptionApplications } from "../api/adoption.api";
import dayjs from "dayjs";

const { Title } = Typography;

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await getUsersAdoptionApplications();
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

  const columns = [
    {
      title: "Pet Name",
      dataIndex: ["pet", "name"],
      key: "petName",
      render: (text, record) => record?.petName || "N/A",
    },
    {
      title: "Breed",
      dataIndex: ["pet", "breed"],
      key: "breed",
      render: (text, record) => record.petBreed || "N/A",
    },
    {
      title: "Applied Date",
      dataIndex: "createdAt",
      key: "appliedDate",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
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
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  return (
    <div style={{ padding: "12px" }}>
      <Title level={2}>My Adoption Applications</Title>
      <Card>
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "You haven't applied for any pets yet." }}
        />
      </Card>
    </div>
  );
};

export default MyApplications;
