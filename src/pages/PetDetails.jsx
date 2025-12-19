import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Space,
  Card,
  Divider,
  Descriptions,
  message,
  Result,
} from "antd";
import {
  HeartOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getPetDetails } from "../api/pets.api";
import { adoptPet, getUsersAdoptionApplications } from "../api/adoption.api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const { Title, Paragraph, Text } = Typography;

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const [pet, setPet] = useState({});
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch pet details using new API GET /getPetDetails
        const data = await getPetDetails(id);
        setPet(data?.data?.pet);

        if (isAuthenticated && user?.role !== "admin") {
          // Check if already applied using GET /getUsersAdoptionApplications
          const applicationsData = await getUsersAdoptionApplications();
          const applied = applicationsData?.data?.result.some(
            (app) => app.pet?._id === id || app.pet === id
          );
          setHasApplied(applied);
        }
      } catch (err) {
        console.log("err", err);
        setError(
          err.response?.status === 404
            ? "Pet not found"
            : "Failed to fetch details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isAuthenticated]);
  console.log("pet", pet);

  const handleApply = async () => {
    if (!isAuthenticated) {
      message.info("Please login to apply for adoption");
      navigate("/login", { state: { from: `/pets/${id}` } });
      return;
    }

    setApplying(true);
    try {
      // Adopt pet using PUT /adoptPet
      // Assuming payload requires petId. User said "Send pet ID as required by backend".
      // Usually adoption application links user (from token) and pet.
      await adoptPet({ id: id });
      message.success("Application submitted successfully!");
      setHasApplied(true);
    } catch (err) {
      // Error handled by interceptor or global handler usually, but we can catch specific 400s
      message.error(
        err?.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading || authLoading) return <Loader />;

  if (error) {
    return (
      <Result
        status="404"
        title="Pet Not Found"
        subTitle={error}
        extra={
          <Button type="primary" onClick={() => navigate("/pets")}>
            Back to Listing
          </Button>
        }
      />
    );
  }

  if (!pet) return <Result status="404" title="Pet details not found" />;

  const canApply =
    pet.status === "available" && !hasApplied && user?.role !== "admin";

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: "24px" }}
      >
        Back
      </Button>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <img
            src={
              pet?.image ||
              "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
            }
            alt={pet?.name}
            style={{
              width: "100%",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Title level={1} style={{ margin: 0 }}>
                {pet.name}
              </Title>
              <Space wrap>
                <Tag
                  color="blue"
                  style={{ fontSize: "14px", padding: "4px 12px" }}
                >
                  {pet.breed}
                </Tag>
                <Tag
                  color="purple"
                  style={{ fontSize: "14px", padding: "4px 12px" }}
                >
                  {pet.age}
                </Tag>
                <Tag
                  color={pet.status === "available" ? "green" : "orange"}
                  style={{ fontSize: "14px", padding: "4px 12px" }}
                >
                  {pet.status}
                </Tag>
              </Space>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <Descriptions column={1}>
              <Descriptions.Item label="Name">
                {pet.name || "Not specified"}
              </Descriptions.Item>
              <Descriptions.Item label="Breed">
                {pet.breed || "Not specified"}
              </Descriptions.Item>
              <Descriptions.Item label="Age">
                {pet.age || "Not specified"}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4}>Description</Title>
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.6" }}>
              {pet.description || "No description available for this pet."}
            </Paragraph>

            <div style={{ marginTop: "24px" }}>
              {hasApplied ? (
                <Card
                  style={{ backgroundColor: "#f6ffed", borderColor: "#b7eb8f" }}
                >
                  <Space>
                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    <Text strong>You have already applied for {pet.name}</Text>
                  </Space>
                </Card>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  icon={<HeartOutlined />}
                  block
                  loading={applying}
                  disabled={!canApply}
                  onClick={handleApply}
                >
                  {pet.status !== "available"
                    ? `Already ${pet.status}`
                    : "Apply for Adoption"}
                </Button>
              )}
              {user?.role === "admin" && (
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    marginTop: "8px",
                    textAlign: "center",
                  }}
                >
                  Admins cannot apply for adoption.
                </Text>
              )}
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default PetDetails;
