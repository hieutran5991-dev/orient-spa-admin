import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import { ReportResponse } from "@/types/report";

export interface ReportParams {
  from_date?: string; // Format: YYYY-MM-DD
  to_date?: string; // Format: YYYY-MM-DD
}

// Get report data
export const getReport = async (params?: ReportParams): Promise<AxiosResponse<ReportResponse>> => {
  return await request.get('reports', {
    params,
  });
};

