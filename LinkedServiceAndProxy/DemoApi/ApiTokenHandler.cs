using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

public class ApiTokenHandlerOptions : AuthenticationSchemeOptions
{
}

public class ApiTokenHandler : AuthenticationHandler<ApiTokenHandlerOptions>
{
    private const string Header = "X-Custom-Auth";

    public ApiTokenHandler
    (
        IOptionsMonitor<ApiTokenHandlerOptions> options, 
        ILoggerFactory logger, 
        UrlEncoder encoder, 
        ISystemClock clock
    )
    : base(options, logger, encoder, clock)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // No auth header
        if (!Request.Headers.ContainsKey(Header))
        {
            Console.WriteLine($"**** {Header} Auth header not present");
            return Task.FromResult(AuthenticateResult.Fail($"{Header} not present"));
        }

        // Empty auth header
        var header = Request.Headers[Header].ToString();
        if (string.IsNullOrWhiteSpace(header))
        {
            Console.WriteLine($"**** {Header} Auth header is empty");
            return Task.FromResult(AuthenticateResult.Fail($"{Header} empty"));
        }
        
        // Validate the token
        if( header != "A-REAL-API-TOKEN")
        {
            Console.WriteLine("**** Token not as expected");
            return Task.FromResult(AuthenticateResult.Fail($"{Header} invalid"));
        }

        var claims = new List<Claim>
        {
            new Claim("name", "API Key User")
        };

        var identity = new ClaimsIdentity(claims, "api-token", "name", "role");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "api-token");
        
        Console.WriteLine("**** Auth success");
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}