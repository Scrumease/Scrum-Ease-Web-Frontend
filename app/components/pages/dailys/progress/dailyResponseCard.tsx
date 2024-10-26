import React from "react";
import UserResponse from "./userResponse";

interface DailyResponseProps {
  response: any;
}

const DailyResponseCard: React.FC<DailyResponseProps> = ({ response }) => {
  const { date, userInfo, formResponses, formSnapshot } = response;

  return (
    <div className="card w-80 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{`Respostas de ${date}`}</h2>
        <p className="font-semibold">{`Usuário: ${userInfo?.name}`}</p>
        <div className="divider"></div>
        <div className="space-y-2">
          {formResponses.map((res: any, index: number) => (
            <UserResponse
              key={res._id}
              question={formSnapshot.questions.find(
                (q: any) => q.order === res.orderQuestion
              )}
              response={res}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyResponseCard;
