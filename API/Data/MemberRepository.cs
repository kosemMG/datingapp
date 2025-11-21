using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
    {
        var query = context.Members.AsQueryable();
        query = query.Where(member => member.Id != memberParams.CurrentMemberId);
        
        if (memberParams.Gender != null)
            query = query.Where(member => member.Gender == memberParams.Gender);
        
        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));
        
        query = query.Where(member => member.DateOfBirth >= minDob && member.DateOfBirth <= maxDob);
        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(member => member.Created),
            _ => query.OrderByDescending(member => member.LastActive)
        };
        
        return await PaginationHelper<Member>.CreateAsync(query, memberParams.PageNumber, memberParams.PageSize);
    }

    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
    {
        // return await context.Members
        //     .Where(member => member.Id == memberId)
        //     .SelectMany(member => member.Photos)
        //     .ToListAsync();
        
        return await context.Photos
            .Where(photo => photo.MemberId == memberId)
            .ToListAsync();
    }

    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await context.Members
            .Include(member => member.User)
            .Include(member => member.Photos)
            .SingleOrDefaultAsync(member => member.Id == id);
    }
}