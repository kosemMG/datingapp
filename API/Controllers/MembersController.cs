using API.DTO;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberRepository repository, IPhotoService photoService) : BaseApiController
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

    [HttpPut]
    public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
    {
        var memberId = User.GetMemberId();

        var member = await repository.GetMemberForUpdate(memberId);
        if (member == null) return BadRequest("Could not find member");

        member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
        member.Description = memberUpdateDto.Description ?? member.Description;
        member.City = memberUpdateDto.City ?? member.City;
        member.Country = memberUpdateDto.Country ?? member.Country;
        
        member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;
        
        repository.Update(member);

        if (await repository.SaveAllAsync()) return NoContent();
        
        return BadRequest("Failed to update member");
    }

    [HttpPost("upload-photo")]
    public async Task<ActionResult<Photo>> UploadPhoto([FromForm] IFormFile file)
    {
        var member = await repository.GetMemberForUpdate(User.GetMemberId());
        if (member == null) return BadRequest("Cannot update member");

        var result = await photoService.UploadPhotoAsync(file);
        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId,
            MemberId = User.GetMemberId()
        };

        if (member.ImageUrl == null)
        {
            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;
        }
        
        member.Photos.Add(photo);
        if (await repository.SaveAllAsync()) return photo;
        
        return BadRequest("Failed to upload photo");
    }
}