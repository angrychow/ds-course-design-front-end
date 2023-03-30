import { Calendar, Modal } from "@douyinfe/semi-ui";
import React from "react";
import "./curriculum.css";

export class Curriculum extends React.Component {
  constructor(props) {
    super(props);
    this.eventText = "";
    this.events = [];
    this.handleClick = this.handleClick.bind(this);
    const dailyEventStyle = {
      borderRadius: "3px",
      boxSizing: "border-box",
      border: "var(--semi-color-primary) 1px solid",
      padding: "10px",
      backgroundColor: "var(--semi-color-primary-light-default)",
      height: "100%",
      overflow: "hidden",
    };
    this.events = [
      {
        key: "0",
        start: new Date(2023, 2, 28, 14, 45, 0),
        end: new Date(2023, 2, 28, 19, 45, 0),
        text: "这是一个活动",
        children: (
          <div
            style={dailyEventStyle}
            onClick={(e) => {
              this.handleClick("这是一个活动");
            }}
          >
            吃饭睡觉打豆豆
          </div>
        ),
      },
    ];
  }
  handleClick(text, e) {
    Modal.info({ title: "事件详情", footer: <></>, content: text });
  }

  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          overflowY: "scroll",
        }}
      >
        <div
          style={{
            marginLeft: "5%",
            width: "90%",
            marginTop: "20px",
            display: "flex",
            flexFlow: "column",
            placeItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              placeContent: "center",
              fontSize: "28px",
              padding: "10px",
            }}
          >
            课程表
          </div>
          <Calendar
            mode="week"
            style={{
              border: "1px solid rgba(var(--semi-grey-3), 0.5)",
              borderRadius: "5px",
              width: "100%",
            }}
            events={this.events}
          />
        </div>
      </div>
    );
  }
}
