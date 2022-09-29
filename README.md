SET @num := 0;
UPDATE table_name SET id = @num := (@num + 1);
ALTER TABLE table_name AUTO_INCREMENT = 1
