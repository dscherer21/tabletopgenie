DROP DATABASE IF EXISTS Imperial_Assault_db;

CREATE DATABASE Imperial_Assault_db;

USE Imperial_Assault_db;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    primary key (id) 
);

CREATE TABLE groups (
    id INT NOT NULL AUTO_INCREMENT,
    primary key (id)
);

CREATE TABLE user_groups (
    group_id INT,
    user_id INT,
    foreign key (group_id) references groups(id),
    foreign key (user_id) references users(id)
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
    empire BOOLEAN DEFAULT false,
    primary key (id)
);

CREATE TABLE character_cards (
    group_id INT
    user_id INT,
    character_id INT,
    card_id INT,
    foreign key (character_id) references characters(id),
    foreign key (group_id) references groups(id),
    foreign (key user_id) references users(id),
    foreign key (card_id) references game_cards(id)
);

CREATE TABLE session (
    id INT NOT NULL AUTO_INCREMENT,
    credits INT,
    picture VARCHAR(255),
    primary key (id)
);