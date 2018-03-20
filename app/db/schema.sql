DROP DATABASE IF EXISTS Imperial_Assault_db;

CREATE DATABASE Imperial_Assault_db;

USE Imperial_Assault_db;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    primary key (id) 
);

CREATE TABLE groups (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    primary key (id)
);

CREATE TABLE characters (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    xp INT,
    primary key (id)
);

CREATE TABLE cards (
    id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(255),
    name VARCHAR(255),
    cost INT,
    tier INT,
    deck VARCHAR(255),
    empire BOOLEAN DEFAULT false,
    shared BOOLEAN DEFAULT false,
    primary key (id)
);

CREATE TABLE game_cards (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    type VARCHAR(255),
    credits INT,
    empire BOOLEAN DEFAULT false,
    primary key (id)
);

CREATE TABLE character_cards (
    group_id INT,
    user_id INT,
    character_id INT,
    card_id INT,
    foreign key (character_id) references characters(id),
    foreign key (group_id) references groups(id),
    foreign key (user_id) references users(id),
    foreign key (card_id) references game_cards(id)
);

CREATE TABLE session (
    id INT,
    group_id INT,
    credits INT,
    picture VARCHAR(255),
    game_date_start_unix INT(13),
    game_date_stop_unix INT(13),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE scheduled (
    id INT AUTO_INCREMENT,
    group_id INT,
    locat VARCHAR(255),
    game_date_start_unix INT(13),
    game_date_stop_unix INT(13),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    PRIMARY KEY (id)
);

CREATE TABLE user_groups (
    group_id INT,
    user_id INT,
    character_id INT,
    empire BOOLEAN DEFAULT false,
    foreign key (group_id) references groups(id),
    foreign key (user_id) references users(id),
    foreign key (character_id) references characters(id)
);


CREATE TABLE administrators (
    id INT AUTO_INCREMENT,
    adminName VARCHAR(20),
    email VARCHAR(30),
    PRIMARY KEY (id)
);

