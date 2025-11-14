"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InvestmentConsultingForm from "@/components/InvestmentConsulting/InvestmentConsultingForm";

const EditInvestmentConsultingPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش مشاوره سرمایه‌گذاری" />
      <InvestmentConsultingForm consultingId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditInvestmentConsultingPage;
