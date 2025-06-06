export function usersFromJson(str: string): User[] {
    return JSON.parse(str).map((x: any) => User.fromJson(x));
}

export function usersToJson(data: User[]): string {
    return JSON.stringify(data.map((x) => x.toJson()));
}

export default class User {
    id: number;
    name: string;
    email: string;
    phone: string;
    supervisor_id: number;
    role_id: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    reports_count: number | null;
    
    constructor({
        id,
        name,
        email,
        phone,
        supervisor_id,
        role_id,
        created_at,
        updated_at,
        deleted_at,
        reports_count,
    }: {
        id: number;
        name: string;
        email: string;
        phone: string;
        supervisor_id: number;
        role_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at?: Date | null;
        reports_count?: number | null;
    }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.supervisor_id = supervisor_id;
        this.role_id = role_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted_at = deleted_at ?? null;
        this.reports_count = reports_count ?? null;
    }
    
    static fromJson(json: any): User {
        return new User({
            id: json.id,
            name: json.name,
            email: json.email,
            phone: json.phone,
            supervisor_id: json.supervisor_id,
            role_id: json.role_id,
            created_at: json.created_at,
            updated_at: json.updated_at,
            deleted_at: json.deleted_at,
            reports_count: json.reports_count,
        });
    }

    toJson(): object {
        return {
            id: this.id,
            user_name: this.name,
            email: this.email,
            phone: this.phone,
            supervisor_id: this.supervisor_id,
            role_id: this.role_id,
            created_at: this.created_at.toISOString(),
            updated_at: this.updated_at.toISOString(),
            deleted_at: this.deleted_at ? this.deleted_at.toISOString() : null,
            reports_count: this.reports_count,
        };
    }
}
