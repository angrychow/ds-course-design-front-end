import {
  IconClock,
  IconDelete,
  IconMapPin,
  IconWrench,
  IconSearch,
} from "@douyinfe/semi-icons";
import { setToken } from "../../utils/fetch";
import { useUserData } from "../../utils/useUserData";

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
  DatePicker,
  TextArea,
} from "@douyinfe/semi-ui";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { activityMock } from "./activity-mock";
import { bus } from "../../bus";
import "./course.css";
import { myAxios } from "../../utils/fetch";
import { InputNumber } from "@douyinfe/semi-ui/lib/es/inputNumber";

export function CourseManage() {
  const optionTimeSelect = [];
  for (let i = 6; i <= 22; i++) {
    optionTimeSelect.push(
      <Form.Select.Option value={i} key={i}>
        {i} 点
      </Form.Select.Option>
    );
  }
  const [activityArray, setActivityArray] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);
  const isUpdate = useRef(false);
  const typeArray = bus.activityTypeArray;
  const places = bus.places;
  const userArray = bus.userArray;
  const [isCheckedCycle, setCheckedCycle] = useState(false);
  const [isCheckedGroup, setCheckedGroup] = useState(false);
  const [isCheckedPlace, setCheckedPlace] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showArrangeModal, setShowArrangeModal] = useState(false);
  const [alert, setAlert] = useState(false);
  const [arrangeNumber, setArrangeNumber] = useState(1);
  const [initData, setInitData] = useState({});
  const nowChoice = useRef("title");
  const nowText = useRef("");
  const arrangeDate = useRef([]);
  const arrangeStart = useRef([]);
  const arrangeEnd = useRef([]);
  const [conflict, setConflict] = useState(null);
  const [userData, setUserData] = useUserData();
  useEffect(() => {
    setToken();
    myAxios.get("/user/verify").then((data) => {
      console.log(data);
      setUserData({
        name: data.name,
        id: data.id,
        isAdmin: data.is_admin == 0 ? false : true,
      });
    });
  }, []);
  var findActivity = null;
  const arrangeTimeList = useMemo(() => {
    const ret = [];
    arrangeDate.current = [];
    arrangeStart.current = [];
    arrangeEnd.current = [];
    const getDate = new Date();
    for (let i = 0; i < arrangeNumber; i++) {
      arrangeDate.current.push(new Date());
      arrangeStart.current.push(8);
      arrangeEnd.current.push(8);
      const id = getDate.getTime() + i * 10;
      ret.push(
        <div
          key={id}
          style={{
            width: "50%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexFlow: "column",
              placeContent: "center space-evenly",
              marginTop: "10px",
            }}
            key={id + 1}
          >
            <DatePicker
              onChange={(date) => {
                arrangeDate.current[i] = date;
              }}
              key={id + 2}
              style={{
                width: "100%",
                marginTop: "5px",
              }}
            ></DatePicker>
            <Select
              key={id + 3}
              label="开始时间"
              style={{
                width: "100%",
                marginTop: "5px",
              }}
              onChange={(value) => {
                console.log(value);
                arrangeStart.current[i] = value;
              }}
            >
              {optionTimeSelect}
            </Select>
            <Select
              key={id + 4}
              label="结束时间"
              style={{
                width: "100%",
                marginTop: "5px",
              }}
              onChange={(value) => {
                console.log(value);
                arrangeEnd.current[i] = value;
              }}
              // ref={refEnd}
            >
              {optionTimeSelect}
            </Select>
          </div>
        </div>
      );
    }
    return ret;
  }, [arrangeNumber]);
  const getNewData = () => {
    myAxios.get("/event/activity/all").then((data) => {
      data.activities = data.activities.map((item) => {
        const _item = { ...item };
        _item.start = new Date(item.start * 1000);
        _item.end = new Date(item.end * 1000);
        _item.name = item.title;
        return _item;
      });
      data.activities = data.activities.filter(
        (item) => item.activityType == 0
      );
      console.log(data.activities);
      if (userData.isAdmin) {
        setActivityArray(data.activities);
        setFilteredArray(data.activities);
      } else {
        var filterData = data.activities.filter((item) => {
          let hasId = false;
          for (let i of item.groupArray) {
            if (i == userData.id) {
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
  useEffect(getNewData, [userData]);
  function handleAdd() {
    isUpdate.current = false;
    handleClick(-1);
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
    if (id != -1) {
      isUpdate.current = true;
    }
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
      newInitData["isCycle"] = findActivity.cycleType;
      newInitData["isGroup"] = findActivity.isGroup;
      newInitData["alert"] = findActivity.alert;
      newInitData["activityName"] = findActivity.name;
      newInitData["activityType"] = findActivity.activityType;
      newInitData["isPlace"] = findActivity.isPlace;
      newInitData["conferenceUrl"] = findActivity.conferenceUrl;
      newInitData["placeID"] = findActivity.placeID;
      newInitData["id"] = findActivity.id;

      setInitData(newInitData);
    } else {
      setInitData({
        isCycle: 0,
        isPlace: false,
        isGroup: false,
        alert: false,
      });
    }
    console.log(findActivity);
    setShowModal(true);
  }
  const optionCycles = [
    {
      id: 0,
      name: "不重复",
    },
    {
      id: 1,
      name: "每天",
    },
    {
      id: 2,
      name: "每周",
    },
  ].map((item) => (
    <Form.Select.Option value={item.id} key={item.id}>
      {item.name}
    </Form.Select.Option>
  ));

  const arrangeValue = useRef({
    users: [],
    cycleType: 0,
    times: [],
  });
  const conflictJSX = useMemo(() => {
    if (!conflict) return <></>;
    if (conflict.length == 0) return <>所有时间段都可行</>;
    else
      return conflict.map((item, index) => {
        if (item.length != 0) {
          return (
            <div key={item}>
              用户：{item.toString()}在时间段
              {new Date(
                arrangeValue.current.times[index][0] * 1000
              ).toDateString() +
                " " +
                new Date(
                  arrangeValue.current.times[index][0] * 1000
                ).getHours() +
                " 时"}{" "}
              -{" "}
              {new Date(
                arrangeValue.current.times[index][1] * 1000
              ).toDateString() +
                " " +
                new Date(
                  arrangeValue.current.times[index][1] * 1000
                ).getHours() +
                " " +
                " 时"}
              有冲突。
            </div>
          );
        }
        return (
          <div key={item}>
            时间段
            {new Date(
              arrangeValue.current.times[index][0] * 1000
            ).toDateString() +
              " " +
              new Date(arrangeValue.current.times[index][0] * 1000).getHours() +
              " 时"}{" "}
            -{" "}
            {new Date(
              arrangeValue.current.times[index][1] * 1000
            ).toDateString() +
              " " +
              new Date(arrangeValue.current.times[index][1] * 1000).getHours() +
              " 时"}
            无冲突。
          </div>
        );
      });
  }, [conflict]);

  const arrangeModalContent = (
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
        <>参与群体人员</>
        <Select
          multiple={true}
          style={{ width: "100%" }}
          label="参与群体人员"
          field="groupSelect"
          onChange={(value) => {
            arrangeValue.current.users = value;
          }}
        >
          {optionUser}
        </Select>
        <div style={{ marginTop: "20px" }}>周期</div>
        <Select
          label="周期"
          onChange={(value) => {
            arrangeValue.current.cycleType = value;
          }}
        >
          {optionCycles}
        </Select>
        <InputNumber
          defaultValue={arrangeNumber}
          onChange={(value) => {
            setArrangeNumber(value);
          }}
          style={{
            marginTop: "20px",
          }}
        />
        {arrangeTimeList}
        <div
          style={{
            display: "flex",
            flexFlow: "row",
            alignContent: "center",
            justifyContent: "space-evenly",
            width: "70%",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              console.log(arrangeStart.current);
              console.log(arrangeEnd.current);

              arrangeValue.current.times = [];
              for (let i = 0; i < arrangeDate.current.length; i++) {
                let _ = arrangeDate.current[i];
                let __ = new Date(
                  _.getFullYear(),
                  _.getMonth() + 1,
                  _.getDate()
                );
                arrangeValue.current.times.push([
                  (__.getTime() + arrangeStart.current[i] * 60 * 60 * 1000) /
                    1000,
                  (__.getTime() + arrangeEnd.current[i] * 60 * 60 * 1000) /
                    1000,
                ]);
              }
              console.log(new Date(arrangeValue.current.times[0][0] * 1000));
              myAxios
                .post("/event/arrange", arrangeValue.current)
                .then((res) => {
                  console.log(res.conflicts);
                  setConflict(res.conflicts);
                });
            }}
          >
            查询
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setShowArrangeModal(false);
            }}
          >
            取消
          </Button>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexFlow: "column",
            placeContent: "center center",
            margin: "10px",
          }}
        >
          {conflictJSX}
        </div>
      </div>
    </>
  );

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
              cycleType: values.isCycle,
              id: isUpdate.current
                ? values.id
                : Math.floor(Math.random() * 100000),
              groupArray: values.groupArray ? values.groupArray : [userData.id],
              placeID: values.placeID ? values.placeID : 1,
              alertPeriod: values.isCycle,
              alertTime:
                (nowDate.getTime() + 1000 * 60 * 60 * values.startHour) / 1000,
            };
            console.log(postValue);
            myAxios
              .post(
                isUpdate.current ? "/event/update" : "/event/activity",
                postValue
              )
              .then((data) => {
                console.log(data);
                return Promise.resolve();
              })
              .then(() => {
                Toast.success(isUpdate.current ? "修改成功！" : "插入成功！");
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
                  <Form.Select
                    field="isCycle"
                    label="是否为周期事件"
                    onChange={(checked) => {
                      this.setState({ isCheckedCycle: checked });
                    }}
                  >
                    {optionCycles}
                  </Form.Select>
                </Col>
                <Col span={8} offset={4}>
                  <Form.Switch
                    field="isGroup"
                    label="是否为群体事件"
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
                    label="是否为线下活动"
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
      title: "周期性",
      dataIndex: "cycle",
      render: (text, record, index) => (
        <div>
          {record.cycleType == 0 && <>不重复</>}
          {record.cycleType == 1 && <>每日课程</>}
          {record.cycleType == 2 && <>每周课程</>}
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
          {(() => {
            if (record.isPlace) {
              if (places.find((item) => item.id == record.placeID)) {
                return places.find((item) => item.id == record.placeID).name;
              } else {
                return record.placeID;
              }
            } else {
              return record.conferenceUrl;
            }
          })()}
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
          <Button
            icon={<IconDelete />}
            onClick={() => {
              console.log(record);
              myAxios.get("/event/delete?id=" + record.id).then((res) => {
                Toast.info("删除成功");
                getNewData();
              });
            }}
            theme="borderless"
          />
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
          <Button theme="solid" type="primary" onClick={() => handleAdd()}>
            添加活动
          </Button>
        </div>
      </Empty>
      <Modal
        visible={showModal}
        title="事件面板"
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
  // let haveTempEvent = true;
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
            添加活动
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
            <Select.Option value="title">事件名称</Select.Option>
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
          <Button
            theme="solid"
            type="primary"
            onClick={() => {
              setShowArrangeModal(true);
              setArrangeNumber(2);
            }}
            style={{
              marginLeft: "20px",
            }}
          >
            自动排期
          </Button>
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
          title="事件面板"
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
        <Modal
          visible={showArrangeModal}
          title="自动排期建议"
          footer={null}
          closable={true}
          centered={false}
        >
          {arrangeModalContent}
        </Modal>
      </div>
    );
  }
  return haveTempEvent ? haveActivity : noActivity;
}
