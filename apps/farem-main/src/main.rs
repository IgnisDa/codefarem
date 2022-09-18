#![feature(proc_macro_hygiene, decl_macro)]

use rocket::{post, routes};

enum Language {
    Rust,
}

#[post("/")]
fn index() -> String {
    "Hello".to_string()
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let conn = edgedb_tokio::create_client().await?;
    let val = conn
        .query_required_single::<i32, _>("SELECT {<int32>$0}", &(1 + 2,))
        .await?;
    let val = conn
        .query_required_single::<String, _>("SELECT {<str>$0}", &("wow",))
        .await?;
    println!("7*8 is: {}", val);
    rocket::ignite().mount("/", routes![index]).launch();
    Ok(())
}
