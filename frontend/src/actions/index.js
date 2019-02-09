import axios from "axios";
import { FETCH_USER } from "./types";

export const fetchUser = () => {
  return function(dispatch) {
    let match=document.cookie.match(new RegExp('(^| )user=([^;]+)'));
    dispatch({ type: FETCH_USER, payload: (match)?match[2]:null} );
  };
};
