use super::{
    dto::{
        mutations::register_user::{RegisterUserInput, RegisterUserResultUnion},
        queries::{
            user_details::UserDetailsResultUnion,
            user_with_email::{UserWithEmailInput, UserWithEmailResultUnion},
        },
    },
    service::UserService,
};
use crate::RequestData;
use async_graphql::{Context, ErrorExtensions, Object, Result};
use auth::{get_hanko_id_from_authorization_token, AuthError};
use macros::{hanko_id_from_request, to_result_union_response};

/// The query segment for User
#[derive(Default)]
pub struct UserQuery {}

/// The mutation segment for User
#[derive(Default)]
pub struct UserMutation {}

#[Object]
impl UserQuery {
    /// Get information about the current user
    async fn user_details(&self, ctx: &Context<'_>) -> Result<UserDetailsResultUnion> {
        let user_id = hanko_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<UserService>()
            .user_details(&user_id)
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
}
