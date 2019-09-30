// @flow
import {Component} from 'react';
import {withRouter} from 'react-router-dom';

type ScrollToTopProps = {
    location: string,
    children: any
}

/**
 * Helper Component which scrolls the page to the top if the location has changed.
 */
class ScrollToTop extends Component<ScrollToTopProps> {

    componentDidUpdate(prevProps: ScrollToTopProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(ScrollToTop)