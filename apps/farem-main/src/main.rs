use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptyMutation, EmptySubscription, Schema,
};
use async_graphql_rocket::{GraphQLRequest, GraphQLResponse};
use domains::farem::service::FaremService;
use farem_main::{graphql::QueryRoot, init_application};
use rocket::{get, launch, post, response::content::RawHtml, routes, State};

pub type GraphqlSchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

#[get("/graphiql")]
fn graphiql() -> RawHtml<String> {
    RawHtml(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}

#[post("/graphql", data = "<request>", format = "application/json")]
async fn graphql_request(
    schema: &State<GraphqlSchema>,
    request: GraphQLRequest,
) -> GraphQLResponse {
    request.execute(schema).await
}

#[launch]
async fn rocket() -> _ {
    let (db, farem_client) = init_application().await.unwrap();
    let farem_service = FaremService::new(&db, &farem_client);
    let schema = Schema::build(QueryRoot::default(), EmptyMutation, EmptySubscription)
        .data(farem_service)
        .finish();
    rocket::build()
        .manage(schema)
        .mount("/", routes![graphiql, graphql_request])
}
