import logo from "./logo.svg";
import "./App.css";
import { Layout, Col, Row, Slider, Nav } from "@douyinfe/semi-ui";
import {
  HashRouter as Router,
  Route,
  Link,
  Routes,
  Outlet,
  useLocation,
} from "react-router-dom";
import buptIcon from "./static/bupt-icon.PNG";
import React, { useState } from "react";
import {
  IconUserCircle,
  IconBackward,
  IconPause,
  IconFastForward,
  IconUser,
  IconStar,
} from "@douyinfe/semi-icons";
import { bus } from "./bus";

const { Header, Footer, Content, Sider } = Layout;

export function App(props) {
  const [timeState, setTimeState] = useState(bus.timeState);
  const [date, setDate] = useState(bus.date);
  const location = useLocation();
  console.log(location);
  return (
    <Layout
      style={{
        height: "100%",
      }}
    >
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
            span={4}
            offset={2}
            style={{
              display: "flex",
              flexFlow: "column",
              placeItems: "center",
              placeContent: "center",
              height: "100%",
            }}
          >
            <div
              style={{
                fontSize: "14px",
              }}
            >
              当前时间
            </div>
            <div style={{ fontSize: "18px" }}>
              {date.toLocaleDateString() +
                " " +
                date.toTimeString().slice(0, 8)}
            </div>
            <div
              style={{
                display: "flex",
                flexFlow: "row",
                placeItems: "center",
                placeContent: "center",
                width: "100%",
                fontSize: "16px",
              }}
            >
              <IconBackward
                className={
                  timeState == "backward"
                    ? "speed-button-clicked"
                    : "speed-button-unclicked"
                }
                onClick={() => {
                  bus.timeState = "backward";
                  setTimeState("backward");
                }}
              />
              <IconPause
                style={{
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
                className={
                  timeState == "pause"
                    ? "speed-button-clicked"
                    : "speed-button-unclicked"
                }
                onClick={() => {
                  bus.timeState = "pause";
                  setTimeState("pause");
                }}
              />
              <IconFastForward
                className={
                  timeState == "forward"
                    ? "speed-button-clicked"
                    : "speed-button-unclicked"
                }
                onClick={() => {
                  bus.timeState = "forward";
                  setTimeState("forward");
                }}
              />
            </div>
          </Col>
          <Col
            span={6}
            offset={6}
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
              {props.username ? props.username : "Angrychow"}
            </div>
          </Col>
        </Row>
      </Header>
      <Layout
        style={{
          height: "calc( 100% - 100px )",
        }}
      >
        <Sider
          style={{
            width: "300px",
            height: "100%",
          }}
        >
          <Nav
            renderWrapper={({ itemElement, isSubNav, isInSubNav, props }) => {
              const routerMap = {
                curriculum: "/curriculum",
                activity: "/activity",
              };
              return (
                <Link
                  style={{ textDecoration: "none" }}
                  to={routerMap[props.itemKey]}
                >
                  {itemElement}
                </Link>
              );
            }}
            style={{ height: "100%" }}
            bodyStyle={{ height: "100%" }}
            items={[
              { itemKey: "curriculum", text: "课程表", icon: <IconUser /> },
              { itemKey: "activity", text: "活动管理", icon: <IconStar /> },
            ]}
            // onSelect={(data) => console.log("trigger onSelect: ", data)}
            // onClick={(data) => console.log("trigger onClick: ", data)}
            defaultSelectedKeys={location.pathname.split("/")}
          />
        </Sider>
        <Content
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}