use async_graphql::{
    connection::{query, Connection, Edge, EmptyFields},
    Error, OutputType, Result,
};
use edgedb_protocol::queryable::Queryable;
use edgedb_tokio::Client;
use serde::{de::DeserializeOwned, Deserialize};
use std::sync::Arc;
use uuid::Uuid;

pub trait HasId {
    fn id(&self) -> String;
}

#[derive(Default)]
pub struct GraphQLConnectionService;

impl GraphQLConnectionService {
    /// This is responsible for taking a database query and returning a paginated result
    /// according to the relay connection spec.
    pub async fn paginate_db_query<'a, T>(
        &self,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
        db_query: &'a str,
        db_conn: &'a Arc<Client>,
    ) -> Result<Connection<String, T, EmptyFields, EmptyFields>>
    where
        T: OutputType + Queryable + DeserializeOwned + HasId,
    {
        query(
            after,
            before,
            first,
            last,
            |after, before, first, last| async move {
                let mut direction = "ASC";

                let first = first.map(|f| f as i16);
                let last = last.map(|l| {
                    direction = "DESC";
                    l as i16
                });
                let limit = first.or(last);

                let convert = |id: Option<String>| id.map(|id| Uuid::parse_str(&id).unwrap());
                let after = convert(after);
                let before = convert(before);

                #[derive(Debug, Deserialize)]
                struct QueryResult<U> {
                    selected: Vec<U>,
                    has_previous_page: bool,
                    has_next_page: bool,
                }

                let new_query = db_query.replace("{{DIRECTION}}", direction);

                let result = db_conn
                    .query_required_single_json(&new_query, &(after, before, limit))
                    .await
                    .unwrap();

                let string_result = result.to_string();

                let query_result: QueryResult<T> = serde_json::from_str(&string_result).unwrap();

                let mut connection =
                    Connection::new(query_result.has_previous_page, query_result.has_next_page);

                connection.edges.extend(
                    query_result
                        .selected
                        .into_iter()
                        .map(|obj| Edge::with_additional_fields(obj.id(), obj, EmptyFields)),
                );
                Ok::<_, Error>(connection)
            },
        )
        .await
    }
}
