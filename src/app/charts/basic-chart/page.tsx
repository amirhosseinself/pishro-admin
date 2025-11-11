import dynamic from "next/dynamic";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const BasicChart = dynamic(() => import("@/components/Charts/BasicChart"), { ssr: false });

export const metadata: Metadata = {
  title: "Next.js Basic Chart Page | pishro - Next.js Dashboard Kit",
  description: "This is Next.js Basic Chart page for pishro Dashboard Kit"
  // other metadata
};

const BasicChartPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="نمودار ساده" />

      <BasicChart />
    </DefaultLayout>);

};

export default BasicChartPage;