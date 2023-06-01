import { useEffect } from "react";
import { useUserData } from "../../utils/useUserData";
import { Curriculum } from "../curriculum/curriculum";
import { myAxios, setToken } from "../../utils/fetch";

export function CurriculumWrap() {
  const [userData, setUserData] = useUserData();
  // console.log(userData);
  useEffect(() => {
    console.log(userData);
  }, [userData]);
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
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Curriculum id={userData.id} />
    </div>
  );
}
