import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";

// core components
import Dashboard from "./views/Dashboard/Dashboard"
import "assets/css/material-dashboard-react.css?v=1.6.0";

const hist = createBrowserHistory();

ReactDOM.render(
  <Dashboard></Dashboard>,
  document.getElementById("root")
);
