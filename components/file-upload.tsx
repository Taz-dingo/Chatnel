"use client";

import { Image, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { GetProp, UploadFile, UploadProps } from "antd";

interface FileUploadProps {
  onChange: (url?: string) => void; // 上传成功的图片的url传给父组件
  value: string;
  endpoint: "messageFile" | "serverImage"; // 上传类型
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const FILE_LIST_NUM = 1;

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [file, setFile] = useState<UploadFile>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const uploadButton = (
    <button
      style={{ border: 0, background: "none" }}
      type="button"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    // 可以直接加载value（url），但是转化一下base64预览更快
    setPreviewImage(value || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({
    fileList: newFileList,
    file,
    event,
  }) => {
    setFileList(newFileList);
    setFile(file);
    console.log("event: ", event);
    if (newFileList.length > 0) {
      onChange(newFileList[0].response?.data.url); // 把上传成功的图片的url传给父组件
      // console.log(newFileList[0].response?.data.url);
    } else {
      onChange(undefined);
    }
  };

  return (
    <>
      <Upload
        action="/upload"
        name="file"
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= FILE_LIST_NUM ? null : uploadButton}
      </Upload>
      {value && (
        <Image
          className="z-10"
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={value}
        />
      )}
    </>
  );
};