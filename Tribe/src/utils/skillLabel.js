// The backend returns skills as names (strings), not { id, name } objects.
import { fa } from './fa';

export const skillLabel = skill => {
  if (typeof skill === 'string') return skill;
  return skill?.name || (skill?.id != null ? `مهارت ${fa(skill.id)}` : 'مهارت');
};
