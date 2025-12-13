import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

const getDashboardData = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD)
        return response.data
    } catch (error) {
        throw error.response?.data || {message : "failed to fetch dashboard progress"}
    }
}


const progressService = {getDashboardData}
  

export default progressService