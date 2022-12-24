CREATE MIGRATION m1m5yzfkyldh5hn4k2u6prusha2agehv2pf3qdwgpzoolpjvyq6cga
    ONTO m1i4yf54buxbmnjlgls7w74a2hugqxmbmz5niv4zt2vcbrxdlc5aba
{
  ALTER TYPE learning::Question {
      DROP LINK authored_by;
      DROP LINK classes;
  };
};
