"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AboutPageForm from "@/components/AboutPage/AboutPageForm";

const EditAboutPagePage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش صفحه درباره ما" />
      <AboutPageForm aboutPageId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditAboutPagePage;
