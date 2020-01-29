/**
 * Returns matching claim from the access token payload to test against
 *
 * @param {{sub: string, teamId: string, email: string}} accessTokenPayload contents from AT
 * @param {string} identifier identifier to test against
 */
function getQualifyingClaim(accessTokenPayload, identifier) {
  // Auth0 id
  if (identifier.includes('|')) {
    return accessTokenPayload.sub;
  }
  if (identifier.startsWith('@')) {
    return accessTokenPayload.teamId;
  }

  if (identifier.includes('@')) {
    return accessTokenPayload.email;
  }
}

/**
 * Our generic method in order to implement ABAC, as a method of practice
 * we this as false by default. That is, if we cannot determine the permissions
 * we will return false as opposed to true, this helps making sure that access
 * is granted if and only if we can validate it and avoids edge cases.
 *
 * @param {{sub: String, teamId: String, email: string}} accessTokenPayload Access Token Payload
 * @param {{identifier: String, permissions: "read"|"write"|"share"|"owner"[]}[]} grants Permissions Object
 * @param {"read"|"write"} action - Extent of action that is being taken
 */
export function getQualifyingGrantToPerform(accessTokenPayload, grants, action) {
  for (const grant of grants) {
    const { identifier, permissions } = grant;
    // Domain identifiers
    if (identifier === 'anonymous') {
      return true;
    }

    let testIdentifier = getQualifyingClaim(accessTokenPayload, identifier);
    if (testIdentifier === identifier) {
      if (canPerformAction(permissions, action)) {
        return grant;
      }
    }
  }

  return null;
}

/**
 * Helper to determine given a permissions array if said action can be performed
 * @param {permissions: "read"|"write"|"share"|"owner"[]} permissions
 * @param {"read"|"write"} action
 */
function canPerformAction(permissions, action) {
  // owners can perform all actions
  if (permissions.includes('owner')) {
    return true;
  }

  // Only owner is allowed to grant share
  // Share must be evaluated via the grant
  if (action !== 'share') {
    return permissions.includes(action);
  }

  return false;
}

/**
 * Our generic method in order to implement ABAC, as a method of practice
 * we this as false by default. That is, if we cannot determine the permissions
 * we will return false as opposed to true, this helps making sure that access
 * is granted if and only if we can validate it and avoids edge cases.
 *
 * @param {{userId: String, teamId: String}} accessTokenPayload Access Token Payload
 * @param {{identifier: String, permissions: "read"|"write"|"share"|"owner"[]}[]} grants Permissions Object
 * @param {"read"|"write"|"share"[]} permissionsToGrant - Which permissions are being granted
 * @returns {boolean} result
 */
export function getQualifyingGrantToGrant(accessTokenPayload, grants, permissionsToGrant) {
  for (const grant of grants) {
    const { identifier, permissions } = grant;
    if (identifier === 'anonymous') {
      return false;
    }

    let testIdentifier = getQualifyingClaim(accessTokenPayload, identifier);
    if (testIdentifier === identifier) {
      if (canGrantPermissions(permissions, permissionsToGrant)) {
        return grant;
      }
    }
  }

  return null;
}

/**
 * Helper to determine given a permissions array if said action can be performed
 * @param {permissions: "read"|"write"|"share"|"owner"[]} permissionsOwned
 * @param {"read"|"write"|"share"[]} permissionsToGrant
 */
function canGrantPermissions(permissionsOwned, permissionsToGrant) {
  // owners can grant all permissions
  if (permissionsOwned.includes('owner')) {
    return true;
  }

  // If you have the share permission you can grant
  // read|write to other users, but not share
  if (!permissionsToGrant.includes('share')) {
    if (permissionsOwned.includes('share')) {
      return true;
    }
  }

  return false;
}
