import { useRef } from "react";
import ApiMiddleware from "../api/ApiMiddleware";

export default function useApi() {
  const apiMiddleware = useRef(ApiMiddleware);
  return apiMiddleware.current;
}
