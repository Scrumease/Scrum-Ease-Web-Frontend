import React, { useEffect, useState } from "react";
import { services } from "../services/services";

interface DailyEntriesProps {
  userId: string;
  days: number;
}

const DailyEntries: React.FC<DailyEntriesProps> = ({ userId, days }) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await services.dailyService.getEntries(userId, days);
        setEntries(response.data);
      } catch (error: any) {
        console.error("Error fetching entries:", error);
        setError(
          "Erro ao carregar entradas. Por favor, tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [userId, days]);

  return (
    <div className="p-4">
      {isLoading && (
        <p className="text-center text-gray-600">Carregando entradas...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!isLoading && !error && entries.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {entries.map((entry) => (
            <div
              key={entry._id}
              className="card bg-base-100 shadow-lg p-6 mb-4 border rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-2">
                {new Date(entry._id).toLocaleDateString("pt-BR")}
              </h3>
              <div className="mb-4">
                <h4 className="text-lg font-medium mb-1">Ontem:</h4>
                <ul className="list-disc list-inside pl-5">
                  {entry.yesterday.map((item: any, index: number) => (
                    <li key={index}>
                      {item.text}{" "}
                      {item.project && (
                        <span className="italic text-gray-500">
                          - Projeto: {item.project}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-medium mb-1">Hoje:</h4>
                <ul className="list-disc list-inside pl-5">
                  {entry.today.map((item: any, index: number) => (
                    <li key={index}>
                      {item.text}{" "}
                      {item.project && (
                        <span className="italic text-gray-500">
                          - Projeto: {item.project}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Impedimentos:</h4>
                {entry.blockers.length > 0 &&
                !(
                  entry.blockers.length === 1 && entry.blockers[0].text === ""
                ) ? (
                  <ul className="list-disc list-inside pl-5">
                    {entry.blockers.map((item: any, index: number) => (
                      <li key={index}>
                        {item.text}{" "}
                        {item.project && (
                          <span className="italic text-gray-500">
                            - Projeto: {item.project}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    Nenhum impedimento registrado.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <p className="text-center text-gray-600">
            Nenhum registro encontrado.
          </p>
        )
      )}
    </div>
  );
};

export default DailyEntries;
