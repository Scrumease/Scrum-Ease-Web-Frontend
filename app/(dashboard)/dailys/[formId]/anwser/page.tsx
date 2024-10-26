"use client";
import Answer from "@/app/components/pages/dailys/answer/answer";
import { FormResponse } from "@/app/components/pages/dailys/answer/schema";
import { useToast } from "@/app/context/ToastContext";
import { ResponseDaily } from "@/app/interfaces/daily/anwser.dto";
import { DailyDocument } from "@/app/interfaces/daily/daily.document";
import { services } from "@/app/services/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const page = ({ params }: { params: { formId: string } }) => {
  const [daily, setDaily] = React.useState<{
    today: DailyDocument;
    yesterday: DailyDocument;
  }>();

  const toast = useToast();
  const router = useRouter();

  const checkOrCreateDaily = useCallback(async () => {
    try {
      const resp = await services.dailyService.checkOrCreateDaily(
        params.formId
      );
      setDaily(resp);
    } catch (error) {
      console.error("Error checking or creating daily:", error);
      toast("Erro ao buscar daily", "error");
    }
  }, []);

  useEffect(() => {
    checkOrCreateDaily();
  }, []);

  const handleSubmit = async (response: FormResponse) => {
    try {
      const responses: ResponseDaily[] = response.formResponses.map((resp) => ({
        orderQuestion: resp.orderQuestion,
        textQuestion: resp.textQuestion,
        urgencyThreshold: resp.urgencyThreshold,
        answer: resp.answer,
      }));

      await services.dailyService.anwserDaily({
        formId: params.formId,
        date: daily!.today.date,
        formResposes: responses,
      });
      toast("Resposta enviada com sucesso", "success");
      router.push("/dailys");
    } catch (error) {
      toast("Erro ao enviar daily", "error");
    }
  };

  return (
    <>
      {daily && daily.today.formResponses.length === 0 && (
        <Answer handleSubmit={handleSubmit} dailyForm={daily} />
      )}
      {daily && daily.today.formResponses.length !== 0 && (
        <div className="flex items-center justify-center h-full w-full">
          <div className="card w-96 bg-base-100 p-4 rounded-md shadow">
            <div className="card-title">Você já respondeu sua daily hoje</div>
            <div className="card-actions">
              <Link href={`/dailys`} className="btn btn-success w-full">
                Voltar
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default page;
