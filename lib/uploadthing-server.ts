// Mock uploadthing API for demonstration

export const utapi = {
  uploadFiles: async (file: File) => {
    return {
      data: {
        url: `https://via.placeholder.com/150x200?text=${file.name}`,
        key: file.name,
      },
    };
  },
  deleteFiles: async (fileKey: string) => {
    console.log('[v0] Mock delete file:', fileKey);
    return { success: true };
  },
};
