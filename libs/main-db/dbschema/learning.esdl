module learning {
    type Class {
        required property name -> str;
        multi link students -> users::Student {
            on target delete allow;
            on source delete allow;
        };
        required property join_slug -> str {
            constraint exclusive;
        };
        # must have one or more teachers
        multi link teachers -> users::Teacher {
            # if a teacher is deleted, silently remove them from the class
            on target delete allow;
            on source delete allow;
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
            on target delete allow;
        };
        # the time when this question was created
        required property created_at -> datetime {
            default := (SELECT datetime_current());
        }
    }

    type TestCase {
        link question := .<test_cases[is learning::Question];
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
        # the data, converted into a string
        property normalized_data := (
            SELECT (
                array_join(.data[is learning::StringCollectionUnit].string_collection_value, ',') IF .data is learning::StringCollectionUnit ELSE
                array_join(<array<str>>.data[is learning::NumberCollectionUnit].number_collection_value, ',') IF .data is learning::NumberCollectionUnit ELSE
                <str>.data[is learning::NumberUnit].number_value IF .data is learning::NumberUnit ELSE
                .data[is learning::StringUnit].string_value
            )
        )
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

    # A folder that contains questions
    type QuestionFolder {
        required property name -> str;
        link parent -> learning::QuestionFolder {
            on source delete allow;
            on target delete delete source;
        };
        required link class -> learning::Class {
            on source delete allow;
            on target delete delete source;
        };
        multi link questions := .<folder[is learning::QuestionInstance];
    }

    # A question that will appear in a class
    type QuestionInstance {
        # the folder in which this instance will appear
        required link folder -> learning::QuestionFolder {
            on source delete allow;
            on target delete delete source;
        };
        # the question that this instance is based on
        required link question -> learning::Question {
            on source delete allow;
            on target delete delete source;
        };
        # the test cases of the parent question that will be used for this instance
        multi link test_cases -> learning::TestCase {
            on source delete allow;
            on target delete allow;
        };
    }
}
