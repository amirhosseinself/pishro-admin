"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CategoryForm from "@/components/Categories/CategoryForm";

const EditCategoryPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش دسته‌بندی" />
      <CategoryForm categoryId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditCategoryPage;
