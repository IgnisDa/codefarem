module default {
    TYPE User {
        REQUIRED LINK profile -> UserProfile {
            ON TARGET DELETE DELETE SOURCE;
            ON SOURCE DELETE DELETE TARGET;
        };
        REQUIRED LINK auth -> UserAuth {
            ON TARGET DELETE DELETE SOURCE;
            ON SOURCE DELETE DELETE TARGET;
        };
    }

    TYPE UserProfile {
        REQUIRED PROPERTY email ->  str {
            CONSTRAINT exclusive;
        };
        REQUIRED PROPERTY username -> str {
            CONSTRAINT exclusive;
        };
    }

    TYPE UserAuth {
        PROPERTY password_hash -> str;
    }

    TYPE Class {
        REQUIRED PROPERTY name -> str;
        MULTI LINK students -> Student;
        # must have one or more teachers
        REQUIRED MULTI LINK teachers -> Teacher {
            # if a teacher is deleted, silently remove them from the class
            ON TARGET DELETE ALLOW;
        };
    }

    TYPE Student extends User {

    }

    TYPE Teacher extends User {

    }
}
