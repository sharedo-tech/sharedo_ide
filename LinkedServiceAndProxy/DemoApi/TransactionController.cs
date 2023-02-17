using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/transactions/{id:guid}")]
public class TransactionController : ControllerBase
{
    // This isn't even remotely thread safe!
    private static Dictionary<Guid, List<Transaction>> _data = new Dictionary<Guid, List<Transaction>>();
    
    [Authorize]
    [HttpGet]
    public IActionResult Get(Guid workItemId)
    {
        if( !_data.ContainsKey(workItemId)) 
        {
            return new JsonResult(TransactionListResponse.Empty);
        }

        return new JsonResult(TransactionListResponse.FromData(_data[workItemId]));
    }

    [Authorize]
    [HttpPost]
    public IActionResult Post(Guid workItemId, Transaction tx)
    {
        if( ! _data.ContainsKey(workItemId))
        {
            _data.Add(workItemId, new List<Transaction>());
        }

        var current = _data[workItemId];
        current.Add(tx);

        return new JsonResult(new{});
    }
}

public class TransactionListResponse
{
    public IEnumerable<Transaction> Rows{ get; set; }
    public int TotalRowCount{ get; set; }
    public decimal Balance{ get; set; }

    public TransactionListResponse()
    {
        Rows = new List<Transaction>();
        TotalRowCount = 0;
        Balance = 0.0m;
    }

    public static TransactionListResponse Empty => new TransactionListResponse();

    public static TransactionListResponse FromData(List<Transaction> data)
    {
        return new TransactionListResponse
        {
            // Return last 5 tail only
            Rows = data.TakeLast(5),
            // Full row count
            TotalRowCount = data.Count,
            // Full balance sum
            Balance = data.Sum(t => t.Delta)
        };
    }
}

public class Transaction
{
    public string? Folio{ get; set; }
    public decimal Delta{ get; set; }
}

