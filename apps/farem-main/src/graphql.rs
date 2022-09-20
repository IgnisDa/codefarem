use async_graphql::{Context, Object};
use domains::farem::service::{FaremService, FaremServiceTrait, SupportedLanguage};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn supported_languages(&self, ctx: &Context<'_>) -> Vec<SupportedLanguage> {
        ctx.data::<FaremService>().unwrap().supported_languages()
        // let val1 = app_context
        //     .db_conn
        //     .query_required_single::<i32, _>("SELECT {<int32>$0}", &(1 + 2,))
        //     .await
        //     .unwrap();
        // println!("{val1}");
        // let val2 = app_context
        //     .db_conn
        //     .query_required_single::<String, _>("SELECT {<str>$0}", &("wow",))
        //     .await
        //     .unwrap();
        // println!("{val2}");
    }
}
