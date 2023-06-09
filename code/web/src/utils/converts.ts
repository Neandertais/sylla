import type { RcFile } from "antd/es/upload";

export function toBase64(file: Blob | RcFile) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      resolve(reader.result as string);
    });
    reader.readAsDataURL(file);
  });
}
