/**
 * A view to display a paginated list of notifications in DE notification window.
 *
 * @author Sriram
 *
 **/
import React, { Component } from "react";

import classnames from "classnames";
import constants from "../../constants";
import exStyles from "../style";
import ids from "../ids";
import intlData from "../messages";
import notificationCategory from "../model/notificationCategory";
import NotificationToolbar from "./NotificationToolbar";

import {
    DECheckbox,
    DETableRow,
    EnhancedTableHead,
    formatDate,
    LoadingMask,
    TablePaginationActions,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    Table,
    TableBody,
    TableCell,
    TablePagination,
    withStyles,
} from "@material-ui/core";

const columnData = [
    {
        id: ids.CATEGORY,
        name: "Category",
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.MESSAGE,
        name: "Message",
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.CREATED_DATE,
        name: "Created Date",
        numeric: false,
        enableSorting: true,
    },
];

function Message(props) {
    const { message, seen, presenter, classes } = props;
    let className = seen
        ? classes.notification
        : classnames(
              classes.notification,
              classes.unSeenNotificationBackground
          );
    return (
        <TableCell padding="none" className={className}>
            <div onClick={(event) => presenter.onMessageClicked(message)}>
                {" "}
                {message.text}
            </div>
        </TableCell>
    );
}

class NotificationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            total: 0,
            offset: 0,
            page: 0,
            rowsPerPage: 100,
            selected: [],
            order: "desc",
            orderBy: "Date",
            filter: props.category ? props.category : notificationCategory.all,
            markAsSeenDisabled: true,
        };
        this.fetchNotifications = this.fetchNotifications.bind(this);
        this.handleRefreshClicked = this.handleRefreshClicked.bind(this);
        this.handleMarkSeenClick = this.handleMarkSeenClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.findNotification = this.findNotification.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
        this.handleRequestSort = this.handleRequestSort.bind(this);
    }

    componentDidMount() {
        this.fetchNotifications();
    }

    fetchNotifications() {
        const { rowsPerPage, offset, filter, order } = this.state;
        this.setState({ loading: true });
        this.props.presenter.getNotifications(
            rowsPerPage,
            offset,
            filter,
            order,
            (notifications, total) => {
                this.setState({
                    loading: false,
                    data: notifications.messages,
                    total: total,
                });
            },
            (errorCode, errorMessage) => {
                this.setState({
                    loading: false,
                });
            }
        );
    }

    handleRefreshClicked() {
        this.fetchNotifications();
    }

    handleMarkSeenClick() {
        this.setState({ loading: true });
        this.props.presenter.onNotificationToolbarMarkAsSeenClicked(
            this.state.selected,
            () => {
                this.state.selected.map(
                    (id) => (this.findNotification(id).seen = true)
                );
                this.setState({ loading: false });
            },
            (errorCode, errorMessage) => {
                this.setState({
                    loading: false,
                });
            }
        );
    }

    handleDeleteClick() {
        this.setState({ loading: true });
        this.props.presenter.deleteNotifications(
            this.state.selected,
            () => {
                this.setState({
                    loading: false,
                });
                this.fetchNotifications();
            },
            (errorCode, errorMessage) => {
                this.setState({
                    loading: false,
                });
            }
        );
    }

    handleChangePage(event, page) {
        const { rowsPerPage } = this.state;
        this.setState(
            { page: page, offset: rowsPerPage * page },
            this.fetchNotifications
        );
    }

    handleFilterChange(event) {
        this.setState({ filter: event.target.value }, this.fetchNotifications);
    }

    handleChangeRowsPerPage(event) {
        this.setState(
            { rowsPerPage: event.target.value },
            this.fetchNotifications
        );
    }

    handleRowClick(event, id) {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        const filter = newSelected.filter((id) => {
            let n = this.findNotification(id);
            return n && !n.seen ? n : null;
        });

        this.setState({
            selected: newSelected,
            markAsSeenDisabled: filter.length === 0,
        });
    }

    findNotification(id) {
        return this.state.data.find(function(n) {
            return n.message.id === id;
        });
    }

    handleSelectAllClick(event, checked) {
        if (checked) {
            this.setState((state) => ({
                selected: state.data.map((n) => n.message.id),
            }));
            return;
        }
        this.setState({ selected: [] });
    }

    handleRequestSort(event, property) {
        const orderBy = property;
        let order = "desc";

        if (this.state.orderBy === property && this.state.order === "desc") {
            order = "asc";
        }

        this.setState({ order, orderBy }, () => this.fetchNotifications());
    }

    isSelected(id) {
        return this.state.selected.indexOf(id) !== -1;
    }

    render() {
        const { classes, baseDebugId } = this.props;
        const {
            data,
            rowsPerPage,
            page,
            order,
            orderBy,
            selected,
            total,
            markAsSeenDisabled,
            loading,
        } = this.state;
        const baseId = baseDebugId + ids.NOTIFICATION_VIEW;
        return (
            <div className={classes.container}>
                <LoadingMask loading={loading}>
                    <NotificationToolbar
                        baseDebugId={baseDebugId}
                        filter={this.state.filter}
                        onFilterChange={this.handleFilterChange}
                        onRefreshClicked={this.handleRefreshClicked}
                        markSeenDisabled={
                            this.state.selected.length === 0 ||
                            markAsSeenDisabled
                        }
                        deleteDisabled={this.state.selected.length === 0}
                        onMarkSeenClicked={this.handleMarkSeenClick}
                        onDeleteClicked={this.handleDeleteClick}
                    />
                    <div className={classes.table}>
                        <Table>
                            <TableBody>
                                {data.map((n) => {
                                    const isSelected = this.isSelected(
                                        n.message.id
                                    );
                                    return (
                                        <DETableRow
                                            onClick={(event) =>
                                                this.handleRowClick(
                                                    event,
                                                    n.message.id
                                                )
                                            }
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            selected={isSelected}
                                            hover
                                            key={n.message.id}
                                        >
                                            <TableCell padding="checkbox">
                                                <DECheckbox
                                                    checked={isSelected}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    notificationCategory[
                                                        n.type
                                                            .replace(/\s/g, "_")
                                                            .toLowerCase()
                                                    ]
                                                }
                                            </TableCell>
                                            <Message
                                                message={n.message}
                                                seen={n.seen}
                                                presenter={this.props.presenter}
                                                classes={classes}
                                            />
                                            <TableCell>
                                                {formatDate(
                                                    n.message.timestamp,
                                                    constants.DATE_FORMAT
                                                )}
                                            </TableCell>
                                        </DETableRow>
                                    );
                                })}
                            </TableBody>
                            <EnhancedTableHead
                                selectable={true}
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                columnData={columnData}
                                baseId={baseId}
                                rowsInPage={data.length}
                            />
                        </Table>
                    </div>
                    <TablePagination
                        colSpan={3}
                        component="div"
                        count={total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                        rowsPerPageOptions={[5, 100, 500, 1000]}
                    />
                </LoadingMask>
            </div>
        );
    }
}
export default withStyles(exStyles)(withI18N(NotificationView, intlData));
