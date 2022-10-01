SELECT (
  INSERT User {
    profile := (INSERT UserProfile {
      username := <str>$0,
      email := <str>$1,
    }),
    auth := (INSERT UserAuth {
      password_hash := <str>$2
    })
  }
) {
    id
}
