use async_graphql::{Context, Object};

use crate::{
    services::core::{CoreService, SupportedLanguage},
    ApplicationContext,
};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn supported_languages(&self, _ctx: &Context<'_>) -> Vec<SupportedLanguage> {
        let app_context = _ctx.data::<ApplicationContext>().unwrap();
        let val1 = app_context
            .db_conn
            .query_required_single::<i32, _>("SELECT {<int32>$0}", &(1 + 2,))
            .await
            .unwrap();
        println!("{val1}");
        let val2 = app_context
            .db_conn
            .query_required_single::<String, _>("SELECT {<str>$0}", &("wow",))
            .await
            .unwrap();
        println!("{val2}");
        CoreService::supported_languages()
    }
}
