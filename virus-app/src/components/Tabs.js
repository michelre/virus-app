import {NavTab} from "react-router-tabs";
import React from "react";

const Tabs = () => <div className="tabs">
    <NavTab to="/" exact>Statistiques par pays</NavTab>
    <NavTab to="/classification" exact>Classification par pays</NavTab>
</div>

export default Tabs
