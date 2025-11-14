import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLaout";

import MobileScrollerStepsTable from "@/components/MobileScrollerSteps/MobileScrollerStepsTable";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت مراحل اسکرولر موبایل | پنل ادمین پیشرو",

  description: "مدیریت مراحل انیمیشن اسکرولر موبایل",
};

const MobileScrollerStepsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مراحل اسکرولر موبایل" />

      <div className="flex flex-col gap-10">
        <MobileScrollerStepsTable />
      </div>
    </DefaultLayout>
  );
};

export default MobileScrollerStepsPage;
