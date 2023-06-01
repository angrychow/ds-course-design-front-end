import * as echarts from "echarts";
import ReactCharts from "echarts-for-react";
import mapBUPT from "../../static/map.svg";
import React from "react";
import { Form, Row, Col, Button, Timeline } from "@douyinfe/semi-ui";
import "./navigate.css";
import { bus } from "../../bus";
import { myAxios } from "../../utils/fetch";

// echarts.registerMap("北邮地图", { svg: mapBUPT });

export class NavigateActivity extends React.Component {
  constructor(props) {
    super(props);
    this.validatePlaceSelect = this.validatePlaceSelect.bind(this);
    this.state = {
      placeArray: ["placeholder"],
      placeObj: {},
      isLoadMap: false,
      navNum: 2,
      pathArray: [
        {
          time: "2019-07-14 10:35",
          extra: "预计到达时间",
          content: "第一个地点",
          type: "ongoing",
        },
        {
          time: "2019-06-13 16:17",
          extra: "预计到达时间",
          content: "第二个地点",
          color: "pink",
        },
        {
          time: "2019-05-14 18:34",
          extra: "预计到达时间",
          content: "第三个地点",
          color: "pink",
        },
        {
          time: "2019-05-09 09:12",
          extra: "预计到达时间",
          content: "第四个地点",
          type: "success",
        },
      ],

      mapOption: {
        title: {
          text: "导航路线",
          left: "center",
          bottom: 10,
        },
        tooltip: {},
        geo: {
          map: "北邮地图",
          roam: false,
          emphasis: {
            itemStyle: {
              color: undefined,
            },
            label: {
              show: false,
            },
          },
        },
        series: [
          {
            name: "最佳路径",
            type: "lines",
            coordinateSystem: "geo",
            geoIndex: 0,
            emphasis: {
              label: {
                show: false,
              },
            },
            polyline: true,
            lineStyle: {
              color: "#c46e54",
              width: 5,
              opacity: 1,
              type: "dotted",
            },
            effect: {
              show: true,
              period: 8,
              color: "#a10000",
              constantSpeed: 80,
              trailLength: 0,
              symbolSize: [20, 12],
              symbol:
                "path://M35.5 40.5c0-22.16 17.84-40 40-40s40 17.84 40 40c0 1.6939-.1042 3.3626-.3067 5H35.8067c-.2025-1.6374-.3067-3.3061-.3067-5zm90.9621-2.6663c-.62-1.4856-.9621-3.1182-.9621-4.8337 0-6.925 5.575-12.5 12.5-12.5s12.5 5.575 12.5 12.5a12.685 12.685 0 0 1-.1529 1.9691l.9537.5506-15.6454 27.0986-.1554-.0897V65.5h-28.7285c-7.318 9.1548-18.587 15-31.2715 15s-23.9535-5.8452-31.2715-15H15.5v-2.8059l-.0937.0437-8.8727-19.0274C2.912 41.5258.5 37.5549.5 33c0-6.925 5.575-12.5 12.5-12.5S25.5 26.075 25.5 33c0 .9035-.0949 1.784-.2753 2.6321L29.8262 45.5h92.2098z",
            },
            data: [
              {
                coords: [
                  [1000, 100],
                  [100, 150],
                  [150, 150],
                  [150, 100],
                ],
              },
            ],
          },
        ],
      },
    };
  }
  validatePlaceSelect(values) {
    const err = {};
    if (!values.startPlace) {
      err.startPlace = "请选择起始地点";
    }
    if (!values.endPlace) {
      err.endPlace = "请选择终止地点";
    }
    if (values.endPlace && values.endPlace == values.startPlace) {
      err.endPlace = "终止地点不能和起始地点相同";
    }
    return err;
  }
  componentDidMount() {
    this.setState({
      placeArray: bus.places,
    });
    var placeObj = {};
    for (const place of bus.places) {
      placeObj[place.id] = place;
    }
    this.setState({
      placeObj: placeObj,
    });
    fetch(mapBUPT)
      .then((resp) => resp.text())
      .then((svgText) => {
        echarts.registerMap("北邮地图", { svg: svgText });
        this.setState({ isLoadMap: true });
      });
  }
  render() {
    const optionJSX = this.state.placeArray.map((item, index) => {
      // console.log(item);
      return (
        <Form.Select.Option value={item} key={item.id}>
          {item.name}
        </Form.Select.Option>
      );
    });

    return (
      <div
        style={{
          width: "100%",
          height: "85%",
          display: "flex",
          flexFlow: "column",
          placeItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexFlow: "row",
            placeItems: "center",
            height: "100%",
          }}
        >
          {this.state.isLoadMap && (
            <ReactCharts
              style={{ height: "125%", width: "80%" }}
              option={this.state.mapOption}
            />
          )}
          <div
            style={{
              width: "40%",
              height: "100%",
              display: "flex",
              flexFlow: "column",
              placeContent: "center",
            }}
          >
            <Form
              style={{ width: "100%", maxHeight: "50%" }}
              onSubmit={(e) => {
                console.log(e);
              }}
              validateFields={this.validatePlaceSelect}
              className="scrollbarContainer"
            >
              {(formState, value, formAPI) => (
                <>
                  <Row>
                    <Col span={12}>
                      {/* 设置一个开始导航的按钮和一个输入数字的框用来选择有几个途径点 */}
                      <Form.InputNumber
                        field="num"
                        label="导航点个数"
                        style={{
                          width: "90%",
                        }}
                        min={2}
                        max={this.state.placeArray.length}
                        defaultValue={2}
                        onChange={(value) => {
                          this.setState((prev) => {
                            prev.navNum = value;
                            return prev;
                          });
                        }}
                      />
                    </Col>
                  </Row>
                  {/* 按照navNum简历对应数量的地点选择框 */}
                  {Array.from(
                    { length: this.state.navNum },
                    (_, i) => i + 1
                  ).map((item) => {
                    return (
                      <Row>
                        <Col span={12}>
                          <Form.Select
                            name={`place${item}`}
                            field={`place${item}`}
                            label={`途径地点${item}`}
                            style={{
                              width: "90%",
                            }}
                          >
                            {optionJSX}
                          </Form.Select>
                        </Col>
                      </Row>
                    );
                  })}
                  {/* <Row>
                    <Col span={12}>
                      <Form.Select
                        field="startPlace"
                        label="出发地点"
                        style={{
                          width: "90%",
                        }}
                      >
                        {optionJSX}
                      </Form.Select>
                    </Col>
                    <Col span={12}>
                      <Form.Select
                        field="endPlace"
                        defaultValue={this.state.placeArray[0]}
                        label="结束地点"
                        style={{
                          width: "90%",
                        }}
                      >
                        {optionJSX}
                      </Form.Select>
                    </Col>
                  </Row> */}
                  <Row>
                    <Button
                      theme="solid"
                      type="primary"
                      style={{
                        width: "70px",
                      }}
                      htmlType="submit"
                      onClick={() => {
                        console.log(formState.values);
                        myAxios
                          .post("/map/navigate", formState.values, {
                            params: Object.values(formState.values).reduce(
                              (acc, cur) => {
                                acc["nodes"].push(cur.id);
                                return acc;
                              },
                              { nodes: [] }
                            ),
                          })
                          .then((data) => {
                            const nodes = data.route;
                            const path = [];

                            for (const node of nodes) {
                              path.push([
                                this.state.placeObj[node].x,
                                this.state.placeObj[node].y,
                              ]);
                            }
                            this.setState((prev) => {
                              prev.mapOption.series[0].data = path;
                              return prev;
                            });
                          });
                      }}
                    >
                      查询
                    </Button>
                  </Row>
                </>
              )}
            </Form>
            <div
              style={{
                height: "50%",
                width: "100%",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
              className="scrollbarContainer"
            >
              <Timeline
                mode="alternate"
                style={{ width: "100%" }}
                dataSource={this.state.pathArray}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
