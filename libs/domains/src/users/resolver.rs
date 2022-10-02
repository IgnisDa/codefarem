use async_graphql::{Context, Object, Result};

use super::{
    dto::mutations::{
        login_user::{LoginUserInput, LoginUserResultUnion},
        register_user::{RegisterUserInput, RegisterUserResultUnion},
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
        Ok(match output {
            Ok(s) => LoginUserResultUnion::Result(s),
            Err(s) => LoginUserResultUnion::Error(s),
        })
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
        Ok(match output {
            Ok(s) => RegisterUserResultUnion::Result(s),
            Err(s) => RegisterUserResultUnion::Error(s),
        })
    }
}
