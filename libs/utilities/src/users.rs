use std::str::FromStr;

use async_graphql::Enum;
use serde::{Deserialize, Serialize};
use strum::Display;

/// The types of accounts a user can create
#[derive(Enum, Clone, Copy, PartialEq, Eq, Display, Serialize, Debug, Deserialize)]
pub enum AccountType {
    Student,
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
