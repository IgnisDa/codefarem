module external {
    type InviteLink {
        required property token -> str {
            constraint exclusive;
        };
        # The email address to whom an invite link will be sent. If set, only this
        # email should be able to sign up using it, otherwise it can be used by any email.
        property email -> str;
        required property expires_at -> datetime;
        property used_at -> datetime;
        property is_active := .expires_at > datetime_of_statement() and .used_at ?= <datetime>{};
        required property account_type -> users::AccountType {
            default := users::AccountType.Teacher;
        };
    }
}
