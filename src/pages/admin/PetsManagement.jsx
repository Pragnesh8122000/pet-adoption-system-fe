import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  message,
  Popconfirm,
  Tag,
  Image,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAllPets,
  createPets,
  updatePets,
  deletePet,
} from "../../api/pets.api";

const { Title } = Typography;
const { Option } = Select;

const PetsManagement = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [form] = Form.useForm();

  // Pagination State
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPets = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      // GET /getAllPets with queries
      const params = {
        page: page,
        limit: pageSize,
      };

      const response = await getAllPets(params);
      setPets(response?.data?.pets || []);

      // Update pagination info from backend response
      // Assuming response.data.totalCount exists based on PetList analysis
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response?.data?.totalCount || 0,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch pets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (newPagination) => {
    fetchPets(newPagination.current, newPagination.pageSize);
  };

  const handleAdd = () => {
    setEditingPet(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingPet(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      // DELETE /deletePet
      await deletePet(id);
      message.success("Pet deleted successfully");
      // Resfresh with current pagination
      fetchPets(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to delete pet");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingPet) {
        // PUT /updatePets
        // Ensure payload has ID
        await updatePets({ ...values, id: editingPet._id });
        message.success("Pet updated successfully");
      } else {
        // POST /createPets
        await createPets(values);
        message.success("Pet added successfully");
      }
      setIsModalOpen(false);
      // Refresh list
      fetchPets(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("Operation failed:", error);
      // message.error('Failed to save pet');
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Breed",
      dataIndex: "breed",
      key: "breed",
      filters: [
        { text: "Dog", value: "Dog" },
        { text: "Cat", value: "Cat" },
        { text: "Bird", value: "Bird" },
      ],
      onFilter: (value, record) => record.breed === value,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "available" ? "green" : "orange"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the pet"
            description="Are you sure to delete this pet?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Pets Management
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add New Pet
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={pets}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={editingPet ? "Edit Pet" : "Add New Pet"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText={editingPet ? "Update" : "Create"}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "available" }}
        >
          <Form.Item
            name="name"
            label="Pet Name"
            rules={[{ required: true, message: "Please input pet name" }]}
          >
            <Input placeholder="Enter pet name" />
          </Form.Item>

          <Space style={{ display: "flex" }} align="baseline">
            <Form.Item
              name="breed"
              label="Breed"
              rules={[{ required: true, message: "Please select breed" }]}
              style={{ width: "260px" }}
            >
              <Select placeholder="Select breed">
                <Option value="Dog">Dog</Option>
                <Option value="Cat">Cat</Option>
                <Option value="Bird">Bird</Option>
                <Option value="Rabbit">Rabbit</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="age"
              label="Age Group"
              rules={[{ required: true, message: "Please select age group" }]}
              style={{ width: "260px" }}
            >
              {/* <Select placeholder="Select age group">
                <Option value="Puppy/Kitten">Puppy/Kitten</Option>
                <Option value="Young">Young</Option>
                <Option value="Adult">Adult</Option>
                <Option value="Senior">Senior</Option>
              </Select> */}
              {/*  age should be number */}
              <Input placeholder="Enter age" name="age" type="number" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default PetsManagement;
