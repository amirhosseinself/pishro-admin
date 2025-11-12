"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import UserForm from "@/components/Users/UserForm";

const EditUserPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش کاربر" />
      <UserForm userId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditUserPage;
