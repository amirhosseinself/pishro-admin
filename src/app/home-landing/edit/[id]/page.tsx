"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import HomeLandingForm from "@/components/HomeLanding/HomeLandingForm";

const EditHomeLandingPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش صفحه لندینگ" />
      <HomeLandingForm homeLandingId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditHomeLandingPage;
