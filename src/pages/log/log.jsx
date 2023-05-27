import { useEffect, useState } from "react";
import { ReactTerminal, TerminalContextProvider } from "react-terminal";

export function Terminal(props) {
  const getLog = () => {
    return new Promise((resovle, reject) => {
      setTimeout(() => {
        console.log("finish");
        resovle("test");
      }, 1000);
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
