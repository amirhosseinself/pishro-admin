"use client";

import React, { useState, useRef } from "react";
import { useCompleteVideoUpload, useVideos } from "@/hooks/useVideos";
import type { Video } from "@prisma/client";
import { toast } from "sonner";

interface VideoUploadProps {
  label: string;
  name: string;
  videoId?: string | null;
  onChange: (videoId: string, videoUrl: string) => void;
  required?: boolean;
  disabled?: boolean;
  showVideoList?: boolean;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  label,
  name,
  videoId = null,
  onChange,
  required = false,
  disabled = false,
  showVideoList = true,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploadStage, setUploadStage] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useCompleteVideoUpload();
  const { data: videosData } = useVideos({ limit: 100, processingStatus: "READY" });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // بررسی نوع فایل
    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/webm",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "فرمت فایل پشتیبانی نمی‌شود. لطفاً فایل MP4, MOV, AVI, MKV یا WebM انتخاب کنید.",
      );
      return;
    }

    // بررسی حجم فایل (حداکثر 5GB)
    const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
    if (file.size > maxSize) {
      toast.error("حجم فایل نباید بیشتر از 5 گیگابایت باشد.");
      return;
    }

    setSelectedFile(file);
    // اگر عنوان خالی است، از نام فایل استفاده کن
    if (!title) {
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTitle(fileNameWithoutExt);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      toast.error("لطفاً فایل و عنوان ویدیو را وارد کنید.");
      return;
    }

    try {
      const video = await uploadMutation.mutateAsync({
        file: selectedFile,
        title: title.trim(),
        onProgress: (stage, progress) => {
          setUploadStage(stage);
          setUploadProgress(progress);
        },
      });

      // پاکسازی فرم
      setSelectedFile(null);
      setTitle("");
      setUploadStage("");
      setUploadProgress(0);
      setShowUploadForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // ارسال videoId به parent
      onChange(video.videoId, video.originalPath);
      toast.success("ویدیو با موفقیت آپلود شد");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.message || "خطا در آپلود ویدیو");
    }
  };

  const getStageText = (stage: string) => {
    switch (stage) {
      case "requesting_url":
        return "درخواست URL آپلود...";
      case "uploading":
        return "در حال آپلود...";
      case "saving":
        return "ذخیره اطلاعات...";
      case "completed":
        return "تکمیل شد!";
      default:
        return "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  const isUploading = uploadMutation.isPending;
  const selectedVideo = videosData?.items?.find((v) => v.videoId === videoId);

  return (
    <div className="w-full">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label} {required && <span className="text-red">*</span>}
      </label>

      <div className="space-y-4">
        {/* ویدیوی انتخاب شده */}
        {selectedVideo && (
          <div className="rounded-[7px] border-[1.5px] border-stroke bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-dark dark:text-white">
                  {selectedVideo.title}
                </h4>
                <p className="mt-1 text-body-xs text-body">
                  وضعیت: {selectedVideo.processingStatus} | حجم:{" "}
                  {formatFileSize(selectedVideo.fileSize)}
                </p>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onChange("", "")}
                  className="text-red hover:text-red/80"
                  title="حذف ویدیو"
                >
                  حذف
                </button>
              )}
            </div>
          </div>
        )}

        {/* انتخاب از ویدیوهای موجود */}
        {!selectedVideo && showVideoList && videosData?.items && videosData.items.length > 0 && (
          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              انتخاب از ویدیوهای موجود
            </label>
            <select
              value={videoId || ""}
              onChange={(e) => {
                const video = videosData.items?.find(
                  (v) => v.videoId === e.target.value,
                );
                if (video) {
                  onChange(video.videoId, video.originalPath);
                }
              }}
              disabled={disabled || isUploading}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="">انتخاب کنید...</option>
              {videosData.items.map((video) => (
                <option key={video.id} value={video.videoId}>
                  {video.title} ({formatFileSize(video.fileSize)})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* دکمه نمایش فرم آپلود */}
        {!selectedVideo && (
          <button
            type="button"
            onClick={() => setShowUploadForm(!showUploadForm)}
            disabled={disabled || isUploading}
            className="inline-flex items-center justify-center rounded-[7px] border border-primary px-5 py-2.5 text-center text-body-sm font-medium text-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-white"
          >
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {showUploadForm ? "بستن فرم آپلود" : "آپلود ویدیوی جدید"}
          </button>
        )}

        {/* فرم آپلود ویدیو */}
        {showUploadForm && !selectedVideo && (
          <div className="rounded-[7px] border-[1.5px] border-stroke bg-white p-5 dark:border-dark-3 dark:bg-gray-dark">
            <h4 className="mb-4 font-medium text-dark dark:text-white">
              آپلود ویدیوی جدید
            </h4>

            <div className="space-y-4">
              {/* انتخاب فایل */}
              <div>
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  فایل ویدیو *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-body">
                    فایل انتخاب شده: {selectedFile.name} (
                    {formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              {/* عنوان */}
              <div>
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  عنوان ویدیو *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                  placeholder="عنوان ویدیو را وارد کنید"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div>
                  <div className="mb-2 flex items-center justify-between text-body-sm">
                    <span className="text-dark dark:text-white">
                      {getStageText(uploadStage)}
                    </span>
                    <span className="text-primary">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* دکمه آپلود */}
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading || !selectedFile || !title.trim()}
                className="w-full rounded-[7px] bg-primary px-4 py-3 font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? "در حال آپلود..." : "شروع آپلود"}
              </button>

              {/* راهنما */}
              <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-body-xs text-blue-700 dark:text-blue-300">
                  💡 فرمت‌های مجاز: MP4, MOV, AVI, MKV, WebM | حداکثر: 5GB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hidden input to store videoId */}
        <input type="hidden" name={`${name}_videoId`} value={videoId || ""} />
      </div>
    </div>
  );
};

export default VideoUpload;
