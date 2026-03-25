import React from "react";
import Notes from "./Notes";

const Home = (props) => {
  return <Notes showAlert={props.showAlert} sidebarOpen={props.sidebarOpen} onCloseSidebar={props.onCloseSidebar} />;
};

export default Home;