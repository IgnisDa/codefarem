use crate::{
    config::AppConfig,
    users::{
        dto::{
            mutations::{
                register_user::{RegisterUserInput, RegisterUserResultUnion},
                update_user::{UpdateUserInput, UpdateUserResultUnion},
            },
            queries::{
                search_users::SearchUsersGroup,
                user_details::UserDetailsResultUnion,
                user_with_email::{UserWithEmailInput, UserWithEmailResultUnion},
            },
        },
        service::UserService,
    },
    utils::Token,
};
use async_graphql::{Context, ErrorExtensions, Object, Result};
use auth::{get_hanko_id_from_authorization_token, AuthError};
use macros::{hanko_id_from_request, to_result_union_response};
use utilities::graphql::SearchQueryInput;

/// The query segment for User
#[derive(Default)]
pub struct UserQuery {}

/// The mutation segment for User
#[derive(Default)]
pub struct UserMutation {}

#[Object]
impl UserQuery {
    /// Generate a random profile avatar
    async fn random_profile_avatar(&self, ctx: &Context<'_>) -> String {
        ctx.data_unchecked::<UserService>().random_profile_avatar()
    }

    /// Get information about the current user
    async fn user_details(&self, ctx: &Context<'_>) -> Result<UserDetailsResultUnion> {
        let hanko_id = hanko_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<UserService>()
            .user_details(&hanko_id)
            .await;
        to_result_union_response!(output, UserDetailsResultUnion)
    }

    /// Check whether a user with the provided email exists in the service
    async fn user_with_email(
        &self,
        ctx: &Context<'_>,
        input: UserWithEmailInput,
    ) -> Result<UserWithEmailResultUnion> {
        let output = ctx
            .data_unchecked::<UserService>()
            .user_with_email(input.email())
            .await;
        to_result_union_response!(output, UserWithEmailResultUnion)
    }

    /// Search for users in the service by username. If not username is provided, all users
    /// are returned.
    async fn search_users(&self, ctx: &Context<'_>, input: SearchQueryInput) -> SearchUsersGroup {
        ctx.data_unchecked::<UserService>()
            .search_users(input.query_string())
            .await
    }
}

#[Object]
impl UserMutation {
    /// Create a new user for the service
    async fn register_user(
        &self,
        ctx: &Context<'_>,
        input: RegisterUserInput,
    ) -> Result<RegisterUserResultUnion> {
        let output = ctx
            .data_unchecked::<UserService>()
            .register_user(
                input.username(),
                input.email(),
                input.hanko_id(),
                input.invite_token(),
            )
            .await;
        to_result_union_response!(output, RegisterUserResultUnion)
    }

    /// Update the profile of the current user
    async fn update_user(
        &self,
        ctx: &Context<'_>,
        input: UpdateUserInput,
    ) -> Result<UpdateUserResultUnion> {
        let hanko_id = hanko_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<UserService>()
            .update_user(&hanko_id, input.username(), input.profile_avatar())
            .await;
        to_result_union_response!(output, UpdateUserResultUnion)
    }
}
