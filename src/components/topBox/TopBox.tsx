import { useQuery } from "@tanstack/react-query";
import TopSalesMenService from "../../services/top_salesmen_service";
import "./topBox.scss"
import LoadingIndicator from "../loadingIndicator/LoadingIndicator";

function TopBox(){
  const service = new TopSalesMenService();

  const {status, data } = useQuery(["top_salesmen"], service.fetchTopSalesmen)

  if(status == "loading") return <LoadingIndicator/>; //TODO components for loading and error (use tailwind to style them)
  if(status == "error") return <p>error {/*error.message*/}</p>; //TODO find a way to ignore error in TS

  const topSalesmen = data ?? [];

  return (
    <div className="topBox">
      <h1>Top Salesmen</h1>
      <div className="list">
        {topSalesmen.map(user=>(
          <div className="listItem" key={user.id}>
            <div className="user">
              {/* <img src={user.img} alt="" /> */}
              <div className="userTexts">
                <span className="username">{user.name}</span>
                <span className="email">{user.email}</span>
              </div>
            </div>
            <span className="amount">{user.reports_count} <br /> {user.reports_count === 1 ? "report" : "reports"}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopBox