import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLaout";

import InvestmentConsultingTable from "@/components/InvestmentConsulting/InvestmentConsultingTable";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت مشاوره سرمایه‌گذاری | پنل ادمین پیشرو",

  description: "مدیریت محتوای صفحه مشاوره سرمایه‌گذاری",
};

const InvestmentConsultingPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مشاوره سرمایه‌گذاری" />

      <div className="flex flex-col gap-10">
        <InvestmentConsultingTable />
      </div>
    </DefaultLayout>
  );
};

export default InvestmentConsultingPage;
