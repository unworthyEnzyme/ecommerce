using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Product;
using ECommerceApp.Business.DTOs.Variant;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Business.Concrete
{
    public class VariantService : IVariantService
    {
        private readonly IVariantRepository _variantRepository;

        public VariantService(IVariantRepository variantRepository)
        {
            _variantRepository = variantRepository;
        }

        public void Add(CreateVariantDto createVariantDto)
        {
            var variant = new Variant
            {
                Price = createVariantDto.Price,
                StockQuantity = createVariantDto.Stock,
                ProductId = createVariantDto.ProductId,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                VariantAttributeValues = createVariantDto.Attributes.Select(attr => new VariantAttributeValue
                {
                    AttributeTypeId = attr.Id,
                    AttributeValue = attr.Value
                }).ToList()
            };
            _variantRepository.Add(variant);

        }

        public IEnumerable<VariantDto> GetAll()
        {
            return _variantRepository.GetAll().Select(v => new VariantDto
            {
                VariantId = v.VariantId,
                Price = v.Price,
                StockQuantity = v.StockQuantity,
                //ProductId = v.ProductId,
                //CreatedAt = v.CreatedAt,
                //IsActive = v.IsActive,
                Attributes = v.VariantAttributeValues.Select(attr => new VariantAttributeDto
                {
                    AttributeName = attr.AttributeType.AttributeName,
                    AttributeValue = attr.AttributeValue
                }).ToList()
            });
        }

        public VariantDto GetById(int id) {
            return _variantRepository
                .GetAll()
                .Where(v => v.VariantId == id)
                .Select(v => new VariantDto {
                    VariantId = v.VariantId,
                    Price = v.Price,
                    StockQuantity = v.StockQuantity,
                    //ProductId = v.ProductId,
                    //CreatedAt = v.CreatedAt,
                    //IsActive = v.IsActive,
                    Attributes = v.VariantAttributeValues.Select(attr => new VariantAttributeDto {
                        AttributeName = attr.AttributeType.AttributeName,
                        AttributeValue = attr.AttributeValue
                    }).ToList()
                })
                .FirstOrDefault();
        }
    }
}
