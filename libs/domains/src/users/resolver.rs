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
        let user_id = user_id_from_request!(ctx);
        let output = ctx
            .data_unchecked::<UserService>()
            .user_details(user_id)
            .await;
        to_result_union_response!(output, UserDetailsResultUnion)
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
            .register_user(input.username(), input.email(), input.password())
            .await;
        to_result_union_response!(output, RegisterUserResultUnion)
    }
}
