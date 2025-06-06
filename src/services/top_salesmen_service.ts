import ApiService from '../API.ts';
import User, { usersFromJson } from '../models/user.ts';

class TopSalesMenService{
    public async fetchTopSalesmen() : Promise<User[] | null> {
        const response =  await ApiService.getInstance().request("dashboard/top-salesmen", "GET", null);
        if(response == null) alert(response);
        return usersFromJson(response);
    }
}

export default TopSalesMenService;