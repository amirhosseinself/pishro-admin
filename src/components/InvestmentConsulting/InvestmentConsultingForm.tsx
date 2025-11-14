"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateInvestmentConsulting,
  useUpdateInvestmentConsulting,
  useInvestmentConsultingDetail,
} from "@/hooks/api";
import type { CreateInvestmentConsultingRequest } from "@/types/api";

interface InvestmentConsultingFormProps {
  consultingId?: string;
  isEdit?: boolean;
}

// Type definitions for JSON array items
interface ServiceItem {
  title: string;
  description?: string;
  icon?: string;
}

interface ProcessStep {
  title: string;
  description?: string;
  icon?: string;
}

interface BenefitItem {
  title: string;
  description?: string;
  icon?: string;
}

const InvestmentConsultingForm: React.FC<InvestmentConsultingFormProps> = ({
  consultingId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createInvestmentConsulting = useCreateInvestmentConsulting();
  const updateInvestmentConsulting = useUpdateInvestmentConsulting();
  const { data: consultingData } = useInvestmentConsultingDetail(
    consultingId || ""
  );

  const [formData, setFormData] = useState<CreateInvestmentConsultingRequest>({
    heroTitle: "",
    heroSubtitle: null,
    heroDescription: null,
    heroBadgeText: null,
    servicesTitle: null,
    servicesDescription: null,
    servicesItems: [],
    processTitle: null,
    processDescription: null,
    processSteps: [],
    benefitsTitle: null,
    benefitsDescription: null,
    benefitsItems: [],
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

  // State for managing array items UI
  const [servicesItemsUI, setServicesItemsUI] = useState<ServiceItem[]>([]);
  const [processStepsUI, setProcessStepsUI] = useState<ProcessStep[]>([]);
  const [benefitsItemsUI, setBenefitsItemsUI] = useState<BenefitItem[]>([]);
  const [metaKeywordsInput, setMetaKeywordsInput] = useState<string>("");

  useEffect(() => {
    if (isEdit && consultingData) {
      const data = consultingData;
      setFormData({
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle || null,
        heroDescription: data.heroDescription || null,
        heroBadgeText: data.heroBadgeText || null,
        servicesTitle: data.servicesTitle || null,
        servicesDescription: data.servicesDescription || null,
        servicesItems: data.servicesItems || [],
        processTitle: data.processTitle || null,
        processDescription: data.processDescription || null,
        processSteps: data.processSteps || [],
        benefitsTitle: data.benefitsTitle || null,
        benefitsDescription: data.benefitsDescription || null,
        benefitsItems: data.benefitsItems || [],
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

      // Initialize UI arrays
      setServicesItemsUI(
        Array.isArray(data.servicesItems) ? data.servicesItems : []
      );
      setProcessStepsUI(
        Array.isArray(data.processSteps) ? data.processSteps : []
      );
      setBenefitsItemsUI(
        Array.isArray(data.benefitsItems) ? data.benefitsItems : []
      );
      setMetaKeywordsInput((data.metaKeywords || []).join(", "));
    }
  }, [isEdit, consultingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        servicesItems: servicesItemsUI,
        processSteps: processStepsUI,
        benefitsItems: benefitsItemsUI,
        metaKeywords: metaKeywordsInput
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k),
      };

      if (isEdit && consultingId) {
        await updateInvestmentConsulting.mutateAsync({
          id: consultingId,
          data: submitData,
        });
        alert("صفحه مشاوره سرمایه‌گذاری با موفقیت به‌روزرسانی شد");
      } else {
        await createInvestmentConsulting.mutateAsync(submitData);
        alert("صفحه مشاوره سرمایه‌گذاری با موفقیت ایجاد شد");
      }
      router.push("/investment-consulting");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره صفحه");
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? value === ""
              ? null
              : Number(value)
            : value === ""
              ? null
              : value,
    }));
  };

  // Service Items handlers
  const addServiceItem = () => {
    setServicesItemsUI([
      ...servicesItemsUI,
      { title: "", description: "", icon: "" },
    ]);
  };

  const updateServiceItem = (
    index: number,
    field: keyof ServiceItem,
    value: string
  ) => {
    const updated = [...servicesItemsUI];
    updated[index] = { ...updated[index], [field]: value };
    setServicesItemsUI(updated);
  };

  const removeServiceItem = (index: number) => {
    setServicesItemsUI(servicesItemsUI.filter((_, i) => i !== index));
  };

  // Process Steps handlers
  const addProcessStep = () => {
    setProcessStepsUI([
      ...processStepsUI,
      { title: "", description: "", icon: "" },
    ]);
  };

  const updateProcessStep = (
    index: number,
    field: keyof ProcessStep,
    value: string
  ) => {
    const updated = [...processStepsUI];
    updated[index] = { ...updated[index], [field]: value };
    setProcessStepsUI(updated);
  };

  const removeProcessStep = (index: number) => {
    setProcessStepsUI(processStepsUI.filter((_, i) => i !== index));
  };

  // Benefits Items handlers
  const addBenefitItem = () => {
    setBenefitsItemsUI([
      ...benefitsItemsUI,
      { title: "", description: "", icon: "" },
    ]);
  };

  const updateBenefitItem = (
    index: number,
    field: keyof BenefitItem,
    value: string
  ) => {
    const updated = [...benefitsItemsUI];
    updated[index] = { ...updated[index], [field]: value };
    setBenefitsItemsUI(updated);
  };

  const removeBenefitItem = (index: number) => {
    setBenefitsItemsUI(benefitsItemsUI.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش صفحه مشاوره سرمایه‌گذاری" : "افزودن صفحه مشاوره سرمایه‌گذاری جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* Hero Section */}
        <div className="mb-7">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            بخش هیرو (Hero Section)
          </h4>

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
              متن بج هیرو
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

        {/* Services Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            بخش خدمات (Services Section)
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="servicesTitle"
              value={formData.servicesTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <textarea
              name="servicesDescription"
              value={formData.servicesDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          {/* Services Items */}
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              آیتم‌های خدمات
            </label>
            <div className="space-y-4">
              {servicesItemsUI.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[7px] border border-stroke p-4 dark:border-dark-3"
                >
                  <div className="mb-3 flex justify-between">
                    <h5 className="font-medium text-dark dark:text-white">
                      خدمت {index + 1}
                    </h5>
                    <button
                      type="button"
                      onClick={() => removeServiceItem(index)}
                      className="text-sm text-red hover:underline"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                      عنوان
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateServiceItem(index, "title", e.target.value)
                      }
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                      توضیحات
                    </label>
                    <textarea
                      value={item.description || ""}
                      onChange={(e) =>
                        updateServiceItem(index, "description", e.target.value)
                      }
                      rows={2}
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                      آیکون
                    </label>
                    <input
                      type="text"
                      value={item.icon || ""}
                      onChange={(e) =>
                        updateServiceItem(index, "icon", e.target.value)
                      }
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addServiceItem}
                className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
              >
                افزودن خدمت
              </button>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            بخش فرآیند (Process Section)
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="processTitle"
              value={formData.processTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <textarea
              name="processDescription"
              value={formData.processDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          {/* Process Steps */}
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              مراحل فرآیند
            </label>
            <div className="space-y-4">
              {processStepsUI.map((step, index) => (
                <div
                  key={index}
                  className="rounded-[7px] border border-stroke p-4 dark:border-dark-3"
                >
                  <div className="mb-3 flex justify-between">
                    <h5 className="font-medium text-dark dark:text-white">
                      مرحله {index + 1}
                    </h5>
                    <button
                      type="button"
                      onClick={() => removeProcessStep(index)}
                      className="text-sm text-red hover:underline"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                      عنوان
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) =>
                        updateProcessStep(index, "title", e.target.value)
                      }
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                      توضیحات
                    </label>
                    <textarea
                      value={step.description || ""}
                      onChange={(e) =>
                        updateProcessStep(index, "description", e.target.value)
                      }
                      rows={2}
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                      آیکون
                    </label>
                    <input
                      type="text"
                      value={step.icon || ""}
                      onChange={(e) =>
                        updateProcessStep(index, "icon", e.target.value)
                      }
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addProcessStep}
                className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
              >
                افزودن مرحله
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            بخش مزایا (Benefits Section)
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="benefitsTitle"
              value={formData.benefitsTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <textarea
              name="benefitsDescription"
              value={formData.benefitsDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          {/* Benefits Items */}
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              آیتم‌های مزایا
            </label>
            <div className="space-y-4">
              {benefitsItemsUI.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[7px] border border-stroke p-4 dark:border-dark-3"
                >
                  <div className="mb-3 flex justify-between">
                    <h5 className="font-medium text-dark dark:text-white">
                      مزیت {index + 1}
                    </h5>
                    <button
                      type="button"
                      onClick={() => removeBenefitItem(index)}
                      className="text-sm text-red hover:underline"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                      عنوان
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateBenefitItem(index, "title", e.target.value)
                      }
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                      توضیحات
                    </label>
                    <textarea
                      value={item.description || ""}
                      onChange={(e) =>
                        updateBenefitItem(index, "description", e.target.value)
                      }
                      rows={2}
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                      آیکون
                    </label>
                    <input
                      type="text"
                      value={item.icon || ""}
                      onChange={(e) =>
                        updateBenefitItem(index, "icon", e.target.value)
                      }
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addBenefitItem}
                className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
              >
                افزودن مزیت
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            بخش CTA
          </h4>

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

        {/* Meta Section (SEO) */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            تنظیمات SEO
          </h4>

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
              کلمات کلیدی (جدا شده با کاما)
            </label>
            <textarea
              value={metaKeywordsInput}
              onChange={(e) => setMetaKeywordsInput(e.target.value)}
              rows={2}
              placeholder="کلمه‌کلید 1, کلمه‌کلید 2, کلمه‌کلید 3"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            تنظیمات
          </h4>

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
            onClick={() => router.push("/investment-consulting")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={
              createInvestmentConsulting.isPending ||
              updateInvestmentConsulting.isPending
            }
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createInvestmentConsulting.isPending ||
            updateInvestmentConsulting.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentConsultingForm;
