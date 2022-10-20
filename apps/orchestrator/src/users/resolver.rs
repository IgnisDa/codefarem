use async_graphql::{Context, ErrorExtensions, Object, Result};
use auth::{get_user_id_from_authorization_token, AuthError};
use macros::{to_result_union_response, user_id_from_request};

use crate::RequestData;

use super::{
    dto::{
        mutations::register_user::{RegisterUserInput, RegisterUserResultUnion},
        queries::{
            login_user::{LoginUserInput, LoginUserResultUnion},
            user_details::UserDetailsResultUnion,
            user_with_email::{UserWithEmailInput, UserWithEmailResultUnion},
        },
    },
    service::{UserService, UserServiceTrait},
};

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
        let (user_id, _) = user_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<UserService>()
            .user_details(user_id)
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

    /// Login a user to the service
    async fn login_user(
        &self,
        ctx: &Context<'_>,
        input: LoginUserInput,
    ) -> Result<LoginUserResultUnion> {
        let output = ctx
            .data_unchecked::<UserService>()
            .login_user(input.email(), input.password())
            .await;
        to_result_union_response!(output, LoginUserResultUnion)
    }

    /// Logout a user from the service
    async fn logout_user(&self, ctx: &Context<'_>) -> Result<bool> {
        let (user_id, _) = user_id_from_request!(ctx);
        Ok(ctx
            .data_unchecked::<UserService>()
            .logout_user(user_id)
            .await)
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
                input.password(),
                input.account_type(),
            )
            .await;
        to_result_union_response!(output, RegisterUserResultUnion)
    }
}
