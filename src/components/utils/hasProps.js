import React, { Component } from "react";

/**
 * @author aramsey
 *
 * Utility HOC to add props to a component
 */
export default function hasProps(WrappedComponent, injectedProps) {
    return class extends Component {
        render() {
            return <WrappedComponent {...injectedProps} {...this.props} />;
        }
    };
}
