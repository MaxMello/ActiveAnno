// @flow
import React from 'react';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';

type HideOnScrollProps = {
    children: any,
    window?: Function,
}

export function HideOnScroll(props: HideOnScrollProps) {
    const { children, window } = props;
    const trigger = useScrollTrigger({ target: window ? window() : undefined, threshold: 100});

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}
