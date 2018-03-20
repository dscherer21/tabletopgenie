

USE Imperial_Assault_db;

INSERT INTO users ( name, email, password_hash )  VALUES ( "rich1", 'rich1@test1.com', '$2a$10$UFQTf3VNAanhOcrimYfLm.pHFRJHhTNoJ0ikL97VWijFlAmdlHaX2' );

INSERT INTO groups ( name ) VALUES ("Test group 1");

INSERT INTO session ( group_id, credits, picture,  game_date_start_unix, game_date_stop_unix ) values ( 1, 10, " ", 1517479200, 1517480200 );

INSERT INTO session ( group_id, credits, picture,  game_date_start_unix, game_date_stop_unix ) values ( 1, 10, " ", 1521483907, 1521493910 );

INSERT INTO session ( group_id, credits, picture,  game_date_start_unix, game_date_stop_unix ) values ( 1, 10, " ", 1521488275, 1521498375 );

INSERT INTO user_groups ( group_id, user_id, character_id, empire ) VALUES (1, 1, 1, false );

INSERT INTO administrators ( adminName, email ) VALUES ("Rich Budek", "RichBu001@gmail.com");

INSERT INTO administrators ( adminName, email ) VALUES ("David Scherer-ODell", "dscherer21@gmail.com");
