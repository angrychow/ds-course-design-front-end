import { Button, Form } from "@douyinfe/semi-ui";
import React from "react";

export class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
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
              }}
            >
              {(formState, value, formAPI) => (
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
                    label="账号"
                    field="account"
                    style={{ width: "300px" }}
                  ></Form.Input>
                  <Form.Input
                    label="密码"
                    field="password"
                    mode="password"
                    style={{ width: "300px" }}
                  ></Form.Input>
                  <Button theme="solid" type="primary" htmlType="submit">
                    登录
                  </Button>
                </div>
              )}
            </Form>
          </div>
        </div>
      </>
    );
  }
}
