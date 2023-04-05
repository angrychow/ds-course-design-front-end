import { IconClock, IconMapPin } from "@douyinfe/semi-icons";
import { IllustrationNoContent } from "@douyinfe/semi-illustrations";
import { Button, Card, Empty, Row } from "@douyinfe/semi-ui";
import React from "react";

export class Temporary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temporaryActivityArray: [
        {
          time: new Date(),
          place: "学生发展中心 209",
          type: "电竞",
          name: "The Binding of Issac 锦标赛",
        },
        {
          time: new Date("2023-04-05"),
          place: "主楼 902",
          type: "八卦",
          name: "梁宸恋爱史分享会",
        },
        {
          time: new Date(),
          place: "学五 1314",
          type: "桌游",
          name: "三国杀身份军争八人场",
        },
        {
          time: new Date(),
          place: "教三二楼厕所",
          type: "聚餐",
          name: "高级料理会所",
        },
        {
          time: new Date(),
          place: "沙河学生活动中心 208",
          type: "电竞",
          name: "Rainbow Six: Seige 锦标赛",
        },
        {
          time: new Date("2023-04-05"),
          place: "主楼 902",
          type: "八卦",
          name: "章成文研究生保送到耶鲁大学分享会",
        },
        {
          time: new Date(),
          place: "学五 1314",
          type: "桌游",
          name: "狼人杀八人场狼人杀八人场狼人杀八人场狼人杀八人场",
        },
        {
          time: new Date(),
          place: "沙河学生活动中心 208",
          type: "电竞",
          name: "Rainbow Six: Seige 锦标赛",
        },
        {
          time: new Date("2023-04-05"),
          place: "主楼 902",
          type: "八卦",
          name: "章成文研究生保送到耶鲁大学分享会",
        },
        {
          time: new Date(),
          place: "学五 1314",
          type: "桌游",
          name: "狼人杀八人场",
        },
      ],
    };
  }

  render() {
    const noActivity = (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexFlow: "row",
          flexWrap: "wrap",
          placeContent: "center",
          placeContent: "center",
        }}
      >
        <Empty
          image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
          title="您现在没有临时任务哦 ~"
          style={{
            display: "flex",
            flexFlow: "column",
            placeContent: "center",
            placeItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexFlow: "column",
              placeContent: "center",
              placeItems: "center",
            }}
          >
            <Button theme="solid" type="primary">
              添加临时任务
            </Button>
          </div>
        </Empty>
      </div>
    );
    let haveTempEvent = this.state.temporaryActivityArray.length > 0;
    let haveActivity;
    if (haveTempEvent) {
      const activityCard = this.state.temporaryActivityArray.map((item) => {
        return (
          <Card
            style={{ marginLeft: "50px", marginBottom: "50px" }}
            title={item.name}
            shadows="hover"
            headerExtraContent={
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  color: "rgba(var(--semi-blue-6), 1)",
                  marginTop: "2px",
                }}
              >
                {item.type}
              </div>
            }
          >
            <Row
              style={{
                fontSize: "24px",
                marginLeft: "5%",
                display: "flex",
                flexFlow: "row",
                minWidth: "200px",
                width: item.name.length * 10 + "px",
                maxWidth: "800px",
              }}
            >
              <div style={{ width: "24px", fontSize: "20px" }}>
                <IconMapPin />
              </div>
              <div style={{ fontSize: "16px" }}>{item.place}</div>
            </Row>

            <Row
              style={{
                fontSize: "24px",
                marginLeft: "5%",
                display: "flex",
                flexFlow: "row",
                minWidth: "100px",
                marginTop: "12px",
              }}
            >
              <div style={{ width: "24px", fontSize: "20px" }}>
                <IconClock />
              </div>
              <div style={{ fontSize: "16px" }}>
                {item.time.toLocaleString()}
              </div>
            </Row>
          </Card>
        );
      });
      haveActivity = (
        <div
          style={{
            width: "100%",
            overflowY: "scroll",
          }}
        >
          <Row
            style={{
              width: "100%",
              height: "70px",
            }}
          >
            <Button
              theme="solid"
              type="primary"
              style={{
                marginLeft: "50px",
                marginTop: "20px",
              }}
            >
              添加临时任务
            </Button>
          </Row>
          <Row
            style={{
              display: "flex",
              flexFlow: "row",
              flexWrap: "wrap",
              justifyItems: "center",
              justifyContent: "center",
            }}
          >
            {activityCard}
          </Row>
        </div>
      );
    }
    return haveTempEvent ? haveActivity : noActivity;
  }
}
