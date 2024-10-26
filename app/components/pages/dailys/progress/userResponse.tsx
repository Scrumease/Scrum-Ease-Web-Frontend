import React from "react";

interface UserResponseProps {
  question: any;
  response: any;
}

const UserResponse: React.FC<UserResponseProps> = ({ question, response }) => {
  const RenderResponse = () => {
    console.log("question", question, "response", response);
    switch (question.answerType) {
      case "text":
        return <p>R: {response.answer}</p>;
      case "yes/no":
        return <p>R: {response.answer ? "Sim" : "Não"}</p>;
      case "multi":
        return (
          <ul className="list-disc ml-4">
            {response.answer.map((ans: string, index: number) => (
              <li key={index}>R: {ans}</li>
            ))}
          </ul>
        );
      default:
        return <p>R: {response.answer}</p>;
    }
  };
  return (
    <div className="border p-2 rounded-lg">
      <p className="font-semibold">P: {question.text}</p>
      <RenderResponse />
    </div>
  );
};

export default UserResponse;
