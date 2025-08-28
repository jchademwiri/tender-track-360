import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Member } from '@/db/schema';
import MembersTableAction from '@/components/members-table-action';

interface MembersTableProps {
  members: Member[];
}

export function MembersTable({ members }: MembersTableProps) {
  return (
    <Table>
      <TableCaption>A list of your organization members.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.user.name}</TableCell>
            <TableCell>{member.user.email}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell className="text-right">
              <MembersTableAction memberId={member.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
