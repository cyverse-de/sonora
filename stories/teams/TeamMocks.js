import { userInfoResp } from "../data/DataMocks";
import Privilege from "../../src/components/models/Privilege";
import userProfileMock from "../userProfileMock";

export const teamMock = {
    description: "testing",
    name: "ipcdev:Dev Team",
    type: "group",
    extension: "Dev Team",
    id: "c1fe2b741c5c40b78f178a29cebb8654",
    display_extension: "Dev Team",
    display_name: "iplant:de:qa:teams:ipcdev:Dev Team",
    id_index: "13206",
    detail: {
        created_by_detail: {
            email: "core-sw@iplantcollaborative.org",
            name: "Ipc Dev",
            last_name: "Dev",
            description: "Ipc Dev",
            id: "ipcdev",
            institution: "iPlant Collaborative",
            first_name: "Ipc",
            source_id: "ldap",
        },
        has_composite: false,
        is_composite_factor: false,
        modified_at: 1602607970794,
        type_names: [],
        created_by: "ipcdev",
        created_at: 1602607967874,
        modified_by: "ipcdev",
    },
};

export const teamList = {
    groups: [
        { ...teamMock },
        {
            description: "just a test",
            name: "aramsey:test",
            type: "group",
            extension: "test",
            id: "1448e0f77d794bc9965dea4bf8eddecb",
            display_extension: "test",
            display_name: "iplant:de:qa:teams:aramsey:test",
            id_index: "13139",
            detail: {
                created_by_detail: {
                    email: "asherz@email.arizona.edu",
                    name: "Ashley Ramsey",
                    last_name: "Ramsey",
                    description: "Ashley Ramsey",
                    id: "aramsey",
                    institution: "University of Arizona",
                    first_name: "Ashley",
                    source_id: "ldap",
                },
                has_composite: false,
                is_composite_factor: false,
                modified_at: 1590511359164,
                type_names: [],
                created_by: "aramsey",
                created_at: 1590511354085,
                modified_by: "aramsey",
            },
        },
        {
            description: "tesssttt",
            name: "jmittelmeier:testing",
            type: "group",
            extension: "testing",
            id: "4b08f86ddcdd494ca1cfd168c67f48df",
            display_extension: "testing",
            display_name: "iplant:de:qa:teams:jmittelmeier:testing",
            id_index: "12868",
            detail: {
                created_by_detail: {
                    email: "jackmittelmeier@email.arizona.edu",
                    name: "Jack Mittelmeier",
                    last_name: "Mittelmeier",
                    description: "Jack Mittelmeier",
                    id: "jmittelmeier",
                    institution: "Cyverse",
                    first_name: "Jack",
                    source_id: "ldap",
                },
                has_composite: false,
                is_composite_factor: false,
                modified_at: 1578493324463,
                type_names: [],
                created_by: "jmittelmeier",
                created_at: 1578493323485,
                modified_by: "jmittelmeier",
            },
        },
        {
            description: "foo",
            name: "sarahr:foo",
            type: "group",
            extension: "foo",
            id: "f6327365ade04edf8389bc43c30e6593",
            display_extension: "foo",
            display_name: "iplant:de:qa:teams:sarahr:foo",
            id_index: "11870",
            detail: {
                created_by_detail: {
                    email: "sarahr@cyverse.org",
                    name: "Sarah Roberts",
                    last_name: "Roberts",
                    description: "Sarah Roberts",
                    id: "sarahr",
                    institution: "University of Arizona",
                    first_name: "Sarah",
                    source_id: "ldap",
                },
                has_composite: false,
                is_composite_factor: false,
                modified_at: 1533224762117,
                type_names: [],
                created_by: "sarahr",
                created_at: 1533224757801,
                modified_by: "sarahr",
            },
        },
    ],
};

const publicPrivilege = {
    type: "access",
    name: "read",
    allowed: true,
    revokable: false,
    subject: {
        name: "EveryEntity",
        description: "EveryEntity",
        id: "GrouperAll",
        source_id: "g:isa",
    },
};

export const privilegeList = (
    isPublic,
    selfPermissionValue = Privilege.READ.value
) => {
    const basePrivileges = {
        privileges: [
            {
                type: "access",
                name: "admin",
                allowed: true,
                revokable: true,
                subject: { ...userInfoResp.batman },
            },
            {
                type: "access",
                name: "admin",
                allowed: true,
                revokable: true,
                subject: { ...userInfoResp.alfred },
            },
            {
                type: "access",
                name: "optin",
                allowed: true,
                revokable: true,
                subject: { ...userInfoResp.robin },
            },
            {
                type: "access",
                name: "view",
                allowed: true,
                revokable: true,
                subject: { ...userInfoResp.joker },
            },
            {
                type: "access",
                name: selfPermissionValue,
                allowed: true,
                revokable: true,
                subject: { id: userProfileMock.id },
            },
            {
                type: "access",
                name: "admin",
                allowed: true,
                revokable: true,
                subject: {
                    email: "de-grouper@iplantcollaborative.org",
                    name: "DE Grouper",
                    last_name: "Grouper",
                    description: "DE Grouper",
                    id: "de_grouper",
                    institution: "N/A",
                    first_name: "DE",
                    source_id: "ldap",
                },
            },
        ],
    };

    // if a user's privilege matches the public privilege, it is NOT returned
    // by the service.  With a public privilege of `read`, robin's secondary
    // privilege and catwoman's privilege aren't shown.  With no public privileges,
    // their privileges are returned.
    return isPublic
        ? { privileges: [...basePrivileges.privileges, { ...publicPrivilege }] }
        : {
              privileges: [
                  ...basePrivileges.privileges,
                  {
                      type: "access",
                      name: "read",
                      allowed: true,
                      revokable: true,
                      subject: { ...userInfoResp.robin },
                  },
                  {
                      type: "access",
                      name: "read",
                      allowed: true,
                      revokable: true,
                      subject: { ...userInfoResp.catwoman },
                  },
              ],
          };
};

export const memberList = {
    members: [
        {
            ...userInfoResp.batman, // admin
        },
        {
            ...userInfoResp.alfred, // admin
        },
        {
            ...userInfoResp.robin, // read + optin
        },
        {
            ...userInfoResp.catwoman, // read
        },
        {
            ...userInfoResp.joker, // view
        },
    ],
};
