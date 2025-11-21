import { useRef } from "react";
import ApiMiddleware from "../middleware/ApiMiddleware";

export default function useApiMiddleware() {
  const apiMiddleware = useRef(ApiMiddleware);
  return { apiMiddleware: apiMiddleware.current };
}
