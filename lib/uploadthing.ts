import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  documentPdf: f({
    pdf: { maxFileSize: "100MB" },
  })
    .onUploadComplete(async ({ file }) => {
      console.log('[v0] File uploaded to Uploadthing:', file.name, file.key);
      return { uploadedBy: "App", key: file.key, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
