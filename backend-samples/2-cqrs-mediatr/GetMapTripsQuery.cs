using Api.Dtos.MapTrip;
using MediatR;

namespace Api.Queries.MapTrip
{
    public class GetMapTripsQuery : IRequest<List<GetMapTripsDto>>
    {
    }
}
