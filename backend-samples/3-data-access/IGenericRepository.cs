using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T> GetById(int id);
        Task Delete(T entity);
        Task Insert(T entity);
        Task InsertRange(IList<T> entities);
        Task Update(T entity);
        IQueryable<T> Entities { get; }
    }
}
