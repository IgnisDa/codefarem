module learning {
    type Class {
        required property name -> str;
        multi link students -> users::Student;
        # must have one or more teachers
        required multi link teachers -> users::Teacher {
            # if a teacher is deleted, silently remove them from the class
            on target delete allow;
        };
    }
}
