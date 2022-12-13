pub mod graphql;
pub mod models;
pub mod users;

use chrono::Utc;
use figment::{providers::Env, Figment};
use log::info;
use rand::{distributions::Alphanumeric, thread_rng, Rng};
use slug::slugify;
use std::{
    env,
    fs::{create_dir_all, File},
    path::PathBuf,
};

pub fn random_string(take: usize) -> String {
    slugify(
        rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(take)
            .map(char::from)
            .collect::<String>(),
    )
    .to_ascii_uppercase()
}

/// This function will extract the `HOST` and `PORT` environment variables and return a
/// `String` containing the URL to the server.
#[inline]
pub fn get_server_url() -> String {
    let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = env::var("PORT").expect("Expected PORT to be set");
    let server_url = format!("{host}:{port}");
    info!("Starting server on url {server_url:?}");
    server_url
}

/// This will create a file in the OS temporary directory and then return a handle to that
/// file along with it's path. These files will NOT be deleted automatically.
pub fn generate_random_file(extension: Option<&'_ str>) -> Result<(File, PathBuf), String> {
    let dir = env::temp_dir();
    let instant = Utc::now().timestamp();
    let characters = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(12)
        .map(char::from)
        .collect::<String>();
    let mut random_filename = format!("{instant}-{characters}");
    if let Some(ext) = extension {
        random_filename.push_str(format!(".{ext}").as_str());
    }
    let dirname = dir.join("codefarem");
    create_dir_all(&dirname).unwrap();
    let file_path = dirname.join(random_filename);
    Ok((File::create(&file_path).unwrap(), file_path))
}

/// Get the figment configuration that is used across the apps
pub fn get_figment_config() -> Figment {
    Figment::new().merge(Env::prefixed("CODEFAREM_").split("__"))
}
