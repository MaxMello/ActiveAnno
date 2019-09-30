import React, { Component } from "react";
import {MenuItem} from "@material-ui/core";

class OverflowMenuItem extends Component {
    render() {
        return <MenuItem {...this.props}>
            <div style={{overflow: "hidden", textOverflow: "ellipsis"}}>
                {this.props.children}
            </div>
        </MenuItem>;
    }
}

export default OverflowMenuItem;