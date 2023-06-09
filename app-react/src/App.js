import ComplexNavbar from "./components/Navbar";
import LoginCard from "./components/Login";
import CustomAgentTable from "./components/AgentTable";
import { useState } from "react";

function App() {

  const [loginFlag, setLoginFlag] = useState(false);
  
  const handleLogin = ({email, password}) => {
    if (email === "test@gmail.com" && password === "test") {
      setLoginFlag(true);
    }
  }

  return (
    <div className="h-full">
      {
        !loginFlag &&
        <div className="grid place-content-center h-full">
          <LoginCard handleLogin={handleLogin}/>
        </div>
      }
      {
        loginFlag &&
        <>
          <ComplexNavbar>
            <div className="grid place-content-center h-full">
              <CustomAgentTable></CustomAgentTable>
            </div>
          </ComplexNavbar>
        </>
      }
    </div>
  );
}

export default App;
