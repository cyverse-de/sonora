/**
 *
 * @author sriram
 *
 */

import React, { Component } from "react";
import Announcer from "./Announcer";
/* import {
    EMPTY_QUEUE_TIMEOUT,
    TIMEOUT,
    LEFT,
    BOTTOM,
    INFO,
} from "./AnnouncerConstants"; */

let msgQueue = [];

class CyVerseAnnouncer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: null,
            msg: "",
            open: false,
            timeout: TIMEOUT,
        };
    }

    componentDidMount() {
        let timer = setInterval(this.tickCallback, TIMEOUT);
        //display first message right away
        this.dequeue();
        this.setState({ timer });
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    dequeue = () => {
        if (msgQueue.length > 0) {
            this.setState({ msg: msgQueue.shift(), open: true });
            if (
                msgQueue.length === 0 &&
                this.state.timeout !== EMPTY_QUEUE_TIMEOUT
            ) {
                clearInterval(this.state.timer);
                let timer = setInterval(this.tickCallback, EMPTY_QUEUE_TIMEOUT);
                this.setState({ timer, timeout: EMPTY_QUEUE_TIMEOUT });
            } else if (this.state.timeout !== TIMEOUT) {
                clearInterval(this.state.timer);
                let timer = setInterval(this.tickCallback, TIMEOUT);
                this.setState({ timer, timeout: TIMEOUT });
            }
        }
    };

    handleClose = () => {
        this.setState({ open: false }, () => {
            this.tickCallback();
        });
    };

    tickCallback = () => {
        this.dequeue();
    };

    render() {
        const {
            msg: {
                text,
                variant,
                duration,
                horizontal,
                vertical,
                CustomAction,
            },
            open,
        } = this.state;
        return (
            <Announcer
                message={text}
                variant={variant ? variant : INFO}
                open={open}
                duration={duration ? duration : TIMEOUT}
                onClose={this.handleClose}
                horizontal={horizontal ? horizontal : LEFT}
                vertical={vertical ? vertical : BOTTOM}
                CustomAction={CustomAction}
            />
        );
    }
}

export default CyVerseAnnouncer;

/**
 * @typedef {(TOP|BOTTOM)} VerticalAlignmentEnum
 */

/**
 * @typedef {(RIGHT|LEFT|CENTER)} HorizontalAlignmentEnum
 */

/**
 * @typedef {(INFO|ERROR|WARNING|SUCCESS)} VariantEnum
 */

/**
 * @typedef {Object} QueueMessage
 * @property {string} text - The message text.
 * @property {VariantEnum} variant - The message variant.
 * @property {number} duration - The message duration.
 * @property {HorizontalAlignmentEnum} horizontal - The message horizontal alignment.
 * @property {VerticalAlignmentEnum} vertical - The message vertical alignment.
 */

/**
 *  Queue messages needed to be announced using CyVerseAnnouncer
 *  @param {QueueMessage} msg - A message with configuration.
 */
const announce = (msg) => {
    msgQueue.push(msg);
};

export { announce };

/**
 * Number of milliseconds after which the displayed messages vanishes.
 * @type {number}
 */
export const TIMEOUT = 6000;

export const EMPTY_QUEUE_TIMEOUT = 1000;

/**
 * A vertical position variant enum that will display messages on top of the screen.
 * @constant
 */
export const TOP = "top";

/**
 * A vertical position variant enum that will display messages on bottom of the screen.
 * @constant
 */
export const BOTTOM = "bottom";

/**
 * A horizontal position variant enum that will display messages on right of the screen.
 * @constant
 */
export const RIGHT = "right";

/**
 * A horizontal position variant enum that will display messages on left of the screen.
 * @constant
 */
export const LEFT = "left";

/**
 * A horizontal position variant enum that will display messages on center of the screen.
 * @constant
 */
export const CENTER = "center";

/**
 * A message variant enum that will display info messages.
 * @constant
 */
export const INFO = "info";

/**
 * A message variant enum that will display error messages.
 * @constant
 */
export const ERROR = "error";

/**
 * A message variant enum that will display warning messages.
 * @constant
 */
export const WARNING = "warning";

/**
 * A message variant enum that will display success messages.
 * @constant
 */
export const SUCCESS = "success";
