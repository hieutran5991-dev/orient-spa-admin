import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import { LanguageListResponse } from "@/types/language";

export const getLanguages = async (): Promise<AxiosResponse<LanguageListResponse>> => {
  return request.get('languages');
};