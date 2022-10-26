use async_graphql::{Enum, InputObject, SimpleObject};
use strum::EnumIter;

#[derive(Enum, Copy, Clone, Eq, PartialEq, Debug, EnumIter)]
pub enum TestCaseUnit {
    Empty,
    Number,
    String,
    NumberCollection,
    StringCollection,
}

impl TestCaseUnit {
    pub fn get_edgeql_model_and_value(&self) -> String {
        "learning::".to_string()
            + (match self {
                Self::Empty => "EmptyUnit",
                Self::Number => "NumberUnit",
                Self::String => "StringUnit",
                Self::NumberCollection => "NumberCollectionUnit",
                Self::StringCollection => "StringCollectionUnit",
            })
    }
}

#[derive(Debug, SimpleObject, InputObject)]
pub struct InputCaseUnit {
    pub data_type: TestCaseUnit,
    pub data: String,

    /// The name of the variable to store it as
    pub name: String,
}

#[derive(Debug, SimpleObject, InputObject)]
pub struct OutputCaseUnit {
    /// The type of data to store this line as
    pub data_type: TestCaseUnit,

    /// The data to store
    pub data: String,
}

#[derive(Debug, SimpleObject, InputObject)]
pub struct TestCase {
    /// The inputs related to this test case
    pub inputs: Vec<InputCaseUnit>,

    /// The outputs related to this test case
    pub outputs: Vec<OutputCaseUnit>,
}
