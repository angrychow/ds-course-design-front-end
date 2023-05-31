import { useEffect, useState } from "react";

export function useUserData() {
  const [userData, setUserData] = useState({
    name: "蒲俊宋",
    id: 2021211116,
    isAdmin: false,
  });
  return [userData, setUserData];
}
