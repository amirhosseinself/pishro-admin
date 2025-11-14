import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLaout";

import AboutPageTable from "@/components/AboutPage/AboutPageTable";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت صفحه درباره ما | پنل ادمین پیشرو",

  description: "مدیریت محتوای صفحه درباره ما",
};

const AboutPagePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت صفحه درباره ما" />

      <div className="flex flex-col gap-10">
        <AboutPageTable />
      </div>
    </DefaultLayout>
  );
};

export default AboutPagePage;
