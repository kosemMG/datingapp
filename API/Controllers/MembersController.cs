using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberRepository repository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers() // localhost:5001/api/members
    {
        return Ok(await repository.GetMembersAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Member>> GetMember(string id)
    {
        var member = await repository.GetMemberByIdAsync(id);
        
        if (member == null) return NotFound();
        return member;
    }

    [HttpGet("{memberId}/photos")]
    public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotosForMember(string memberId)
    {
        return Ok(await repository.GetPhotosForMemberAsync(memberId));
    }
}