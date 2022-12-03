import { USER_DETAILS } from ":generated/graphql/orchestrator/queries";
import invariant from "tiny-invariant";
import { gqlClient, authenticatedRequest } from "./graphql.server";

export const getUserDetails = async (request: Request) => {
    const { userDetails } = await gqlClient.request(
        USER_DETAILS,
        undefined,
        authenticatedRequest(request)
    );
    invariant(userDetails.__typename === 'UserDetailsOutput', 'Invalid user');
    return userDetails
}
