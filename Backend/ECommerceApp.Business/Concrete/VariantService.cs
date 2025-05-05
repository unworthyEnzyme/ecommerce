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

        public VariantService(IVariantRepository variantRepository, IVariantImageRepository variantImageRepository)
        {
            _variantRepository = variantRepository;
            _variantImageRepository = variantImageRepository;
        }

        public int Add(CreateVariantDto createVariantDto)
        {
            var variant = new Variant
            {
                Price = createVariantDto.Price,
                StockQuantity = createVariantDto.Stock,
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
            return _variantRepository.Add(variant);
        }

        public IEnumerable<VariantDto> GetAll()
        {
            return _variantRepository.GetAll().Select(v => new VariantDto
            {
                Id = v.VariantId,
                Price = v.Price,
                Stock = v.StockQuantity,
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
            });
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
                Stock = variant.StockQuantity,
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
                    Stock = v.StockQuantity,
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
                });
        }
    }
}
