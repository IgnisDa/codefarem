use async_graphql::{Context, Error, ErrorExtensions, Object, Result};

use crate::RequestData;

use super::{
    dto::mutations::register_user::{RegisterUserInput, RegisterUserResultUnion},
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
    /// A random test query that does nothing
    // FIXME: remove this
    async fn test(&self, ctx: &Context<'_>) -> Result<String> {
        dbg!(ctx.data_unchecked::<RequestData>());
        Err(Error::new("oh no!").extend_with(|_, e| e.set("name", "value")))
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
            .data::<UserService>()
            .unwrap()
            .register_user(input.username(), input.email(), input.password())
            .await;
        Ok(match output {
            Ok(s) => RegisterUserResultUnion::Result(s),
            Err(s) => RegisterUserResultUnion::Error(s),
        })
    }
}
