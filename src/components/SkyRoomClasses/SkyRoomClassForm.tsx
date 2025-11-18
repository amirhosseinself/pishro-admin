"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateSkyRoomClass,
  useUpdateSkyRoomClass,
  useSkyRoomClass,
} from "@/hooks/api/use-skyroom-classes";
import { toast } from "sonner";
import type { CreateSkyRoomClassRequest } from "@/types/api";

interface SkyRoomClassFormProps {
  classId?: string;
  isEdit?: boolean;
}

const SkyRoomClassForm: React.FC<SkyRoomClassFormProps> = ({
  classId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createSkyRoomClass = useCreateSkyRoomClass();
  const updateSkyRoomClass = useUpdateSkyRoomClass();
  const { data: classData } = useSkyRoomClass(classId || "");

  const [formData, setFormData] = useState<CreateSkyRoomClassRequest>({
    meetingLink: "",
    published: true,
  });

  useEffect(() => {
    if (isEdit && classData) {
      const skyClass = classData.data;
      setFormData({
        meetingLink: skyClass.meetingLink,
        published: skyClass.published,
      });
    }
  }, [isEdit, classData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && classId) {
        await updateSkyRoomClass.mutateAsync({ id: classId, data: formData });
        toast.success("کلاس با موفقیت به‌روزرسانی شد");
      } else {
        await createSkyRoomClass.mutateAsync(formData);
        toast.success("کلاس با موفقیت ایجاد شد");
      }

      router.push("/skyroom-classes");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره کلاس");
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش کلاس Skyroom" : "افزودن کلاس Skyroom جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* Meeting Link */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            لینک کلاس Skyroom <span className="text-red">*</span>
          </label>
          <input
            type="url"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleChange}
            required
            placeholder="https://www.skyroom.online/..."
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Published */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            وضعیت انتشار
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="rounded border-stroke"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              منتشر شود
            </span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/skyroom-classes")}
            className="rounded bg-gray px-6 py-2 text-dark hover:bg-opacity-90 dark:bg-dark-2 dark:text-white"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={
              createSkyRoomClass.isPending || updateSkyRoomClass.isPending
            }
            className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createSkyRoomClass.isPending || updateSkyRoomClass.isPending
              ? "در حال ذخیره..."
              : isEdit
                ? "به‌روزرسانی"
                : "ایجاد کلاس"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkyRoomClassForm;
