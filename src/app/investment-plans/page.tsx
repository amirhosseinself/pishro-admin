import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLaout";

import InvestmentPlansTable from "@/components/InvestmentPlans/InvestmentPlansTable";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت سبدهای سرمایه‌گذاری | پنل ادمین پیشرو",

  description: "مدیریت محتوای صفحه سبدهای سرمایه‌گذاری",
};

const InvestmentPlansPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="سبدهای سرمایه‌گذاری" />

      <div className="flex flex-col gap-10">
        <InvestmentPlansTable />
      </div>
    </DefaultLayout>
  );
};

export default InvestmentPlansPage;
