import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./pieChartBox.scss";
import { useQuery } from "@tanstack/react-query";
import UsersByRoleService from "../../services/users_by_role_service";
import LoadingIndicator from "../loadingIndicator/LoadingIndicator";

function PieChartBox(){

  const service = new UsersByRoleService();

  const {status, data } = useQuery(["users_by_roles"], service.fetchUsersByRoles)
  
  if(status == "loading") return (<LoadingIndicator/>); //TODO component for error (use tailwind to style them)
  if(status == "error") return <p>error {/*error.message*/}</p>; //TODO find a way to ignore error in TS
  
  const usersPercentageData = [
    { name: "Admin", value: data.admin || 0, color: "#0088FE" },
    { name: "Salesman", value: data.salesman || 0, color: "#00C49F" },
    { name: "Supervisor", value: data.supervisor || 0, color: "#FFBB28" },
  ];

  return (
    <div className="pieChartBox">
      <h1>Users by Role</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{ background: "white", borderRadius: "5px" }}
            />
            <Pie
              data={usersPercentageData}
              innerRadius={"70%"}
              outerRadius={"90%"}
              paddingAngle={5}
              dataKey="value"
            >
              {usersPercentageData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="options">
        {usersPercentageData.map((item) => (
          <div className="option" key={item.name}>
            <div className="title">
              <div className="dot" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartBox;
