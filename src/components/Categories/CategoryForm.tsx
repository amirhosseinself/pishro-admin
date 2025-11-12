"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateCategory,
  useUpdateCategory,
  useCategory,
} from "@/hooks/api/use-categories";
import type { CreateCategoryRequest } from "@/types/api";

interface CategoryFormProps {
  categoryId?: string;
  isEdit?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { data: categoryData } = useCategory(categoryId || "");

  const [formData, setFormData] = useState<CreateCategoryRequest>({
    slug: "",
    title: "",
    description: "",
    icon: "",
    coverImage: "",
    color: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    heroImage: "",
    heroCta1Text: "",
    heroCta1Link: "",
    heroCta2Text: "",
    heroCta2Link: "",
    aboutTitle1: "",
    aboutTitle2: "",
    aboutDescription: "",
    aboutImage: "",
    aboutCta1Text: "",
    aboutCta1Link: "",
    aboutCta2Text: "",
    aboutCta2Link: "",
    statsBoxes: [],
    enableUserLevelSection: false,
    published: true,
    featured: false,
    order: 0,
    tagIds: [],
  });

  useEffect(() => {
    if (isEdit && categoryData) {
      const category = categoryData;
      setFormData({
        slug: category.slug,
        title: category.title,
        description: category.description || "",
        icon: category.icon || "",
        coverImage: category.coverImage || "",
        color: category.color || "",
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
        metaKeywords: category.metaKeywords || [],
        heroTitle: category.heroTitle || "",
        heroSubtitle: category.heroSubtitle || "",
        heroDescription: category.heroDescription || "",
        heroImage: category.heroImage || "",
        heroCta1Text: category.heroCta1Text || "",
        heroCta1Link: category.heroCta1Link || "",
        heroCta2Text: category.heroCta2Text || "",
        heroCta2Link: category.heroCta2Link || "",
        aboutTitle1: category.aboutTitle1 || "",
        aboutTitle2: category.aboutTitle2 || "",
        aboutDescription: category.aboutDescription || "",
        aboutImage: category.aboutImage || "",
        aboutCta1Text: category.aboutCta1Text || "",
        aboutCta1Link: category.aboutCta1Link || "",
        aboutCta2Text: category.aboutCta2Text || "",
        aboutCta2Link: category.aboutCta2Link || "",
        statsBoxes: category.statsBoxes || [],
        enableUserLevelSection: category.enableUserLevelSection || false,
        published: category.published,
        featured: category.featured,
        order: category.order || 0,
        tagIds: category.tagIds || [],
      });
    }
  }, [isEdit, categoryData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && categoryId) {
        await updateCategory.mutateAsync({ id: categoryId, data: formData });
        alert("دسته‌بندی با موفقیت به‌روزرسانی شد");
      } else {
        await createCategory.mutateAsync(formData);
        alert("دسته‌بندی با موفقیت ایجاد شد");
      }
      router.push("/categories");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره دسته‌بندی");
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
          {isEdit ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Slug <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              آیکون (URL)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تصویر کاور (URL)
            </label>
            <input
              type="text"
              name="coverImage"
              value={formData.coverImage || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              رنگ (Hex Code)
            </label>
            <input
              type="text"
              name="color"
              value={formData.color || ""}
              onChange={handleChange}
              placeholder="#000000"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان متا
            </label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
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
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات متا
          </label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription || ""}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5 flex gap-5">
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

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="rounded border-stroke"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              ویژه
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="enableUserLevelSection"
              checked={formData.enableUserLevelSection}
              onChange={handleChange}
              className="rounded border-stroke"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              فعال‌سازی بخش سطح کاربر
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createCategory.isPending || updateCategory.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createCategory.isPending || updateCategory.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
