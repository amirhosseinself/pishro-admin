"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateLesson,
  useUpdateLesson,
  useLesson,
} from "@/hooks/api/use-lessons";
import { useCourses } from "@/hooks/api/use-courses";
import { toast } from "sonner";
import type { CreateLessonRequest } from "@/types/api";
import ImageUpload from "@/components/ImageUpload";
import VideoUpload from "@/components/VideoUpload";

interface LessonFormProps {
  lessonId?: string;
  isEdit?: boolean;
}

const LessonForm: React.FC<LessonFormProps> = ({
  lessonId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const { data: lessonData } = useLesson(lessonId || "");
  const { data: coursesData } = useCourses({ limit: 100 });

  const [formData, setFormData] = useState<CreateLessonRequest>({
    courseId: "",
    title: "",
    description: "",
    videoId: null,
    videoUrl: "",
    thumbnail: "",
    duration: "",
    order: 0,
    published: true,
    views: 0,
  });

  useEffect(() => {
    if (isEdit && lessonData) {
      const lesson = lessonData.data;
      setFormData({
        courseId: lesson.courseId,
        title: lesson.title,
        description: lesson.description || "",
        videoId: lesson.videoId || null,
        videoUrl: lesson.videoUrl,
        thumbnail: lesson.thumbnail || "",
        duration: lesson.duration || "",
        order: lesson.order,
        published: lesson.published,
        views: lesson.views,
      });
    }
  }, [isEdit, lessonData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.courseId) {
      toast.error("لطفاً دوره را انتخاب کنید");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("لطفاً عنوان درس را وارد کنید");
      return;
    }

    // بررسی اینکه یا ویدیو آپلود شده باشد یا URL وارد شده باشد
    if (!formData.videoId && (!formData.videoUrl || !formData.videoUrl.trim())) {
      toast.error("لطفاً ویدیو را آپلود کنید یا URL ویدیو را وارد کنید");
      return;
    }

    try {
      if (isEdit && lessonId) {
        await updateLesson.mutateAsync({ id: lessonId, data: formData });
        toast.success("درس با موفقیت به‌روزرسانی شد");
      } else {
        await createLesson.mutateAsync(formData);
        toast.success("درس با موفقیت ایجاد شد");
      }
      router.push("/lessons");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره درس");
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش درس" : "افزودن درس جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* Course Selection */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            دوره <span className="text-red">*</span>
          </label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">انتخاب کنید...</option>
            {coursesData?.data?.items?.map((course: any) => (
              <option key={course.id} value={course.id}>
                {course.subject}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            عنوان درس <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="مثال: مقدمه‌ای بر برنامه‌نویسی"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Description */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            placeholder="توضیحات درس را وارد کنید..."
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Video Upload */}
        <div className="mb-5.5">
          <VideoUpload
            label="ویدیوی درس"
            name="video"
            videoId={formData.videoId}
            onChange={(videoId, videoUrl) => {
              setFormData((prev) => ({
                ...prev,
                videoId: videoId || null,
                videoUrl: videoUrl || "",
              }));
            }}
            required={!formData.videoUrl}
            showVideoList={true}
          />
          <p className="mt-2 text-body-xs text-body">
            ویدیوی درس را آپلود کنید یا از ویدیوهای موجود انتخاب نمایید
          </p>
        </div>

        {/* Video URL (Alternative) */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            یا URL ویدیوی خارجی {!formData.videoId && <span className="text-red">*</span>}
          </label>
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl || ""}
            onChange={handleChange}
            placeholder="https://example.com/video.mp4"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
          <p className="mt-1 text-body-xs text-body">
            اگر ویدیو را آپلود نکردید، می‌توانید لینک مستقیم ویدیو را وارد کنید
          </p>
        </div>

        {/* Thumbnail */}
        <div className="mb-5.5">
          <ImageUpload
            label="تصویر بندانگشتی درس"
            name="thumbnail"
            value={formData.thumbnail || ""}
            onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail: url }))}
            category="COURSE"
            showPreview={true}
            previewWidth={300}
            previewHeight={180}
            alt="تصویر بندانگشتی درس"
          />
        </div>

        {/* Duration and Order */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              مدت زمان
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration || ""}
              onChange={handleChange}
              placeholder="مثال: 45:30"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
            <p className="mt-1 text-body-xs text-body">
              فرمت: دقیقه:ثانیه (مثال: 45:30)
            </p>
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ترتیب نمایش
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
            <p className="mt-1 text-body-xs text-body">
              عدد کوچکتر = نمایش زودتر
            </p>
          </div>
        </div>

        {/* Views */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            تعداد بازدید
          </label>
          <input
            type="number"
            name="views"
            value={formData.views}
            onChange={handleChange}
            min="0"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Published Checkbox */}
        <div className="mb-5.5">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="rounded border-stroke"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              منتشر شده
            </span>
          </label>
          <p className="mt-1 text-body-xs text-body">
            در صورت فعال بودن، درس برای کاربران نمایش داده می‌شود
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/lessons")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createLesson.isPending || updateLesson.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createLesson.isPending || updateLesson.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonForm;
