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
  Toast,
} from "@douyinfe/semi-ui";
import React, { useState, useRef } from "react";
import { bus } from "../../bus";
import { myAxios } from "../../utils/fetch";

export function PersonManage() {
  const [activityArray, setActivityArray] = useState([]);
  const typeArray = bus.activityTypeArray;
  const places = bus.places;
  // const userArray = bus.userArray;
  const [userArray, setUserArray] = useState(bus.userArray);
  const [isCheckedCycle, setCheckedCycle] = useState(false);
  const [isCheckedGroup, setCheckedGroup] = useState(false);
  const [isCheckedPlace, setCheckedPlace] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [initData, setInitData] = useState({});
  const initData = useRef({});
  var findActivity = null;

  function handleAdd() {
    handleClick(-1);
  }
  const optionTimeSelect = [];
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

  function handleClick(id) {
    let has = userArray.find((item) => {
      return item.id == id;
    });
    if (has) {
      initData.current = {
        ...has,
        is_admin: has.is_admin == 1 ? true : false,
      };
    } else {
      has.current = {};
    }
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
          initValues={initData.current}
          onSubmit={(values) => {
            // Toast.info({
            //   opts: values.toString(),
            // });
            values = {
              ...values,
              id: initData.current.id,
            };
            console.log(values);
            myAxios
              .post("/user/signup", values)
              .then((res) => {
                Toast.success("成功重置！");
                return Promise.resolve();
              })
              .then(() => {
                myAxios.get("/user/").then((data) => {
                  console.log(data);
                  bus.userArray = data.users;
                  setUserArray(data.users);
                  setShowModal(false);
                });
              });
          }}
        >
          {({ formState, value, formAPI }) => (
            <>
              <Form.Input label="修改姓名" field="name"></Form.Input>
              <Form.Switch label="修改Admin" field="is_admin"></Form.Switch>
              <Form.Input label="密码" field="password"></Form.Input>
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexFlow: "row",
                  placeContent: "center space-evenly",
                }}
              >
                <Button type="primary" htmlType="submit">
                  重置
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  关闭
                </Button>
              </div>
            </>
          )}
        </Form>
        <div style={{ width: "100%", height: "20px" }}></div>
      </div>
    </>
  );

  const column = [
    {
      title: "用户名称",
      dataIndex: "name",
    },
    {
      title: "用户 id",
      dataIndex: "id",
    },
    {
      title: "是否为管理员",
      dataIndex: "is_admin",
      render: (text, record, index) => <div>{text == 1 ? "是" : "否"}</div>,
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
            onClick={
              () => {
                handleClick(record.id);
              }
              // console.log(record.id);
              // handleClick(record.id);
            }
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
        title="系统中目前还没有用户哦 ~"
        style={{
          display: "flex",
          flexFlow: "column",
          placeContent: "center",
          placeItems: "center",
        }}
      ></Empty>
      <Modal
        visible={showModal}
        title="添加事件"
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
  let haveTempEvent = userArray.length > 0;
  let haveActivity;
  if (haveTempEvent) {
    haveActivity = (
      <div
        style={{
          width: "100%",
          overflowY: "hidden",
          marginTop: "30px",
        }}
      >
        <Row style={{ width: "100%", height: "calc(100% - 200px)" }}>
          <Table
            columns={column}
            dataSource={userArray}
            pagination={{ pageSize: 9 }}
          />
        </Row>
        <Modal
          visible={showModal}
          title="添加事件"
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
