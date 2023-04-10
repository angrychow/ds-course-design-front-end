import { IconClock, IconMapPin } from "@douyinfe/semi-icons";
import { IllustrationNoContent } from "@douyinfe/semi-illustrations";
import { Button, Card, Empty, Row, Form, Modal, Col } from "@douyinfe/semi-ui";
import React from "react";
import { mockActivityData } from "./temporary-mock";
import { bus } from "../../bus";

export class Temporary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temporaryActivityArray: mockActivityData,
      typeArray: bus.tempTypeArray,
      places: bus.places,
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleAdd() {
    this.handleClick(-1);
  }
  handleClick(index) {
    console.log(index);
    const optionTimeSelect = [];
    const findEvent = this.state.temporaryActivityArray.find(
      (item) => item.id == index
    );
    // console.log(findEvent);
    let startHour = 6;
    if (findEvent) {
      if (findEvent.time.getHours() >= 22) {
        startHour = 22;
      } else if (findEvent.time.getHours() >= 6) {
        startHour = findEvent.time.getHours();
      }
    }

    const initVal = findEvent
      ? {
          activityDate: findEvent.time,
          activityType: this.state.typeArray.find(
            (item) => item.name == findEvent.type
          ).id,
          activityPlace: this.state.places.find(
            (item) => item.name == findEvent.place
          ).id,
          activityName: findEvent.name,
          startHour: startHour,
        }
      : {};
    console.log(initVal);
    for (let i = 6; i <= 22; i++) {
      optionTimeSelect.push(
        <Form.Select.Option value={i} key={i}>
          {i} 点
        </Form.Select.Option>
      );
    }
    const optionType = this.state.typeArray.map((item) => {
      return (
        <Form.Select.Option value={item.id} key={item.id}>
          {item.name}
        </Form.Select.Option>
      );
    });
    const optionPlaces = this.state.places.map((item) => {
      return (
        <Form.Select.Option value={item.id} key={item.id}>
          {item.name}
        </Form.Select.Option>
      );
    });
    Modal.info({
      title: "添加或修改临时事件",
      footer: <></>,
      content: (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexFlow: "column",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Form
              style={{
                width: "100%",
                display: "flex",
                flexFlow: "column",
                alignContent: "center",
                alignItems: "center",
              }}
              initValues={initVal}
              onSubmit={(values) => {
                // Toast.info({
                //   opts: values.toString(),
                // });
                console.log(values);
              }}
            >
              {(formState, value, formAPI) => (
                <>
                  <Row style={{ width: "70%" }}>
                    <Form.DatePicker
                      field="activityDate"
                      label="事件日期"
                      style={{
                        width: "100%",
                      }}
                    ></Form.DatePicker>
                  </Row>
                  <Row style={{ width: "70%" }}>
                    <Col span={24} offset={0}>
                      <Form.Select
                        field="startHour"
                        label="发生时间"
                        style={{
                          width: "100%",
                        }}
                      >
                        {optionTimeSelect}
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row style={{ width: "70%" }}>
                    <Form.Select
                      field="activityType"
                      label="事件类型"
                      style={{
                        width: "100%",
                      }}
                    >
                      {optionType}
                    </Form.Select>
                  </Row>
                  <Row style={{ width: "70%" }}>
                    <Form.Select
                      field="activityPlace"
                      label="事件地点"
                      style={{
                        width: "100%",
                      }}
                    >
                      {optionPlaces}
                    </Form.Select>
                  </Row>
                  <Row style={{ width: "70%" }}>
                    <Form.Input
                      field="activityName"
                      label="事件名称"
                      style={{
                        width: "100%",
                      }}
                    ></Form.Input>
                  </Row>
                  <Row style={{ width: "30%" }}>
                    <Col span={24}>
                      <Button type="primary" htmlType="submit">
                        提交
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Form>
          </div>
        </>
      ),
    });
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
            <Button
              theme="solid"
              type="primary"
              onClick={() => this.handleAdd()}
            >
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
            onClick={() => this.handleClick(item.id)}
            key={item.id}
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
              onClick={() => this.handleAdd()}
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
