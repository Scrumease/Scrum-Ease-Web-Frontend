import React, { useEffect, useState } from "react";
import BarChart from "./base/BarChart";
import { services } from "@/app/services/services";
import { ProjectCountByUser } from "@/app/interfaces/project/projectCountByUser.interface";

const ProjectCountByUserChart = () => {
  const [projectData, setProjectData] = useState<ProjectCountByUser[] | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await services.projectService.getProjectCountByUser();
        setProjectData(response);
      } catch {
        setProjectData(null);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: projectData?.map((item) => {
      const nameParts = item.userName.split(" ");
      return nameParts.slice(0, 2).join(" ");
    }),
    datasets: [
      {
        label: "Total de Projetos",
        data: projectData?.map((item) => item.totalProjects),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Projetos Ativos",
        data: projectData?.map((item) => item.activeProjects),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Quantidade de Projetos por Usuário",
      },
    },
  };

  return (
    <div>
      {projectData ? (
        <BarChart data={chartData} options={chartOptions} title="" />
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
};

export default ProjectCountByUserChart;
