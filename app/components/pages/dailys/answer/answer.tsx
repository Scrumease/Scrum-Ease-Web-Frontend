"use client";
import React from "react";
import Authorize from "../../../Authorize";
import { DailyDocument } from "@/app/interfaces/daily/daily.document";
import { FormResponse } from "./schema";
import DailyForm from "./form";

interface AnswerComponentProps {
  dailyForm: { today: DailyDocument; yesterday?: DailyDocument };
  handleSubmit: (response: FormResponse) => void;
}

const Answer = ({ dailyForm, handleSubmit }: AnswerComponentProps) => {
  return (
    <>
      <Authorize props={{}}>
        <DailyForm
          onSubmit={handleSubmit}
          yesterdayResponse={dailyForm.yesterday?.formResponses}
          formSnapshot={dailyForm.today.formSnapshot}
        />
      </Authorize>
    </>
  );
};

export default Answer;
