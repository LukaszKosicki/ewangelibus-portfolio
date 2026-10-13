using Api.Queries.MapTrip;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class MapTripController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MapTripController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetMarkers()
        {
            var result = await _mediator.Send(new GetMapTripsQuery());
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetTrips([FromQuery] GetTripsQuery model)
        {
            var result = await _mediator.Send(model);
            return Ok(result);
        }
    }
}
