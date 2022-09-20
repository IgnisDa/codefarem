#![feature(proc_macro_hygiene, decl_macro)]

use async_graphql::http::playground_source;
use async_graphql::http::GraphQLPlaygroundConfig;
use async_graphql::{EmptyMutation, EmptySubscription, Schema};
use async_graphql_rocket::{GraphQLRequest as Request, GraphQLResponse as Response};
use farem_main::{graphql::QueryRoot, ApplicationContext};
use rocket::get;
use rocket::response::content::RawHtml;
use rocket::{launch, post, routes, State};

pub type GraphqlSchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

#[get("/graphiql")]
fn graphiql() -> RawHtml<String> {
    RawHtml(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}

#[post("/graphql", data = "<request>", format = "application/json")]
async fn graphql_request(schema: &State<GraphqlSchema>, request: Request) -> Response {
    request.execute(schema).await
}

#[launch]
async fn rocket() -> _ {
    let ctx = ApplicationContext::init().await.unwrap();
    let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
        .data(ctx)
        .finish();
    rocket::build()
        .manage(schema)
        .mount("/", routes![graphiql, graphql_request])
}
