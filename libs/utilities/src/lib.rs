pub mod graphql;
pub mod models;
pub mod users;

use chrono::Utc;
use rand::{distributions::Alphanumeric, thread_rng, Rng};
use std::{
    env,
    fs::{self, File},
    path::PathBuf,
};

/// This function will extract the `HOST` and `PORT` environment variables and return a
/// `String` containing the URL to the server.
pub fn get_server_url() -> String {
    let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = env::var("PORT").expect("Expected PORT to be set");
    format!("{host}:{port}")
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
    fs::create_dir_all(&dirname).unwrap();
    let file_path = dirname.join(random_filename);
    Ok((File::create(&file_path).unwrap(), file_path))
}
