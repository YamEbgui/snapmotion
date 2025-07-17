import { api } from "@/app/lib/apiClient";
import { FramesResponse } from "@/app/types/Frame";

export const getFrames = async (file: File): Promise<FramesResponse> => {
    const formData = new FormData();
    formData.append("image", file);
    return api('/api/generate-frames',{method: "POST", body: formData});
}