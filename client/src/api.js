import axios from "axios";
const API_URL =import.meta.env.VITE_API_URL || "http://localhost:3000";
const api = axios.create({
    baseURL: `${API_URL}/api`,
});
export const getImages = async (params = {}) => {
    const response = await api.get("/images", {
        params,
    });
return response.data;
};
export const uploadImage = async (
    file,
    title,
    description,
    tags,
    onUploadProgress
) => {
    const formData = new FormData();
     formData.append("image", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
const response = await api.post("/images", formData, {
        onUploadProgress,
    });
 return response.data;
};
export const updateImage = async (
    id,
    title,
    description,
    tags
) => {
    const response = await api.patch(`/images/${id}`, {
        title,
        description,
        tags,
    });
return response.data;
};
export const toggleFavorite = async (id, isFavorite) => {
    const response = await api.patch(`/images/${id}/favorite`, {
        isFavorite,
    });

    return response.data;
};
export const deleteImage = async (id) => {
    const response = await api.delete(`/images/${id}`);
return response.data;
};