
export const bus = {
  id: null,
  embedToken: '',
  date: new Date("2023-03-25 23:50:00"),
  timeState: 'pause',
  places: [
    {
      id: 1,
      name: '主楼 902',
      x: 114,
      y: 514,
    },
    {
      id: 2,
      name: '学生发展中心',
      x: 191,
      y: 810,
    },
    {
      id: 3,
      name: '学五 1314',
      x: 114,
      y: 514,
    }
  ],
  activityTypeArray: [
    {
      id: 0,
      name: "课程",
    },
    {
      id: 1,
      name: "事件",
    },
  ],
  tempTypeArray: [
    {
      id: 1,
      name: "电竞",
    },
    {
      id: 2,
      name: "八卦",
    },
    {
      id: 3,
      name: "桌游",
    },
    {
      id: 4,
      name: "聚餐",
    },
  ],
  userArray: [
    { name: "安戈瑞抽", id: "2021211116", is_admin: 1 },
    { name: "法五五五", id: "2021211110", is_admin: 1 },
    { name: "Octopus", id: "2021211111", is_admin: 1 },
  ],
  isAdmin: true,
  activityArray: [],
}