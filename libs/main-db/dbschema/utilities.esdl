module utilities {
    function slugify(text: str) -> str
    using (
        SELECT str_lower(re_replace(r'[^a-zA-Z0-9]', r'-', text, flags:='gi'))
    )
}
