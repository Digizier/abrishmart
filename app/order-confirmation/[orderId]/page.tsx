import React from "react";
import ConfirmationClientView from "./ConfirmationClientView";

export async function generateStaticParams() {
  return [
    { orderId: "ABM-SUCCESS" },
  ];
}

interface ConfirmationPageProps {
  params: {
    orderId: string;
  };
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  return <ConfirmationClientView orderId={params.orderId} />;
}
