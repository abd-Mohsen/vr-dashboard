import ApiService from '../API.ts';

class UsersByRoleService{
    public async fetchUsersByRoles() {
        const response =  await ApiService.getInstance().request("dashboard/role-counts", "GET", null);
        if(response == null) alert(response);
        return JSON.parse(response!);
    }
}

export default UsersByRoleService;