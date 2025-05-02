using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Business.DTOs.Variant
{
    public class CreateVariantDto
    {
        public int ProductId { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public IEnumerable<CreateVariantDtoAttributes> Attributes { get; set; }

        public class CreateVariantDtoAttributes
        {
            public int Id { get; set; }
            public string Value { get; set; }
        }
        public required IEnumerable<CreateVariantImageDto> Images { get; set; }
    }
}
