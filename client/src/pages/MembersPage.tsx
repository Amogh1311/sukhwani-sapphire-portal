import { MembersTable } from '../components/MembersTable';
import { MEMBERS } from '../data/members';

export function MembersPage() {
  return (
    <div className="max-w-5xl">
      <MembersTable members={MEMBERS} />
    </div>
  );
}
