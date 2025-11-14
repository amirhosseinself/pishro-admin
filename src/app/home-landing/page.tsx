import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLaout";

import HomeLandingTable from "@/components/HomeLanding/HomeLandingTable";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت صفحه لندینگ | پنل ادمین پیشرو",

  description: "مدیریت محتوای صفحه اصل لندینگ",
};

const HomeLandingPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت صفحه لندینگ" />

      <div className="flex flex-col gap-10">
        <HomeLandingTable />
      </div>
    </DefaultLayout>
  );
};

export default HomeLandingPage;
