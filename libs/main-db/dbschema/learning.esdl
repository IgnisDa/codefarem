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
            constraint expression on (len(__subject__) >= 8);
        };
        # the actual question text in markdown
        required property problem -> str;
        # the classes in which this question is used
        multi link classes -> learning::Class;
        # the test cases (and their expected outputs)
        multi link test_cases -> learning::TestCase {
            on source delete delete target;
        };
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
    type TestCase {
        # the inputs that are passed to the question
        multi link inputs -> learning::TestCaseData {
            on source delete delete target;
        };
        # the expected outputs of the question
        multi link outputs -> learning::TestCaseData {
            on source delete delete target;
        };
    }
    type TestCaseData {
        # the actual data to be stored
        required property data -> str;
        # the order in which the inputs are passed
        required property seq -> int32;
    }
}
