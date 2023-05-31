import {
  IconClock,
  IconDelete,
  IconMapPin,
  IconWrench,
  IconSearch,
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
  Select,
  Input,
  Toast,
} from "@douyinfe/semi-ui";
import React, { useEffect, useRef, useState } from "react";
import { activityMock } from "./activity-mock";
import { bus } from "../../bus";
import "./course.css";
import { myAxios } from "../../utils/fetch";

export function CourseManage() {
  const [activityArray, setActivityArray] = useState(activityMock);
  const [filteredArray, setFilteredArray] = useState(activityMock);
  const typeArray = bus.activityTypeArray;
  const places = bus.places;
  const userArray = bus.userArray;
  const [isCheckedCycle, setCheckedCycle] = useState(false);
  const [isCheckedGroup, setCheckedGroup] = useState(false);
  const [isCheckedPlace, setCheckedPlace] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(false);
  const [initData, setInitData] = useState({});
  const nowChoice = useRef("title");
  const nowText = useRef("");
  var findActivity = null;
  const getNewData = () => {
    myAxios.get("/event/activity/all").then((data) => {
      console.log(data.activities);
      data.activities = data.activities.map((item) => {
        const _item = { ...item };
        _item.start = new Date(item.start * 1000);
        _item.end = new Date(item.end * 1000);
        _item.name = item.title;
        return _item;
      });
      data.activities = data.activities.filter((item) => {
        return item.activityType == 0;
      });
      if (bus.isAdmin) {
        setActivityArray(data.activities);
        setFilteredArray(data.activities);
      } else {
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
        setActivityArray(filterData);
        setFilteredArray(filterData);
      }
    });
  };
  // getNewData();
  useEffect(getNewData, []);
  function handleAdd() {
    handleClick(-1);
  }
  const optionTimeSelect = [];
  for (let i = 6; i <= 22; i++) {
    optionTimeSelect.push(
      <Form.Select.Option value={i} key={i}>
        {i} 点
      </Form.Select.Option>
    );
  }
  const optionUser = userArray.map((item) => {
    return (
      <Form.Select.Option value={item.id} key={item.id}>
        {item.name}
      </Form.Select.Option>
    );
  });
  const optionType = typeArray.map((item) => {
    return (
      <Form.Select.Option value={item.id} key={item.id}>
        {item.name}
      </Form.Select.Option>
    );
  });

  const optionPlaces = places.map((item) => (
    <Form.Select.Option value={item.id} key={item.id}>
      {item.name}
    </Form.Select.Option>
  ));
  function handleClick(id) {
    findActivity = activityArray.find((item) => item.id == id);
    if (findActivity) {
      setCheckedCycle(findActivity.isCycle);
      setCheckedGroup(findActivity.isGroup);
      setCheckedPlace(findActivity.isPlace);
      const newInitData = {};
      // 字段名字不一样，reassign
      newInitData["activityDate"] = findActivity.start;
      newInitData["startHour"] = findActivity.start.getHours();
      newInitData["endHour"] = findActivity.end.getHours();
      newInitData["isCycle"] = findActivity.isCycle;
      newInitData["isGroup"] = findActivity.isGroup;
      newInitData["alert"] = findActivity.alert;
      newInitData["activityName"] = findActivity.name;
      newInitData["activityType"] = findActivity.activityType;
      newInitData["isPlace"] = findActivity.isPlace;
      newInitData["conferenceUrl"] = findActivity.conferenceUrl;
      newInitData["placeID"] = findActivity.placeID;

      setInitData(newInitData);
    } else {
      setInitData({
        isCycle: false,
        isPlace: false,
        isGroup: false,
        alert: false,
      });
    }
    console.log(findActivity);
    setShowModal(true);
  }
  const modalContent = (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexFlow: "column",
          alignContent: "center",
          alignItems: "center",
          // margin: "0px 20px 20px 20px",
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
          initValues={initData}
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
                (nowDate.getTime() + 1000 * 60 * 60 * values.startHour) / 1000,
              end: (nowDate.getTime() + 1000 * 60 * 60 * values.endHour) / 1000,
              title: values.activityName,
              text: values.activityName,
              cycleType: values.isCycle ? 2 : 0,
              id: Math.floor(Math.random() * 100000),
              groupArray: values.groupArray ? values.groupArray : [bus.id],
              placeID: values.placeID ? values.placeID : 1,
              alertPeriod: values.isCycle ? 2 : 0,
              alertTime:
                (nowDate.getTime() + 1000 * 60 * 60 * values.startHour) / 1000,
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
                // Modal.destroyAll();
                setShowModal(false);
                getNewData();
                return Promise.resolve();
              })
              .catch((err) => {
                console.log(err);
                Toast.error("插入失败，原因是：" + err.response.data.message);
              });
          }}
        >
          {({ formState, values, formAPI }) => (
            <>
              <Row style={{ width: "70%" }}>
                <Form.DatePicker
                  field="activityDate"
                  label="课程日期"
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
                    label="是否为周期课程"
                    onChange={(checked) => {
                      setCheckedCycle(checked);
                    }}
                    disabled={findActivity != undefined}
                  />
                </Col>
                <Col span={8} offset={4}>
                  <Form.Switch
                    field="isGroup"
                    label="是否为群体课程"
                    onChange={(checked) => {
                      setCheckedGroup(checked);
                    }}
                    disabled={findActivity != undefined}
                  />
                </Col>
              </Row>
              <Row style={{ width: "100%" }}>
                <Col span={8} offset={4}>
                  <Form.Switch
                    field="isPlace"
                    label="是否为线下课程"
                    onChange={(checked) => {
                      setCheckedPlace(checked);
                    }}
                    disabled={findActivity}
                  />
                </Col>
                <Col span={8} offset={4}>
                  <Form.Switch
                    field="alert"
                    label="是否提醒"
                    onChange={(checked) => {
                      setAlert(checked);
                    }}
                    disabled={findActivity}
                  />
                </Col>
              </Row>
              {(isCheckedGroup || (findActivity && findActivity.isGroup)) && (
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
              {(isCheckedPlace || (findActivity && findActivity.isPlace)) && (
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
              {(!isCheckedPlace || (findActivity && !findActivity.isPlace)) && (
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
                  label="课程类型"
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
                  label="课程名称"
                  style={{
                    width: "100%",
                  }}
                ></Form.Input>
              </Row>
              <Row style={{ width: "60%" }}>
                <Col span={8}>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                </Col>
                <Col span={8} offset={8}>
                  <Button type="primary" onClick={() => setShowModal(false)}>
                    取消
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Form>
        <div style={{ width: "100%", height: "20px" }}></div>
      </div>
    </>
  );

  const column = [
    {
      title: "课程名称",
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
            ? // ? places.find((item) => item.id == record.placeID).name
              record.placeID
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
            onClick={() => {
              console.log(record.id);
              handleClick(record.id);
            }}
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
        title="您现在没有课程哦 ~"
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
          <Button theme="solid" type="primary" onClick={() => handleAdd()}>
            添加课程
          </Button>
        </div>
      </Empty>
      <Modal
        visible={showModal}
        title="添加课程"
        closable={false}
        footer={null}
        afterClose={() => {
          setCheckedCycle(false);
          setCheckedGroup(false);
        }}
        centered={true}
      >
        {modalContent}
      </Modal>
    </div>
  );
  let haveTempEvent = activityArray.length > 0;
  let haveActivity;
  if (haveTempEvent) {
    haveActivity = (
      <div
        style={{
          width: "100%",
          overflowY: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "70px",
            display: "flex",
            flexFlow: "row",
            alignItems: "center",
          }}
        >
          <Button
            theme="solid"
            type="primary"
            onClick={() => handleAdd()}
            style={{
              marginLeft: "20px",
            }}
          >
            添加课程
          </Button>
          <Select
            style={{
              marginLeft: "20px",
            }}
            defaultValue={"title"}
            onChange={(value) => {
              nowChoice.current = value;
            }}
          >
            <Select.Option value="title">课程名称</Select.Option>
            <Select.Option value="placeID">地点名</Select.Option>
            <Select.Option value="time">时间</Select.Option>
          </Select>
          <Input
            suffix={
              <IconSearch
                className="IconSearch"
                onClick={() => {
                  console.log(nowChoice.current);
                  if (nowChoice.current == "title") {
                    const rawArr = activityArray.filter((item) => {
                      // console.log(nowText.current);
                      // console.log(item);
                      return item.title.includes(nowText.current);
                    });
                    setFilteredArray(rawArr);
                  } else if (nowChoice.current == "time") {
                    if (nowText.current == "降序") {
                      const _activityArray = [...activityArray];
                      setFilteredArray(
                        _activityArray.sort((a, b) => {
                          return a.start.getTime() - b.start.getTime();
                        })
                      );
                    } else if (nowText.current == "升序") {
                      const _activityArray = [...activityArray];
                      setFilteredArray(
                        _activityArray.sort((a, b) => {
                          return b.start.getTime() - a.start.getTime();
                        })
                      );
                    }
                  }
                }}
              />
            }
            placeholder="多关键词搜索"
            style={{ marginLeft: "10px", width: "calc(40% - 80px)" }}
            onChange={(value, e) => {
              nowText.current = value;
            }}
          />
        </div>
        <Row style={{ width: "100%", height: "calc(100% - 200px)" }}>
          <Table
            columns={column}
            dataSource={filteredArray}
            pagination={{ pageSize: 8 }}
          />
        </Row>
        <Modal
          visible={showModal}
          title="添加课程"
          footer={null}
          afterClose={() => {
            setCheckedCycle(false);
            setCheckedGroup(false);
          }}
          closable={false}
          centered={true}
        >
          {modalContent}
        </Modal>
      </div>
    );
  }
  return haveTempEvent ? haveActivity : noActivity;
}
