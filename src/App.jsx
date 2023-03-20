import logo from "./logo.svg";
import "./App.css";
import { Layout, Col, Row } from "@douyinfe/semi-ui";
import { HashRouter as Router, Route, Link, Routes } from "react-router-dom";
import buptIcon from "./static/bupt-icon.PNG";
import React from "react";
import { IconUserCircle } from "@douyinfe/semi-icons";

const { Header, Footer, Content } = Layout;

export class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Layout>
        <Header
          style={{
            width: "100 %",
            display: "flex",
            flexFlow: "row",
            height: "100px",
            alignItems: "center",
            borderBottom: "1px solid rgba(var(--semi-grey-2), 1)",
          }}
        >
          <Row
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Col
              span={6}
              style={{
                display: "flex",
                flexFlow: "row",
                placeItems: "center",
                height: "100%",
              }}
            >
              <img
                src={buptIcon}
                style={{
                  marginLeft: "10px",
                  width: "80px",
                  height: "80px",
                }}
              />
              <div
                style={{
                  marginLeft: "20px",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              >
                课程表管理系统
              </div>
            </Col>
            <Col
              span={6}
              offset={12}
              style={{
                display: "flex",
                flexFlow: "row",
                placeItems: "center",
                placeContent: "center",
                height: "100%",
              }}
            >
              <IconUserCircle style={{ fontSize: "32px" }} />
              <div style={{ fontSize: "28px", marginLeft: "10px" }}>
                {this.props.username ? this.props.username : "Angrychow"}
              </div>
            </Col>
          </Row>
        </Header>
      </Layout>
    );
  }
}
