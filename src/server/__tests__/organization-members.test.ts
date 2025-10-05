import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  updateMemberRole,
  removeMemberFromOrganization,
  bulkRemoveMembersFromOrganization,
} from '../organization-members';

// Mock the database and dependencies
vi.mock('@/db', () => ({
  db: {
    query: {
      member: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(),
    })),
  },
}));

vi.mock('./users', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('./organizations', () => ({
  getUserOrganizationMembership: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Organization Members Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateMemberRole', () => {
    it('should return error when user is not authenticated', async () => {
      const { getCurrentUser } = await import('./users');
      vi.mocked(getCurrentUser).mockResolvedValue({ currentUser: null });

      const result = await updateMemberRole('org-1', 'member-1', 'admin');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('UNAUTHORIZED');
    });

    it('should return error when user has no access to organization', async () => {
      const { getCurrentUser } = await import('./users');
      const { getUserOrganizationMembership } = await import('./organizations');

      vi.mocked(getCurrentUser).mockResolvedValue({
        currentUser: {
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com',
        },
      });
      vi.mocked(getUserOrganizationMembership).mockResolvedValue(null);

      const result = await updateMemberRole('org-1', 'member-1', 'admin');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('FORBIDDEN');
    });

    it('should return error when user has insufficient permissions', async () => {
      const { getCurrentUser } = await import('./users');
      const { getUserOrganizationMembership } = await import('./organizations');

      vi.mocked(getCurrentUser).mockResolvedValue({
        currentUser: {
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com',
        },
      });
      vi.mocked(getUserOrganizationMembership).mockResolvedValue({
        id: 'membership-1',
        userId: 'user-1',
        organizationId: 'org-1',
        role: 'member',
        createdAt: new Date(),
        organization: {} as any,
      });

      const result = await updateMemberRole('org-1', 'member-1', 'admin');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('FORBIDDEN');
    });
  });

  describe('removeMemberFromOrganization', () => {
    it('should return error when user is not authenticated', async () => {
      const { getCurrentUser } = await import('./users');
      vi.mocked(getCurrentUser).mockResolvedValue({ currentUser: null });

      const result = await removeMemberFromOrganization('org-1', 'member-1');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('UNAUTHORIZED');
    });

    it('should return error when trying to remove owner', async () => {
      const { getCurrentUser } = await import('./users');
      const { getUserOrganizationMembership } = await import('./organizations');
      const { db } = await import('@/db');

      vi.mocked(getCurrentUser).mockResolvedValue({
        currentUser: {
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com',
        },
      });
      vi.mocked(getUserOrganizationMembership).mockResolvedValue({
        id: 'membership-1',
        userId: 'user-1',
        organizationId: 'org-1',
        role: 'admin',
        createdAt: new Date(),
        organization: {} as any,
      });
      vi.mocked(db.query.member.findFirst).mockResolvedValue({
        id: 'member-1',
        userId: 'user-2',
        organizationId: 'org-1',
        role: 'owner',
        createdAt: new Date(),
      });

      const result = await removeMemberFromOrganization('org-1', 'member-1');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('FORBIDDEN');
      expect(result.error?.message).toContain(
        'Cannot remove organization owner'
      );
    });
  });

  describe('bulkRemoveMembersFromOrganization', () => {
    it('should return error when user is not authenticated', async () => {
      const { getCurrentUser } = await import('./users');
      vi.mocked(getCurrentUser).mockResolvedValue({ currentUser: null });

      const result = await bulkRemoveMembersFromOrganization('org-1', [
        'member-1',
        'member-2',
      ]);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('UNAUTHORIZED');
    });

    it('should return error when no valid members to remove', async () => {
      const { getCurrentUser } = await import('./users');
      const { getUserOrganizationMembership } = await import('./organizations');
      const { db } = await import('@/db');

      vi.mocked(getCurrentUser).mockResolvedValue({
        currentUser: {
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com',
        },
      });
      vi.mocked(getUserOrganizationMembership).mockResolvedValue({
        id: 'membership-1',
        userId: 'user-1',
        organizationId: 'org-1',
        role: 'admin',
        createdAt: new Date(),
        organization: {} as any,
      });
      vi.mocked(db.query.member.findMany).mockResolvedValue([]);

      const result = await bulkRemoveMembersFromOrganization('org-1', [
        'member-1',
        'member-2',
      ]);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_REQUEST');
    });
  });
});
