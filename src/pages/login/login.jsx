import { Button, Form, Toast } from "@douyinfe/semi-ui";
import React from "react";
import { myAxios } from "../../utils/fetch";
import { useNavigate } from "react-router";

export function Login(props) {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexFlow: "row",
          placeContent: "center",
          placeItems: "center",
        }}
      >
        <div
          style={{
            width: "600px",
            height: "400px",
            borderRadius: "16px",
            boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.3)",
            padding: "30px",
            display: "flex",
            flexFlow: "column",
            placeContent: "center",
            placeItems: "center",
          }}
        >
          <div style={{ fontSize: "32px" }}>登录系统</div>
          <Form
            style={{
              width: "70%",
            }}
            onSubmit={(value) => {
              console.log(value);
              myAxios
                .post("/user/login", {
                  id: parseInt(value.id),
                  password: value.password,
                })
                .then((data) => {
                  console.log(data);
                  localStorage["token"] = data;
                  navigate("/");
                });
            }}
          >
            {({ formState, value, formApi }) => (
              <div
                style={{
                  display: "flex",
                  flexFlow: "column",
                  placeContent: "center",
                  placeItems: "center",
                  width: "100%",
                }}
              >
                <Form.Input
                  label="姓名"
                  field="name"
                  style={{ width: "300px" }}
                ></Form.Input>
                <Form.Input
                  label="账号"
                  field="id"
                  style={{ width: "300px" }}
                ></Form.Input>
                <Form.Input
                  label="密码"
                  field="password"
                  mode="password"
                  style={{ width: "300px" }}
                ></Form.Input>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexFlow: "row",
                    placeContent: "space-around",
                    placeItems: "space-around",
                  }}
                >
                  <Button theme="solid" type="primary" htmlType="submit">
                    登录
                  </Button>
                  <Button
                    theme="solid"
                    type="primary"
                    htmlType="button"
                    onClick={() => {
                      // console.log(formApi.getValues());
                      const value = formApi.getValue();
                      myAxios
                        .post("/user/signup", {
                          id: parseInt(value.id),
                          password: value.password,
                          name: value.name,
                          is_admin:
                            value.name == "蒲俊宋" ||
                            value.name == "杜抒泽" ||
                            value.name == "章成文",
                        })
                        .then((data) => {
                          console.log(data);
                          if (data.search(/Success/g) != -1) {
                            Toast.success("成功注册：" + data);
                          } else {
                            Toast.error("注册失败：" + data);
                          }
                        });
                    }}
                  >
                    注册
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
    </>
  );
}
