using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(ILikesRepository repository) : BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();
        if (sourceMemberId == targetMemberId) return BadRequest("You cannot like yourself");

        var existingLike = await repository.GetMemberLike(sourceMemberId, targetMemberId);
        if (existingLike is null)
        {
            var like = new MemberLike
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId
            };
            repository.AddLike(like);
        }
        else
        {
            repository.DeleteLike(existingLike);
        }

        if (await repository.SaveAllChangesAsync()) return Ok();
        
        return BadRequest("Failed to update like");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
    {
        return Ok(await repository.GetCurrentMemberLikeIds(User.GetMemberId()));
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<Member>>> GetMemberLikes([FromQuery] LikesParams likesParams)
    {
        likesParams.MemberId = User.GetMemberId();
        return Ok(await repository.GetMemberLikes(likesParams));
    }
}