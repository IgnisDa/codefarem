use crate::{
    dto::mutations::create_invite_link::{CreateInviteLinkInput, CreateInviteLinkResultUnion},
    Service,
};
use async_graphql::{Context, EmptySubscription, Object, Result, Schema};
use macros::to_result_union_response;
pub type GraphqlSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn hello(&self) -> String {
        "hello query".to_owned()
    }
}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn hello(&self) -> String {
        "hello mutation".to_owned()
    }

    async fn create_invite_link(
        &self,
        ctx: &Context<'_>,
        input: CreateInviteLinkInput,
    ) -> Result<CreateInviteLinkResultUnion> {
        let output = ctx
            .data_unchecked::<Service>()
            .create_invite_link(input.email(), input.account_type(), input.valid_for())
            .await;
        to_result_union_response!(output, CreateInviteLinkResultUnion)
    }
}
