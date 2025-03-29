Note: The UserId is not only id but also name, that's why we use VARCHAR(256) \\\\ 

CREATE TABLE Users (
    UserId VARCHAR(256) PRIMARY KEY, 
    PassWord VARCHAR(256)
);

CREATE TABLE Recipes (
    RecipeId INT PRIMARY KEY,
    Name VARCHAR(256)
);

CREATE TABLE RecipeBooks (
    RecipeBookId INT PRIMARY KEY,
    Name VARCHAR(256)
);

CREATE TABLE RecipesInRecipeBooks (
    RecipeBookId INT,
    RecipeId INT,
    PRIMARY KEY (RecipeBookId, RecipeId),
    FOREIGN KEY (RecipeBookId) REFERENCES RecipeBooks(RecipeBookId),
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId)
); 

CREATE TABLE FavRecipes (
    UserId VARCHAR(256),
    RecipeId INT,
    PRIMARY KEY (UserId, RecipeId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId)
); 

CREATE TABLE FavRecipeBooks (
    UserId VARCHAR(256),
    RecipeBookId INT,
    PRIMARY KEY (UserId, RecipeBookId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
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

INSERT INTO FavRecipes (UserId, RecipeId) 
VALUES 
('user1', 1), 
('user2', 2);

Add recipebook table

