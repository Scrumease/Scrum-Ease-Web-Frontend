"use client";
import React from "react";
import Authorize from "../../../Authorize";
import { DailyDocument } from "@/app/interfaces/daily/daily.document";
import { FormResponse } from "./schema";
import DailyForm from "./form";
import { ProjectDocument } from "@/app/interfaces/project/project.document";

interface AnswerComponentProps {
  dailyForm: {
    today: DailyDocument;
    yesterday?: DailyDocument;
    project: ProjectDocument;
  };
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
          project={dailyForm.project}
        />
      </Authorize>
    </>
  );
};

export default Answer;
