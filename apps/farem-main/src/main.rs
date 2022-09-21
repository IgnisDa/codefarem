use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptySubscription, Schema,
};
use async_graphql_rocket::{GraphQLRequest, GraphQLResponse};
use domains::farem::service::FaremService;
use farem_main::{
    graphql::{MutationRoot, QueryRoot},
    init_application,
};
use rocket::{get, launch, post, response::content::RawHtml, routes, State};

pub type GraphqlSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

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
    let (db, rust_farem_client) = init_application().await.unwrap();
    let farem_service = FaremService::new(&db, &rust_farem_client);
    let schema = Schema::build(
        QueryRoot::default(),
        MutationRoot::default(),
        EmptySubscription,
    )
    .data(farem_service)
    .finish();
    rocket::build()
        .manage(schema)
        .mount("/", routes![graphiql, graphql_request])
}
