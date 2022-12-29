CREATE MIGRATION m1y66uwvrcqdywrblpbic6lmmaeo22r4f2x2w6h3zzmaimogkvmfxq
    ONTO m1zacrhiehi2o3vp35r6i3qbgeut5xy3p5txgsiab4h75fvu4vlpmq
{
  ALTER TYPE learning::Goal {
      CREATE REQUIRED PROPERTY end_date -> std::datetime {
          SET default := (SELECT
              (std::datetime_current() + <std::duration>'14 days')
          );
      };
  };
};
