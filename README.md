SET @num := 0;
UPDATE users SET id = @num := (@num + 1);
ALTER TABLE users AUTO_INCREMENT = 1