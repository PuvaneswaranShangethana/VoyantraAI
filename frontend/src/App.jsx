import { useState } from "react";
import MainChat from "./pages/MainChat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Packages from "./pages/Packages";
import Hotels from "./pages/Hotels";
import Transport from "./pages/Transport";
import BudgetPlanner from "./pages/BudgetPlanner";
import Itinerary from "./pages/Itinerary";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import UnknownQuestions from "./pages/UnknownQuestions";
import AdminPackages from "./pages/AdminPackages";
import AdminHotels from "./pages/AdminHotels";
import AdminTransport from "./pages/AdminTransport";
import AdminFAQs from "./pages/AdminFAQs";
import ProfileSettings from "./pages/ProfileSettings";

function App() {
  const [page, setPage] = useState("login");
  const [autoMessage, setAutoMessage] = useState("");
  const [loggedUser, setLoggedUser] = useState(null);

  if (page === "login")
  return <Login setPage={setPage} setLoggedUser={setLoggedUser} />;
  if (page === "register") return <Register setPage={setPage} />;

  if (page === "chat")
  return (
    <MainChat
      setPage={setPage}
      autoMessage={autoMessage}
      setAutoMessage={setAutoMessage}
      loggedUser={loggedUser}
    />
    );

  if (page === "packages")
    return <Packages setPage={setPage} setAutoMessage={setAutoMessage} />;

  if (page === "hotels")
    return <Hotels setPage={setPage} setAutoMessage={setAutoMessage} />;

  if (page === "transport")
    return <Transport setPage={setPage} setAutoMessage={setAutoMessage} />;

  if (page === "budget")
    return <BudgetPlanner setPage={setPage} setAutoMessage={setAutoMessage} />;

  if (page === "itinerary")
    return <Itinerary setPage={setPage} setAutoMessage={setAutoMessage} />;

  if (page === "history") return <History setPage={setPage} />;
  if (page === "admin")
  return <AdminDashboard setPage={setPage} loggedUser={loggedUser} />;
  if (page === "unknown") return <UnknownQuestions setPage={setPage} />;
  if (page === "admin-packages") return <AdminPackages setPage={setPage} />;
  if (page === "admin-hotels") return <AdminHotels setPage={setPage} />;
  if (page === "admin-transport") return <AdminTransport setPage={setPage} />;
  if (page === "admin-faqs") return <AdminFAQs setPage={setPage} />;
  if (page === "profile")
  return <ProfileSettings setPage={setPage} loggedUser={loggedUser} />;

  return null;
}

export default App;