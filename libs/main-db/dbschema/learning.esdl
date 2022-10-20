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
            # https://github.com/edgedb/edgedb/issues/4473
            # default := utilities::slugify(.name);
            constraint exclusive;
        };
        # the actual question text in markdown
        required property text -> str;
        # the classes in which this question is used
        multi link class -> learning::Class;
        # the test cases (and their expected outputs)
        multi link test_cases -> learning::TestCase;
        # the people who created/edited the question
        multi link authored_by -> users::User {
            # allow deleting the author
            on target delete allow;
            on source delete allow;
        };
        # the time when this question was created
        required property created_at -> datetime {
            default := (SELECT datetime_current());
        }
    }
    scalar type CaseUnitSequence extending sequence;
    type TestCase {
        # the inputs that are passed to the question
        multi link input -> learning::InputCaseUnit {
            property order -> learning::CaseUnitSequence;
        };
        # the expected outputs of the question
        required multi link output -> learning::OutputCaseUnit {
            property order -> learning::CaseUnitSequence;
        };
    }
    type InputCaseUnit {
        # the name of the input, to be used as a variable in the codegen
        required property name -> str;
        required link data -> learning::CaseUnit;
    }
    type OutputCaseUnit {
        required link data -> learning::CaseUnit;
    }
    abstract type CaseUnit {}
    type NumberUnit extending learning::CaseUnit {
        required property value -> float64;
    }
    type StringUnit extending learning::CaseUnit {
        required property value -> str;
    }
    type NumberCollectionUnit extending learning::CaseUnit {
        required property value -> array<float64>;
    }
    type StringCollectionUnit extending learning::CaseUnit {
        required property value -> array<str>;
    }
}
