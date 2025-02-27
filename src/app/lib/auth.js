export const checkUserRole = (session, requiredRole) => {
    if (!session?.user?.role) return false;
    const rolesHierarchy = {
      "User": 0,
      "Volunteer": 1,
      "Staff": 2,
      "Admin": 3,
      "Manager": 4,
      "Super Admin": 5
    };
    
    return rolesHierarchy[session.user.role] >= rolesHierarchy[requiredRole];
  };
  
  export const getRedirectPath = (session) => {
    if (!session?.user?.role) return "/auth/signin";
    
    switch (session.user.role) {
      case "Super Admin":
        return "/dashboard/super-admin";
      case "Manager":
        return "/dashboard/manager";
      case "Admin":
        return "/dashboard/admin";
      case "Staff":
        return "/dashboard/staff";
      case "Volunteer":
        return "/volunteer";
      default:
        return "/dashboard";
    }
  };