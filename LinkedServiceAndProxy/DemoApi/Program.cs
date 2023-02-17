var enableCors = args.Contains("-cors");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (enableCors)
{
    builder.Services.AddCors(o =>
    {
        o.AddPolicy(name: "corsPolicy", policy => 
        {
            policy.AllowAnyOrigin();
            policy.AllowAnyHeader();
        });
    });
}

builder.Services
    .AddAuthentication
    (
        o =>
        {
            o.DefaultAuthenticateScheme = "api-token";
            o.DefaultChallengeScheme = "api-token";
        }
    )
    .AddScheme<ApiTokenHandlerOptions, ApiTokenHandler>
    (
        "api-token",
        "api-token",
        o => { }
    );

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

if (enableCors)
{
    app.UseCors("corsPolicy");
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
