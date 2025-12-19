import { Spin } from "antd";

const Loader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
      minHeight: "200px",
    }}
  >
    <Spin size="large" />
  </div>
);

export default Loader;
