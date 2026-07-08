import API from "./api";

export const deleteResume = async (
  resumeName
) => {
  const response = await API.delete(
    `/resume/${encodeURIComponent(
      resumeName
    )}`
  );

  return response.data;
};