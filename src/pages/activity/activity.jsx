import {
  IconClock,
  IconDelete,
  IconMapPin,
  IconWrench,
} from "@douyinfe/semi-icons";
import { IllustrationNoContent } from "@douyinfe/semi-illustrations";
import {
  Button,
  Card,
  Empty,
  Row,
  Form,
  Modal,
  Col,
  Table,
} from "@douyinfe/semi-ui";
import React from "react";
import { activityMock } from "./activity-mock";
import { bus } from "../../bus";

export class ActivityManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityArray: activityMock,
      typeArray: bus.activityTypeArray,
      places: bus.places,
      userArray: bus.userArray,
      isCheckedCycle: false,
      isCheckedGroup: false,
      isCheckedPlace: false,
      placesArray: bus.places,
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleAdd() {
    this.handleClick(-1);
  }

  handleClick(id) {
    const optionTimeSelect = [];
    for (let i = 6; i <= 22; i++) {
      optionTimeSelect.push(
        <Form.Select.Option value={i} key={i}>
          {i} 点
        </Form.Select.Option>
      );
    }
    const optionUser = this.state.userArray.map((item) => {
      return (
        <Form.Select.Option value={item.id} key={item.id}>
          {item.name}
        </Form.Select.Option>
      );
    });
    const optionType = this.state.typeArray.map((item) => {
      return (
        <Form.Select.Option value={item.id} key={item.id}>
          {item.name}
        </Form.Select.Option>
      );
    });
    const findActivity = this.state.activityArray.find((item) => item.id == id);
    var initData = {};
    if (findActivity) {
      this.state.isCheckedCycle = findActivity.isCycle;
      this.state.isCheckedGroup = findActivity.isGroup;
      this.state.isCheckedPlace = findActivity.isPlace;
      // 字段名字不一样，reassign
      initData["activityDate"] = findActivity.start;
      initData["startHour"] = findActivity.start.getHours();
      initData["endHour"] = findActivity.end.getHours();
      initData["isCycle"] = findActivity.isCycle;
      initData["isGroup"] = findActivity.isGroup;
      initData["activityName"] = findActivity.name;
      initData["activityType"] = this.state.typeArray.find(
        (item) => item.name == findActivity.activityType
      ).id;
      initData["isPlace"] = findActivity.isPlace;
      initData["conferenceUrl"] = findActivity.conferenceUrl;
      initData["placeID"] = findActivity.placeID;
      // initData = JSON.parse(JSON.stringify(find))
      // initData.push(...findActivity);
      // initData[]
    }
    const optionPlaces = this.state.placesArray.map((item) => (
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
              initValues={initData}
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
                        disabled={findActivity}
                      />
                    </Col>
                    <Col span={8} offset={4}>
                      <Form.Switch
                        field="isGroup"
                        label="是否为群体事件"
                        onChange={(checked) => {
                          this.setState({ isCheckedGroup: checked });
                        }}
                        disabled={findActivity}
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
                        disabled={findActivity}
                      />
                    </Col>
                  </Row>
                  {(this.state.isCheckedGroup ||
                    (findActivity && findActivity.isGroup)) && (
                    <Row style={{ width: "100%" }}>
                      <Form.Select
                        multiple={true}
                        style={{ width: "100%" }}
                        label="参与群体人员"
                        field="groupSelect"
                      >
                        {optionUser}
                      </Form.Select>
                    </Row>
                  )}
                  {(this.state.isCheckedPlace ||
                    (findActivity && findActivity.isPlace)) && (
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
                  {(!this.state.isCheckedPlace ||
                    (findActivity && !findActivity.isPlace)) && (
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
        this.setState({ isCheckedCycle: false, isCheckedGroup: false });
      },
    });
  }

  render() {
    const column = [
      {
        title: "事件名称",
        dataIndex: "name",
      },
      {
        title: "时间",
        dataIndex: "time",
        render: (text, record, index) => (
          <div>
            {record.start.getMonth() +
              1 +
              "月" +
              record.start.getDate() +
              "日 " +
              record.start.getHours() +
              "时-" +
              record.end.getHours() +
              "时"}
          </div>
        ),
      },
      {
        title: "地点或 URL",
        dataIndex: "place",
        width: 500,
        render: (text, record, index) => (
          <div
            style={{
              overflowWrap: "break-word",
              maxWidth: "500px",
            }}
          >
            {record.isPlace
              ? this.state.places.find((item) => item.id == record.placeID).name
              : record.conferenceUrl}
          </div>
        ),
      },
      {
        title: "修改",
        dataIndex: "modify",
        width: 50,
        render: (text, record, index) => (
          <div>
            <Button
              icon={<IconWrench />}
              theme="borderless"
              onClick={() => this.handleClick(record.id)}
            />
          </div>
        ),
      },
      {
        title: "删除",
        dataIndex: "delete",
        width: 50,
        render: (text, record, index) => (
          <div>
            <Button icon={<IconDelete />} theme="borderless" />
          </div>
        ),
      },
    ];

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
          title="您现在没有活动哦 ~"
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
              添加活动
            </Button>
          </div>
        </Empty>
      </div>
    );
    let haveTempEvent = this.state.activityArray.length > 0;
    let haveActivity;
    if (haveTempEvent) {
      haveActivity = (
        <div
          style={{
            width: "100%",
            overflowY: "hidden",
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
              添加活动
            </Button>
          </Row>
          <Row style={{ width: "100%", height: "calc(100% - 200px)" }}>
            <Table
              columns={column}
              dataSource={this.state.activityArray}
              pagination={{ pageSize: 8 }}
            />
          </Row>
        </div>
      );
    }
    return haveTempEvent ? haveActivity : noActivity;
  }
}
