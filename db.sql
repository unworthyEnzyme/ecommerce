CREATE TABLE Users
(
  UserId INT PRIMARY KEY IDENTITY(1,1),
  Email NVARCHAR(50) NOT NULL,
  Password NVARCHAR(100) NOT NULL,
  RoleId INT NOT NULL,
  IsActive BIT DEFAULT 1,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  CONSTRAINT UC_Users UNIQUE (Email),
  FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);
GO

CREATE TABLE Roles
(
  RoleId INT PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(50) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL
);
GO

CREATE TABLE Operations
(
  OperationId INT PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(50) NOT NULL,
  Description NVARCHAR(200),
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  CONSTRAINT UC_Operations UNIQUE (Name)
);
GO

CREATE TABLE RoleOperations
(
  RoleId INT NOT NULL,
  OperationId INT NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  PRIMARY KEY (RoleId, OperationId),
  FOREIGN KEY (RoleId) REFERENCES Roles(RoleId),
  FOREIGN KEY (OperationId) REFERENCES Operations(OperationId)
);
GO

CREATE TABLE TopCategories
(
  TopCategoryId INT PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(50) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  CONSTRAINT UC_TopCategories UNIQUE (Name)
);
GO

CREATE TABLE SubCategories
(
  SubCategoryId INT PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(50) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  CONSTRAINT UC_SubCategories UNIQUE (Name)
);
GO

CREATE TABLE CategoryRelations
(
  TopCategoryId INT NOT NULL,
  SubCategoryId INT NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  PRIMARY KEY (TopCategoryId, SubCategoryId),
  FOREIGN KEY (TopCategoryId) REFERENCES TopCategories(TopCategoryId),
  FOREIGN KEY (SubCategoryId) REFERENCES SubCategories(SubCategoryId)
);
GO

-- Table to store attribute types (e.g., "Color", "Size", "Storage")
CREATE TABLE AttributeTypes (
  AttributeTypeID INT PRIMARY KEY IDENTITY(1,1),
  AttributeName NVARCHAR(50) UNIQUE NOT NULL CHECK (AttributeName <> ''),
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL
);


-- Table to store core product information
CREATE TABLE Products (
  ProductID INT PRIMARY KEY IDENTITY(1,1),
  ProductCode NVARCHAR(50) NOT NULL UNIQUE CHECK (ProductCode <> ''),
  Name NVARCHAR(100) NOT NULL CHECK (Name <> ''),
  Description NVARCHAR(MAX),
  SubCategoryID INT NOT NULL,
  TopCategoryID INT NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (SubCategoryID) REFERENCES SubCategories(SubCategoryID),
  FOREIGN KEY (TopCategoryID) REFERENCES TopCategories(TopCategoryID)
);

-- Table to store attributes that apply to the product as a whole (e.g., brand, material)
CREATE TABLE ProductAttributeValues (
  ProductAttributeValueID INT PRIMARY KEY IDENTITY(1,1),
  ProductID INT NOT NULL,
  AttributeTypeID INT NOT NULL,
  AttributeValue NVARCHAR(100) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
  FOREIGN KEY (AttributeTypeID) REFERENCES AttributeTypes(AttributeTypeID),
  CONSTRAINT UQ_ProductAttributeValues_ProductID_AttributeTypeID UNIQUE (ProductID, AttributeTypeID)
);

-- Table to define which attributes are used for a product's variants (e.g., "Color" and "Size")
CREATE TABLE ProductVariantAttributeTypes (
  ProductVariantAttributeTypeID INT PRIMARY KEY IDENTITY(1,1),
  ProductID INT NOT NULL,
  AttributeTypeID INT NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
  FOREIGN KEY (AttributeTypeID) REFERENCES AttributeTypes(AttributeTypeID),
  CONSTRAINT UQ_ProductVariantAttributeTypes_ProductID_AttributeTypeID UNIQUE (ProductID, AttributeTypeID)
);

-- Table to store individual product variants with their own price and stock
CREATE TABLE Variants (
  VariantID INT PRIMARY KEY IDENTITY(1,1),
  ProductID INT NOT NULL,
  Price DECIMAL(10,2) NOT NULL CHECK (Price > 0),
  StockQuantity INT NOT NULL CHECK (StockQuantity >= 0),
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Table to store specific attribute values for each variant
CREATE TABLE VariantAttributeValues (
  VariantAttributeValueID INT PRIMARY KEY IDENTITY(1,1),
  VariantID INT NOT NULL,
  AttributeTypeID INT NOT NULL,
  AttributeValue NVARCHAR(100) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (VariantID) REFERENCES Variants(VariantID),
  FOREIGN KEY (AttributeTypeID) REFERENCES AttributeTypes(AttributeTypeID),
  CONSTRAINT UQ_VariantAttributeValues_VariantID_AttributeTypeID UNIQUE (VariantID, AttributeTypeID)
);

CREATE TABLE Orders
(
  OrderId INT NOT NULL PRIMARY KEY,
  OrderDate DATETIME NOT NULL,
  UserId INT NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

CREATE TABLE OrderItems
(
  OrderItemId INT PRIMARY KEY IDENTITY(1,1),
  OrderId INT NOT NULL,
  ProductId INT NOT NULL,
  Quantity INT NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
  FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);
GO

CREATE TABLE FavoriteProducts
(
  UserId INT NOT NULL,
  ProductId INT NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  PRIMARY KEY (UserId, ProductId),
  FOREIGN KEY (UserId) REFERENCES Users(UserId),
  FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);
GO

CREATE TABLE Payments
(
  PaymentId INT PRIMARY KEY IDENTITY(1,1),
  OrderId INT NOT NULL,
  Amount DECIMAL(10, 2) NOT NULL,
  PaymentDate DATETIME NOT NULL,
  PaymentStatusId INT NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
  FOREIGN KEY (PaymentStatusId) REFERENCES PaymentStatus(PaymentStatusId)
);
GO

CREATE TABLE PasswordResetRequests
(
  PasswordResetRequestId INT PRIMARY KEY IDENTITY(1,1),
  UserId INT NOT NULL,
  Token NVARCHAR(100) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

CREATE TABLE PromotionCodes
(
  PromotionCodeId INT PRIMARY KEY IDENTITY(1,1),
  Code NVARCHAR(50) NOT NULL,
  Discount DECIMAL(10, 2) NOT NULL,
  ExpiryDate DATE NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL
);
GO

CREATE TABLE UserAddresses
(
  AddressId INT PRIMARY KEY IDENTITY(1,1),
  UserId INT NOT NULL,
  AddressLine1 NVARCHAR(100) NOT NULL,
  AddressLine2 NVARCHAR(100),
  City NVARCHAR(50) NOT NULL,
  State NVARCHAR(50) NOT NULL,
  Country NVARCHAR(50) NOT NULL,
  PostalCode NVARCHAR(20) NOT NULL,
  IsDefault BIT NOT NULL DEFAULT 0,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO


CREATE TABLE ShippingAddress
(
  ShippingAddressId INT PRIMARY KEY IDENTITY(1,1),
  AddressLine1 NVARCHAR(100) NOT NULL,
  AddressLine2 NVARCHAR(100),
  City NVARCHAR(50) NOT NULL,
  State NVARCHAR(50) NOT NULL,
  Country NVARCHAR(50) NOT NULL,
  PostalCode NVARCHAR(20) NOT NULL,
  PhoneNumber NVARCHAR(20) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL
);
GO

CREATE TABLE Orders
(
  OrderId INT PRIMARY KEY IDENTITY(1,1),
  OrderDate DATETIME NOT NULL,
  UserId INT NOT NULL,
  StatusId INT NOT NULL,
  ShippingAddressId INT NOT NULL,
  PromotionCodeId INT NULL,
  TotalAmount DECIMAL(10, 2) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (UserId) REFERENCES Users(UserId),
  FOREIGN KEY (ShippingAddressId) REFERENCES ShippingAddress(ShippingAddressId),
  FOREIGN KEY (PromotionCodeId) REFERENCES PromotionCodes(PromotionCodeId),
  FOREIGN KEY (StatusId) REFERENCES OrderStatus(StatusId)
);
GO

CREATE TABLE ProductImages
(
  ImageId INT PRIMARY KEY IDENTITY(1,1),
  ProductId INT NOT NULL,
  ImageUrl NVARCHAR(MAX) NOT NULL,
  IsPrimary BIT NOT NULL DEFAULT 0,
  SortOrder INT NOT NULL DEFAULT 0,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  DeletedAt DATETIME NULL,
  FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);
GO

CREATE TABLE ShoppingCart
(
  CartId INT PRIMARY KEY IDENTITY(1,1),
  UserId INT NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

CREATE TABLE CartItems
(
  CartItemId INT PRIMARY KEY IDENTITY(1,1),
  CartId INT NOT NULL,
  ProductId INT NOT NULL,
  VariantId INT NULL,
  Quantity INT NOT NULL DEFAULT 1,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME NULL,
  FOREIGN KEY (CartId) REFERENCES ShoppingCart(CartId),
  FOREIGN KEY (VariantId) REFERENCES Variants(VariantId),
  FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);
GO

CREATE TABLE OrderStatus
(
  StatusId INT PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(50) NOT NULL, -- e.g., Pending, Processing, Shipped, Delivered, Cancelled
  Description NVARCHAR(200),
  CONSTRAINT UC_OrderStatus UNIQUE (Name)
);
GO

CREATE TABLE PaymentStatus
(
  PaymentStatusId INT PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(50) NOT NULL,
  CONSTRAINT UC_PaymentStatus UNIQUE (Name)
);
GO
