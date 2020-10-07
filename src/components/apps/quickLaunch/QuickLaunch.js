/**
 *
 * @author sriram
 *
 */
import React from "react";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";
import PublicIcon from "@material-ui/icons/Public";
import LockIcon from "@material-ui/icons/Lock";
import { withStyles } from "@material-ui/core/styles";

const styles1 = (theme) => ({
    chip: {
        margin: theme.spacing(1),
    },
});

const QuickLaunch= React.forwardRef((props, ref) => {
    const {
        id,
        handleClick,
        handleDelete,
        isDefault,
        isPublic,
        classes,
        href,
        ...custom
    } = props;
    const color = isDefault || isPublic ? "primary" : "default";
    const icon = isPublic ? <PublicIcon /> : <LockIcon />;
    return (
        <Chip
            key={id}
            icon={icon}
            href={href}
            ref={ref}
            color={color}
            onDelete={handleDelete}
            onClick={handleClick}
            className={classes.chip}
            variant="outlined"
            {...custom}
        />
    );
});

QuickLaunch.defaultProps = {
    clickable: true,
};

QuickLaunch.propTypes = {
    id: PropTypes.string.isRequired,
    clickable: PropTypes.bool,
    label: PropTypes.string.isRequired,
    handleDelete: PropTypes.func,
    handleClick: PropTypes.func,
    isDefault: PropTypes.bool,
    isPublic: PropTypes.bool,
    classes: PropTypes.object,
};

export default withStyles(styles1)(QuickLaunch);
