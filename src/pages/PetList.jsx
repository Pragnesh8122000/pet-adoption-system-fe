import { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Pagination,
  Typography,
  Space,
  Empty,
  Skeleton,
  Tag,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllPets } from "../api/pets.api";
import debounce from "lodash/debounce";

const { Title, Text } = Typography;
const { Option } = Select;

const PetList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const breed = searchParams.get("breed") || "";
  const age = searchParams.get("age") || "";

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search,
        breed: breed === "All" ? "" : breed,
        age: age === "All" ? "" : age,
      };
      const response = await getAllPets(params);
      console.log(response);
      setPets(response?.data?.pets || []);
      setTotal(response?.data?.totalCount || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [page, limit, search, breed, age]);

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchParams((prev) => {
        prev.set("search", value);
        prev.set("page", "1");
        return prev;
      });
    }, 500),
    []
  );

  const handleFilterChange = (key, value) => {
    setSearchParams((prev) => {
      if (value && value !== "All") {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const handlePageChange = (page, pageSize) => {
    setSearchParams((prev) => {
      prev.set("page", page.toString());
      prev.set("limit", pageSize.toString());
      return prev;
    });
  };

  const renderSkeletons = () => (
    <Row gutter={[16, 16]}>
      {[...Array(8)].map((_, i) => (
        <Col xs={24} sm={12} md={8} lg={6} key={i}>
          <Card>
            <Skeleton active avatar paragraph={{ rows: 3 }} />
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Find Your New Best Friend</Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search by name or breed"
              prefix={<SearchOutlined />}
              defaultValue={search}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              placeholder="Breed"
              style={{ width: "100%" }}
              value={breed || "All"}
              onChange={(val) => handleFilterChange("breed", val)}
            >
              <Option value="All">All Breeds</Option>
              <Option value="Dog">Dog</Option>
              <Option value="Cat">Cat</Option>
              <Option value="Bird">Bird</Option>
              <Option value="Rabbit">Rabbit</Option>
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Input
              placeholder="Age"
              prefix={<SearchOutlined />}
              value={age}
              onChange={(val) => handleFilterChange("age", val.target.value)}
              allowClear
            />
          </Col>
        </Row>

        {loading ? (
          renderSkeletons()
        ) : pets.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {pets.map((pet) => (
                <Col xs={24} sm={12} md={8} lg={6} key={pet._id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={pet.name}
                        src={
                          pet.image && pet.image.trim() !== ""
                            ? pet.image
                            : "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                        }
                        style={{ height: 200, objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";
                        }}
                      />
                    }
                    onClick={() => navigate(`/pets/${pet._id}`)}
                  >
                    <Card.Meta
                      title={pet.name}
                      description={
                        <Space direction="vertical">
                          <Text type="secondary">{pet.breed}</Text>
                          <Space>
                            <Tag color="blue">{pet.age}</Tag>
                            <Tag
                              color={
                                pet.status === "available" ? "green" : "orange"
                              }
                            >
                              {pet.status}
                            </Tag>
                          </Space>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <Pagination
                current={page}
                pageSize={limit}
                total={total}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["5", "10", "25", "50", "100"]}
              />
            </div>
          </>
        ) : (
          <Empty description="No pets found matching your criteria" />
        )}
      </Space>
    </div>
  );
};

export default PetList;
