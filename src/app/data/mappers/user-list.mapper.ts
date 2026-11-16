import { PagedResult } from 'src/app/domain/entities/PagedResult.entity';
import { User } from '../../domain/entities/user.entity';
import { UserListItemResponseDto, UserListResponseDto } from '../dto/response/user-list.response.dto';

export class UserListMapper {
static fromApiResponse(
  response: UserListResponseDto
): PagedResult<User> {
  return {
    items: (response.items ?? []).map(dto => {
      const nameParts = (dto.name ?? '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.slice(1).join(' ') || '';

      return new User(
        dto.id,
        dto.email ?? '',
        dto.username,
        dto.name  || undefined,
        lastName || undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        dto.role ? [dto.role] : [],
        undefined,
        dto.status,
        dto.joined_date ? new Date(dto.joined_date) : undefined
      );
    }),

    totalItems: response.total_count ?? 0
  };
}
}
