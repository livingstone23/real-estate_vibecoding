'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUsersWithRoles() {
  const supabase = await createClient()

  // Fetch all users from public.users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')

  if (usersError) {
    console.error('Error fetching users:', usersError)
    return []
  }

  // Fetch all roles to have a reference of what's available
  const { data: allRoles, error: rolesError } = await supabase
    .from('roles')
    .select('*')

  if (rolesError) {
    console.error('Error fetching roles:', rolesError)
    return []
  }

  // Fetch all user_roles assignments, joined with roles
  const { data: userRoles, error: userRolesError } = await supabase
    .from('user_roles')
    .select('user_id, roles(id, name)')

  if (userRolesError) {
    console.error('Error fetching user roles:', userRolesError)
    return []
  }

  return users.map((user) => {
    const userRoleAssignments = userRoles?.filter((ur) => ur.user_id === user.id) || []
    const assignedRoleNames = userRoleAssignments
      .map((ur: any) => ur.roles?.name)
      .filter(Boolean) as string[]
    
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      nickname: user.nickname,
      created_at: user.created_at,
      roles: assignedRoleNames,
      availableRoles: allRoles || []
    }
  })
}

export async function toggleUserRole(userId: string, roleName: string, assign: boolean) {
  const supabaseAdmin = await createClient()

  // Get the Role ID
  const { data: roleData, error: roleError } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('name', roleName)
    .single()

  if (roleError || !roleData) {
    console.error('Role not found:', roleError)
    return { success: false, error: 'Role not found' }
  }

  const roleId = roleData.id

  if (assign) {
    // Add the role mapping
    const { error } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: userId, role_id: roleId })
    
    if (error && error.code !== '23505') { // Ignore unique violation if it already exists
       console.error('Error assigning role:', error)
       return { success: false, error: error.message }
    }
  } else {
    // Remove the role mapping
    const { error } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .match({ user_id: userId, role_id: roleId })
    
    if (error) {
       console.error('Error removing role:', error)
       return { success: false, error: error.message }
    }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
