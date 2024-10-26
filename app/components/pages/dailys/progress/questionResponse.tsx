import React from "react";

interface QuestionResponseProps {
  question: any;
  answer: any;
  urgencyThreshold: number;
}

const QuestionResponse: React.FC<QuestionResponseProps> = ({
  question,
  answer,
  urgencyThreshold,
}) => {
  return (
    <div className="question-response">
      <h4>{`Pergunta: ${question.text}`}</h4>
      {Array.isArray(answer) ? (
        <ul>
          {answer.map((ans, index) => (
            <li key={index}>{ans}</li>
          ))}
        </ul>
      ) : (
        <p>{`Resposta: ${answer}`}</p>
      )}
      {question.advancedSettings.urgencyRequired && (
        <p>{`Urgência: ${urgencyThreshold}`}</p>
      )}
    </div>
  );
};

export default QuestionResponse;
