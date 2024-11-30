const host = "129.146.111.32:3000";

const listFiles = async () => {
  try {
    const response = await fetch(`http://${host}/`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`http://${host}/`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const watchFile = async (fileId) => {
  try {
    const response = await fetch(`http://${host}/${fileId}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const newTab = window.open(url, "_blank");
    newTab.focus();
  } catch (err) {
    console.error(err);
  }
};
const watchInfo = async (fileId) => {
  try {
    const response = await fetch(`http://${host}/info/${fileId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const downloadFile = async (fileId) => {
  try {
    const response = await fetch(`http://${host}/${fileId}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `file-${fileId}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
  }
};

const updateFile = async (fileId, file) => {
  try {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`http://${host}/${fileId}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

const deleteFile = async (fileId) => {
  try {
    const response = await fetch(`http://${host}/${fileId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export {
  watchInfo,
  listFiles,
  uploadFile,
  watchFile,
  downloadFile,
  updateFile,
  deleteFile,
};
