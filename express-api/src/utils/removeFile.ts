import { unlink } from "fs/promises";
import path from "path";

// For Windows User
export const safeUnlink = async (
  originalFileNames: string[],
  optimizedFileNames: string[] | null,
  retries = 3,
  delayMs = 200
) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await removeFiles(originalFileNames, optimizedFileNames);
      return;
    } catch (error: any) {
      if (
        (error.code === "EPERM" || error.code === "EBUSY") &&
        attempt < retries
      ) {
        // wait a bit, and then retry
        await new Promise((res) => setTimeout(res, delayMs));
        continue;
      }
      throw error;
    }
  }
};

export const removeFiles = async (
  originalFileNames: string[],
  optimizedFileNames: string[] | null
) => {
  try {
    for (const originalFileName of originalFileNames) {
      const originalFilePath = path.join(
        __dirname,
        "../..",
        "/upload/image/" + originalFileName
      );
      await unlink(originalFilePath);
    }

    if (optimizedFileNames) {
      for (const optimizedFileName of optimizedFileNames) {
        const optimizedFilePath = path.join(
          __dirname,
          "../../..",
          "/upload/optimize/" + optimizedFileName
        );
        await unlink(optimizedFilePath);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
