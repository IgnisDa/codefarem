module users {
     abstract type User {
        required link profile -> users::UserProfile {
            on target delete delete source;
            on source delete delete target;
        };
        required link auth -> users::UserAuth {
            on target delete delete source;
            on source delete delete target;
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

    type UserAuth {
        property password_hash -> str;
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
