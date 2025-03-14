"use client";
import Authorize from "../components/Authorize";
import ProjectCountByUserChart from "../components/charts/ProjectCountByUserChart";

const DashboardContent = (): JSX.Element => {
  return (
    <Authorize props={{}}>
      <div className="h-full">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Line Chart</h2>
            </div>
          </div> */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quantidade de Projetos por Usuário</h2>
              <ProjectCountByUserChart />
            </div>
          </div>
        </div>
      </div>
    </Authorize>
  );
};

export default DashboardContent;
