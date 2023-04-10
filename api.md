## 接口文档

### Login

+ /login POST
  + account：用户的 id 号
  + pwd：用户的密码
+ 成功 200，并返回 jwt
+ 这是唯一不需要鉴权的 Api

### Curriculum

+ /curriculum GET
  + Date：int，返回时间戳
+ 成功 200，并返回时间戳本周所有 Activity
  + Activity 字段
    + start：开始时间的时间戳
    + end：结束时间的时间戳
    + text：string，Activity 说明
    + title：string，Activity 标题
    + isGroup：是否为群体事件
      + groupArray：如果是群体事件，返回参与人数组
    + isCycle：是否为周期时间
    + activityType：事件类型，Stirng
    + id：任务 id

+ /curriculum POST
  + post 内容同上述 Activity 字段

### Navigate

+ /navigate/place GET
  + 返回所有地点的列表
    + label：String，地点名字
    + id：int/String，地点标识符，类型后端实现，前端无所谓

+ /navigate GET
  + place：Array，Array 里是 id，第一个是起点，最后一个是终点
  + isTemp：是否为顺便服务导航，如果是的话，Array 内可能有多个 place id；如果不是，那么Array只会有两个 place id

### Temporary

+ /temporary GET
  + 返回临时任务
    + time：时间戳，临时任务时间
    + place id：place 标识符
    + place label：place 名字
    + type：临时任务类型
    + name：临时任务标题
    + id：临时任务 id

+ /temporary POST
  + 添加或者修改临时任务，id 存在则修改，不存在则新增
    + time：时间戳，临时任务时间
    + place id：place 标识符
    + place label：place 名字
    + type：临时任务类型
    + name：临时任务标题
    + id：临时任务 id