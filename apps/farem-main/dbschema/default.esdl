module default {
    type User {
        required link profile -> UserProfile {
            ON TARGET DELETE DELETE SOURCE;
            ON SOURCE DELETE DELETE TARGET;
        };
        required link auth -> UserAuth {
            ON TARGET DELETE DELETE SOURCE;
            ON SOURCE DELETE DELETE TARGET;
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
}
