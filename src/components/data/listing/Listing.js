/**
 * @author aramsey
 *
 * A component intended to be the parent to the data's table view and
 * thumbnail/tile view.
 */
import React, { useEffect, useState } from "react";

import { formatMessage, withI18N } from "@cyverse-de/ui-lib";
import {
    Hidden,
    TablePagination,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import Header from "../Header";
import messages from "../messages";
import TableView from "./TableView";
import UploadDropTarget from "../../uploads/UploadDropTarget";
import {
    getDataListing,
    getDataRoots,
} from "../../../facades/dataServiceFacade";

import { camelcaseit } from "../../../common/functions";
import HomeIcon from "@material-ui/icons/Home";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import GroupIcon from "@material-ui/icons/Group";
import DeleteIcon from "@material-ui/icons/Delete";
import NavigationConstants from "../../layout/NavigationConstants";
import { injectIntl } from "react-intl";
import { useRouter } from "next/router";
import { useUserProfile } from "../../../contexts/userProfile";
import { useUploadTrackingState } from "../../../contexts/uploadTracking";
import constants from "../../../constants";
import { useQuery } from "react-query";

function Listing(props) {
    const theme = useTheme();
    const router = useRouter();
    const isMedium = useMediaQuery(theme.breakpoints.up("sm"));
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

    const [userProfile] = useUserProfile();
    const uploadTracker = useUploadTrackingState();

    const [isGridView, setGridView] = useState(false);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [uploadsCompleted, setUploadsCompleted] = useState(0);

    let dataRoots = [];
    let userHomePath = "";
    let userTrashPath = "";
    let sharedWithMePath = "";
    let communityDataPath = "";
    let listingData = { total: 0, files: [], folders: [] };

    const { baseId, path, handlePathChange, intl } = props;
    const { data, error: rootsError } = useQuery("dataRoots", getDataRoots);
    const {
        status: listingStatus,
        data: respData,
        error: listingError,
    } = useQuery(
        ["dataListing", { path, rowsPerPage, orderBy, order, page }],
        getDataListing
    );

    useEffect(() => {
        const completed = uploadTracker.uploads.filter((upload) => {
            return (
                upload.parentPath === path &&
                upload.hasUploaded &&
                !upload.hasErrored
            );
        }).length;
        setUploadsCompleted(completed);
    }, [uploadTracker, path]);

    useEffect(() => {
        setSelected([]);
    }, [path]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked && !selected.length) {
            const newSelecteds =
                listingData?.listing?.map((resource) => resource.id) || [];
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const toggleDisplay = () => {
        setGridView(!isGridView);
    };

    // Simple range select: if you shift-click a range, the range will be
    // selected.  If all items in the range are already selected, all items
    // will be deselected.
    const rangeSelect = (start, end, targetId) => {
        const rangeIds = [];
        for (let i = start; i <= end; i++) {
            rangeIds.push(listingData?.listing[i].id);
        }

        let isTargetSelected = selected.includes(targetId);

        isTargetSelected ? deselect(rangeIds) : select(rangeIds);
    };

    const handleClick = (event, id, index) => {
        if (event.shiftKey) {
            lastSelectIndex > index
                ? rangeSelect(index, lastSelectIndex, id)
                : rangeSelect(lastSelectIndex, index, id);
        } else {
            toggleSelection(id);
        }

        setLastSelectIndex(index);
    };

    const toggleSelection = (resourceId) => {
        if (selected.includes(resourceId)) {
            deselect([resourceId]);
        } else {
            select([resourceId]);
        }
    };

    const select = (resourceIds) => {
        let newSelected = [...selected];
        resourceIds.forEach((resourceId) => {
            const selectedIndex = selected.indexOf(resourceId);
            if (selectedIndex === -1) {
                newSelected.push(resourceId);
            }
        });

        setSelected(newSelected);
    };

    const deselect = (resourceIds) => {
        const newSelected = selected.filter(
            (selectedID) => !resourceIds.includes(selectedID)
        );

        setSelected(newSelected);
    };

    const onDownloadSelected = (resourceId) => {
        console.log("Download", resourceId);
    };

    const onEditSelected = (resourceId) => {
        console.log("Edit", resourceId);
    };

    const onMetadataSelected = (resourceId) => {
        console.log("Metadata", resourceId);
    };

    const onDeleteSelected = (resourceId) => {
        console.log("Delete", resourceId);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (respData) {
        listingData.total = respData?.total;
        listingData.listing = [
            ...respData?.folders.map((f) => ({
                ...f,
                type: "FOLDER",
            })),
            ...respData?.files.map((f) => ({
                ...f,
                type: "FILE",
            })),
        ].map((i) => camelcaseit(i)); // camelcase the fields for each object, for consistency.
    }

    if (data && userProfile) {
        const respRoots = data.roots;
        const home = respRoots.find((root) => root.label === userProfile.id);
        home.icon = <HomeIcon />;
        const sharedWithMe = respRoots.find(
            (root) => root.label === constants.SHARED_WITH_ME
        );
        sharedWithMePath = sharedWithMe.path;
        sharedWithMe.icon = <FolderSharedIcon />;
        const communityData = respRoots.find(
            (root) => root.label === constants.COMMUNITY_DATA
        );
        communityDataPath = communityData.path;
        communityData.icon = <GroupIcon />;
        const trash = respRoots.find(
            (root) => root.label === formatMessage(intl, "trash")
        );
        trash.icon = <DeleteIcon />;

        const basePaths = data["base-paths"];
        userHomePath = basePaths["user_home_path"];
        userTrashPath = basePaths["user_trash_path"];
        dataRoots.push(home, sharedWithMe, communityData, trash);
    }

    //route to default path
    if (
        dataRoots.length > 0 &&
        (!rootsError || rootsError.length === 0) &&
        !path
    ) {
        router.push(
            constants.PATH_SEPARATOR +
                NavigationConstants.DATA +
                constants.PATH_SEPARATOR +
                `ds${dataRoots[0].path}`
        );
    }
    return (
        <>
            <UploadDropTarget path={path}>
                <Header
                    baseId={baseId}
                    isGridView={isGridView}
                    toggleDisplay={toggleDisplay}
                    path={path}
                    error={rootsError || listingError}
                    onDownloadSelected={onDownloadSelected}
                    onEditSelected={onEditSelected}
                    onMetadataSelected={onMetadataSelected}
                    onDeleteSelected={onDeleteSelected}
                    dataRoots={dataRoots}
                    userHomePath={userHomePath}
                    userTrashPath={userTrashPath}
                    sharedWithMePath={sharedWithMePath}
                    communityDataPath={communityDataPath}
                />
                {!isGridView && (
                    <TableView
                        loading={listingStatus === "loading"}
                        error={rootsError || listingError}
                        path={path}
                        handlePathChange={handlePathChange}
                        listing={listingData?.listing}
                        isMedium={isMedium}
                        isLarge={isLarge}
                        baseId={baseId}
                        onDownloadSelected={onDownloadSelected}
                        onEditSelected={onEditSelected}
                        onMetadataSelected={onMetadataSelected}
                        onDeleteSelected={onDeleteSelected}
                        handleRequestSort={handleRequestSort}
                        handleSelectAllClick={handleSelectAllClick}
                        handleClick={handleClick}
                        order={order}
                        orderBy={orderBy}
                        selected={selected}
                    />
                )}
                {isGridView && <span>Coming Soon!</span>}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={listingData?.total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </UploadDropTarget>
        </>
    );
}

export default withI18N(injectIntl(Listing), messages);
