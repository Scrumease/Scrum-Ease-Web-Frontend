import React from "react";
import DailyResponseCard from "./dailyResponseCard";
import { DailyDocument } from "@/app/interfaces/daily/daily.document";

interface FormResponsesProps {
  responses: Array<any>;
}

const FormResponses: React.FC<FormResponsesProps> = ({ responses }) => {
  const groupedResponses = responses.reduce((acc, response) => {
    const date = response.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(response);
    return acc;
  }, {} as Record<string, DailyDocument[]>);

  return (
    <div className="w-full mx-auto p-4">
      {Object.entries<DailyDocument[]>(groupedResponses).map(
        ([date, dailyResponses]) => (
          <div key={date} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{date}</h2>{" "}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {dailyResponses.map((response, index) => (
                <div key={index} className="w-full">
                  <DailyResponseCard response={response} />
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default FormResponses;
