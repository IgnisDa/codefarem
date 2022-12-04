module organizations {
    type Organization {
        required property name -> str;
        multi link members -> users::Teacher {
            property since -> datetime;
            # allow deleting members
            on target delete allow;
            on source delete allow;
        };
    }

    type InviteLink {
        required property token -> str {
            constraint exclusive;
        };
        # The teacher's email address to whom an invite link will be sent. However
        # it is not mandatory that the same email be used to register from this link.
        property email -> str;
        required link organization -> organizations::Organization {
            # delete invite link if the organization is deleted
            on target delete delete source;
            # do nothing if an invite link is deleted
            on source delete allow;
        };
        required property expires_at -> datetime;
        required property is_used -> bool {
            default := false;
        };
        property is_active := .expires_at > datetime_of_statement() and not .is_used;
    }
}
