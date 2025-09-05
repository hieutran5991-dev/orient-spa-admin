import { AxiosResponse } from "axios";
import request from "@/lib/axios";
import { SettingListResponse, UpdateSettingRequest, UpdateSettingResponse } from "@/types/setting";

export const getSettings = async (): Promise<AxiosResponse<SettingListResponse>> => {
  return await request.get('settings');
};

export const updateSettings = async (setting: UpdateSettingRequest): Promise<AxiosResponse<UpdateSettingResponse>> => {
  return await request.post('settings', setting);
};