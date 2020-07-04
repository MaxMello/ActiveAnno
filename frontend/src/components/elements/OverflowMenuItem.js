// @flow
import React, {Component} from "react";
import {MenuItem} from "@material-ui/core";

/**
 * MenuItem with text overflow
 */
class OverflowMenuItem extends Component<any, any> {
    render() {
        return <MenuItem {...this.props}>
            <div style={{overflow: "hidden", textOverflow: "ellipsis"}}>
                {this.props.children}
            </div>
        </MenuItem>;
    }
}

export default OverflowMenuItem;