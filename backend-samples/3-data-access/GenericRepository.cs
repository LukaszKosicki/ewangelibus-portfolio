using Data.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        protected AppDbContext AppDbContext;
        private DbSet<T> entities;

        public GenericRepository(AppDbContext context)
        {
            AppDbContext = context;
            entities = context.Set<T>();
        }

        public async Task<T> GetById(int id) => 
            await entities.SingleOrDefaultAsync(e => e.Id == id);

        public async Task Delete(T entity)
        {
            entities.Remove(entity);
            await AppDbContext.SaveChangesAsync();
        }

        public async Task Insert(T entity)
        {
            await entities.AddAsync(entity);
            await AppDbContext.SaveChangesAsync();
        }

        public async Task InsertRange(IList<T> entitiy)
        {
            await entities.AddRangeAsync(entitiy);
            await AppDbContext.SaveChangesAsync();
        }

        public async Task Update(T entity)
        {
            entities.Update(entity);
            await AppDbContext.SaveChangesAsync();
        }

        public IQueryable<T> Entities =>
         entities;
    }
}
