/**
 * @typedef {object} ShortSubject
 * @property {string} id
 * @property {string} source_id
 */

/**
 * @typedef {object} Subject
 * @property {string} id
 * @property {string} source_id
 * @property {string} email
 * @property {string} name
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} description
 * @property {string} institution
 */

/**
 * @typedef {object} DataSubjectPermission
 * @property {string} user - the user's ID
 * @property {SharingPermissions} permission - the permission value the user has
 */

/**
 * @typedef {object} DataPermission
 * @property {string} path - the path of the resource
 * @property {DataSubjectPermission[]} user-permissions
 */

/**
 * The response returned from the permission-lister endpoint for data
 * @typedef {object} DataPermissionListResponse
 * @property {DataPermission[]} paths
 */

/**
 * @typedef {object} SubjectPermission
 * @property {ShortSubject} subject
 * @property {SharingPermissions} permission - the permission value the user has
 */

/**
 * @typedef AppPermission
 * @property {string} system_id
 * @property {string} app_id
 * @property {string} name
 * @property {SubjectPermission[]} permissions
 */

/**
 * The response returned from the permission-lister endpoint for apps
 * @typedef AppPermissionListResponse
 * @property {AppPermission[]} apps
 */

/**
 * @typedef AnalysisPermission
 * @property {string} id
 * @property {string} name
 * @property {SubjectPermission[]} permissions
 */

/**
 * The response returned from the permission-lister endpoint for analyses
 * @typedef AnalysisPermissionListResponse
 * @property {AnalysisPermission[]} analyses
 */

/**
 * @typedef ToolPermission
 * @property {string} id
 * @property {string} name
 * @property {SubjectPermission[]} permissions
 */

/**
 * The response returned from the permission-lister endpoint for tools
 * @typedef ToolPermissionListResponse
 * @property {ToolPermission[]} tools
 */

/**
 * Any permission lister response
 * @typedef PermissionListResponse
 * @type {(DataPermissionListResponse|AppPermissionListResponse|AnalysisPermissionListResponse|ToolPermissionListResponse)}
 */

/**
 * Any permission object from any of the permission-lister responses
 * @typedef Sharing
 * @type {(DataPermission|AppPermission|AnalysisPermission|ToolPermission)}
 */

/**
 * Any subject permission object from any of the permission-lister responses
 * @typedef AnySubjectPermission
 * @type {(DataSubjectPermission|SubjectPermission)}
 */

/**
 * @typedef DataResourceType
 * @type {('file'|'folder')}
 */

/**
 * @typedef DataResource
 * @property {string} label
 * @property {string} path
 * @property {DataResourceType} type
 */

/**
 * @typedef AppResource
 * @property {string} name
 * @property {string} system_id
 * @property {string} id
 */

/**
 * @typedef AnalysisResource
 * @property {string} name
 * @property {string} id
 */

/**
 * @typedef ToolResource
 * @property {string} name
 * @property {string} id
 */

/**
 * @typedef Resource
 * @type {(DataResource|AppResource|AnalysisResource|ToolResource)}
 */

/**
 * @typedef {object} SharingUser
 * @augments Subject
 * @property {string} originalPermission
 * @property {string} displayPermission
 * @property {AppResource[]} apps
 * @property {AnalysisResource[]} analyses
 * @property {DataResource[]} paths
 * @property {ToolResource[]} tools
 */

/**
 * An object whose keys are all user IDs and the values are the SharingUser
 * object for the user with that user ID
 * @typedef {{string, SharingUser}} UserMap
 */

/**
 * @typedef {{path: string, permission: string}} PathPermission
 */

/**
 * @typedef DataPermissionSharing
 * @property {PathPermission[]} paths
 * @property {string} user
 */

/**
 * @typedef DataShareRequest
 * @property {DataPermissionSharing[]} sharing
 */

/**
 * @typedef {{system_id: string, permission: string, app_id: string}} AppSharePermission
 */

/**
 * @typedef AppShare
 * @property {ShortSubject} subject
 * @property {AppSharePermission[]} apps
 */

/**
 * @typedef AppShareRequest
 * @property {AppShare[]} sharing
 */

/**
 * @typedef {{permission: string, analysis_id: string}} AnalysisSharePermission
 */

/**
 * @typedef AnalysisShare
 * @property {ShortSubject} subject
 * @property {AnalysisSharePermission[]} analyses
 */

/**
 * @typedef AnalysisShareRequest
 * @property {AnalysisShare[]} sharing
 */

/**
 * @typedef {{permission: string, tool_id: string}} ToolSharePermission
 */

/**
 * @typedef ToolShare
 * @property {ShortSubject} subject
 * @property {ToolSharePermission[]} tools
 */

/**
 * @typedef ToolShareRequest
 * @property {ToolShare[]} sharing
 */

/**
 * @typedef ShareRequest
 * @type {(DataShareRequest|AppShareRequest|AnalysisShareRequest|ToolShareRequest)}
 */

/**
 * @typedef DataUnshare
 * @property {string[]} paths
 * @property {string} user
 */

/**
 * @typedef DataUnshareRequest
 * @property {DataUnshare[]} unsharing
 */

/**
 * @typedef AppUnshare
 * @property {ShortSubject} subject
 * @property {AppResource[]} apps
 */

/**
 * @typedef AppUnshareRequest
 * @property {AppUnshare[]} unsharing
 */

/**
 * @typedef AnalysisUnshare
 * @property {string[]} analyses
 * @property {ShortSubject} subject
 */

/**
 * @typedef AnalysisUnshareRequest
 * @property {AnalysisUnshare[]} unsharing
 */

/**
 * @typedef ToolUnshare
 * @property {string[]} tools
 * @property {ShortSubject} subject
 */

/**
 * @typedef ToolUnshareRequest
 * @property {ToolUnshare[]} unsharing
 */

/**
 * @typedef UnshareRequest
 * @type {(DataUnshareRequest|AppUnshareRequest|AnalysisUnshareRequest|ToolUnshareRequest)}
 */
