using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace ECommerceApp.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AssetsController : ControllerBase
  {
    private readonly string _uploadsPath;
    private readonly FileExtensionContentTypeProvider _contentTypeProvider;

    public AssetsController()
    {
      _uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "assets");
      if (!Directory.Exists(_uploadsPath))
      {
        Directory.CreateDirectory(_uploadsPath);
      }
      _contentTypeProvider = new FileExtensionContentTypeProvider();
    }

    [HttpPost("upload")]
    [Authorize(Roles = "Admin,User")]
    public ActionResult<List<string>> UploadFiles([FromForm] List<IFormFile> files)
    {
      try
      {
        var uploadedUrls = new List<string>();

        foreach (var file in files)
        {
          if (file.Length == 0)
            continue;

          var fileId = Guid.NewGuid().ToString();
          var fileName = $"{fileId}{Path.GetExtension(file.FileName)}";
          var filePath = Path.Combine(_uploadsPath, fileName);

          if (!_contentTypeProvider.TryGetContentType(fileName, out string? mimeType))
          {
            mimeType = "application/octet-stream";
          }

          using (var stream = new FileStream(filePath, FileMode.Create))
          {
            file.CopyTo(stream);
          }

          // Store mime type in a separate file
          System.IO.File.WriteAllText($"{filePath}.mime", mimeType);

          uploadedUrls.Add($"/assets/{fileName}");
        }

        return Ok(uploadedUrls);
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }

    [HttpGet("{fileName}")]
    public IActionResult GetAsset(string fileName)
    {
      var filePath = Path.Combine(_uploadsPath, fileName);
      var mimeFilePath = $"{filePath}.mime";

      if (!System.IO.File.Exists(filePath) || !System.IO.File.Exists(mimeFilePath))
      {
        return NotFound();
      }

      var contentType = System.IO.File.ReadAllText(mimeFilePath);
      var fileBytes = System.IO.File.ReadAllBytes(filePath);

      return File(fileBytes, contentType);
    }
  }
}
