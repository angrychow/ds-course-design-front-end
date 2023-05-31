import {
  Calendar,
  Modal,
  Form,
  Row,
  Col,
  Button,
  Toast,
} from "@douyinfe/semi-ui";
import React from "react";
import "./curriculum.css";
import { bus } from "../../bus";
import { timeChangeEmiiter } from "../../utils/events";
import { activityMock } from "./activity-mock";
import { myAxios } from "../../utils/fetch";

export class Curriculum extends React.Component {
  constructor(props) {
    super(props);
    this.eventText = "";
    this.events = [];
    this.handleClickEvent = this.handleClickEvent.bind(this);
    this.handleClickGrid = this.handleClickGrid.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleGetNewEvents = this.handleGetNewEvents.bind(this);
    this.selectFormDate = bus.date;
    const dailyEventStyle = {
      borderRadius: "3px",
      boxSizing: "border-box",
      border: "var(--semi-color-primary) 1px solid",
      padding: "10px",
      backgroundColor: "var(--semi-color-primary-light-default)",
      height: "100%",
      overflow: "hidden",
    };
    this.state = {
      currentTime: bus.date,
      isCheckedCycle: false,
      isCheckedGroup: false,
      activityArray: activityMock,
      userArray: bus.userArray,
      typeArray: bus.activityTypeArray,
      isCheckedPlace: false,
      isCheckedAlert: false,
      placesArray: bus.places,
      events: activityMock.map((item) => {
        return {
          key: Number.toString(item.id),
          start: item.start,
          end: item.end,
          text: item.text,
          children: (
            <div
              style={dailyEventStyle}
              onClick={(e) => {
                this.handleClickEvent(item.text, e);
                e.stopPropagation();
              }}
            >
              {item.name}
            </div>
          ),
        };
      }),
    };
    timeChangeEmiiter.addListener("timeChange", this.handleTimeChange);
    this.handleGetNewEvents();
  }

  handleGetNewEvents() {
    const dailyEventStyle = {
      borderRadius: "3px",
      boxSizing: "border-box",
      border: "var(--semi-color-primary) 1px solid",
      padding: "10px",
      backgroundColor: "var(--semi-color-primary-light-default)",
      height: "100%",
      overflow: "hidden",
    };
    myAxios
      .get("/event/activity/all", {
        id: bus.id,
        start: new Date(2023, bus.date.getMonth(), 1).getTime() / 1000,
        end: new Date(2024, bus.date.getMonth(), 2).getTime() / 1000,
      })
      .then((data) => {
        console.log(data);
        var filterData = data.activities.filter((item) => {
          let hasId = false;
          for (let i of item.groupArray) {
            if (i == bus.id) {
              hasId = true;
              break;
            }
          }
          return hasId;
        });
        if (!filterData) filterData = [];
        const cycleEvent = [];
        for (let item of filterData) {
          if (item.cycleType != 0) {
            for (let i = -16; i < 0; i++) {
              const cycleItem = {
                ...item,
                start: item.start + i * 604800,
                end: item.end + i * 604800,
              };
              cycleEvent.push(cycleItem);
            }

            for (let i = 1; i < 17; i++) {
              const cycleItem = {
                ...item,
                start: item.start + i * 604800,
                end: item.end + i * 604800,
              };
              cycleEvent.push(cycleItem);
            }
          }
        }
        filterData = filterData.concat(cycleEvent);
        console.log(filterData);
        this.setState({
          events: filterData.map((item) => {
            return {
              key: Number.toString(item.id + item.start),
              start: new Date(item.start * 1000),
              end: new Date(item.end * 1000),
              text: item.text,
              children: (
                <div
                  style={dailyEventStyle}
                  onClick={(e) => {
                    this.handleClickEvent(item.text, e);
                    e.stopPropagation();
                  }}
                >
                  {item.title}
                </div>
              ),
            };
          }),
        });
      });
  }

  handleClickEvent(text, e) {
    Modal.info({ title: "事件详情", footer: <></>, content: text });
  }

  handleTimeChange(date) {
    this.setState({ currentTime: bus.date });
    console.log(bus.date);
  }

  handleClickGrid(date) {
    const optionTimeSelect = [];
    for (let i = 6; i <= 22; i++) {
      optionTimeSelect.push(
        <Form.Select.Option value={i} key={i}>
          {i} 点
        </Form.Select.Option>
      );
    }
    const optionUser = bus.userArray.map((item) => {
      return (
        <Form.Select.Option value={item.id} key={item.id}>
          {item.name}
        </Form.Select.Option>
      );
    });
    const optionType = bus.activityTypeArray.map((item) => {
      return (
        <Form.Select.Option value={item.id} key={item.id}>
          {item.name}
        </Form.Select.Option>
      );
    });
    const optionPlaces = bus.places.map((item) => (
      <Form.Select.Option value={item.id} key={item.id}>
        {item.name}
      </Form.Select.Option>
    ));
    Modal.info({
      title: "添加事件",
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
            <div>添加事件</div>
            <Form
              style={{
                width: "100%",
                display: "flex",
                flexFlow: "column",
                alignContent: "center",
                alignItems: "center",
              }}
              initValues={{
                startHour:
                  date.getHours() >= 6 && date.getHours() <= 22
                    ? date.getHours()
                    : 6,
                activityDate: date,
                isCycle: false,
                isPlace: false,
                isGroup: false,
                alert: false,
              }}
              onSubmit={(values) => {
                // Toast.info({
                //   opts: values.toString(),
                // });
                // console.log(values);
                const nowDate = new Date(
                  values.activityDate.getFullYear() +
                    "-" +
                    (values.activityDate.getMonth() + 1) +
                    "-" +
                    values.activityDate.getDate()
                );
                let postValue = {
                  ...values,
                  start:
                    (nowDate.getTime() + 1000 * 60 * 60 * values.startHour) /
                    1000,
                  end:
                    (nowDate.getTime() + 1000 * 60 * 60 * values.endHour) /
                    1000,
                  title: values.activityName,
                  text: values.activityName,
                  cycleType: values.isCycle ? 2 : 0,
                  id: Math.floor(Math.random() * 100000),
                  groupArray: values.groupArray ? values.groupArray : [bus.id],
                  placeID: values.placeID ? values.placeID : 1,
                  alertPeriod: values.isCycle ? 2 : 0,
                  alertTime:
                    (nowDate.getTime() + 1000 * 60 * 60 * values.startHour) /
                    1000,
                };
                console.log(postValue);
                myAxios
                  .post("/event/activity", postValue)
                  .then((data) => {
                    console.log(data);
                    return Promise.resolve();
                  })
                  .then(() => {
                    Toast.success("插入成功！！！");
                    Modal.destroyAll();
                    this.handleGetNewEvents();
                    return Promise.resolve();
                  })
                  .catch((err) => {
                    console.log(err);
                    Toast.error(
                      "插入失败，原因是：" + err.response.data.message
                    );
                  });
              }}
            >
              {({ formState, values, formAPI }) => (
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
                  <Row style={{ width: "100%" }}>
                    <Col span={11}>
                      <Form.Select
                        field="startHour"
                        label="开始时间"
                        style={{
                          width: "100%",
                        }}
                      >
                        {optionTimeSelect}
                      </Form.Select>
                    </Col>
                    <Col span={11} offset={2}>
                      <Form.Select
                        field="endHour"
                        label="结束时间"
                        style={{
                          width: "100%",
                        }}
                      >
                        {optionTimeSelect}
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row style={{ width: "100%" }}>
                    <Col span={8} offset={4}>
                      <Form.Switch
                        field="isCycle"
                        label="是否为周期事件"
                        onChange={(checked) => {
                          this.setState({ isCheckedCycle: checked });
                        }}
                      />
                    </Col>
                    <Col span={8} offset={4}>
                      <Form.Switch
                        field="isGroup"
                        label="是否为群体事件"
                        onChange={(checked) => {
                          this.setState({ isCheckedGroup: checked });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row style={{ width: "100%" }}>
                    <Col span={8} offset={4}>
                      <Form.Switch
                        field="isPlace"
                        label="是否为线下活动"
                        onChange={(checked) => {
                          this.setState({ isCheckedPlace: checked });
                        }}
                      />
                    </Col>
                    <Col span={8} offset={4}>
                      <Form.Switch
                        field="alert"
                        label="是否设置闹钟"
                        onChange={(checked) => {
                          this.setState({ isCheckedAlert: checked });
                          console.log(values);
                        }}
                      />
                    </Col>
                  </Row>
                  {this.state.isCheckedGroup && (
                    <Row style={{ width: "100%" }}>
                      <Form.Select
                        multiple={true}
                        style={{ width: "100%" }}
                        label="参与群体人员"
                        field="groupArray"
                      >
                        {optionUser}
                      </Form.Select>
                    </Row>
                  )}
                  {this.state.isCheckedPlace && (
                    <Row style={{ width: "100%" }}>
                      <Form.Select
                        style={{ width: "100%" }}
                        label="地点"
                        field="placeID"
                      >
                        {optionPlaces}
                      </Form.Select>
                    </Row>
                  )}
                  {!this.state.isCheckedPlace && (
                    <Row style={{ width: "100%" }}>
                      <Form.Input
                        style={{ width: "100%" }}
                        label="会议地址"
                        field="conferenceUrl"
                      ></Form.Input>
                    </Row>
                  )}
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
      afterClose: () => {
        this.setState({
          isCheckedCycle: false,
          isCheckedGroup: false,
          isCheckedPlace: false,
          isCheckedAlert: false,
        });
      },
    });
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
            events={this.state.events}
            onClick={(e, d) => {
              // console.log("当前被选择的grid：" + d);
              // console.log(typeof d);
              this.selectFormDate = d;
              this.handleClickGrid(d);
            }}
            displayValue={this.state.currentTime}
            showCurrTime={false}
          />
        </div>
      </div>
    );
  }
}
