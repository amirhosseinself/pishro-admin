"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InvestmentPlansForm from "@/components/InvestmentPlans/InvestmentPlansForm";

const EditInvestmentPlansPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش سبد سرمایه‌گذاری" />
      <InvestmentPlansForm plansId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditInvestmentPlansPage;
