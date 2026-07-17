import API from "./api";

export const uploadResume = async (file, role) => {
  const formData = new FormData();

  formData.append("resume", file);
  formData.append("role", role);

  const response = await API.post(
    "/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteResume = async (resumeName) => {
  const response = await API.delete(
    `/resume/${encodeURIComponent(resumeName)}`
  );

  return response.data;
};