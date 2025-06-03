using System;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Product;
using ECommerceApp.Business.DTOs.Variant;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Business.Concrete
{
    public class VariantService : IVariantService
    {
        private readonly IVariantRepository _variantRepository;
        private readonly IVariantImageRepository _variantImageRepository;

        public VariantService(
            IVariantRepository variantRepository,
            IVariantImageRepository variantImageRepository)
        {
            _variantRepository = variantRepository;
            _variantImageRepository = variantImageRepository;
        }

        public int Add(CreateVariantDto createVariantDto)
        {
            var variant = new Variant
            {
                Price = createVariantDto.Price,
                ProductId = createVariantDto.ProductId,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                VariantImages = createVariantDto.Images.Select(img => new VariantImage
                {
                    ImageUrl = img.ImageUrl,
                    IsPrimary = img.IsPrimary,
                    SortOrder = img.SortOrder,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                }).ToList(),
                VariantAttributeValues = createVariantDto.Attributes.Select(attr => new VariantAttributeValue
                {
                    AttributeTypeId = attr.Id,
                    AttributeValue = attr.Value,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                }).ToList()
            };

            var variantId = _variantRepository.Add(variant);

            // Create initial stock movement if initial stock is provided
            if (createVariantDto.Stock > 0)
            {
                var stockMovement = new StockMovement
                {
                    VariantId = variantId,
                    Quantity = createVariantDto.Stock,
                    MovementType = "IN",
                    Reference = "Initial Stock",
                    Notes = "Initial stock entry",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };
                _variantRepository.AddStockMovement(stockMovement);
            }

            return variantId;
        }

        public IEnumerable<VariantDto> GetAll()
        {
            return _variantRepository.GetAll().Select(v => new VariantDto
            {
                Id = v.VariantId,
                Price = v.Price,
                Stock = v.Stock.Quantity,
                Name = v.Product.Name,
                Product = new ProductDto
                {
                    Name = v.Product.Name,
                    ProductId = v.Product.ProductId,
                    ProductCode = v.Product.ProductCode,
                    Description = v.Product.Description,
                    TopCategory = new TopCategoryDto
                    {
                        Id = v.Product.TopCategoryId,
                        Name = v.Product.TopCategory.Name
                    },
                    SubCategory = new SubCategoryDto
                    {
                        Id = v.Product.SubCategoryId,
                        Name = v.Product.SubCategory.Name,
                        TopCategoryId = v.Product.TopCategoryId
                    },
                },
                Attributes = v.VariantAttributeValues.Select(attr => new VariantAttributeDto
                {
                    AttributeName = attr.AttributeType.AttributeName,
                    AttributeValue = attr.AttributeValue
                }).ToList(),
                Images = _variantImageRepository.GetByVariantId(v.VariantId)
                    .Select(vi => new VariantImageDto
                    {
                        ImageId = vi.ImageId,
                        ImageUrl = vi.ImageUrl,
                        IsPrimary = vi.IsPrimary,
                        SortOrder = vi.SortOrder
                    }).ToList()
            }).ToList();
        }

        public VariantDto GetById(int id)
        {
            var variant = _variantRepository.GetById(id);
            if (variant == null)
                return null;

            return new VariantDto
            {
                Id = variant.VariantId,
                Price = variant.Price,
                Stock = variant.Stock.Quantity,
                Name = variant.Product.Name,
                Product = new ProductDto
                {
                    Name = variant.Product.Name,
                    ProductId = variant.Product.ProductId,
                    ProductCode = variant.Product.ProductCode,
                    Description = variant.Product.Description,
                    TopCategory = new TopCategoryDto
                    {
                        Id = variant.Product.TopCategoryId,
                        Name = variant.Product.TopCategory.Name
                    },
                    SubCategory = new SubCategoryDto
                    {
                        Id = variant.Product.SubCategoryId,
                        Name = variant.Product.SubCategory.Name
                    },
                },
                Attributes = variant.VariantAttributeValues.Select(attr => new VariantAttributeDto
                {
                    AttributeName = attr.AttributeType.AttributeName,
                    AttributeValue = attr.AttributeValue
                }).ToList(),
                Images = _variantImageRepository.GetByVariantId(variant.VariantId)
                    .Select(vi => new VariantImageDto
                    {
                        ImageId = vi.ImageId,
                        ImageUrl = vi.ImageUrl,
                        IsPrimary = vi.IsPrimary,
                        SortOrder = vi.SortOrder
                    }).ToList()
            };
        }

        public void Delete(int id)
        {
            _variantRepository.Delete(id);
        }

        public IEnumerable<VariantDto> GetByCategories(int topCategoryId, int subCategoryId)
        {
            return _variantRepository.GetByCategories(topCategoryId, subCategoryId)
                .Select(v => new VariantDto
                {
                    Id = v.VariantId,
                    Price = v.Price,
                    Stock = v.Stock.Quantity,
                    Name = v.Product.Name,
                    Product = new ProductDto
                    {
                        Name = v.Product.Name,
                        ProductId = v.Product.ProductId,
                        ProductCode = v.Product.ProductCode,
                        Description = v.Product.Description,
                        TopCategory = new TopCategoryDto
                        {
                            Id = v.Product.TopCategoryId,
                            Name = v.Product.TopCategory.Name
                        },
                        SubCategory = new SubCategoryDto
                        {
                            Id = v.Product.SubCategoryId,
                            Name = v.Product.SubCategory.Name,
                            TopCategoryId = v.Product.TopCategoryId
                        },
                    },
                    Attributes = v.VariantAttributeValues.Select(attr => new VariantAttributeDto
                    {
                        AttributeName = attr.AttributeType.AttributeName,
                        AttributeValue = attr.AttributeValue
                    }).ToList(),
                    Images = _variantImageRepository.GetByVariantId(v.VariantId)
                        .Select(vi => new VariantImageDto
                        {
                            ImageId = vi.ImageId,
                            ImageUrl = vi.ImageUrl,
                            IsPrimary = vi.IsPrimary,
                            SortOrder = vi.SortOrder
                        }).ToList()
                }).ToList();
        }

        public IEnumerable<VariantDto> GetByCategoriesAndPriceRange(int? topCategoryId, int? subCategoryId, decimal? minPrice, decimal? maxPrice)
        {
            var variants = _variantRepository.GetByCategoriesAndPriceRange(topCategoryId, subCategoryId, minPrice, maxPrice);

            return variants.Select(v => new VariantDto
            {
                Id = v.VariantId,
                Price = v.Price,
                Stock = v.Stock?.Quantity ?? 0,
                Name = v.Product.Name,
                Product = new ProductDto
                {
                    Name = v.Product.Name,
                    ProductId = v.Product.ProductId,
                    ProductCode = v.Product.ProductCode,
                    Description = v.Product.Description,
                    TopCategory = new TopCategoryDto
                    {
                        Id = v.Product.TopCategoryId,
                        Name = v.Product.TopCategory.Name
                    },
                    SubCategory = new SubCategoryDto
                    {
                        Id = v.Product.SubCategoryId,
                        Name = v.Product.SubCategory.Name,
                        TopCategoryId = v.Product.TopCategoryId
                    },
                },
                Attributes = v.VariantAttributeValues.Select(attr => new VariantAttributeDto
                {
                    AttributeName = attr.AttributeType.AttributeName,
                    AttributeValue = attr.AttributeValue
                }).ToList(),
                Images = _variantImageRepository.GetByVariantId(v.VariantId)
                    .Select(vi => new VariantImageDto
                    {
                        ImageId = vi.ImageId,
                        ImageUrl = vi.ImageUrl,
                        IsPrimary = vi.IsPrimary,
                        SortOrder = vi.SortOrder
                    }).ToList()
            }).ToList();
        }

        public IEnumerable<AttributeOptionDto> GetAttributeOptionsForVariant(int variantId)
        {
            // Get the variant with its product
            var variant = _variantRepository.GetById(variantId);
            if (variant == null)
                return [];

            // Get the product ID to find all variants of the same product
            int productId = variant.ProductId;

            // Get all variants of the same product
            var allProductVariants = _variantRepository.GetAll()
                .Where(v => v.ProductId == productId && v.IsActive)
                .ToList();

            // Group all variant attribute values by attribute type
            var attributeOptions = allProductVariants
                .SelectMany(v => v.VariantAttributeValues)
                .Where(a => a.IsActive)
                .GroupBy(a => new { a.AttributeTypeId, a.AttributeType.AttributeName })
                .Select(g => new AttributeOptionDto
                {
                    Id = g.Key.AttributeTypeId,
                    Name = g.Key.AttributeName,
                    Values = g.Select(a => a.AttributeValue).Distinct().ToList()
                })
                .ToList();

            return attributeOptions;
        }

        public IEnumerable<AttributeOptionDto> GetAttributeOptionsForList(IEnumerable<int> variantIds)
        {
            if (!variantIds.Any())
                return Enumerable.Empty<AttributeOptionDto>();

            var variants = _variantRepository.GetAll()
                .Where(v => variantIds.Contains(v.VariantId) && v.IsActive)
                .ToList();

            return GetAttributeOptionsFromVariants(variants);
        }

        // Helper method to extract attribute options from a list of variants
        private IEnumerable<AttributeOptionDto> GetAttributeOptionsFromVariants(IEnumerable<Variant> variants)
        {
            // Get all variant attribute values for these variants
            var attributeOptions = variants
                .Where(v => v.IsActive)
                .SelectMany(v => v.VariantAttributeValues)
                .Where(a => a.IsActive)
                .GroupBy(a => new { a.AttributeTypeId, a.AttributeType.AttributeName })
                .Select(g => new AttributeOptionDto
                {
                    Id = g.Key.AttributeTypeId,
                    Name = g.Key.AttributeName,
                    Values = g.Select(a => a.AttributeValue).Distinct().ToList()
                })
                .ToList();

            return attributeOptions;
        }

        public IEnumerable<VariantDto> GetByCategoriesPriceRangeAndAttributes(
            int? topCategoryId,
            int? subCategoryId,
            decimal? minPrice,
            decimal? maxPrice,
            Dictionary<int, string> attributeFilters)
        {
            var variants = _variantRepository.GetByCategoriesPriceRangeAndAttributes(
                topCategoryId,
                subCategoryId,
                minPrice,
                maxPrice,
                attributeFilters);

            return variants.Select(v => new VariantDto
            {
                Id = v.VariantId,
                Price = v.Price,
                Stock = v.Stock?.Quantity ?? 0,
                Name = v.Product.Name,
                Product = new ProductDto
                {
                    Name = v.Product.Name,
                    ProductId = v.Product.ProductId,
                    ProductCode = v.Product.ProductCode,
                    Description = v.Product.Description,
                    TopCategory = new TopCategoryDto
                    {
                        Id = v.Product.TopCategoryId,
                        Name = v.Product.TopCategory.Name
                    },
                    SubCategory = new SubCategoryDto
                    {
                        Id = v.Product.SubCategoryId,
                        Name = v.Product.SubCategory.Name,
                        TopCategoryId = v.Product.TopCategoryId
                    },
                },
                Attributes = v.VariantAttributeValues.Select(attr => new VariantAttributeDto
                {
                    AttributeName = attr.AttributeType.AttributeName,
                    AttributeValue = attr.AttributeValue
                }).ToList(),
                Images = _variantImageRepository.GetByVariantId(v.VariantId)
                    .Select(vi => new VariantImageDto
                    {
                        ImageId = vi.ImageId,
                        ImageUrl = vi.ImageUrl,
                        IsPrimary = vi.IsPrimary,
                        SortOrder = vi.SortOrder
                    }).ToList()
            }).ToList();
        }

        public VariantDto? GetVariantByAttributeOptions(Dictionary<int, string> attributeOptions, int productId)
        {
            var variants = _variantRepository.GetAll()
                .Where(v => v.ProductId == productId && v.IsActive)
                .ToList();

            foreach (var variant in variants)
            {
                var variantAttributes = variant.VariantAttributeValues;

                // Check if this variant has exactly the requested attributes
                if (variantAttributes.Count == attributeOptions.Count)
                {
                    bool matches = true;
                    foreach (var requestedAttribute in attributeOptions)
                    {
                        var variantAttribute = variantAttributes.FirstOrDefault(va =>
                            va.AttributeTypeId == requestedAttribute.Key &&
                            va.AttributeValue == requestedAttribute.Value);

                        if (variantAttribute == null)
                        {
                            matches = false;
                            break;
                        }
                    }

                    if (matches)
                    {
                        return new VariantDto
                        {
                            Id = variant.VariantId,
                            Name = variant.Product.Name,
                            Price = variant.Price,
                            Stock = variant.Stock?.Quantity ?? 0,
                            Product = new ProductDto
                            {
                                Name = variant.Product.Name,
                                ProductId = variant.Product.ProductId,
                                ProductCode = variant.Product.ProductCode,
                                Description = variant.Product.Description,
                                TopCategory = new TopCategoryDto
                                {
                                    Id = variant.Product.TopCategoryId,
                                    Name = variant.Product.TopCategory.Name
                                },
                                SubCategory = new SubCategoryDto
                                {
                                    Id = variant.Product.SubCategoryId,
                                    Name = variant.Product.SubCategory.Name,
                                    TopCategoryId = variant.Product.TopCategoryId
                                },
                            },
                            Attributes = variantAttributes.Select(attr => new VariantAttributeDto
                            {
                                AttributeName = attr.AttributeType.AttributeName,
                                AttributeValue = attr.AttributeValue
                            }).ToList(),
                            Images = _variantImageRepository.GetByVariantId(variant.VariantId)
                                .Select(vi => new VariantImageDto
                                {
                                    ImageId = vi.ImageId,
                                    ImageUrl = vi.ImageUrl,
                                    IsPrimary = vi.IsPrimary,
                                    SortOrder = vi.SortOrder
                                }).ToList()
                        };
                    }
                }
            }

            return null;
        }
    }
}
