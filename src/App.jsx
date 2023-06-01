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
  redirect,
  useNavigate,
} from "react-router-dom";
import buptIcon from "./static/bupt-icon.PNG";
import React, { useEffect, useMemo, useState } from "react";
import {
  IconUserCircle,
  IconBackward,
  IconPause,
  IconFastForward,
  IconUser,
  IconStar,
  IconPaperclip,
  IconMapPin,
  IconArchive,
  IconUserGroup,
  IconMark,
  IconOption,
} from "@douyinfe/semi-icons";
import { bus } from "./bus";
import { timeChangeEmiiter } from "./utils/events";
import { myAxios, setToken } from "./utils/fetch";
import { useUserData } from "./utils/useUserData";

const { Header, Footer, Content, Sider } = Layout;

export function App(props) {
  const [timeState, setTimeState] = useState(bus.timeState);
  const [date, setDate] = useState(bus.date);
  const [isAdmin, setIsAdmin] = useState(bus.isAdmin);
  const location = useLocation();
  const timeChangeHandler = () => {
    if (timeState == "forward") {
      let timeStamp = date.getTime() + 1000 * 60 * 60 * 24;
      setDate(new Date(timeStamp));
      bus.date = date;
      timeChangeEmiiter.emit("timeChange");
    } else if (timeState == "backward") {
      let timeStamp = date.getTime() - 1000 * 60 * 60 * 24;
      setDate(new Date(timeStamp));
      bus.date = date;
      timeChangeEmiiter.emit("timeChange");
    }
  };
  const navigate = useNavigate();
  const [userData, setUserData] = useUserData();
  var timeChangeInterval = setInterval(timeChangeHandler, 1000);
  useEffect(() => {
    return function cleanup() {
      clearInterval(timeChangeInterval);
    };
  });
  useEffect(() => {
    let token = localStorage["token"];
    if (
      (token == null || token == "" || token == undefined) &&
      bus.embedToken == ""
    ) {
      // console.log(123);
      navigate("/login");
    } else {
      bus.embedToken = token;
      setToken();
      // debugger;
      myAxios.get("/user/verify").then((data) => {
        console.log(data);
        bus.isAdmin = data.is_admin == 0 ? false : true;
        setIsAdmin(bus.isAdmin);
        setUserData({
          name: data.name,
          id: data.id,
          isAdmin: data.is_admin == 0 ? false : true,
        });
        bus.id = data.id;
      });
      myAxios.get("/user/").then((data) => {
        console.log(data);
        bus.userArray = data.users;
      });
      myAxios.get("/map/place").then((data) => {
        console.log(data);
        bus.places = data.nodes;
      });
    }
  }, []);

  // console.log(location);

  const navList = useMemo(() => {
    console.log(isAdmin);
    return isAdmin
      ? [
          {
            itemKey: "curriculum",
            text: "课程表",
            icon: <IconUser />,
          },
          {
            itemKey: "navigate",
            text: "地图导航",
            icon: <IconMapPin />,
          },
          {
            itemKey: "temporary",
            text: "临时事务管理",
            icon: <IconPaperclip />,
          },
          {
            itemKey: "activity",
            text: "事件管理",
            icon: <IconArchive />,
          },
          {
            itemKey: "person",
            text: "人员管理",
            icon: <IconUserGroup />,
          },
          {
            itemKey: "course",
            text: "课程管理",
            icon: <IconMark />,
          },
          {
            itemKey: "log",
            text: "日志",
            icon: <IconOption />,
          },
        ]
      : [
          {
            itemKey: "curriculum",
            text: "课程表",
            icon: <IconUser />,
          },
          {
            itemKey: "navigate",
            text: "地图导航",
            icon: <IconMapPin />,
          },
          {
            itemKey: "temporary",
            text: "临时事务管理",
            icon: <IconPaperclip />,
          },
          {
            itemKey: "activity",
            text: "事件管理",
            icon: <IconArchive />,
          },
        ];
  }, [isAdmin]);
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
                  if (bus.timeState != "backward") {
                    bus.timeState = "backward";
                    setTimeState("backward");
                  }
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
                  if (bus.timeState != "pause") {
                    bus.timeState = "pause";
                    setTimeState("pause");
                  }
                }}
              />
              <IconFastForward
                className={
                  timeState == "forward"
                    ? "speed-button-clicked"
                    : "speed-button-unclicked"
                }
                onClick={() => {
                  if (bus.timeState != "forward") {
                    bus.timeState = "forward";
                    setTimeState("forward");
                  }
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
              {userData.name}
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
                navigate: "/navigate",
                temporary: "/temporary",
                activity: "/activity",
                course: "/course",
                person: "/person",
                log: "/log",
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
            items={navList}
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
