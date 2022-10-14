CREATE MIGRATION m1k4xqoozr4f5otzzvjuw6ilckfmkg23pqaw5olfqpyojwejwjljsa
    ONTO m1eqdazjkhl5ipjpwo4nl32jliaa6aasws7tsbijslrmwd4sdzdoja
{
  ALTER TYPE default::Student {
      CREATE MULTI LINK classes := (.<students[IS default::Class]);
  };
  ALTER TYPE default::Teacher {
      CREATE MULTI LINK classes := (.<teachers[IS default::Class]);
  };
};
