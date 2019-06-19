import React, { useEffect } from "react";
import "axios-progress-bar/dist/nprogress.css";
import "./App.scss";
import TheAppBar from "./components/TheAppBar";
import MonthView from "./components/MonthView";
import { Toolbar } from "@material-ui/core";
import { setGlobal, useGlobal } from "reactn";
import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment";
import { Groups } from "./data";
import { loadProgressBar } from "axios-progress-bar";

export const LoginUrl = `/login.aspx?ReturnUrl=${encodeURIComponent(
  document.URL
)}`;

setGlobal({
  sidebarOpen: false,
  showList: false,
  group: { id: 0, name: "" },
  groups: [],
  userId: Cookies.get("LAST_VALID_USER") || 0,
  myShifts: false,
  currentDate: moment()
});

loadProgressBar();

export const UseStaticData = false;

axios.defaults.withCredentials = true;

function App() {
  const [group, setGroup] = useGlobal("group");
  const [groups, setGroups] = useGlobal("groups");

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      console.log("groups has changed and is longer than 0", groups);
      setGroup({ ...groups[0] });

      console.log("set loading to false!");
    }
  }, [groups]);

  function fetchGroups() {
    if (UseStaticData) {
      setGroups([...Groups]);
      return;
    }
    axios
      .get(`/templates/GetCallboardGroups`)
      .then(response => {
        setGroups([...response.data]);
      })
      .catch(error => {
        console.log("fetch groups error");
        console.log(error);

        if (error.response && error.response.status === 401) {
          alert("You must first login to continue.");
          window.location.href = LoginUrl;
        }
      })
      .finally(() => {});
  }
  return (
    <React.Fragment>
      <TheAppBar />
      <Toolbar />
      <MonthView />
    </React.Fragment>
  );
}

export default App;
