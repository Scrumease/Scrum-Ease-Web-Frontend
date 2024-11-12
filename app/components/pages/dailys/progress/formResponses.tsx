import React from "react";
import DailyResponseCard from "./dailyResponseCard";
import { DailyDocument } from "@/app/interfaces/daily/daily.document";

interface FormResponsesProps {
  responses: Array<any>;
}

//TODO: ajeitar carousel

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
    <div className="max-w-5xl mx-auto p-4">
      {Object.entries<DailyDocument[]>(groupedResponses).map(
        ([date, dailyResponses]) => (
          <div key={date} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{date}</h2>{" "}
            <div className="carousel carousel-center rounded-box max-w-full space-x-4 overflow-visible p-4">
              {dailyResponses.slice(0, 4).map((response, index) => (
                <div key={index} className="carousel-item w-80">
                  <DailyResponseCard response={response} />
                </div>
              ))}
            </div>
            {dailyResponses.length > 4 && (
              <>
                <div className="absolute top-1/2 transform -translate-y-1/2 left-2">
                  <a href="#prev" className="btn btn-circle">
                    ❮
                  </a>
                </div>
                <div className="absolute top-1/2 transform -translate-y-1/2 right-2">
                  <a href="#next" className="btn btn-circle">
                    ❯
                  </a>
                </div>
              </>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default FormResponses;
