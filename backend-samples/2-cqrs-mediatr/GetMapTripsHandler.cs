using Api.Dtos.MapTrip;
using Api.Queries.MapTrip;
using Data.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.MapTrip
{
    public class GetMapTripsHandler : IRequestHandler<GetMapTripsQuery, List<GetMapTripsDto>>
    {
        protected readonly IGenericRepository<Domain.Entities.Trip.Trip> tripRepository;
        public GetMapTripsHandler(IGenericRepository<Domain.Entities.Trip.Trip> tripRepository)
        {
            this.tripRepository = tripRepository;
        }

        public async Task<List<GetMapTripsDto>> Handle(GetMapTripsQuery command, CancellationToken cancellationToken)
        {
            var trips = await tripRepository.Entities.Select(e => new GetMapTripsDto
            {
                City = e.City,
                Country = e.Country,
                Id = e.Id,
                X = e.X,
                Y = e.Y,
                Visited = e.DateOfTheVisit.Date.CompareTo(DateTime.Now.Date.ToUniversalTime()) < 0
            }).ToListAsync();

            return trips;
        }
    }
}
