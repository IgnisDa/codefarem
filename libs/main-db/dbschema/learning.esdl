module learning {
    type Class {
        required property name -> str;
        multi link students -> users::Student;
        # must have one or more teachers
        multi link teachers -> users::Teacher {
            # if a teacher is deleted, silently remove them from the class
            on target delete allow;
        };
    }
    type Question {
        # a name for this question
        required property name -> str;
        # A unique slug for this question
        required property slug -> str {
            constraint exclusive;
            constraint expression on (len(__subject__) = 8);
        };
        # the actual question text, will store html content
        required property problem -> str;
        # the test cases (and their expected outputs)
        multi link test_cases -> learning::TestCase {
            on source delete delete target;
        };
        # the time when this question was created
        required property created_at -> datetime {
            default := (SELECT datetime_current());
        }
    }

    type TestCase {
        # the inputs that are passed to the question
        multi link inputs -> learning::InputCaseUnit {
            on source delete delete target;
        };
        # the expected outputs of the question
        multi link outputs -> learning::OutputCaseUnit {
            on source delete delete target;
        };
    }

    abstract type CommonCaseUnit {
        required link data -> learning::CaseUnit {
            on source delete delete target;
        };
        # the order in which the inputs are passed
        required property seq -> int32;
    }
    type InputCaseUnit extending CommonCaseUnit {
        # the name of the input, to be used as a variable in the codegen
        required property name -> str;
    }
    type OutputCaseUnit extending CommonCaseUnit {}

    abstract type CaseUnit {}
    type NumberUnit extending learning::CaseUnit {
        required property number_value -> float64;
    }
    type StringUnit extending learning::CaseUnit {
        required property string_value -> str;
    }
    type NumberCollectionUnit extending learning::CaseUnit {
        required property number_collection_value -> array<float64>;
    }
    type StringCollectionUnit extending learning::CaseUnit {
        required property string_collection_value -> array<str>;
    }
}
