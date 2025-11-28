// Define types for clarity (ensure these match your actual imports)
interface PermissionItem {
    id: number;
    name: string; // e.g., "create user"
    guard_name: string;
    // ... other fields
}

interface ModuleItem {
    id: number;
    name: string; // e.g., "User"
    // ... other fields
}

/**
 * Extracts the module ID and an array of selected actions from an existing permission name.
 * @param permission The existing PermissionItem object.
 * @param modules The array of available ModuleItem objects.
 * @param actions The array of available CRUD actions (e.g., ['create', 'view', 'update', 'delete']).
 * @returns An object with the initial module ID and the actions array.
 */
function parseInitialPermissions(
    permission: PermissionItem, 
    modules: ModuleItem[], 
    actions: string[]
): { initialModuleId: string, initialActions: string[] } {
    
    // Permission name format is: "[action] [module_name]" (e.g., "create user")
    const parts = permission.name.split(" "); 
    if (parts.length === 0) {
        return { initialModuleId: "", initialActions: [] };
    }
    
    // 1. Identify the Module Name (the last part of the permission name, e.g., 'user')
    const moduleNameFromPermission = parts[parts.length - 1]; 
    
    // 2. Find the corresponding Module ID
    const module = modules.find(m => m.name.toLowerCase() === moduleNameFromPermission.toLowerCase());
    const initialModuleId = module ? module.id.toString() : "";
    
    // 3. Identify the Actions (all parts except the last one, e.g., 'create')
    // Filter the available actions array to see which ones are present in the permission name parts.
    const initialActions = actions.filter(action => {
        // Check if the current action (e.g., 'create') is found in the permission parts
        return parts.includes(action.toLowerCase());
    });
    
    return { 
        initialModuleId, 
        initialActions
    };
}

export { parseInitialPermissions };