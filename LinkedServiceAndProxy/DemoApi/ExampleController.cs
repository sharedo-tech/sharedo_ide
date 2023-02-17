using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/test")]
public class ExampleController : ControllerBase
{
    [Authorize]
    [HttpGet]
    public IActionResult Get()
    {
        return new JsonResult(new
        {
            Message = $"Hello {User.Identity?.Name ?? "null"} at {DateTime.Now.ToString("r")}"
        });
    }
}

