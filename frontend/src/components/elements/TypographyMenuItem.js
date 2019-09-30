import React, { Component } from "react";
import {MenuItem} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

class TypographyMenuItem extends Component {
    render() {
        return <MenuItem {...this.props}>
            <Typography variant={"body1"} noWrap>
                {this.props.children}
            </Typography>
        </MenuItem>;
    }
}

export default TypographyMenuItem;