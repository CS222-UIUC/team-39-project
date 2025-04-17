Note: The UserId is not only id but also name, that's why we use VARCHAR(256) \\\\ 

CREATE TABLE Users (
    UserId VARCHAR(256) PRIMARY KEY, 
    PassWord VARCHAR(256)
);

CREATE TABLE RecipeBooks (
    RecipeBookId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(256)
);

CREATE TABLE Recipes (
    RecipeId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(256),
    Ingredients TEXT,
    Steps TEXT,
    Category VARCHAR(256)
);

CREATE TABLE RecipesInRecipeBooks (
    RecipeBookId INT NOT NULL,
    RecipeId INT NOT NULL,
    PRIMARY KEY (RecipeBookId, RecipeId),
    FOREIGN KEY (RecipeBookId) REFERENCES RecipeBooks(RecipeBookId),
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId)
);

CREATE TABLE ReadOnly (
    UserId VARCHAR(256) NOT NULL,
    RecipeBookId INT NOT NULL,
    PRIMARY KEY (UserId, RecipeBookId),
    FOREIGN KEY (RecipeBookId) REFERENCES RecipeBooks(RecipeBookId)
);

CREATE TABLE Coedit (
    UserId VARCHAR(256) NOT NULL,
    RecipeBookId INT NOT NULL,
    PRIMARY KEY (UserId, RecipeBookId),
    FOREIGN KEY (RecipeBookId) REFERENCES RecipeBooks(RecipeBookId)
); \\ 

Add data for testing(remember we need to assign id in controller when inserting)\\\\ 
INSERT INTO Users (UserId, PassWord) 
VALUES 
('user1', 'password1'), 
('user2', 'password2');

INSERT INTO Recipes (RecipeId, Name) 
VALUES 
(1, 'Recipe1'), 
(2, 'Chicken Curry');


Add recipebook table

Add Ingredients and Steps: done
Note User only modify recipe book 
co-edit need more table to indictae the relation