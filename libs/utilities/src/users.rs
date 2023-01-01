use crate::{
    graphql::{ApiError, UserDetailsOutput},
    random_string,
};
use async_graphql::Enum;
use avatars::{female_avatar, generate_seed, male_avatar, Gender, Mood};
use edgedb_tokio::Client;
use rand::seq::SliceRandom;
use serde::{Deserialize, Serialize};
use std::{str::FromStr, sync::Arc};
use strum::Display;

const USER_DETAILS: &str = include_str!("../../main-db/edgeql/users/user-details.edgeql");

/// The types of accounts a user can create
#[derive(Enum, Clone, Copy, PartialEq, Eq, Display, Serialize, Debug, Deserialize, Default)]
pub enum AccountType {
    #[serde(rename = "users::Student")]
    #[default]
    Student,
    #[serde(rename = "users::Teacher")]
    Teacher,
}

impl FromStr for AccountType {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "Student" | "users::Student" => Ok(Self::Student),
            "Teacher" | "users::Teacher" => Ok(Self::Teacher),
            _ => Err(()),
        }
    }
}

/// Find the user details from the database using the hanko id
async fn find_user_details_from_db(
    hanko_id: &'_ str,
    client: &Arc<Client>,
) -> Option<UserDetailsOutput> {
    let json_str = client.query_json(USER_DETAILS, &(hanko_id,)).await.ok()?;
    serde_json::from_str::<Vec<UserDetailsOutput>>(&json_str)
        .ok()
        .and_then(|mut users| users.pop())
}

/// Fetch the user details from the database using the hanko id
pub async fn get_user_details_from_hanko_id(
    hanko_id: &'_ str,
    client: &Arc<Client>,
) -> Result<UserDetailsOutput, ApiError> {
    find_user_details_from_db(hanko_id, client)
        .await
        .ok_or_else(|| ApiError {
            error: format!("User with hanko_id={hanko_id} not found"),
        })
}

/// Generate a profile avatar SVG for the user using their username
pub fn generate_profile_avatar_svg(username: Option<&str>) -> String {
    let (mood, gender) = {
        let mut rng = rand::thread_rng();
        let mood = [Mood::Happy, Mood::Sad, Mood::Surprised]
            .choose(&mut rng)
            .unwrap();
        let gender = [Gender::Female, Gender::Male].choose(&mut rng).unwrap();
        (mood, gender)
    };

    let seed_string = username
        .map(|f| f.to_owned())
        .unwrap_or_else(|| random_string(8));

    let seed = generate_seed(&seed_string);

    match gender {
        Gender::Female => female_avatar(seed, mood),
        Gender::Male => male_avatar(seed, mood),
    }
}
