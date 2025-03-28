INSERT INTO AttributeTypes (AttributeName)
VALUES ('Brand'), ('Material'), ('Color'), ('Size'), ('Storage');

INSERT INTO TopCategories (Name)
VALUES ('Apparel'), ('Electronics');

INSERT INTO SubCategories (Name)
VALUES ('T-Shirts'), ('Smartphones');

INSERT INTO CategoryRelations (TopCategoryId, SubCategoryId)
VALUES (1, 1), -- Apparel -> T-Shirts
       (2, 2); -- Electronics -> Smartphones

INSERT INTO Products (Name, Description, SubCategoryID, TopCategoryID)
VALUES ('Classic T-Shirt', 'A comfortable cotton t-shirt', 1, 1),
       ('Smartphone', 'A high-end smartphone with great features', 2, 2);

INSERT INTO ProductAttributeValues (ProductID, AttributeTypeID, AttributeValue)
VALUES (1, 1, 'Nike'),  -- Brand for T-Shirt
       (1, 2, 'Cotton'),   -- Material for T-Shirt
       (2, 1, 'Apple'); -- Brand for Smartphone

INSERT INTO ProductVariantAttributeTypes (ProductID, AttributeTypeID)
VALUES (1, 3),  -- Color for T-Shirt
       (1, 4),  -- Size for T-Shirt
       (2, 3),  -- Color for Smartphone
       (2, 5);  -- Storage for Smartphone

INSERT INTO Variants (ProductID, Price, StockQuantity)
VALUES (1, 15.99, 50),  -- T-Shirt Variant 1
       (1, 15.99, 30),  -- T-Shirt Variant 2
       (2, 699.99, 20), -- Smartphone Variant 1
       (2, 799.99, 15); -- Smartphone Variant 2

INSERT INTO VariantAttributeValues (VariantID, AttributeTypeID, AttributeValue)
VALUES (1, 3, 'Red'),    -- Color for T-Shirt Variant 1
       (1, 4, 'M'),      -- Size for T-Shirt Variant 1
       (2, 3, 'Blue'),   -- Color for T-Shirt Variant 2
       (2, 4, 'L'),      -- Size for T-Shirt Variant 2
       (3, 3, 'Black'),  -- Color for Smartphone Variant 1
       (3, 5, '64GB'),   -- Storage for Smartphone Variant 1
       (4, 3, 'Silver'), -- Color for Smartphone Variant 2
       (4, 5, '128GB');  -- Storage for Smartphone Variant 2

-- List All Products with Their Categories
SELECT p.ProductID, p.Name, p.Description, tc.Name AS TopCategory, sc.Name AS SubCategory
FROM Products p
JOIN TopCategories tc ON p.TopCategoryID = tc.TopCategoryID
JOIN SubCategories sc ON p.SubCategoryID = sc.SubCategoryID;

-- Get Product Attributes for the T-Shirt
SELECT at.AttributeName, pav.AttributeValue
FROM ProductAttributeValues pav
JOIN AttributeTypes at ON pav.AttributeTypeID = at.AttributeTypeID
WHERE pav.ProductID = 1;

-- List Variant Attributes for the T-Shirt
SELECT at.AttributeName
FROM ProductVariantAttributeTypes pvat
JOIN AttributeTypes at ON pvat.AttributeTypeID = at.AttributeTypeID
WHERE pvat.ProductID = 1;

-- Get All Variants for the T-Shirt with Attributes
SELECT v.VariantID, v.Price, v.StockQuantity, at.AttributeName, vav.AttributeValue
FROM Variants v
JOIN VariantAttributeValues vav ON v.VariantID = vav.VariantID
JOIN AttributeTypes at ON vav.AttributeTypeID = at.AttributeTypeID
WHERE v.ProductID = 1
ORDER BY v.VariantID, at.AttributeName;

-- Find T-Shirt Variants with Specific Attributes
SELECT v.VariantID, v.Price, v.StockQuantity
FROM Variants v
JOIN VariantAttributeValues vav1 ON v.VariantID = vav1.VariantID 
    AND vav1.AttributeTypeID = 3 AND vav1.AttributeValue = 'Red'
JOIN VariantAttributeValues vav2 ON v.VariantID = vav2.VariantID 
    AND vav2.AttributeTypeID = 4 AND vav2.AttributeValue = 'M'
WHERE v.ProductID = 1;

-- Get All Products with Variants and Attributes
SELECT p.ProductID, p.Name AS ProductName, 
       tc.Name AS TopCategory, sc.Name AS SubCategory,
       pav.AttributeName AS ProductAttribute, pav.AttributeValue AS ProductAttributeValue,
       v.VariantID, v.Price, v.StockQuantity,
       vav.AttributeName AS VariantAttribute, vav.AttributeValue AS VariantAttributeValue
FROM Products p
JOIN TopCategories tc ON p.TopCategoryID = tc.TopCategoryID
JOIN SubCategories sc ON p.SubCategoryID = sc.SubCategoryID
LEFT JOIN (
    SELECT pav.ProductID, at.AttributeName, pav.AttributeValue
    FROM ProductAttributeValues pav
    JOIN AttributeTypes at ON pav.AttributeTypeID = at.AttributeTypeID
) pav ON p.ProductID = pav.ProductID
LEFT JOIN Variants v ON p.ProductID = v.ProductID
LEFT JOIN (
    SELECT vav.VariantID, at.AttributeName, vav.AttributeValue
    FROM VariantAttributeValues vav
    JOIN AttributeTypes at ON vav.AttributeTypeID = at.AttributeTypeID
) vav ON v.VariantID = vav.VariantID
ORDER BY p.ProductID, v.VariantID, pav.AttributeName, vav.AttributeName;