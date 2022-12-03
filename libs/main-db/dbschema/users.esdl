module users {
    abstract type User {
        required link auth -> users::UserAuth {
            on target delete delete source;
            on source delete delete target;
        };
        required link profile -> users::UserProfile {
            on target delete delete source;
            on source delete delete target;
        };
    }

    type UserAuth {
        # the unique ID issued by the hanko auth provider
        required property hanko_id -> str {
            constraint exclusive;
        };
    }

    type UserProfile {
        required property email ->  str {
            constraint exclusive;
        };
        required property username -> str {
            constraint exclusive;
        };
    }

    type Student extending users::User {
        # the classes that this student is a part of
        multi link classes := .<students[is learning::Class];
    }

    type Teacher extending users::User {
        # the classes that this teacher teachers
        multi link classes := .<teachers[is learning::Class];
    }
}
