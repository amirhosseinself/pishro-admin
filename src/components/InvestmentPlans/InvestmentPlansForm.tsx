"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateInvestmentPlans,
  useUpdateInvestmentPlans,
  useInvestmentPlansDetail,
} from "@/hooks/api";
import type { CreateInvestmentPlansRequest } from "@/types/api";

interface InvestmentPlansFormProps {
  plansId?: string;
  isEdit?: boolean;
}

const InvestmentPlansForm: React.FC<InvestmentPlansFormProps> = ({
  plansId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createInvestmentPlans = useCreateInvestmentPlans();
  const updateInvestmentPlans = useUpdateInvestmentPlans();
  const { data: investmentPlansData } = useInvestmentPlansDetail(plansId || "");

  const [formData, setFormData] = useState<CreateInvestmentPlansRequest>({
    heroTitle: "",
    heroSubtitle: null,
    heroDescription: null,
    heroBadgeText: null,
    plansTitle: null,
    plansDescription: null,
    howItWorksTitle: null,
    howItWorksDescription: null,
    howItWorksSteps: [],
    faqTitle: null,
    faqDescription: null,
    ctaTitle: null,
    ctaDescription: null,
    ctaButtonText: null,
    ctaButtonLink: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: [],
    published: true,
    order: 0,
  });

  useEffect(() => {
    if (isEdit && investmentPlansData) {
      const data = investmentPlansData;
      setFormData({
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle || null,
        heroDescription: data.heroDescription || null,
        heroBadgeText: data.heroBadgeText || null,
        plansTitle: data.plansTitle || null,
        plansDescription: data.plansDescription || null,
        howItWorksTitle: data.howItWorksTitle || null,
        howItWorksDescription: data.howItWorksDescription || null,
        howItWorksSteps: data.howItWorksSteps || [],
        faqTitle: data.faqTitle || null,
        faqDescription: data.faqDescription || null,
        ctaTitle: data.ctaTitle || null,
        ctaDescription: data.ctaDescription || null,
        ctaButtonText: data.ctaButtonText || null,
        ctaButtonLink: data.ctaButtonLink || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || [],
        published: data.published,
        order: data.order,
      });
    }
  }, [isEdit, investmentPlansData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && plansId) {
        await updateInvestmentPlans.mutateAsync({ id: plansId, data: formData });
        alert("طرح‌های سرمایه‌گذاری با موفقیت به‌روزرسانی شد");
      } else {
        await createInvestmentPlans.mutateAsync(formData);
        alert("طرح‌های سرمایه‌گذاری با موفقیت ایجاد شد");
      }
      router.push("/investment-plans");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره صفحه");
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
            ? value === "" ? null : Number(value)
            : value === "" ? null : value,
    }));
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(",").map((k) => k.trim()).filter((k) => k);
    setFormData((prev) => ({
      ...prev,
      metaKeywords: keywords,
    }));
  };

  const handleHowItWorksStepsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const steps = JSON.parse(e.target.value);
      setFormData((prev) => ({
        ...prev,
        howItWorksSteps: Array.isArray(steps) ? steps : [],
      }));
    } catch {
      // Keep current value if JSON is invalid
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش طرح‌های سرمایه‌گذاری" : "افزودن طرح‌های سرمایه‌گذاری جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* Hero Section */}
        <div className="mb-7">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">بخش هیرو (Hero Section)</h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان اصلی <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان فرعی
            </label>
            <input
              type="text"
              name="heroSubtitle"
              value={formData.heroSubtitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <textarea
              name="heroDescription"
              value={formData.heroDescription || ""}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              متن نشان (Badge Text)
            </label>
            <input
              type="text"
              name="heroBadgeText"
              value={formData.heroBadgeText || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Plans Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">بخش طرح‌ها (Plans Section)</h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان طرح‌ها
            </label>
            <input
              type="text"
              name="plansTitle"
              value={formData.plansTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات طرح‌ها
            </label>
            <textarea
              name="plansDescription"
              value={formData.plansDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">بخش نحوه عملکرد (How It Works)</h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="howItWorksTitle"
              value={formData.howItWorksTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <textarea
              name="howItWorksDescription"
              value={formData.howItWorksDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              مراحل (JSON)
            </label>
            <textarea
              value={JSON.stringify(formData.howItWorksSteps, null, 2)}
              onChange={handleHowItWorksStepsChange}
              rows={6}
              placeholder='[{"step": 1, "title": "...", "description": "..."}]'
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 font-mono text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">بخش سوالات متداول (FAQ)</h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="faqTitle"
              value={formData.faqTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <textarea
              name="faqDescription"
              value={formData.faqDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">بخش CTA (Call to Action)</h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="ctaTitle"
              value={formData.ctaTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <textarea
              name="ctaDescription"
              value={formData.ctaDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                متن دکمه
              </label>
              <input
                type="text"
                name="ctaButtonText"
                value={formData.ctaButtonText || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                لینک دکمه
              </label>
              <input
                type="text"
                name="ctaButtonLink"
                value={formData.ctaButtonLink || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Meta Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">تنظیمات SEO</h4>

          <div className="mb-5.5">
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

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              کلیدواژه‌ها (با کاما جدا کنید)
            </label>
            <input
              type="text"
              value={formData.metaKeywords.join(", ")}
              onChange={handleKeywordsChange}
              placeholder="کلیدواژه۱, کلیدواژه۲, کلیدواژه۳"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">تنظیمات</h4>

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
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ترتیب نمایش
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-60 rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/investment-plans")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createInvestmentPlans.isPending || updateInvestmentPlans.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createInvestmentPlans.isPending || updateInvestmentPlans.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentPlansForm;
