module default {
    abstract type User {
        required link profile -> UserProfile {
            on target delete delete source;
            on source delete delete target;
        };
        required link auth -> UserAuth {
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

    type Class {
        required property name -> str;
        multi link students -> Student;
        # must have one or more teachers
        required multi link teachers -> Teacher {
            # if a teacher is deleted, silently remove them from the class
            on target delete allow;
        };
    }

    type Student extending User {
        # the classes that this student is a part of
        multi link classes := .<students[is Class];
    }

    type Teacher extending User {
        # the classes that this teacher teachers
        multi link classes := .<teachers[is Class];
    }
}
