import { useEffect, useState } from "react";
import { ReactTerminal, TerminalContextProvider } from "react-terminal";
import { myAxios } from "../../utils/fetch";

export function Terminal(props) {
  const getLog = () => {
    return new Promise((resolve, reject) => {
      myAxios
        .get("/log/")
        .then((data) => {
          console.log(data);
          resolve(
            data.logs.map((item) => (
              <div key={item.id}>
                id: {item.id}, level: {item.level}, time:{" "}
                {new Date(item.time * 1000).toLocaleTimeString}, action:{" "}
                {item.message}, user: {item.user},
              </div>
            ))
          );
        })
        .catch((err) => {
          console.log(err);
          resolve("获取log失败");
        });
    });
  };
  const commands = {
    log: getLog,
  };
  return (
    <TerminalContextProvider>
      <div
        style={{
          width: "calc(100% - 50px)",
          height: "calc(100% - 50px)",
          margin: "25px",
        }}
      >
        <ReactTerminal
          welcomeMessage={
            <>
              <div>欢迎使用管理系统后台</div>
              <div>输入 log 查询日志</div>
              <div>输入 clear 清空控制台</div>
            </>
          }
          commands={commands}
        />
      </div>
    </TerminalContextProvider>
  );
}
