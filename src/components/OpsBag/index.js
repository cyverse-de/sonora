import React from "react";

import { useLocalStorage } from "../utils/localStorage";
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemSecondaryAction,
} from "@material-ui/core";
import { Label, Delete } from "@material-ui/icons";

export class BagItem {
    constructor(item) {
        this.item = item;
        this.display = {};
    }

    set icon(component) {
        this.display.icon = component;
    }

    get icon() {
        return this.display?.icon || <Label />;
    }

    set label(label) {
        this.display.label = label;
    }

    get label() {
        return this.display.label || this.item.id;
    }
}

export const useOpsBag = (name) => {
    const [bagValue, setBagValue] = useLocalStorage(name, []);

    const addToBag = (bagItem) => setBagValue([...bagValue, bagItem]);

    const removeFromBag = (index) =>
        setBagValue([...bagValue].splice(index, 1));

    return [bagValue, addToBag, removeFromBag];
};

export default ({ bagItems, open, remove }) => {
    return (
        <Drawer anchor="left" open={open}>
            <List>
                {bagItems.map((bagItem, index) => {
                    return (
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>{bagItem.icon}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={bagItem.label} />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={remove(index)}
                                >
                                    <Delete />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
};
