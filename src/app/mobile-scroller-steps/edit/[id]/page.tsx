"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import MobileScrollerStepForm from "@/components/MobileScrollerSteps/MobileScrollerStepForm";

const EditMobileScrollerStepPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش مرحله اسکرولر" />
      <MobileScrollerStepForm stepId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditMobileScrollerStepPage;
