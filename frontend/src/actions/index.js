import axios from "axios";
import { FETCH_USER } from "./types";

export const fetchUser = () => {
  return function(dispatch) {
    axios
      .get("http://localhost:8080/auth/current_user")
      .then(res => {console.log(res.data);dispatch({ type: FETCH_USER, payload: res.data })});
  };
};
