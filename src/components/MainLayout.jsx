import { useState } from "react";
import { Layout, Menu, Button, theme, Modal } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  FileTextOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    Modal.confirm({
      title: "Logout",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to logout?",
      okText: "Yes, Logout",
      cancelText: "Cancel",
      onOk() {
        logout();
        navigate("/login");
      },
    });
  };

  const menuItems = [
    {
      key: "/pets",
      icon: <HeartOutlined />,
      label: <Link to="/pets">Browse Pets</Link>,
    },
  ];

  if (user?.role === "admin") {
    menuItems.push(
      {
        key: "/admin/pets",
        icon: <AppstoreOutlined />,
        label: <Link to="/admin/pets">Manage Pets</Link>,
      },
      {
        key: "/admin/applications",
        icon: <UserOutlined />,
        label: <Link to="/admin/applications">Manage Applications</Link>,
      }
    );
  }

  if (user?.role === "user") {
    menuItems.push({
      key: "/my-applications",
      icon: <FileTextOutlined />,
      label: <Link to="/my-applications">My Applications</Link>,
    });
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        breakpoint="lg"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div
          className="demo-logo-vertical"
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {!collapsed ? "🐾 PetAdoption" : "🐾"}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
          <div
            style={{
              marginRight: "24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span style={{ fontWeight: "500" }}>
              Welcome, {user?.name || "User"} ({user?.role})
            </span>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "initial",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
